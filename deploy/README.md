# Running SecureTanza on the Debian VM

`securetanza.service` runs `npm start`, which is `next start` (the built app)
and the scheduled-export cron worker (`backend/cron/worker.ts`) together —
the same pair that `npm run dev` runs locally, just supervised so it survives
crashes and VM reboots instead of depending on a terminal staying open.

## One-time setup

```bash
# 1. Dedicated, unprivileged user to run the service as
sudo useradd --system --create-home --shell /usr/sbin/nologin securetanza

# 2. Put the app where the unit expects it (or edit WorkingDirectory/paths
#    in securetanza.service to match wherever you actually clone it)
sudo mkdir -p /opt/securetanza
sudo chown securetanza:securetanza /opt/securetanza
#   ...clone/copy the repo into /opt/securetanza as that user...

# 3. Install deps and build (as the securetanza user, or chown afterwards)
cd /opt/securetanza
npm install
npm run build
npm run db:generate   # regenerates the Prisma client against DATABASE_URL

# 4. Production secrets — DATABASE_URL, JWT secret, anything else read via
#    process.env. Not committed; the app's own dotenv calls only look for
#    .env.local / .env, so name this whatever you point EnvironmentFile at.
sudo -u securetanza cp .env.example .env.production   # if one exists, else create by hand
sudo chmod 600 /opt/securetanza/.env.production

# 5. Install and enable the unit
sudo cp deploy/securetanza.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now securetanza
```

## Checking it's actually working

```bash
# Service status, and whether it's restarted unexpectedly
sudo systemctl status securetanza

# Live logs from both next start and the cron worker (they share one unit,
# so [CRON]-prefixed lines are the worker, the rest is Next.js)
sudo journalctl -u securetanza -f

# Cron ticks every minute regardless of whether anything's scheduled to run,
# but you can confirm a schedule actually fired by checking the archive:
# Settings → Backups → filter to "Scheduled", or:
sudo -u securetanza npx tsx -e "
  import('./backend/lib/prisma').then(async ({ prisma, disconnectPrisma }) => {
    const rows = await prisma.backup.findMany({ where: { kind: 'scheduled_export' }, orderBy: { createdAt: 'desc' }, take: 5 });
    console.log(rows);
    await disconnectPrisma();
  });
"
```

## Notes specific to this VM

- No Cloudflare tunnel, no port forwarding — this is LAN-only. `next start`
  binds `0.0.0.0:3000` by default, which is fine for that; nothing here
  needs a reverse proxy or TLS termination unless you decide you want one
  later for LAN HTTPS. If you do put nginx/Caddy in front of it, this unit
  doesn't change — just point the proxy at `127.0.0.1:3000`.
- The unit's `NoNewPrivileges=true` is the only hardening turned on by
  default. If you want tighter sandboxing (`ProtectSystem=strict`,
  `ReadWritePaths=`, etc.), add it once the base setup is confirmed working —
  it wasn't included here because getting it wrong silently breaks startup,
  and there was no way to verify the exact paths Next.js/Prisma need to
  write to on your actual VM from here.
- `Restart=on-failure` restarts the *whole* unit (both processes) if either
  one dies, because `concurrently --kill-others-on-fail` (already set in
  `package.json`'s `start` script) makes one process dying take the other
  down with it — otherwise a crashed cron worker could sit dead indefinitely
  while Next.js kept serving requests, and systemd would have no way to know.
