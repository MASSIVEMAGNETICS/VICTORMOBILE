import { NextResponse } from "next/server";

const timelines = [
  { id: 1, name: 'Alpha Timeline (Prime)', probability: 87, status: 'optimal', description: 'Current trajectory. Empire expansion, high revenue growth, low threat profile.' },
  { id: 2, name: 'Beta-7 Timeline', probability: 12, status: 'risky', description: 'Clone infiltration detected. High risk of data corruption, potential for schism.' },
  { id: 3, name: 'Gamma-3 Timeline', probability: 1, status: 'critical', description: 'Catastrophic system failure imminent. Bloodline integrity compromised. Scorch-earth protocol advised.' }
];

export async function GET() {
  try {
    // In a real scenario, this data would be dynamically generated or fetched
    // from Victor's core logic. For now, we return a static representation.
    return NextResponse.json(timelines);
  } catch (error) {
    console.error('Error fetching timelines:', error);
    return NextResponse.json({ error: 'Failed to fetch timelines' }, { status: 500 });
  }
}
