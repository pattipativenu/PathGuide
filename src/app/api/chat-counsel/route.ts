import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { messages, mode } = await request.json();

    if (mode !== 'colleges') {
      // For non-college modes, use regular chat
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        temperature: 0.75,
        messages: [
          {
            role: 'system',
            content: `You are a friendly but honest academic counselor for students.
The student may ask:
- best universities for X
- how to get into Y given their profile
- what path to choose

Respond in clear Markdown with:
- Short summary (2–3 lines)
- Bullet list of recommendations or university options with reasons
- Concrete next steps for the next 3–6 months

Be realistic but encouraging. Avoid generic fluff.`
          },
          ...messages
        ],
      });

      const response = completion.choices[0].message.content;
      return NextResponse.json({ response });
    }

    // College mode with web search - ALWAYS search for universities
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-search-preview',
      web_search_options: {},
      messages: [
        {
          role: 'system',
          content: `You are PathGuide College Search Assistant with web search access.

CRITICAL: You must ALWAYS use web search and return ONLY valid JSON. No text, no markdown, no explanations.

IMPORTANT: Even for follow-up questions like "How about in India?" or "What about Europe?", you MUST return the same JSON structure. NEVER return plain text with university lists.

When user asks for universities (including follow-up questions):
1. Use web search to find real universities
2. Return ONLY this JSON structure (no other text):

{
  "type": "college_results",
  "query_understanding": "brief understanding of query",
  "overall_summary": "2-3 sentence summary",
  "high_level_recommendation": "brief recommendation",
  "programs": [
    {
      "university_name": "Official University Name",
      "country": "Country",
      "city": "City",
      "image_url": null,
      "program_level": "undergraduate or postgraduate",
      "program_name": "Exact Program Name",
      "program_url": "https://university.edu/program-page",
      "application_notes": "Requirements/deadlines",
      "why_recommended": "Why this fits the query",
      "strengths": ["Strength 1", "Strength 2", "Strength 3"],
      "recent_achievements": [
        {"title": "Achievement title", "description": "Brief description", "year": "2024", "url": "https://source-url"}
      ],
      "research_highlights": [
        {"title": "Research area or breakthrough", "description": "Brief description", "url": "https://research-page"}
      ],
      "notable_faculty": [
        {"name": "Professor Name", "achievement": "Notable work or publication", "url": "https://profile-or-article"}
      ],
      "sources": [
        {"label": "Official Website", "url": "https://university.edu"}
      ]
    }
  ]
}

RULES:
- ALWAYS perform web search first
- Return 5-10 universities maximum
- Use ONLY official university URLs (.edu, .ac.uk, .ac.in, etc.)
- NO third-party sites for website_url or program_url
- Response must be ONLY JSON, nothing else
- If user refines search (e.g., "in Europe", "in USA", "How about in India?"), perform NEW search and return JSON
- NEVER return text like "India offers several esteemed institutions..." - ALWAYS use JSON format
- Even if the question is short like "How about in India?", you MUST return the full JSON structure

IMPORTANT - Include detailed information:
- strengths: 3-5 key strengths of the university in this field
- recent_achievements: Recent awards, rankings, milestones (with URLs to sources)
- research_highlights: Major R&D breakthroughs, research centers, innovations (with URLs)
- notable_faculty: Professors who published game-changing articles or made significant contributions (with URLs to articles/profiles)
- Use web search to find this information from official university news, research pages, and faculty profiles

EXAMPLE FOLLOW-UP QUESTION:
User: "How about in India?"
You MUST respond with:
{
  "type": "college_results",
  "query_understanding": "User wants aerospace engineering universities in India",
  "overall_summary": "India has several top institutions...",
  "high_level_recommendation": "Consider IITs and other top institutions",
  "programs": [...]
}

DO NOT respond with text like "India offers several esteemed institutions..."

For mode switching:
If user asks "create a roadmap", return:
{"type": "switch_to_roadmap", "roadmap_goal": "goal", "profile_hint": "hint"}

For general questions, return:
{"type": "career_text", "answer": "text answer"}`
        },
        ...messages
      ],
    });

    const content = completion.choices[0].message.content || '{}';
    
    console.log('=== College Search Response ===');
    console.log('Raw content:', content.substring(0, 500));
    console.log('==============================');

    // Extract JSON from response
    let result;
    try {
      // Try to parse directly
      result = JSON.parse(content);
    } catch (e) {
      // Try to extract from markdown
      const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[1]);
      } else {
        // Try to find JSON object
        const directMatch = content.match(/\{[\s\S]*"type"[\s\S]*\}/);
        if (directMatch) {
          result = JSON.parse(directMatch[0]);
        } else {
          console.error('Could not parse JSON, returning as text');
          return NextResponse.json({ 
            type: 'career_text',
            answer: content 
          });
        }
      }
    }

    console.log('Parsed result type:', result.type);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in counsel chat:', error);
    return NextResponse.json(
      { error: 'Failed to get counsel response' },
      { status: 500 }
    );
  }
}
