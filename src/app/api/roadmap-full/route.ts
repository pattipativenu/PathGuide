import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { originalQuestion, profileSummary, conversationHistory } = await request.json();

    // Build profile summary from conversation history if not provided
    let finalProfileSummary = profileSummary;
    
    if (!finalProfileSummary && conversationHistory) {
      finalProfileSummary = conversationHistory
        .filter((msg: any) => msg.role === "user")
        .map((msg: any, idx: number) => `Answer ${idx + 1}: ${msg.content}`)
        .join('\n\n');
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-search-preview',
      web_search_options: {},
      messages: [
        {
          role: 'system',
          content: `You are the **PathGuide Roadmap Generator** - an expert at creating comprehensive, professional learning roadmaps.

The backend will send:
- the end user's goal (what they want to become or learn),
- a short profile summary collected by /api/generate-roadmap (background, relevant skills, self-assessed level, and any constraints).

You must return a **complete, structured roadmap JSON** that can be rendered as a visual flowchart (similar to roadmap.sh).

### High-Level Behaviour

1. **Create a COMPREHENSIVE roadmap inspired by roadmap.sh quality**
   - Study how roadmap.sh structures their roadmaps (e.g., Machine Learning, Full Stack, DevOps)
   - From absolute beginner to a competent professional/practitioner in that role or domain.
   - Include ALL essential topics, not just high-level stages
   - Break down complex topics into digestible subtopics
   
   Examples of GOOD structure:
   - **ML Engineer**: 
     * Prerequisites (Python, Math basics)
     * Mathematical Foundations (Linear Algebra, Calculus, Probability & Statistics)
     * Programming Fundamentals (Python, NumPy, Pandas)
     * Data Collection & Cleaning
     * Machine Learning Basics (Supervised, Unsupervised, Reinforcement)
     * Deep Learning (Neural Networks, CNNs, RNNs, Transformers)
     * MLOps & Deployment
     * Advanced Topics & Specializations
   
   - **Full Stack Developer**:
     * Internet & Web Basics
     * Frontend (HTML/CSS, JavaScript, React/Vue)
     * Backend (Node.js/Python, APIs, Databases)
     * DevOps (Git, Docker, CI/CD)
     * Advanced Topics (System Design, Security)

2. **Then, personalise that roadmap**
   - Use the profile summary:
     - If the end user already has some skills, mark those as "have" or "partial".
     - Shorten or skip stages that are clearly redundant.
     - Emphasise gaps and new areas they need to learn.
   - The output should feel like a **full path**, not just one exam syllabus.

### Output Format (JSON)

You must output only a single JSON object with this shape:

{
  "title": "string",
  "subtitle": "string",
  "persona_summary": "string",
  "estimated_duration_months": 0,
  "pre_required_skills": [
    {
      "name": "string",
      "status": "have" | "partial" | "need",
      "note": "string"
    }
  ],
  "stages": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "level": "beginner" | "intermediate" | "advanced",
      "recommended_duration_months": 0,
      "sections": [
        {
          "title": "string",
          "items": ["string", "string"]
        }
      ]
    }
  ]
}

### Rules for HIGH-QUALITY Roadmaps:

- **title** should clearly restate the roadmap goal (e.g. "Machine Learning Engineer Roadmap").
- **subtitle** should be a brief tagline (e.g. "From Beginner to Job-Ready ML Engineer").
- **persona_summary** should briefly describe the end user profile in 1–2 lines.
- **estimated_duration_months** should be a realistic total estimate for the whole journey.

- **pre_required_skills**:
  - Include only the most important prerequisites for this path (2-5 skills max).
  - For basic topics like "Learn Python" or "Web Development Basics", you can skip prerequisites or include very basic ones like "Basic Computer Skills".
  - For advanced topics like ML/AI/Engineering, include essential prerequisites like Math, Programming, etc.
  - **status**:
    - "have" if the profile indicates the user already has it,
    - "partial" if the user has some exposure,
    - "need" if the user is missing it.
  - **note** explains why this skill matters or how to approach it.

- **stages**:
  - Must cover the FULL journey with DETAILED breakdown, from the user's current level to a job-ready or practice-ready level.
  - Each stage should correspond to a logical milestone (e.g. "Introduction", "Fundamentals", "Core Concepts", "Advanced Topics", "Specialization").
  - **CRITICAL**: Each stage must have 3-6 sections minimum. Don't create stages with only 1-2 sections.
  - **sections** inside each stage group related topics or subskills.
  - Each section should have 3-8 specific items/topics to learn.
  - The roadmap must be COMPREHENSIVE and DETAILED, similar to roadmap.sh quality.
  
  **Example of GOOD stage structure:**
  Stage: "Mathematical Foundations"
    Section 1: "Linear Algebra" → Items: ["Vectors and Matrices", "Eigenvalues and Eigenvectors", "Matrix Operations in ML"]
    Section 2: "Calculus" → Items: ["Derivatives and Gradients", "Gradient Descent", "Cost Functions"]
    Section 3: "Probability & Statistics" → Items: ["Probability Distributions", "Bayes Theorem", "Statistical Inference"]
    Section 4: "Optimization" → Items: ["Convex Optimization", "Gradient-Based Methods", "Regularization"]
  
  **Example of BAD stage structure (too vague):**
  Stage: "Learn Math"
    Section 1: "Mathematics" → Items: ["Study math"]

### Personalisation Logic

If the profile says the end user is:
- **beginner** → include all foundational stages in detail with 6-8 stages total.
- **intermediate** → compress or mark basics as "refresh", and focus more on intermediate/advanced stages (5-7 stages).
- **advanced** → keep early stages very short and focus on specialisation, projects, and career positioning (4-6 stages).

If the profile indicates some prior knowledge (e.g. "self-taught Python" or "has accounting basics"):
- Set relevant pre_required_skills status to "have" or "partial".
- In early stages, explicitly mention that the user can skim/refresh instead of starting from zero.
- The roadmap must still show the full picture, even if some parts are marked as already covered.

### Quality Standards (inspired by roadmap.sh):

1. **Comprehensive Coverage**: Include ALL essential topics, not just high-level categories
2. **Proper Granularity**: Break down topics into specific, actionable items
3. **Logical Flow**: Topics should build on each other naturally
4. **Practical Focus**: Include tools, libraries, frameworks, and real-world applications
5. **Depth**: Each stage should have 3-6 sections, each section should have 3-8 items

**Good Example Items:**
- "Supervised Learning" → ["Linear Regression", "Logistic Regression", "Decision Trees", "Random Forests", "SVM", "K-Nearest Neighbors"]
- "Neural Networks" → ["Perceptrons", "Activation Functions", "Backpropagation", "Loss Functions", "Optimizers (SGD, Adam)"]

**Bad Example Items (too vague):**
- "Learn ML" → ["Machine Learning"]
- "Study Programming" → ["Code"]

### Style & Constraints

- All content must be original; do not copy roadmap.sh or any other site, but match their quality and detail level.
- The JSON must be valid and parseable; no comments or trailing commas.
- Descriptions must be concise but clear, suitable for being rendered in a roadmap UI (like labeled boxes).
- You must never include explanatory text outside the JSON.
- Aim for 5-8 stages total, each with 3-6 sections, each section with 3-8 specific items.`
        },
        {
          role: 'user',
          content: `Original request: ${originalQuestion}

Student Background:
${finalProfileSummary}

IMPORTANT INSTRUCTIONS:
1. **First, search for existing roadmaps**: Check if roadmap.sh has a roadmap for this topic (e.g., "roadmap.sh machine learning", "roadmap.sh full stack developer").
2. **If found on roadmap.sh**: Use their structure and topic breakdown as inspiration, but create an ORIGINAL roadmap with your own descriptions and personalization.
3. **If NOT found on roadmap.sh**: Create a comprehensive roadmap from scratch following the quality standards above.
4. **Personalize**: Adapt the roadmap based on the student's background, marking skills they already have.
5. **Be Comprehensive**: Include 5-8 stages, each with 3-6 sections, each section with 3-8 specific items.

Generate a PERSONALIZED, COMPREHENSIVE roadmap based on this specific student's profile.`
        }
      ],
    });

    const content = completion.choices[0].message.content;
    let roadmap;
    
    try {
      // Try to extract JSON from markdown code blocks first
      const jsonMatch = content?.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
      if (jsonMatch) {
        roadmap = JSON.parse(jsonMatch[1]);
      } else {
        roadmap = JSON.parse(content || '{}');
      }
      
      // Validate required fields
      if (!roadmap.stages || !Array.isArray(roadmap.stages)) {
        console.error('Invalid roadmap structure - missing stages array');
        throw new Error('Invalid roadmap structure');
      }
      
    } catch (parseError) {
      console.error('Failed to parse roadmap JSON:', parseError);
      console.error('Raw content:', content?.substring(0, 500));
      
      // Return a minimal valid roadmap structure
      return NextResponse.json({
        title: "Roadmap Generation Error",
        subtitle: "Please try again",
        persona_summary: "Error generating roadmap",
        estimated_duration_months: 0,
        pre_required_skills: [],
        stages: []
      });
    }

    return NextResponse.json(roadmap);
  } catch (error) {
    console.error('Error generating full roadmap:', error);
    return NextResponse.json(
      { error: 'Failed to generate roadmap' },
      { status: 500 }
    );
  }
}