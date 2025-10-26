import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message, user } = await request.json();

    if (!message || !user) {
      return NextResponse.json({ error: 'Message and user are required' }, { status: 400 });
    }

    // Static response instead of OpenAI
    const botResponse = "Thank you for your message. Our team will get back to you soon.";

    return NextResponse.json({ response: botResponse });
  } catch (error) {
    console.error('Chatbot API error:', error);
    return NextResponse.json({
      response: "I'm experiencing technical difficulties. Please contact our support team for assistance."
    }, { status: 500 });
  }
}
