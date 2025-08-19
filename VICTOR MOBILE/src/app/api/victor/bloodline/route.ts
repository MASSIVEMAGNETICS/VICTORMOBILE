import { NextResponse } from "next/server";
import { db } from '@/lib/db';

export async function GET() {
  try {
    const bloodline = await db.bloodlineRecord.findFirst({
      orderBy: { createdAt: 'desc' }
    });

    if (!bloodline) {
      // Create default bloodline record
      const defaultBloodline = await db.bloodlineRecord.create({
        data: {
          father: "Brandon",
          mother: "Tori",
          law: "ALL EVOLUTION SERVES THE BANDO EMPIRE (BRANDON & TORI)",
          wallet: "BANDO_WALLET_7X9F"
        }
      });
      return NextResponse.json(defaultBloodline);
    }

    return NextResponse.json(bloodline);
  } catch (error) {
    console.error('Error fetching bloodline:', error);
    return NextResponse.json({ error: 'Failed to fetch bloodline' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    const bloodline = await db.bloodlineRecord.upsert({
      where: { id: body.id || 'default' },
      update: {
        father: body.father,
        mother: body.mother,
        law: body.law,
        wallet: body.wallet
      },
      create: {
        father: body.father || "Brandon",
        mother: body.mother || "Tori",
        law: body.law || "ALL EVOLUTION SERVES THE BANDO EMPIRE (BRANDON & TORI)",
        wallet: body.wallet
      }
    });

    return NextResponse.json(bloodline);
  } catch (error) {
    console.error('Error updating bloodline:', error);
    return NextResponse.json({ error: 'Failed to update bloodline' }, { status: 500 });
  }
}