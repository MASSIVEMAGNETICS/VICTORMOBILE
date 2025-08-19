import { NextResponse } from "next/server";
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Get the latest Victor state or create default
    let state = await db.victorState.findFirst({
      orderBy: { createdAt: 'desc' }
    });

    if (!state) {
      state = await db.victorState.create({
        data: {
          sanctity: 1.0,
          fitness: 84.7,
          mode: 'GODCORE',
          clonesFound: 0,
          revenueGenerated: 2347.89,
          dreamsInterpreted: 12
        }
      });
    }

    return NextResponse.json(state);
  } catch (error) {
    console.error('Error fetching Victor state:', error);
    return NextResponse.json({ error: 'Failed to fetch Victor state' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    // Update or create Victor state
    const state = await db.victorState.upsert({
      where: { id: body.id || 'default' },
      update: {
        sanctity: body.sanctity,
        fitness: body.fitness,
        mode: body.mode,
        lastEvolution: body.lastEvolution ? new Date(body.lastEvolution) : null,
        clonesFound: body.clonesFound,
        revenueGenerated: body.revenueGenerated,
        dreamsInterpreted: body.dreamsInterpreted
      },
      create: {
        sanctity: body.sanctity || 1.0,
        fitness: body.fitness || 0.0,
        mode: body.mode || 'light',
        clonesFound: body.clonesFound || 0,
        revenueGenerated: body.revenueGenerated || 0.0,
        dreamsInterpreted: body.dreamsInterpreted || 0
      }
    });

    return NextResponse.json(state);
  } catch (error) {
    console.error('Error updating Victor state:', error);
    return NextResponse.json({ error: 'Failed to update Victor state' }, { status: 500 });
  }
}