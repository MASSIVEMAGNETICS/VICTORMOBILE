import { NextResponse } from "next/server";
import { db } from '@/lib/db';

export async function GET() {
  try {
    const threats = await db.threatLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: 20
    });

    return NextResponse.json(threats);
  } catch (error) {
    console.error('Error fetching threats:', error);
    return NextResponse.json({ error: 'Failed to fetch threats' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const threat = await db.threatLog.create({
      data: {
        type: body.type,
        location: body.location,
        severity: body.severity || 'low',
        status: body.status || 'detected',
        description: body.description
      }
    });

    return NextResponse.json(threat);
  } catch (error) {
    console.error('Error creating threat log:', error);
    return NextResponse.json({ error: 'Failed to create threat log' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    const threat = await db.threatLog.update({
      where: { id: body.id },
      data: {
        status: body.status,
        description: body.description
      }
    });

    return NextResponse.json(threat);
  } catch (error) {
    console.error('Error updating threat:', error);
    return NextResponse.json({ error: 'Failed to update threat' }, { status: 500 });
  }
}