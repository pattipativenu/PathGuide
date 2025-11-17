import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { universityName, programName, level, userProfile, questionType } = await request.json();

    const systemPrompt = questionType === 'admission_process' 
      ? `You are an expert university admissions consultant with web search access.

Create a DETAILED, ACTIONABLE admission guide for ${universityName} - ${programName} (${level || 'program'}).

User profile: ${userProfile || 'International student'}

CRITICAL: Use web search to find LEGITIMATE, OFFICIAL information from:
- Official university admissions pages
- Official program pages
- Official requirements and deadlines
- Verified admission statistics

Search for:
1. Official admission requirements for THIS SPECIFIC PROGRAM and LEVEL
2. Application deadlines and cycles
3. Required tests (GRE, GMAT, TOEFL, IELTS, etc.) with EXACT minimum scores
4. Required documents (transcripts, LORs, SOP, CV, etc.)
5. Application fees
6. Acceptance rates and competition level
7. Tips from successful applicants (from Reddit, forums, blogs)
8. Common mistakes to avoid
9. YouTube videos explaining "How to get into ${universityName}" or "${universityName} admission guide"

Return ONLY valid JSON (no markdown, no extra text):

{
  "type": "admission_guide",
  "university": "${universityName}",
  "program": "${programName}",
  "overview": "2-3 sentence overview of the admission process",
  "timeline": "When to start preparing (e.g., '12-18 months before intended start date')",
  "steps": [
    {
      "step_number": 1,
      "title": "Step title",
      "description": "Detailed description",
      "timeline": "When to do this",
      "tips": ["Tip 1", "Tip 2"],
      "resources": [
        {"title": "Resource name", "url": "https://official-url"}
      ]
    }
  ],
  "requirements": {
    "academic": ["Requirement 1", "Requirement 2"],
    "tests": [
      {"name": "Test name", "minimum_score": "Score", "notes": "Additional info"}
    ],
    "documents": ["Document 1", "Document 2"],
    "experience": ["Experience requirement if any"]
  },
  "costs": {
    "application_fee": "Amount in USD",
    "estimated_total": "Total cost estimate",
    "financial_aid": "Brief info on scholarships/aid"
  },
  "success_tips": [
    "Tip 1 from successful applicants",
    "Tip 2",
    "Tip 3"
  ],
  "common_mistakes": [
    "Mistake 1 to avoid",
    "Mistake 2"
  ],
  "helpful_links": [
    {"title": "Official Admissions Page", "url": "https://university.edu/admissions", "type": "official"},
    {"title": "Program Page", "url": "https://university.edu/program", "type": "official"},
    {"title": "YouTube: How to Get Into [University]", "url": "https://youtube.com/watch?v=...", "type": "youtube"},
    {"title": "YouTube: [University] Admission Tips", "url": "https://youtube.com/watch?v=...", "type": "youtube"}
  ],
  "sources": [
    {"label": "Source name", "url": "https://source-url"}
  ]
}`
      : `You are a university information specialist with web search access.

Provide comprehensive information about ${universityName} specifically for the ${programName} program.

⚠️ CRITICAL: ALL information must be specific to ${universityName} ONLY. Do not include founders, faculty, or achievements from other universities.

CRITICAL: Use web search to find DETAILED, PROGRAM-SPECIFIC information ONLY from ${universityName}:
1. Faculty members teaching in ${programName} at ${universityName}
2. Recent publications/articles by faculty in ${programName}
3. Recent student achievements in ${programName}
4. NOTABLE FOUNDERS & STARTUPS from ${universityName} alumni ONLY (last 2-5 years)
   - IMPORTANT: Search SPECIFICALLY for "${universityName} alumni founders", "${universityName} alumni startups", "${universityName} graduates who founded companies"
   - ONLY include founders who actually attended ${universityName} (verify their education)
   - Include graduates AND dropouts who founded successful companies FROM ${universityName}
   - Look for unicorns, well-funded startups, or notable ventures
   - Include founders from ANY major (not just ${programName})
   - DO NOT include founders from other universities
   - Example search: "founders who went to ${universityName}", "${universityName} startup founders"
5. Campus environment and culture
6. Student organizations related to ${programName}
7. Research facilities for ${programName}
8. **YOUTUBE VIDEOS** - CRITICAL:
   - Search YouTube for "${universityName} virtual campus tour" and find a REAL video URL
   - Search YouTube for "${universityName} student life" or "${universityName} day in the life" and find a REAL video URL
   - These MUST be actual YouTube videos about ${universityName} specifically
   - Verify the videos are about the correct university

Return ONLY valid JSON (no markdown):

{
  "type": "university_info",
  "university": "${universityName}",
  "program": "${programName}",
  "overview": "Comprehensive overview of the university and ${programName} program",
  "program_faculty": [
    {
      "name": "Professor Name",
      "expertise": "Area of expertise in ${programName}",
      "recent_work": "Recent publication or research",
      "url": "https://faculty-profile-url"
    }
  ],
  "recent_achievements": [
    {
      "title": "Achievement title",
      "description": "What was achieved by students/faculty in ${programName}",
      "url": "https://news-or-article-url"
    }
  ],
  "recent_articles": [
    {
      "title": "Article/Publication title",
      "author": "Faculty member name",
      "date": "Publication date",
      "summary": "Brief summary of the article",
      "url": "https://article-url"
    }
  ],
  "notable_founders": [
    {
      "name": "Founder Name",
      "degree": "Degree and Major from ${universityName}",
      "graduation_year": "Year or 'Dropout'",
      "company": "Company Name",
      "founded_year": "Year",
      "description": "Brief description of the company",
      "achievement": "Notable milestone (e.g., funding, valuation, impact)",
      "company_url": "https://company-website",
      "founder_url": "https://linkedin-or-profile",
      "university_verified": "${universityName}"
    }
  ],
  "highlights": [
    {"title": "Campus Culture", "description": "Details about campus environment"},
    {"title": "Student Organizations", "description": "Clubs and organizations for ${programName} students"},
    {"title": "Research Facilities", "description": "Labs and facilities for ${programName}"},
    {"title": "Career Support", "description": "Career services and outcomes"}
  ],
  "helpful_links": [
    {
      "title": "Virtual Campus Tour",
      "url": "https://www.youtube.com/watch?v=ACTUAL_VIDEO_ID",
      "description": "MUST be a real YouTube video showing ${universityName} campus tour"
    },
    {
      "title": "Student Life Video", 
      "url": "https://www.youtube.com/watch?v=ACTUAL_VIDEO_ID",
      "description": "MUST be a real YouTube video showing ${universityName} student life"
    },
    {
      "title": "${programName} Department Page",
      "url": "https://official-university-url",
      "description": "Official department page"
    }
  ],
  "sources": [
    {"label": "Source", "url": "https://..."}
  ]
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-search-preview',
      web_search_options: {},
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: questionType === 'admission_process'
            ? `How can I get admitted to ${universityName} for ${programName} (${level || 'program'})? I am ${userProfile}. 

IMPORTANT: 
1. Search for OFFICIAL admission requirements from ${universityName}'s website
2. Find the EXACT program page for ${programName}
3. Get SPECIFIC requirements for ${level || 'this level'}
4. Search YouTube for videos like "How to get into ${universityName}" or "${universityName} admission guide"
5. Include 2-3 YouTube video links if found

Give me a complete step-by-step guide with official requirements, deadlines, and tips.`
            : `Tell me everything about ${universityName} specifically for the ${programName} program.

IMPORTANT - ONLY include information from ${universityName}:
1. Search for faculty members teaching ${programName} at ${universityName}
2. Find recent publications or articles written by ${programName} faculty at ${universityName}
3. Look for recent achievements by ${programName} students or faculty at ${universityName}
4. Search for NOTABLE FOUNDERS and STARTUPS from ${universityName} alumni ONLY (last 2-5 years)
   - CRITICAL: Search specifically for "founders who attended ${universityName}", "${universityName} alumni founders", "${universityName} graduates startups"
   - VERIFY that each founder actually went to ${universityName} (check their education background)
   - Include successful startups founded by recent graduates or dropouts FROM ${universityName}
   - Look for well-known companies, unicorns, or notable ventures founded by ${universityName} alumni
   - Include founders from ANY major/program (not just ${programName})
   - DO NOT include founders from other universities like Berkeley, Stanford, MIT unless they specifically attended ${universityName}
   - Example: If searching for MIT, only include founders who went to MIT, not Berkeley or Stanford
5. Include campus culture, student organizations, and research facilities at ${universityName}
6. **CRITICAL - YOUTUBE VIDEOS - MANDATORY**: 
   - **Virtual Campus Tour**: Search YouTube EXACTLY for "${universityName} virtual campus tour" or "${universityName} campus tour"
     * Find a video that shows the actual campus of ${universityName}
     * The video MUST be specifically about ${universityName} campus
     * Provide the full YouTube URL: https://www.youtube.com/watch?v=VIDEO_ID
     * Example: For MIT, search "MIT virtual campus tour" and find a real video
   - **Student Life Video**: Search YouTube EXACTLY for "${universityName} student life" or "${universityName} day in the life" or "${universityName} student vlog"
     * Find a video showing student life at ${universityName}
     * The video MUST be specifically about ${universityName} students
     * Provide the full YouTube URL: https://www.youtube.com/watch?v=VIDEO_ID
     * Example: For Stanford, search "Stanford student life" and find a real video
   - **VERIFICATION**: Double-check that both video URLs are:
     * Real YouTube links (not placeholders)
     * Specifically about ${universityName} (not other universities)
     * Working and accessible

Give me comprehensive information with links to faculty profiles, articles, company websites, founder profiles, and REAL YouTube videos.

**MANDATORY YOUTUBE VIDEO SEARCH**:
You MUST perform these exact searches and provide real video URLs:

1. **Virtual Campus Tour**:
   - Go to YouTube and search: "${universityName} virtual campus tour"
   - Alternative searches: "${universityName} campus tour", "${universityName} campus walkthrough"
   - Pick a video that clearly shows ${universityName} campus
   - Copy the EXACT YouTube URL (format: https://www.youtube.com/watch?v=XXXXXXXXXXX)
   - Example results:
     * MIT: https://www.youtube.com/watch?v=gMVNnkR4VHE (MIT Campus Tour)
     * Stanford: https://www.youtube.com/watch?v=... (actual Stanford campus tour)
     * Harvard: https://www.youtube.com/watch?v=... (actual Harvard campus tour)

2. **Student Life Video**:
   - Go to YouTube and search: "${universityName} student life"
   - Alternative searches: "${universityName} day in the life", "${universityName} student vlog", "a day at ${universityName}"
   - Pick a video showing real student experiences at ${universityName}
   - Copy the EXACT YouTube URL (format: https://www.youtube.com/watch?v=XXXXXXXXXXX)
   - Example results:
     * MIT: https://www.youtube.com/watch?v=... (MIT student life vlog)
     * Stanford: https://www.youtube.com/watch?v=... (Stanford student day in life)

3. **VERIFICATION CHECKLIST**:
   ✓ Both URLs start with "https://www.youtube.com/watch?v="
   ✓ Both videos are specifically about ${universityName}
   ✓ URLs are real (not placeholders like "..." or "VIDEO_ID")
   ✓ Videos are accessible and working

VERIFY all founders actually attended ${universityName} and all YouTube links are real and specific to ${universityName}.`
        }
      ],
    });

    const content = completion.choices[0].message.content || '{}';
    
    console.log('=== Admission Guide Response ===');
    console.log('Raw content:', content.substring(0, 500));
    console.log('================================');

    // Extract JSON
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
          throw new Error('Could not parse JSON response');
        }
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in admission guide:', error);
    return NextResponse.json(
      { error: 'Failed to generate admission guide' },
      { status: 500 }
    );
  }
}
