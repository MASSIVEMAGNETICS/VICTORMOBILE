import { NextResponse } from "next/server";
import { db } from '@/lib/db';

export async function GET() {
  try {
    const parityState = await db.parityState.findFirst({
      orderBy: { timestamp: 'desc' }
    });

    if (!parityState) {
      // Create default parity state
      const defaultState = await db.parityState.create({
        data: {
          stabilizers: JSON.stringify([]),
          measurements: 0,
          entropy: 0.0,
          coherence: 1.0
        }
      });
      return NextResponse.json(defaultState);
    }

    return NextResponse.json(parityState);
  } catch (error) {
    console.error('Error fetching parity state:', error);
    return NextResponse.json({ error: 'Failed to fetch parity state' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const parityState = await db.parityState.create({
      data: {
        stabilizers: JSON.stringify(body.stabilizers || []),
        measurements: body.measurements || 0,
        entropy: body.entropy || 0.0,
        coherence: body.coherence || 1.0
      }
    });

    return NextResponse.json(parityState);
  } catch (error) {
    console.error('Error creating parity state:', error);
    return NextResponse.json({ error: 'Failed to create parity state' }, { status: 500 });
  }
}