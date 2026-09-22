import { prisma } from './backend/lib/prisma.ts';
import fs from 'fs';

const geo = JSON.parse(fs.readFileSync('public/tanza_cavite.geojson', 'utf8'));
const geoNames = geo.features.map(f => f.properties.adm4_en);
const norm = s => (s ?? '').trim().toLowerCase();
const geoSet = new Set(geoNames.map(norm));

const rows = await prisma.crimeIncident.findMany({ select: { barangay: true }, distinct: ['barangay'] });
const dbNames = rows.map(r => r.barangay).filter(Boolean).sort();

const unmatched = dbNames.filter(n => !geoSet.has(norm(n)));
console.log('geojson barangays:', geoNames.length, '| distinct db barangays:', dbNames.length);
console.log('UNMATCHED (' + unmatched.length + '):');
unmatched.forEach(n => {
  // nearest geo candidate by prefix
  const cand = geoNames.find(g => norm(n).startsWith(norm(g)) || norm(g).startsWith(norm(n)));
  console.log(`  "${n}"  ->  ${cand ? `"${cand}"` : 'NO CANDIDATE'}`);
});
await prisma.$disconnect();
