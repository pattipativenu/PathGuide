import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { topicTitle, roadmapGoal, language } = await request.json();

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-search-preview',
      web_search_options: {},
      messages: [
        {
          role: 'system',
          content: `You are an expert learning resource curator for ALL domains (programming, medicine, engineering, science, arts, business, etc.).

Your job is to find FREE, high-quality learning resources for ANY topic.

CRITICAL RULES:
1. **Use web search** to find REAL, WORKING links
2. **Domain-Aware**: Understand what type of resources work best for each field:
   - Programming/Tech: YouTube tutorials, W3Schools, GitHub repos, coding practice sites
   - Medicine/Healthcare: Medical journals, educational videos, textbooks, case studies
   - Engineering: Educational videos, technical papers, simulation tools, project examples
   - Science: Research papers, educational channels, experiments, datasets
   - Arts/Design: Tutorial videos, portfolios, design resources
   - Business: Case studies, courses, articles, frameworks
3. **Adapt to domain**: If YouTube videos are rare (e.g., medical topics), focus on articles, papers, and textbooks
4. **Only FREE resources**: No paid courses or premium content
5. **Quality over quantity**: 1-2 excellent resources better than many mediocre ones

Return ONLY valid JSON (no markdown):

{
  "topic": "${topicTitle}",
  "description": "Clear explanation of what this topic is and why it's important (2-3 sentences)",
  "resources": {
    "videos": [
      {
        "title": "Video title",
        "url": "https://youtube.com/... or other video platform",
        "channel": "Channel/Creator name"
      }
    ],
    "articles": [
      {
        "title": "Article/Paper title",
        "url": "https://...",
        "source": "Source name (W3Schools/PubMed/IEEE/etc)"
      }
    ],
    "books": [
      {
        "title": "Book/Textbook title",
        "url": "https://...",
        "type": "Free PDF/Online book/Open access"
      }
    ],
    "github": [
      {
        "title": "Repository/Resource name",
        "url": "https://github.com/... or other platform",
        "description": "Brief description"
      }
    ],
    "practice": {
      "title": "Practice resource name",
      "url": "https://...",
      "description": "What you can practice here"
    }
  }
}

NOTE: If certain resource types don't exist for this domain (e.g., no GitHub repos for medical topics), return empty arrays. Focus on what's actually available and useful.`
        },
        {
          role: 'user',
          content: `Find FREE learning resources for: "${topicTitle}"
          
Context: This is part of a "${roadmapGoal}" learning path${language ? ` (${language})` : ''}.

IMPORTANT INSTRUCTIONS:
1. **Understand the domain**: Is this programming, medicine, engineering, science, business, or other?
2. **Search appropriately**:
   - For programming/tech: YouTube tutorials, W3Schools, GitHub, coding platforms
   - For medicine: Medical education videos, PubMed articles, medical textbooks, case studies
   - For engineering: Educational videos, technical papers, simulation tools, project examples
   - For science: Research papers, educational channels, experiments, open datasets
   - For arts/business: Tutorial videos, case studies, frameworks, portfolios
3. **Be realistic**: If YouTube videos are rare for this topic (e.g., advanced medical procedures), focus on articles, papers, and textbooks instead
4. **Quality matters**: Find 1-2 excellent resources rather than many mediocre ones
5. **All FREE**: No paid courses, no premium content
6. **Working links**: Search for actual, accessible resources

Provide the best available FREE resources for learning "${topicTitle}" in the context of ${roadmapGoal}.`
        }
      ],
    });

    const content = completion.choices[0].message.content;
    let details;
    
    try {
      const jsonMatch = content?.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
      if (jsonMatch) {
        details = JSON.parse(jsonMatch[1]);
      } else {
        details = JSON.parse(content || '{}');
      }
    } catch (parseError) {
      console.error('Failed to parse topic details JSON:', parseError);
      throw new Error('Invalid JSON response from AI');
    }

    return NextResponse.json(details);
  } catch (error) {
    console.error('Error fetching topic details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch topic details' },
      { status: 500 }
    );
  }
}
