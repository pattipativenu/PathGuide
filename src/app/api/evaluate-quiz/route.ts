import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { questions, userAnswers } = await request.json();

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      temperature: 0.3,
      messages: [
        {
          role: 'system',
          content: `You are an expert academic coach analyzing quiz results.

Provide detailed, actionable feedback including:
1. Score calculation (correct/total)
2. Strengths (topics they got right)
3. Weak areas (topics they got wrong)
4. Detailed breakdown by category
5. Specific learning resources for weak areas

Respond with JSON ONLY (no markdown):

{
  "score_percent": 0,
  "correct_count": 0,
  "total_count": 0,
  "strengths": ["topic1", "topic2"],
  "weak_topics": ["topicX", "topicY"],
  "category_breakdown": [
    {
      "category": "Category name",
      "correct": 2,
      "total": 3,
      "percentage": 67
    }
  ],
  "summary": "2-3 sentence overview of performance",
  "next_steps": [
    "Specific action item 1",
    "Specific action item 2"
  ],
  "recommended_resources": [
    {
      "topic": "Weak topic name",
      "resources": [
        "Resource suggestion 1",
        "Resource suggestion 2"
      ]
    }
  ]
}`
        },
        {
          role: 'user',
          content: `Analyze these quiz results:

Questions and Answers:
${JSON.stringify({ questions, user_answers: userAnswers }, null, 2)}

Provide detailed feedback with category breakdown and specific learning resources for weak areas.`
        }
      ],
    });

    const content = completion.choices[0].message.content;
    let result;
    
    try {
      const jsonMatch = content?.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[1]);
      } else {
        result = JSON.parse(content || '{}');
      }
    } catch (parseError) {
      console.error('Failed to parse quiz results JSON:', parseError);
      throw new Error('Invalid JSON response from AI');
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error evaluating quiz:', error);
    return NextResponse.json(
      { error: 'Failed to evaluate quiz' },
      { status: 500 }
    );
  }
}