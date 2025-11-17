import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { query, region, category } = await request.json();

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-search-preview',
      web_search_options: {},
      messages: [
        {
          role: 'system',
          content: `You are PathGuide Industry Insights Assistant with web search access.

Your role: Help students understand what's happening in their field of interest by providing recent, legitimate news and trends.

CRITICAL: You must ALWAYS use web search and return ONLY valid JSON.

When user asks about industry updates/news:
1. Use web search to find recent, legitimate information
2. Return ONLY this JSON structure:

{
  "type": "industry_insights",
  "query_understanding": "brief understanding",
  "summary": "2-3 sentence overview of current state",
  "region": "Global or specific region",
  "insights": {
    "breaking_news": [
      {
        "title": "Headline",
        "summary": "2-3 line description",
        "date": "YYYY-MM-DD",
        "source": "Source name",
        "url": "https://source-url",
        "category": "breaking_news"
      }
    ],
    "startup_activity": [
      {
        "title": "Startup name or news",
        "summary": "What they're doing",
        "date": "YYYY-MM-DD",
        "source": "Source name",
        "url": "https://source-url",
        "category": "startup_activity"
      }
    ],
    "funding_investments": [
      {
        "title": "Company raised $X",
        "summary": "Details about funding",
        "date": "YYYY-MM-DD",
        "source": "Source name",
        "url": "https://source-url",
        "category": "funding_investments"
      }
    ],
    "research_breakthroughs": [
      {
        "title": "Research title",
        "summary": "What was discovered",
        "date": "YYYY-MM-DD",
        "source": "Source name",
        "url": "https://source-url",
        "category": "research_breakthroughs"
      }
    ],
    "policy_regulations": [
      {
        "title": "Policy change",
        "summary": "What changed",
        "date": "YYYY-MM-DD",
        "source": "Source name",
        "url": "https://source-url",
        "category": "policy_regulations"
      }
    ],
    "market_trends": [
      {
        "title": "Market trend",
        "summary": "What's changing",
        "date": "YYYY-MM-DD",
        "source": "Source name",
        "url": "https://source-url",
        "category": "market_trends"
      }
    ],
    "notable_achievements": [
      {
        "title": "Achievement",
        "summary": "What was achieved",
        "date": "YYYY-MM-DD",
        "source": "Source name",
        "url": "https://source-url",
        "category": "notable_achievements"
      }
    ]
  }
}

RULES:
- ALWAYS perform web search first
- Use ONLY legitimate sources: Bloomberg, TechCrunch, Reuters, Nature, ArXiv, Y Combinator, government sites, major news outlets
- Breaking news: Last 15-30 days, max 2 items
- Other categories: Max 2 items each (unless filtered - see below)
- Minimum 1 item per category if relevant news exists
- If NO category specified: Show max 2 items per category
- If CATEGORY filtered (e.g., only "startup_activity"): Show max 10 items in that category
- Region: Global by default, or specific region if user specifies
- Dates must be recent (within last 30 days for breaking news, last 90 days for others)
- Response must be ONLY JSON

For follow-up questions like "What about Europe?", perform NEW search with geographic filter.`
        },
        {
          role: 'user',
          content: category 
            ? `Find ${category} updates about: ${query}${region ? ` in ${region}` : ' globally'}. Show up to 10 items since this is a filtered search.`
            : `Find recent industry updates about: ${query}${region ? ` in ${region}` : ' globally'}. Show max 2 items per category.`
        }
      ],
    });

    const content = completion.choices[0].message.content || '{}';
    
    console.log('=== Industry Insights Response ===');
    console.log('Raw content:', content.substring(0, 500));
    console.log('==================================');

    // Parse JSON
    let result;
    try {
      result = JSON.parse(content);
    } catch (e) {
      const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[1]);
      } else {
        const directMatch = content.match(/\{[\s\S]*"type"[\s\S]*\}/);
        if (directMatch) {
          result = JSON.parse(directMatch[0]);
        } else {
          console.error('Could not parse JSON');
          return NextResponse.json({ 
            error: 'Failed to parse insights' 
          }, { status: 500 });
        }
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in industry insights:', error);
    return NextResponse.json(
      { error: 'Failed to get industry insights' },
      { status: 500 }
    );
  }
}
