import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { goal, roadmapStages, userProfile, userSkills, userLevel } = await request.json();

    const stagesText = roadmapStages?.map((s: any) => s.title).join(', ') || 'N/A';

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      temperature: 0.4,
      messages: [
        {
          role: 'system',
          content: `You are an expert quiz designer creating personalized assessments.

Create a quiz with 15-20 questions based on the user's background and skill level.

IMPORTANT RULES:
1. **Question Count**: Generate exactly 15-20 questions
2. **Difficulty Level**: 
   - If user is BEGINNER: 70% easy, 25% medium, 5% hard
   - If user is INTERMEDIATE: 30% easy, 50% medium, 20% hard
   - If user is ADVANCED: 10% easy, 30% medium, 60% hard
3. **Focus on User's Skills**: Create questions about topics the user mentioned they know
4. **Relevant Topics**: Questions should be relevant to their goal and roadmap
5. **Clear Options**: Each question must have 4 options (A, B, C, D)
6. **Explanations**: Provide clear explanations for correct answers

Respond with JSON ONLY (no markdown, no extra text):

{
  "quiz_context": {
    "based_on_skills": ["skill1", "skill2"],
    "user_level": "beginner|intermediate|advanced",
    "total_questions": 15-20
  },
  "questions": [
    {
      "id": "q1",
      "question": "Question text here?",
      "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
      "correct_option": "A",
      "topic": "Topic name",
      "difficulty": "easy|medium|hard",
      "explanation": "Why this answer is correct and others are wrong"
    }
  ]
}`
        },
        {
          role: 'user',
          content: `Student Goal: ${goal}
Roadmap Stages: ${stagesText}
User Background: ${userProfile || 'Not specified'}
Skills Mentioned: ${userSkills || 'None specified'}
User Level: ${userLevel || 'beginner'}

Create a personalized quiz with 15-20 questions focusing on the skills they mentioned at their level.`
        }
      ],
    });

    const content = completion.choices[0].message.content;
    let quiz;
    
    try {
      // Try to extract JSON from markdown code blocks
      const jsonMatch = content?.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
      if (jsonMatch) {
        quiz = JSON.parse(jsonMatch[1]);
      } else {
        quiz = JSON.parse(content || '{}');
      }
    } catch (parseError) {
      console.error('Failed to parse quiz JSON:', parseError);
      throw new Error('Invalid JSON response from AI');
    }

    return NextResponse.json(quiz);
  } catch (error) {
    console.error('Error generating quiz:', error);
    return NextResponse.json(
      { error: 'Failed to generate quiz' },
      { status: 500 }
    );
  }
}