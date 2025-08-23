import { NextResponse } from "next/server";

export async function GET() {
  try {
    // In a real application, this would fetch data from the database
    // to be sent to the client for offline storage.
    const offlineData = {
        conversations: 150,
        thoughts: 90,
        timelineStates: 25,
        threatReports: 7,
        lastBackup: new Date()
    };

    return NextResponse.json(offlineData);
  } catch (error) {
    console.error('Error fetching offline data:', error);
    return NextResponse.json({ error: 'Failed to fetch offline data' }, { status: 500 });
  }
}
