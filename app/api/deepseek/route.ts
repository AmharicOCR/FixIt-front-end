import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { prompt } = await req.json();

  try {
    const response = await fetch(
      `https://openrouter.ai/api/v1/chat/completions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: 'openai/gpt-4o',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 40,
        }),
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      console.error("API Error:", data);
      throw new Error(data.error?.message || "API request failed");
    }

    if (!data.choices?.[0]?.message?.content) {
      throw new Error("No text generated in response");
    }

    return NextResponse.json({
      choices: [{
        message: {
          content: data.choices[0].message.content
        }
      }]
    });
    
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to call API" },
      { status: 500 }
    );
  }
}