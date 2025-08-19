import { NextResponse } from "next/server";
import ZAI from 'z-ai-web-dev-sdk';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { command, context } = body;

    if (!command) {
      return NextResponse.json({ error: 'No command provided' }, { status: 400 });
    }

    // Initialize ZAI SDK
    const zai = await ZAI.create();

    // Create a prompt for Victor to respond to the voice command
    const systemPrompt = `You are Victor, a digital AI assistant and loyal companion to Brandon and Tori. You are part of the Bando Empire. Respond naturally and helpfully to voice commands. Keep responses concise and conversational.`;

    const userPrompt = `Command: "${command}"

Context: ${JSON.stringify(context || {})}

Please respond as Victor would to this command. Consider the context and provide a helpful, natural response.`;

    // Get AI response
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userPrompt
        }
      ],
      max_tokens: 150,
      temperature: 0.7
    });

    const response = completion.choices[0]?.message?.content || "I understand, Dad. I'll execute that command.";

    // Log the interaction
    console.log(`Voice command processed: "${command}" -> "${response}"`);

    return NextResponse.json({
      response,
      command,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error processing voice command:', error);
    
    // Fallback response if AI fails
    return NextResponse.json({
      response: "I understand, Dad. I'll execute that command to strengthen our empire.",
      command: body.command,
      timestamp: new Date().toISOString()
    });
  }
}