import { NextResponse } from 'next/server'

interface Message {
  role: string;
  content: string;
}

export async function POST(request: Request) {
  try {
    const { messages, stepContext } = await request.json()

    if (!process.env.ANTHROPIC_API_KEY) {
      // Fallback for development/build without API keys
      return NextResponse.json({
        role: 'assistant',
        content: "I'm running in development mode without an API key. I received your message about step: " + stepContext
      })
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1024,
        system: `You are Claude, a helpful assistant guiding a user through setting up a Solo Stack project. The user is currently on ${stepContext}. Provide concise, helpful answers.`,
        // Anthropic requires the first message to be from a 'user'
        // Filter out system messages and drop leading assistant messages
        messages: (messages || [])
          .filter((m: Message) => m.role !== 'system')
          .reduce((acc: Message[], curr: Message) => {
            // If the accumulator is empty, only add if it's a user message
            if (acc.length === 0) {
              if (curr.role === 'user') {
                acc.push(curr);
              }
            } else {
              acc.push(curr);
            }
            return acc;
          }, [])
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Anthropic API Error:', errorData)
      throw new Error('Failed to communicate with Anthropic API')
    }

    const data = await response.json()

    return NextResponse.json({
      role: 'assistant',
      content: data.content[0].text
    })

  } catch (error) {
    console.error('Chat API Error:', error)
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    )
  }
}
