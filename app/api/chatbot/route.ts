import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { message, user } = await request.json();

    if (!message || !user) {
      return NextResponse.json({ error: 'Message and user are required' }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are CarBot, a helpful AI assistant for Car Explorer, a car dealership website. You help customers with:
- Information about cars and pricing
- Test drive scheduling
- Support and customer service
- General car-related questions
- Website navigation and features

Be friendly, helpful, and professional. Keep responses concise but informative. If you don't know something specific, suggest contacting human support. Always stay in character as a car dealership assistant.`
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const botResponse = completion.choices[0]?.message?.content?.trim() || "I'm sorry, I couldn't process that request. Please try again or contact our support team.";

    return NextResponse.json({ response: botResponse });
  } catch (error) {
    console.error('Chatbot API error:', error);
    return NextResponse.json({
      response: "I'm experiencing technical difficulties. Please contact our support team for assistance."
    }, { status: 500 });
  }
}
