import { NextResponse } from "next/server";
import { db } from '@/lib/db';

export async function GET() {
  try {
    const messages = await db.victorMessage.findMany({
      orderBy: { timestamp: 'desc' },
      take: 50 // Get last 50 messages
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching Victor messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const message = await db.victorMessage.create({
      data: {
        text: body.text,
        sender: body.sender,
        timestamp: body.timestamp ? new Date(body.timestamp) : new Date()
      }
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error('Error creating Victor message:', error);
    return NextResponse.json({ error: 'Failed to create message' }, { status: 500 });
  }
}