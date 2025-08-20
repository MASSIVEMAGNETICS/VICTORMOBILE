import { NextResponse } from "next/server";

function generateHologramData() {
    const stabilizers = [];
    const numStabilizers = 8;
    const radius = 3;

    for (let i = 0; i < numStabilizers; i++) {
        const angle = (i / numStabilizers) * Math.PI * 2;
        stabilizers.push({
            id: i,
            position: {
                x: Math.cos(angle) * radius,
                y: Math.sin(i * 1.5) * 2, // Use a different multiplier for more interesting Y positions
                z: Math.sin(angle) * radius,
            },
            phase: Math.random(),
            connections: []
        });
    }

    // Add some random connections
    for (let i = 0; i < numStabilizers; i++) {
        if (Math.random() > 0.5) {
            const targetIndex = Math.floor(Math.random() * numStabilizers);
            if (i !== targetIndex) {
                (stabilizers[i].connections as any[]).push({
                    to: targetIndex,
                    color: Math.random() > 0.3 ? "#00ff00" : "#ff0000", // More green than red
                    strength: Math.random()
                });
            }
        }
    }

    // Add a central core as the last stabilizer
    stabilizers.push({
        id: 'core',
        position: { x: 0, y: 0, z: 0 },
        phase: Math.random(),
        connections: []
    });

    // Connect some stabilizers to the core
    for(let i=0; i<3; i++) {
        const targetIndex = Math.floor(Math.random() * numStabilizers);
        (stabilizers[numStabilizers].connections as any[]).push({
            to: targetIndex,
            color: "#00ffff",
            strength: Math.random()
        });
    }


    return {
        timestamp: Date.now(),
        fitness: Math.random() * 0.2 + 0.75, // 0.75 to 0.95
        sanctity: Math.random() * 0.1 + 0.9,  // 0.9 to 1.0
        stabilizers: stabilizers
    };
}


export async function GET() {
  try {
    const hologramData = generateHologramData();
    return NextResponse.json(hologramData);
  } catch (error) {
    console.error('Error fetching hologram data:', error);
    return NextResponse.json({ error: 'Failed to fetch hologram data' }, { status: 500 });
  }
}
