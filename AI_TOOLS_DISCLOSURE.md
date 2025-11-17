# AI Tools Disclosure — PathGuide AI Platform

## Purpose of This Document

This document provides complete transparency about all AI models, tools, and services used in the PathGuide AI platform. We believe in full disclosure so users understand exactly how their data is processed, what technologies power their experience, and how AI enhances their educational journey.

## Overview

PathGuide AI uses OpenAI's advanced language models to provide personalized educational guidance, real-time information retrieval, and intelligent content generation. No proprietary datasets are used, no student data is stored permanently, and all responses are generated dynamically based on user input.

## AI Models Used

### 1. GPT-4o (GPT-4 Optimized)

**Model Name**: `gpt-4o`

**Provider**: OpenAI

**Where It Is Used**:
- Roadmap generation (conversational intake and roadmap creation)
- Quiz generation (personalized assessment creation)
- Quiz evaluation (scoring and feedback analysis)
- General career counseling

**Why It Is Used**:
- Advanced natural language understanding for conversational interactions
- Structured output generation (JSON roadmaps, quiz questions)
- Context-aware personalization based on user background
- Accurate interpretation of user goals and skill levels
- Consistent, high-quality content generation

**How It Improves Experience**:
- **Personalization**: Understands your unique background and adapts recommendations accordingly
- **Conversational Flow**: Asks intelligent follow-up questions to gather necessary information
- **Structured Learning**: Creates well-organized roadmaps with logical progression
- **Accurate Assessment**: Generates questions matched to your declared skill level
- **Detailed Feedback**: Provides actionable insights on quiz performance with specific improvement areas

**Temperature Settings**:
- Roadmap intake: 0.8 (creative, conversational)
- Quiz generation: 0.4 (structured, consistent)
- Quiz evaluation: 0.3 (precise, analytical)

### 2. GPT-4o-search-preview (GPT-4 with Web Search)

**Model Name**: `gpt-4o-search-preview`

**Provider**: OpenAI

**Where It Is Used**:
- Industry insights (real-time news, trends, startup activity)
- College search (university discovery and program information)
- Admission guidance (detailed university profiles and requirements)
- Topic resource discovery (finding learning materials)
- Roadmap generation (finding current industry requirements)

**Why It Is Used**:
- Real-time web search capabilities for current information
- Access to latest news, research, and developments
- Verification of university information from official sources
- Discovery of learning resources (YouTube videos, articles, courses)
- Market intelligence and trend analysis

**How It Improves Experience**:
- **Current Information**: Always up-to-date data, not static outdated content
- **Verified Sources**: Information from legitimate sources (official university websites, Bloomberg, TechCrunch, Reuters, Nature, ArXiv)
- **Comprehensive Coverage**: Finds resources and information across the entire web
- **Real-Time Trends**: Industry insights reflect what's happening right now
- **Accurate University Data**: Admission requirements, program details, and faculty information from official sources

**Temperature Settings**:
- Industry insights: 0.2 (factual accuracy priority)
- College search: 0.3 (accurate information with some flexibility)
- Topic resources: 0.3 (balanced accuracy and discovery)

## Detailed Usage by Feature

### Roadmap Mode

**AI Models**: GPT-4o (intake), GPT-4o-search-preview (roadmap generation)

**What AI Does**:
1. **Conversational Intake**: Asks 2-3 targeted questions to understand your background, skills, and level
2. **Context Analysis**: Interprets your responses to build a profile
3. **Roadmap Generation**: Creates personalized learning path with 5-8 stages
4. **Resource Discovery**: Finds relevant learning materials for each topic
5. **Domain Intelligence**: Adapts recommendations based on field (tech, medicine, arts, etc.)

**Data Processing**:
- Input: Your goal, background, skills, experience level
- Processing: AI analyzes context and generates structured roadmap
- Output: JSON-formatted roadmap with stages, sections, topics, timelines
- Storage: Results stored locally in your browser for 1 hour (not on servers)

**Why This Improves Experience**:
- Eliminates need to manually research and organize learning paths
- Adapts to your specific background (beginner vs. advanced)
- Provides realistic timelines based on your starting point
- Curates free, high-quality resources automatically

### Industry Insights Mode

**AI Models**: GPT-4o-search-preview

**What AI Does**:
1. **Query Understanding**: Interprets what industry/field you want to explore
2. **Web Search**: Performs real-time search across legitimate news sources
3. **Content Categorization**: Organizes findings into breaking news, startup activity, funding, research, policy, trends, achievements
4. **Source Verification**: Ensures information comes from credible sources
5. **Summary Generation**: Creates concise, actionable summaries

**Data Processing**:
- Input: Industry query, optional region/category filters
- Processing: Real-time web search and content analysis
- Output: Categorized insights with source links and dates
- Storage: Results cached locally for session duration

**Why This Improves Experience**:
- Saves hours of manual news aggregation and research
- Filters noise to show only relevant, legitimate information
- Provides context and implications of industry developments
- Helps identify emerging opportunities and trends

### College Explorer Mode

**AI Models**: GPT-4o-search-preview

**What AI Does**:
1. **Query Interpretation**: Understands your university search criteria
2. **University Discovery**: Searches for real universities matching your needs
3. **Data Aggregation**: Collects information from official university websites
4. **Profile Generation**: Creates detailed profiles with programs, faculty, research, achievements
5. **Recommendation Matching**: Explains why each university fits your goals

**Data Processing**:
- Input: Search query, academic goals, preferences
- Processing: Web search of official university sources
- Output: Structured university profiles with verified information
- Storage: Results cached locally during session

**Why This Improves Experience**:
- Discovers universities you might not have considered
- Provides comprehensive information beyond rankings
- Links directly to official program pages and applications
- Shows research strengths and faculty expertise
- Includes recent achievements and developments

### Test Me Mode

**AI Models**: GPT-4o (generation and evaluation)

**What AI Does**:

**Quiz Generation**:
1. **Profile Analysis**: Reviews your roadmap, mentioned skills, and declared level
2. **Question Creation**: Generates 15-20 questions based on your context
3. **Difficulty Adaptation**: Adjusts question difficulty to your level
4. **Topic Coverage**: Ensures questions cover relevant areas from your roadmap

**Quiz Evaluation**:
1. **Answer Analysis**: Compares your answers to correct answers
2. **Performance Calculation**: Computes overall score and category breakdowns
3. **Strength Identification**: Identifies topics you've mastered
4. **Weakness Detection**: Pinpoints areas needing improvement
5. **Resource Recommendation**: Suggests specific learning materials for weak areas

**Data Processing**:
- Input: Your roadmap, skills, level (for generation); your answers (for evaluation)
- Processing: AI generates questions or analyzes performance
- Output: Quiz questions with explanations; detailed feedback with recommendations
- Storage: Quiz results stored locally for reference

**Why This Improves Experience**:
- Questions are relevant to what you're actually learning
- Difficulty matches your skill level (not too easy, not too hard)
- Detailed feedback shows exactly where to focus effort
- Specific resource recommendations for improvement
- Objective measurement of progress

## Data Handling & Privacy

### What Data Is Sent to AI Services

**User Inputs**:
- Your stated goals and career interests
- Background information you provide (student, professional, etc.)
- Skills and experience you mention
- Quiz answers you submit
- Search queries for universities or industries

**What Is NOT Sent**:
- Personal identifying information (name, email, phone)
- Payment information (platform is free)
- Browsing history or activity outside PathGuide
- Location data beyond what you explicitly provide

### Data Storage

**Server-Side**:
- No user data is permanently stored on PathGuide servers
- API requests are processed in real-time and not logged
- No user accounts or profiles are maintained

**Client-Side (Your Browser)**:
- Roadmap results stored in localStorage for 1 hour
- Quiz results cached for session duration
- History cleared automatically after expiration
- You can clear data anytime by clearing browser storage

**OpenAI**:
- OpenAI processes requests but does not use your data for model training
- Data retention follows OpenAI's standard policies (30 days for abuse monitoring)
- No long-term storage of your conversations or queries

### Security Measures

**Encryption**:
- All communications use TLS 1.3 encryption
- API keys stored as environment variables, never in code
- No secrets exposed in client-side bundles

**Data Minimization**:
- Only necessary information sent to AI services
- No collection of unnecessary personal data
- Minimal data retention (1-hour local cache)

**Access Control**:
- API keys secured in environment variables
- No public access to backend configuration
- Secure deployment on Google Cloud Run

## No Proprietary Datasets

PathGuide does not use any proprietary or pre-trained datasets. All information is:

- **Generated Dynamically**: Responses created in real-time based on your input
- **Web-Sourced**: Current information retrieved via web search when needed
- **Publicly Available**: Resources curated from publicly accessible sources
- **Not Pre-Stored**: No database of pre-written roadmaps or answers

This ensures:
- Information is always current and relevant
- Responses are personalized to your unique situation
- No bias from outdated or limited datasets
- Transparency in information sources

## AI Limitations & Transparency

### What AI Can Do Well

- Understand natural language queries and context
- Generate structured, personalized learning paths
- Find and curate relevant resources from the web
- Assess skill levels based on quiz performance
- Provide detailed, actionable feedback

### What AI Cannot Do

- Guarantee 100% accuracy of all information (always verify critical decisions)
- Replace human judgment and decision-making
- Predict future career success with certainty
- Provide legal or official admission advice
- Access information behind paywalls or private databases

### User Responsibility

- Verify critical information (admission deadlines, requirements) with official sources
- Use AI guidance as one input in decision-making, not the only input
- Consult with human advisors for complex or high-stakes decisions
- Report inaccuracies or issues to help improve the platform

## Continuous Improvement

### Model Updates

- AI models are updated automatically through OpenAI's API
- New capabilities and improvements deployed without user action
- Backward compatibility maintained across updates
- Performance monitored continuously

### Quality Assurance

- Regular testing of AI outputs for accuracy and relevance
- User feedback incorporated into prompt engineering
- Monitoring of response quality and consistency
- Continuous refinement of AI instructions

### Feedback Loop

- User interactions help identify areas for improvement
- Common issues addressed through prompt optimization
- New features developed based on user needs
- Transparent communication about changes and updates

## Compliance & Ethics

### Regulatory Compliance

- **GDPR**: European privacy regulations respected
- **CCPA**: California privacy rights honored
- **OpenAI Terms**: Full compliance with usage policies
- **Educational Standards**: Content meets appropriateness guidelines

### Ethical AI Use

- **Transparency**: Users informed when interacting with AI
- **Fairness**: Efforts to minimize bias in recommendations
- **Privacy**: Minimal data collection and retention
- **Accountability**: Clear channels for reporting issues

### Responsible AI Principles

- AI assists learning, doesn't replace critical thinking
- Human oversight in design and monitoring
- Continuous bias detection and mitigation
- User empowerment and informed consent

## Contact & Support

### Questions About AI Usage

If you have questions about how AI is used in PathGuide:
- Review this document for detailed information
- Check our FAQ for common questions
- Contact support for specific concerns

### Reporting Issues

If you encounter AI-related problems:
- Inaccurate information or recommendations
- Inappropriate or biased content
- Technical errors or failures
- Privacy or security concerns

Please report through our feedback channels so we can investigate and improve.

## Summary

PathGuide AI uses OpenAI's GPT-4o and GPT-4o-search-preview models to provide:
- Personalized learning roadmaps
- Real-time industry insights
- Intelligent university discovery
- Adaptive skill assessments

All responses are generated dynamically, no student data is stored permanently, and information is sourced from legitimate public sources. We are committed to transparency, privacy, and responsible AI use to empower students worldwide.

---

*Last Updated: 2024*  
*AI Models: GPT-4o, GPT-4o-search-preview (OpenAI)*  
*For questions or concerns: Contact PathGuide Support*
