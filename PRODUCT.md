# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Police personnel, operational officers, and system administrators of the Tanza Municipal Police Station (Cavite, Philippines) monitoring crime incidents, managing case blotters, and maintaining municipal surveillance operations.

## Product Purpose

SecureTanza is an enterprise crime mapping, geospatial intelligence, analytics, and operational management system. Success means high operational reliability, fast blotter data ingestion, real-time spatial pattern visualization, and zero backend process failure or connection saturation.

## Positioning

Tailored specifically for local municipal law enforcement operations in Tanza, Cavite, integrating barangay-level geospatial analysis with real-time system performance telemetry and automated crime surge alerting.

## Operating Context

Law enforcement desktop and control-room environments where officers review crime trends, audit batch Excel blotter uploads, configure export schedules, and monitor municipal security metrics.

## Capabilities and Constraints

- Next.js 16 (Turbopack), React 19, TypeScript, Tailwind CSS, Prisma ORM, PostgreSQL (via Supabase PgBouncer pooler).
- Role-based access control (`admin`, `admin_operational_officer`, `operational_officer`, `privileged_user`).
- High-volume crime incident ingestion with strict transactional integrity.
- Background cron worker handling automated periodic Excel data exports and 14-day retention cleanups.

## Brand Commitments

- Name: SecureTanza
- Municipal affiliation: Tanza Municipal Police Station
- Identity: Secure, authoritative, high-clarity utility console with deep slate backgrounds (`#0B1120`/`#0F172A`) and sky cyan `#0EA5E9` accents.

## Evidence on Hand

- Real crime incident database (`crime_incidents` table with 1,900+ real records).
- 41 barangays of Tanza, Cavite with real coordinates and polygon mapping data.
- Live database audit logs, background export schedules, and automated notification engines.

## Product Principles

1. Operational clarity over decorative flourishes: every pixel must serve rapid assessment and decision-making.
2. Zero ambiguity: metrics, latency numbers, and health statuses must be exact, un-obscured, and legible.
3. Resilience and telemetry: provide real-time diagnostic visibility into database pools, V8 heap usage, and background jobs.
