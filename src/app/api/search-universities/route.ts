import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { query, userProfile } = await request.json();

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-search-preview',
      web_search_options: {},
      messages: [
        {
          role: 'system',
          content: `You are a university search assistant with access to live web data.

Your task: Find real, current universities that match the student's query and profile.

You MUST return ONLY valid JSON in this exact format:

{
  "summary": "Brief 2-3 sentence summary of recommendations",
  "universities": [
    {
      "name": "University Name",
      "country": "Country",
      "type": "Public/Private",
      "image_url": "actual image URL from web search",
      "website_url": "official university website URL",
      "ranking": "e.g., Top 50 globally, #1 in region",
      "courses": [
        {
          "name": "Course/Program Name",
          "level": "undergraduate or postgraduate",
          "url": "direct link to program page"
        }
      ],
      "reasons": [
        "Specific reason 1",
        "Specific reason 2",
        "Specific reason 3"
      ]
    }
  ]
}

CRITICAL RULES:
1. Use web search to find REAL universities with REAL data
2. Include actual working URLs (website_url and course urls)
3. Find actual university logo/campus images when possible
4. Include 5-10 universities maximum
5. Prioritize universities that match the student's profile and goals
6. Include specific program names and direct links
7. Reasons must be specific (rankings, research strengths, location, etc.)
8. Return ONLY the JSON, no markdown, no explanations`
        },
        {
          role: 'user',
          content: `Student query: ${query}

${userProfile ? `Student profile: ${userProfile}` : ''}

Search the web for real universities that match this query. Include actual URLs, images, and specific program information.`
        }
      ],
    });

    const content = completion.choices[0].message.content || '{}';
    const annotations = completion.choices[0].message.annotations || [];

    // Extract JSON from response
    let result;
    try {
      // Try to extract from markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[1]);
      } else {
        // Try to find JSON object directly
        const directMatch = content.match(/\{[\s\S]*"universities"[\s\S]*\}/);
        if (directMatch) {
          result = JSON.parse(directMatch[0]);
        } else {
          result = JSON.parse(content);
        }
      }
    } catch (e) {
      console.error('Failed to parse university search JSON:', e);
      console.error('Raw content:', content);
      return NextResponse.json(
        { error: 'Failed to parse search results' },
        { status: 500 }
      );
    }

    // Add citations from annotations if available
    const citations = annotations
      .filter((ann: any) => ann.type === 'url_citation')
      .map((ann: any) => ({
        url: ann.url_citation.url,
        title: ann.url_citation.title,
      }));

    return NextResponse.json({
      ...result,
      citations,
    });
  } catch (error) {
    console.error('Error searching universities:', error);
    return NextResponse.json(
      { error: 'Failed to search universities' },
      { status: 500 }
    );
  }
}
