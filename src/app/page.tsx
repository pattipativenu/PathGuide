"use client";

import { useState, useEffect, useRef } from "react";

// Typewriter component for animated text
function TypewriterText({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setDisplayedText("");
    setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 30); // 30ms per character for smooth typing

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return <span>{displayedText}</span>;
}
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, Plus } from "lucide-react";

interface ResourceLink {
  type: "video" | "article" | "course" | "book";
  title: string;
  platform: string;
  url: string;
}

type PrerequisiteStatus = "need_to_learn" | "refresh" | "already_have";

interface PreRequiredSkill {
  name: string;
  status: "have" | "partial" | "need";
  note: string;
}

interface RoadmapSection {
  title: string;
  items: string[];
}

interface RoadmapStage {
  id: string;
  title: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  recommended_duration_months: number;
  sections: RoadmapSection[];
}

interface Roadmap {
  title: string;
  subtitle: string;
  persona_summary: string;
  estimated_duration_months: number;
  pre_required_skills: PreRequiredSkill[];
  stages: RoadmapStage[];
}

interface StudentProfile {
  goal_topic: string;
  education_level: string;
  programming_skills: string[];
  math_level: string;
  physics_level?: string;
  previous_projects: string[];
  time_per_week_hours?: number;
  time_horizon_months?: number;
  region_preference?: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  mode: "roadmap" | "insights" | "colleges" | "test";
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_option: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  explanation: string;
}

interface Quiz {
  quiz_context?: {
    based_on_skills?: string[];
    user_level?: string;
    total_questions?: number;
  };
  questions: QuizQuestion[];
}

interface QuizResult {
  score_percent: number;
  correct_count?: number;
  total_count?: number;
  strengths: string[];
  weak_topics: string[];
  category_breakdown?: {
    category: string;
    correct: number;
    total: number;
    percentage: number;
  }[];
  summary: string;
  next_steps: string[];
  recommended_resources?: {
    topic: string;
    resources: string[];
  }[];
}

interface CollegeResult {
  name: string;
  country: string;
  type: string;
  image_url?: string;
  website_url: string;
  courses: {
    name: string;
    level: "undergraduate" | "postgraduate";
    url: string;
  }[];
  reasons: string[];
  ranking?: string;
  strengths?: string[];
  recent_achievements?: {
    title: string;
    description: string;
    year?: string;
    url?: string;
  }[];
  research_highlights?: {
    title: string;
    description: string;
    url?: string;
  }[];
  notable_faculty?: {
    name: string;
    achievement: string;
    url?: string;
  }[];
}

interface RecentTopic {
  id: string;
  title: string;
  timestamp: number;
  mode: "roadmap" | "insights" | "colleges" | "test";
}

export default function PathGuide() {
  // Mode and view state
  const [currentMode, setCurrentMode] = useState<"roadmap" | "insights" | "colleges" | "test">("roadmap");
  const [workspaceView, setWorkspaceView] = useState<"welcome" | "roadmap" | "sources" | "quiz_board" | "insights">("welcome");
  const [insightsFilter, setInsightsFilter] = useState<string | null>(null);
  const [showModeMenu, setShowModeMenu] = useState(false);
  
  // Roadmap state
  const [originalQuestion, setOriginalQuestion] = useState<string | null>(null);
  const [currentRoadmap, setCurrentRoadmap] = useState<Roadmap | null>(null);

  
  // Clarifier state
  const [clarifierStep, setClarifierStep] = useState<"idle" | "waiting_for_answers" | "complete">("idle");
  const [clarifyingQuestions, setClarifyingQuestions] = useState<string[]>([]);
  const [clarifierAnswers, setClarifierAnswers] = useState<{ [question: string]: string }>({});
  
  // Chat state (only for chat box conversations)
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  
  // Result history state (only for result box displays)
  const [resultHistory, setResultHistory] = useState<Array<{
    id: string;
    title: string;
    timestamp: number;
    mode: "roadmap" | "insights" | "colleges" | "test";
    data: Roadmap | CollegeResult[] | QuizResult | null;
  }>>([]);
  const [showHistory, setShowHistory] = useState(false);
  
  // Quiz state
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<{ question_id: string; chosen: string }[]>([]);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showQuizStart, setShowQuizStart] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showAnswerFeedback, setShowAnswerFeedback] = useState(false);
  
  // Topic detail slider state
  const [selectedTopic, setSelectedTopic] = useState<{
    title: string;
    stageId: string;
    sectionIndex: number;
  } | null>(null);
  const [topicDetails, setTopicDetails] = useState<any>(null);
  const [loadingTopicDetails, setLoadingTopicDetails] = useState(false);
  const [topicStatuses, setTopicStatuses] = useState<{[key: string]: 'done' | 'in-progress' | 'skip'}>({});
  
  // Sources state
  const [collegeResults, setCollegeResults] = useState<CollegeResult[]>([]);
  const [showEducationLevelOptions, setShowEducationLevelOptions] = useState(false);
  const [pendingCollegeQuery, setPendingCollegeQuery] = useState<string>("");
  const [showFollowUpQuestions, setShowFollowUpQuestions] = useState(false);
  const [admissionGuide, setAdmissionGuide] = useState<any>(null);
  const [currentFollowUpIndex, setCurrentFollowUpIndex] = useState(0);
  const [lastCollegeSearchContext, setLastCollegeSearchContext] = useState<{
    program: string;
    level: string;
    query: string;
  } | null>(null);
  const [loadingMoreUniversities, setLoadingMoreUniversities] = useState(false);
  
  // Industry Insights state
  const [industryInsights, setIndustryInsights] = useState<any>(null);
  const [insightsQuery, setInsightsQuery] = useState<string>('');
  const [insightsRegion, setInsightsRegion] = useState<string | null>(null);
  
  // UI state
  const [loading, setLoading] = useState(false);

  // Recent topics state
  const [recentTopics, setRecentTopics] = useState<RecentTopic[]>([]);

  // Remove hover tooltip state - not needed anymore

  // Add ref for auto-scrolling
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when chat updates
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatHistory, loading]);

  // Load ONLY result history from localStorage on mount (not chat or current state)
  useEffect(() => {
    const savedHistory = localStorage.getItem('pathguide_history');
    if (savedHistory) {
      try {
        const { data, timestamp } = JSON.parse(savedHistory);
        const now = Date.now();
        const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
        
        // Check if data is less than 1 hour old
        if (now - timestamp < oneHour) {
          // Only restore result history
          if (data.resultHistory) setResultHistory(data.resultHistory);
        } else {
          // Data expired, clear it
          localStorage.removeItem('pathguide_history');
        }
      } catch (error) {
        console.error('Error loading saved history:', error);
        localStorage.removeItem('pathguide_history');
      }
    }
  }, []);

  // Save ONLY result history to localStorage (not chat or current state)
  useEffect(() => {
    const dataToStore = {
      data: {
        resultHistory
      },
      timestamp: Date.now()
    };
    
    localStorage.setItem('pathguide_history', JSON.stringify(dataToStore));
  }, [resultHistory]);

  // Add result to history (only for Result Box displays)
  const addResultToHistory = (title: string, mode: "roadmap" | "insights" | "colleges" | "test", data: any) => {
    const newResult = {
      id: Date.now().toString(),
      title: title.substring(0, 60) + (title.length > 60 ? "..." : ""),
      timestamp: Date.now(),
      mode,
      data
    };
    
    setResultHistory(prev => [newResult, ...prev].slice(0, 20)); // Keep last 20 results
  };

  // Handle history item click
  const handleHistoryClick = (historyItem: typeof resultHistory[0]) => {
    setCurrentMode(historyItem.mode);
    
    if (historyItem.mode === "roadmap" && historyItem.data) {
      setCurrentRoadmap(historyItem.data as Roadmap);
      setWorkspaceView("roadmap");
    } else if (historyItem.mode === "colleges" && historyItem.data) {
      setCollegeResults(historyItem.data as CollegeResult[]);
      setWorkspaceView("sources");
    } else if (historyItem.mode === "test" && historyItem.data) {
      setQuizResult(historyItem.data as QuizResult);
      setWorkspaceView("quiz_board");
    }
    
    setShowHistory(false);
  };

  // Handle conversational intake answers
  const handleIntakeAnswer = async () => {
    if (!chatInput.trim() || clarifierStep !== "waiting_for_answers") return;
    
    const userAnswer = chatInput;
    setChatHistory(prev => [...prev, { role: "user", content: userAnswer, mode: "roadmap" }]);
    setChatInput("");
    setLoading(true);
    
    try {
      // Build conversation history for the API
      const conversationHistory = chatHistory
        .filter(msg => msg.mode === "roadmap")
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));
      
      // Add the current user answer
      conversationHistory.push({
        role: "user",
        content: userAnswer
      });
      
      const response = await fetch("/api/generate-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalQuestion,
          conversationHistory
        }),
      });
      
      const data = await response.json();
      
      if (data.ready_to_generate) {
        // AI has enough info, generate the full roadmap
        const roadmapResponse = await fetch("/api/roadmap-full", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            originalQuestion,
            profileSummary: data.profile_summary,
            conversationHistory
          }),
        });
        
        const roadmap = await roadmapResponse.json();
        setCurrentRoadmap(roadmap);
        setClarifierStep("complete");
        setWorkspaceView("roadmap");
        addResultToHistory(originalQuestion || "Roadmap", "roadmap", roadmap);
        
        setChatHistory(prev => [
          ...prev,
          { role: "assistant", content: "Perfect! Your roadmap is ready in the Result Box. Click any topic to explore details.", mode: "roadmap" }
        ]);
      } else if (data.next_question) {
        // Continue the conversation
        setChatHistory(prev => [
          ...prev,
          { role: "assistant", content: data.next_question, mode: "roadmap" }
        ]);
      }
    } catch (error) {
      console.error("Error:", error);
      setChatHistory(prev => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error. Could you try again?", mode: "roadmap" }
      ]);
    }
    
    setLoading(false);
  };

  // Handle education level selection
  const handleEducationLevelSelect = async (level: string) => {
    setShowEducationLevelOptions(false);
    const fullQuery = `${pendingCollegeQuery} for ${level}`;
    
    setChatHistory(prev => [
      ...prev,
      { role: "user", content: level, mode: "colleges" }
    ]);
    
    setLoading(true);
    
    const response = await fetch("/api/chat-counsel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        messages: [
          ...chatHistory,
          { role: "user", content: pendingCollegeQuery },
          { role: "user", content: level }
        ],
        mode: "colleges"
      }),
    });
    
    const data = await response.json();
    
    if (data.type === 'college_results') {
      const universities = data.programs.map((prog: any) => {
        const officialWebsite = prog.sources?.find((s: any) => 
          s.label?.toLowerCase().includes('official') || 
          s.label?.toLowerCase().includes('website')
        )?.url || prog.sources?.[0]?.url;
        
        return {
          name: prog.university_name,
          country: prog.country,
          type: prog.program_level,
          image_url: prog.image_url,
          website_url: officialWebsite || prog.program_url,
          courses: [{
            name: prog.program_name,
            level: prog.program_level,
            url: prog.program_url
          }],
          reasons: [prog.why_recommended, prog.application_notes].filter(Boolean),
          ranking: prog.city,
          strengths: prog.strengths || [],
          recent_achievements: prog.recent_achievements || [],
          research_highlights: prog.research_highlights || [],
          notable_faculty: prog.notable_faculty || []
        };
      });
      
      // Extract program name from the query
      const programMatch = pendingCollegeQuery.match(/(?:for|in|study)\s+(.+?)(?:\s+in|\s+at|$)/i);
      const program = programMatch ? programMatch[1].trim() : universities[0]?.courses[0]?.name || "the program";
      
      // Save context for future questions
      setLastCollegeSearchContext({
        program: program,
        level: level,
        query: fullQuery
      });
      
      setCollegeResults(universities);
      setWorkspaceView("sources");
      addResultToHistory(fullQuery, "colleges", universities);
      setShowFollowUpQuestions(true);
      setCurrentFollowUpIndex(0); // Reset to first university
      
      const chatMessage = `${data.overall_summary}\n\n${data.high_level_recommendation}\n\nCheck the Result Box for detailed university information.`;
      
      setChatHistory(prev => [
        ...prev,
        { role: "assistant", content: chatMessage, mode: "colleges" }
      ]);
    }
    
    setLoading(false);
  };

  // Handle follow-up question click
  const handleFollowUpQuestion = async (question: string) => {
    setShowFollowUpQuestions(false);
    setChatHistory(prev => [
      ...prev,
      { role: "user", content: question, mode: "colleges" }
    ]);
    
    setLoading(true);
    
    // Determine question type
    const isAdmissionQuestion = /how to get|break into|admission|entry|barriers/i.test(question);
    const targetUniversity = collegeResults[currentFollowUpIndex];
    
    if (!targetUniversity) {
      setLoading(false);
      return;
    }
    
    // Use context from original search
    const programName = lastCollegeSearchContext?.program || targetUniversity.courses[0]?.name || "program";
    const level = lastCollegeSearchContext?.level || targetUniversity.type || "program";
    const userProfile = `international student seeking ${level} in ${programName}`;
    
    if (isAdmissionQuestion) {
      // Get admission guide with full context
      const response = await fetch("/api/admission-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          universityName: targetUniversity.name,
          programName: programName,
          level: level,
          userProfile: userProfile,
          questionType: "admission_process"
        }),
      });
      
      const guide = await response.json();
      setAdmissionGuide(guide);
      setWorkspaceView("sources");
      
      setChatHistory(prev => [
        ...prev,
        { role: "assistant", content: `I've prepared a detailed admission guide for ${targetUniversity.name}'s ${programName} (${level}) program. Check the Result Box for step-by-step instructions!`, mode: "colleges" }
      ]);
    } else {
      // Get university info
      const response = await fetch("/api/admission-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          universityName: targetUniversity.name,
          programName: programName,
          userProfile: "",
          questionType: "university_info"
        }),
      });
      
      const info = await response.json();
      setAdmissionGuide(info);
      setWorkspaceView("sources");
      
      setChatHistory(prev => [
        ...prev,
        { role: "assistant", content: `Here's detailed information about ${targetUniversity.name}. Check the Result Box!`, mode: "colleges" }
      ]);
    }
    
    setLoading(false);
  };

  // Load more universities
  const handleLoadMoreUniversities = async () => {
    if (!lastCollegeSearchContext) return;
    
    setLoadingMoreUniversities(true);
    
    try {
      const response = await fetch("/api/chat-counsel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: [
            { role: "user", content: `Show me more top universities for ${lastCollegeSearchContext.program} (${lastCollegeSearchContext.level}). I want to see additional options beyond the ones already shown.` }
          ],
          mode: "colleges"
        }),
      });
      
      const data = await response.json();
      
      if (data.type === 'college_results') {
        const newUniversities = data.programs.map((prog: any) => {
          const officialWebsite = prog.sources?.find((s: any) => 
            s.label?.toLowerCase().includes('official') || 
            s.label?.toLowerCase().includes('website')
          )?.url || prog.sources?.[0]?.url;
          
          return {
            name: prog.university_name,
            country: prog.country,
            type: prog.program_level,
            image_url: prog.image_url,
            website_url: officialWebsite || prog.program_url,
            courses: [{
              name: prog.program_name,
              level: prog.program_level,
              url: prog.program_url
            }],
            reasons: [prog.why_recommended, prog.application_notes].filter(Boolean),
            ranking: prog.city,
            strengths: prog.strengths || [],
            recent_achievements: prog.recent_achievements || [],
            research_highlights: prog.research_highlights || [],
            notable_faculty: prog.notable_faculty || []
          };
        });
        
        // Append new universities to existing list
        setCollegeResults(prev => [...prev, ...newUniversities]);
        
        setChatHistory(prev => [
          ...prev,
          { role: "assistant", content: `I've added ${newUniversities.length} more universities to the list. Check the Result Box!`, mode: "colleges" }
        ]);
      }
    } catch (error) {
      console.error("Error loading more universities:", error);
      setChatHistory(prev => [
        ...prev,
        { role: "assistant", content: "Sorry, I couldn't load more universities. Please try again.", mode: "colleges" }
      ]);
    }
    
    setLoadingMoreUniversities(false);
  };

  // Send message in different modes
  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    if (currentMode === "roadmap" && clarifierStep === "waiting_for_answers") {
      handleIntakeAnswer();
      return;
    }

    const userMessage: ChatMessage = { role: "user", content: chatInput, mode: currentMode };
    setChatHistory(prev => [...prev, userMessage]);
    const questionText = chatInput;
    setChatInput("");
    setLoading(true);

    try {
      if (currentMode === "roadmap" && !currentRoadmap && clarifierStep === "idle") {
        // First roadmap request - start conversational intake
        setOriginalQuestion(questionText);
        
        const response = await fetch("/api/generate-roadmap", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            originalQuestion: questionText,
            conversationHistory: []
          }),
        });
        
        const data = await response.json();
        
        if (data.need_more_info && data.next_question) {
          setClarifierStep("waiting_for_answers");
          
          setChatHistory(prev => [
            ...prev,
            { role: "assistant", content: data.next_question, mode: "roadmap" }
          ]);
        } else if (data.ready_to_generate) {
          // Unlikely on first message, but handle it
          const roadmapResponse = await fetch("/api/roadmap-full", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              originalQuestion: questionText,
              profileSummary: data.profile_summary,
              conversationHistory: []
            }),
          });
          
          const roadmap = await roadmapResponse.json();
          setCurrentRoadmap(roadmap);
          setClarifierStep("complete");
          setWorkspaceView("roadmap");
          addResultToHistory(questionText, "roadmap", roadmap);
          
          setChatHistory(prev => [
            ...prev,
            { role: "assistant", content: "Here's your personalized roadmap in the Result Box. Click any topic for details.", mode: "roadmap" }
          ]);
        }
      } else if (currentMode === "insights") {
        // Industry Insights mode
        // Extract region from query if mentioned
        const regionKeywords = ['in india', 'in usa', 'in europe', 'in uk', 'in china', 'in japan', 'in asia', 'in africa'];
        let detectedRegion = null;
        for (const keyword of regionKeywords) {
          if (questionText.toLowerCase().includes(keyword)) {
            detectedRegion = keyword.replace('in ', '');
            break;
          }
        }
        
        // Store query and region for filtering
        setInsightsQuery(questionText);
        setInsightsRegion(detectedRegion);
        setInsightsFilter(null); // Reset filter for new query
        
        const response = await fetch("/api/industry-insights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: questionText,
            region: detectedRegion,
            category: null // No filter for initial query
          }),
        });
        
        const data = await response.json();
        
        if (data.type === 'industry_insights') {
          setIndustryInsights(data);
          setWorkspaceView("insights");
          addResultToHistory(questionText, "insights" as any, data);
          
          const chatMessage = `${data.summary}\n\nCheck the Result Box for detailed insights across all categories.`;
          setChatHistory(prev => [
            ...prev,
            { role: "assistant", content: chatMessage, mode: currentMode }
          ]);
        } else {
          setChatHistory(prev => [
            ...prev,
            { role: "assistant", content: "I couldn't find recent insights. Could you be more specific?", mode: currentMode }
          ]);
        }
      } else if (currentMode === "colleges") {
        // Check if this is a manual admission question (e.g., "How to get into Stanford")
        const isManualAdmissionQuestion = /how to get|break into|admission|entry.*into/i.test(questionText) && 
          /university|college|stanford|mit|harvard/i.test(questionText);
        
        if (isManualAdmissionQuestion && lastCollegeSearchContext && collegeResults.length > 0) {
          // Extract university name from question
          const universityMatch = questionText.match(/(?:into|to)\s+([A-Z][a-zA-Z\s]+(?:University|College|Institute|MIT|Stanford|Harvard))/i);
          const targetUniversityName = universityMatch ? universityMatch[1].trim() : null;
          
          // Find the university in results or use first one
          const targetUniversity = targetUniversityName 
            ? collegeResults.find(u => u.name.toLowerCase().includes(targetUniversityName.toLowerCase())) || collegeResults[0]
            : collegeResults[0];
          
          // Use saved context
          const programName = lastCollegeSearchContext.program;
          const level = lastCollegeSearchContext.level;
          const userProfile = `international student seeking ${level} in ${programName}`;
          
          setLoading(true);
          
          const response = await fetch("/api/admission-guide", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              universityName: targetUniversity.name,
              programName: programName,
              level: level,
              userProfile: userProfile,
              questionType: "admission_process"
            }),
          });
          
          const guide = await response.json();
          setAdmissionGuide(guide);
          setWorkspaceView("sources");
          setShowFollowUpQuestions(false);
          
          setChatHistory(prev => [
            ...prev,
            { role: "assistant", content: `I've prepared a detailed admission guide for ${targetUniversity.name}'s ${programName} (${level}) program. Check the Result Box for step-by-step instructions!`, mode: "colleges" }
          ]);
          
          setLoading(false);
          return;
        }
        
        // Check if question needs education level clarification
        const needsEducationLevel = /universities|colleges|institutions|programs|study|best.*for/i.test(questionText) &&
          !/undergraduate|postgraduate|phd|bachelor|master|doctoral|UG|PG/i.test(questionText);
        
        if (needsEducationLevel && !showEducationLevelOptions) {
          // Ask for education level
          setPendingCollegeQuery(questionText);
          setShowEducationLevelOptions(true);
          setChatHistory(prev => [
            ...prev,
            { role: "assistant", content: "What level of education are you looking for?", mode: currentMode }
          ]);
          setLoading(false);
          return;
        }

        const response = await fetch("/api/chat-counsel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            messages: [...chatHistory, userMessage],
            mode: currentMode
          }),
        });
        
        const data = await response.json();
        
        // Handle different response types
        if (data.type === 'switch_to_roadmap') {
          // Switch to roadmap mode
          setChatHistory(prev => [...prev, { 
            role: "assistant", 
            content: "I'll create a personalized roadmap for you based on our discussion.", 
            mode: currentMode 
          }]);
          
          setCurrentMode("roadmap");
          setOriginalQuestion(data.roadmap_goal || questionText);
          
          // Generate roadmap directly without asking questions
          const roadmapResponse = await fetch("/api/roadmap-full", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              originalQuestion: data.roadmap_goal || questionText,
              profileSummary: data.profile_hint || "Based on previous college discussion",
              conversationHistory: chatHistory
            }),
          });
          
          const roadmap = await roadmapResponse.json();
          setCurrentRoadmap(roadmap);
          setClarifierStep("complete");
          setWorkspaceView("roadmap");
          addResultToHistory(data.roadmap_goal || questionText, "roadmap", roadmap);
          
          setChatHistory(prev => [
            ...prev,
            { role: "assistant", content: "Your roadmap is ready in the Result Box!", mode: "roadmap" }
          ]);
        } else if (data.type === 'college_results') {
          // Handle college search results
          const universities = data.programs.map((prog: any) => {
            // Find the official website URL from sources (should be first)
            const officialWebsite = prog.sources?.find((s: any) => 
              s.label?.toLowerCase().includes('official') || 
              s.label?.toLowerCase().includes('website')
            )?.url || prog.sources?.[0]?.url;
            
            return {
              name: prog.university_name,
              country: prog.country,
              type: prog.program_level,
              image_url: prog.image_url,
              website_url: officialWebsite || prog.program_url,
              courses: [{
                name: prog.program_name,
                level: prog.program_level,
                url: prog.program_url
              }],
              reasons: [prog.why_recommended, prog.application_notes].filter(Boolean),
              ranking: prog.city,
              strengths: prog.strengths || [],
              recent_achievements: prog.recent_achievements || [],
              research_highlights: prog.research_highlights || [],
              notable_faculty: prog.notable_faculty || []
            };
          });
          
          // Extract program and level from query or first result
          const programMatch = questionText.match(/(?:for|in|study)\s+(.+?)(?:\s+in|\s+at|$)/i);
          const program = programMatch ? programMatch[1].trim() : universities[0]?.courses[0]?.name || "the program";
          const level = universities[0]?.type || "program";
          
          // Save context for future questions
          setLastCollegeSearchContext({
            program: program,
            level: level,
            query: questionText
          });
          
          setCollegeResults(universities);
          setWorkspaceView("sources");
          addResultToHistory(questionText, "colleges", universities);
          
          // Show follow-up questions after displaying results
          setShowFollowUpQuestions(true);
          setCurrentFollowUpIndex(0); // Reset to first university
          
          const chatMessage = `${data.overall_summary}\n\n${data.high_level_recommendation}\n\nCheck the Result Box for detailed university information with direct links to programs.`;
          
          setChatHistory(prev => [
            ...prev,
            { role: "assistant", content: chatMessage, mode: currentMode }
          ]);
        } else if (data.type === 'career_text') {
          // Handle general career advice
          setChatHistory(prev => [...prev, { 
            role: "assistant", 
            content: data.answer, 
            mode: currentMode 
          }]);
        } else if (data.response) {
          // Fallback for non-college modes
          setChatHistory(prev => [...prev, { 
            role: "assistant", 
            content: data.response, 
            mode: currentMode 
          }]);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
    
    setLoading(false);
  };

  // Generate quiz
  const generateQuiz = async () => {
    if (!currentRoadmap) return;
    
    setLoading(true);
    setQuizCompleted(false);
    setQuizResult(null);
    setShowQuizStart(false);
    
    try {
      // Extract user skills and level from conversation history
      const userMessages = chatHistory.filter(msg => msg.role === "user" && msg.mode === "roadmap");
      const userSkills = userMessages.map(msg => msg.content).join(", ");
      const userLevel = currentRoadmap.persona_summary?.toLowerCase().includes("advanced") ? "advanced" :
                       currentRoadmap.persona_summary?.toLowerCase().includes("intermediate") ? "intermediate" : "beginner";
      
      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal: originalQuestion,
          roadmapStages: currentRoadmap.stages,
          userProfile: currentRoadmap.persona_summary,
          userSkills: userSkills,
          userLevel: userLevel
        }),
      });
      
      const data = await response.json();
      setCurrentQuiz(data);
      setQuizIndex(0);
      setQuizAnswers([]);
      setSelectedAnswer(null);
      setShowAnswerFeedback(false);
      setWorkspaceView("quiz_board");
      
      setChatHistory(prev => [
        ...prev,
        { role: "assistant", content: "Your personalized quiz is ready in the Result Box! Good luck! 🎯", mode: "test" }
      ]);
    } catch (error) {
      console.error("Error:", error);
      setChatHistory(prev => [
        ...prev,
        { role: "assistant", content: "Sorry, I couldn't generate the quiz. Please try again.", mode: "test" }
      ]);
    }
    
    setLoading(false);
  };

  // Answer quiz question
  const answerQuizQuestion = (questionId: string, chosen: string) => {
    setSelectedAnswer(chosen);
    setShowAnswerFeedback(true);
    
    const existingIndex = quizAnswers.findIndex(a => a.question_id === questionId);
    
    if (existingIndex >= 0) {
      const newAnswers = [...quizAnswers];
      newAnswers[existingIndex] = { question_id: questionId, chosen };
      setQuizAnswers(newAnswers);
    } else {
      setQuizAnswers([...quizAnswers, { question_id: questionId, chosen }]);
    }
  };
  
  // Move to next question
  const handleNextQuestion = () => {
    setQuizIndex(quizIndex + 1);
    setSelectedAnswer(null);
    setShowAnswerFeedback(false);
  };

  // Submit quiz
  const submitQuiz = async () => {
    if (!currentQuiz || quizAnswers.length !== currentQuiz.questions.length) return;
    
    setLoading(true);
    
    try {
      const response = await fetch("/api/evaluate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questions: currentQuiz.questions,
          userAnswers: quizAnswers
        }),
      });
      
      const result = await response.json();
      setQuizResult(result);
      setQuizCompleted(true);
      setWorkspaceView("quiz_board");
      addResultToHistory("Quiz Results", "test", result);
      
      setChatHistory(prev => [
        ...prev,
        { role: "assistant", content: `Score: ${result.score_percent}%\n\n${result.summary}\n\nCheck the Result Box for details.`, mode: "test" }
      ]);
    } catch (error) {
      console.error("Error:", error);
    }
    
    setLoading(false);
  };

  // Check if section item is weak
  const isWeakItem = (itemText: string) => {
    if (!quizResult || !quizResult.weak_topics) return false;
    return quizResult.weak_topics.some(weak => 
      itemText.toLowerCase().includes(weak.toLowerCase())
    );
  };

  // Handle mode switching with welcome screen reset
  const switchMode = (newMode: "roadmap" | "insights" | "colleges" | "test") => {
    setCurrentMode(newMode);
    
    
    // Reset to welcome if no data for that mode
    if (newMode === "roadmap" && !currentRoadmap) {
      setWorkspaceView("welcome");
    } else if (newMode === "insights" && !industryInsights) {
      setWorkspaceView("welcome");
    } else if (newMode === "colleges" && collegeResults.length === 0) {
      setWorkspaceView("welcome");
    } else if (newMode === "test" && !currentQuiz && !quizResult) {
      setWorkspaceView("welcome");
    }
  };

  // Fetch topic details
  const fetchTopicDetails = async (topicTitle: string, stageId: string, sectionIndex: number) => {
    setSelectedTopic({ title: topicTitle, stageId, sectionIndex });
    setLoadingTopicDetails(true);
    
    try {
      const response = await fetch("/api/topic-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicTitle,
          roadmapGoal: originalQuestion,
          language: originalQuestion?.toLowerCase().includes('python') ? 'Python' : 
                   originalQuestion?.toLowerCase().includes('javascript') ? 'JavaScript' : null
        }),
      });
      
      const data = await response.json();
      setTopicDetails(data);
    } catch (error) {
      console.error("Error fetching topic details:", error);
    }
    
    setLoadingTopicDetails(false);
  };

  // Update topic status
  const updateTopicStatus = (topicKey: string, status: 'done' | 'in-progress' | 'skip') => {
    setTopicStatuses(prev => ({
      ...prev,
      [topicKey]: status
    }));
  };

  // Get topic status
  const getTopicStatus = (stageId: string, sectionIndex: number) => {
    const key = `${stageId}-${sectionIndex}`;
    return topicStatuses[key];
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-300" style={{ background: 'rgb(209, 222, 38)' }}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full border-2 border-black flex items-center justify-center font-bold text-base">
              PG
            </div>
            <div>
              <h1 className="text-4xl font-bold text-black" style={{ fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif', letterSpacing: '0.02em' }}>PathGuide</h1>
              <p className="text-sm text-gray-700 mt-1">
                AI-Powered Student Guidance and Learning Roadmap Platform
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Two Columns */}
      <div className="container mx-auto px-6 py-6">
        <div className="flex gap-0 h-[calc(100vh-180px)]">
          {/* Left Panel - Result Box (70%) */}
          <div className="flex-[7] rounded-l-lg overflow-hidden flex flex-col bg-white relative">
            {/* Result Box Header with History Button */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 flex-shrink-0">
              <h2 className="text-lg font-semibold text-gray-900">Result Box</h2>
              <Button
                onClick={() => setShowHistory(!showHistory)}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                {showHistory ? "Hide History" : "Show History"}
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {/* History View */}
              {showHistory && (
                <div className="h-full">
                  <div className="max-w-2xl mx-auto">
                    <h3 className="text-lg font-semibold mb-3 text-black">Result History</h3>
                    {resultHistory.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-600">No results yet. Generate a roadmap, quiz, or college recommendations to see them here.</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {resultHistory.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleHistoryClick(item)}
                            className="w-full text-left p-3 bg-white/50 hover:bg-white/70 border border-gray-300 rounded transition-all"
                          >
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-black">{item.title}</p>
                              <span className="text-xs px-2 py-1 bg-black text-white rounded">
                                {item.mode}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">
                              {new Date(item.timestamp).toLocaleString()}
                            </p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Welcome View */}
              {workspaceView === "welcome" && !showHistory && (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center max-w-2xl mx-auto px-8">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full border-2 border-black flex items-center justify-center p-4" style={{ backgroundColor: 'rgb(247, 248, 212)' }}>
                      {currentMode === 'roadmap' && (
                        <img src="/icons/roadmap.png" alt="Roadmap" className="w-full h-full object-contain" style={{ imageRendering: 'crisp-edges' }} />
                      )}
                      {currentMode === 'insights' && (
                        <img src="/icons/insights.png" alt="Insights" className="w-full h-full object-contain" style={{ imageRendering: 'crisp-edges' }} />
                      )}
                      {currentMode === 'colleges' && (
                        <img src="/icons/university.png" alt="Universities" className="w-full h-full object-contain" style={{ imageRendering: 'crisp-edges' }} />
                      )}
                      {currentMode === 'test' && (
                        <img src="/icons/test me.png" alt="Test" className="w-full h-full object-contain" style={{ imageRendering: 'crisp-edges' }} />
                      )}
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Welcome to PathGuide</h2>
                    <div className="text-gray-700 text-lg leading-relaxed min-h-[80px]">
                      {currentMode === 'roadmap' && (
                        <TypewriterText text="Your journey starts here. Get a step-by-step roadmap tailored to your background and goals" />
                      )}
                      {currentMode === 'insights' && (
                        <TypewriterText text="Discover what's happening in your industry — from breaking news and startup launches to funding rounds, research breakthroughs, policy changes, and market trends" />
                      )}
                      {currentMode === 'colleges' && (
                        <TypewriterText text="Discover universities that match your goals — from Ivy League to specialized institutes, with detailed program information and achievements" />
                      )}
                      {currentMode === 'test' && (
                        <TypewriterText text="Ready to test your knowledge? I'll create a personalized quiz based on your learning roadmap and identify areas to improve" />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Roadmap View - PROPER FLOWCHART WITH CONNECTIONS */}
              {workspaceView === "roadmap" && currentRoadmap && !showHistory && (
                <div className="w-full min-h-full px-4">
                  {/* Roadmap Header */}
                  <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-black mb-2">{currentRoadmap.title || "Your Roadmap"}</h2>
                    {currentRoadmap.subtitle && (
                      <p className="text-sm text-gray-600">{currentRoadmap.subtitle}</p>
                    )}
                  </div>

                  {/* Pre-requisites and Duration Row */}
                  <div className="flex items-start justify-between mb-8">
                    {/* Pre-Required Skills - Compact Box */}
                    {currentRoadmap.pre_required_skills && currentRoadmap.pre_required_skills.length > 0 && (
                      <div className="bg-white border-2 border-black rounded p-3 max-w-xs">
                        <h3 className="font-bold text-xs mb-2 text-gray-900">Pre-requisites</h3>
                        <div className="space-y-1.5">
                          {currentRoadmap.pre_required_skills.map((skill, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs">
                              <span className="text-sm">
                                {skill.status === 'have' ? '✅' : skill.status === 'partial' ? '🟡' : '❌'}
                              </span>
                              <span className="text-gray-800 font-medium">{skill.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Duration Info */}
                    <div className="bg-blue-50 border-2 border-black rounded p-3">
                      <p className="text-xs text-gray-600 mb-1">Estimated Duration</p>
                      <p className="text-lg font-bold text-blue-700">{currentRoadmap.estimated_duration_months || 0} months</p>
                      {currentRoadmap.persona_summary && (
                        <p className="text-xs text-gray-600 mt-2 italic max-w-xs">
                          {currentRoadmap.persona_summary}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Main Roadmap Flowchart - Centered with proper connections */}
                  {currentRoadmap.stages && currentRoadmap.stages.length > 0 ? (
                  <div className="w-full pb-8 flex flex-col items-center">
                    {currentRoadmap.stages.map((stage, stageIdx) => (
                      <div key={stage.id} className="w-full max-w-6xl mb-0">
                        {/* Solid connector from previous stage */}
                        {stageIdx > 0 && (
                          <div className="flex justify-center">
                            <div className="w-1 h-12 bg-blue-600"></div>
                          </div>
                        )}

                        {/* Stage Title (Yellow Box) - Centered */}
                        <div className="flex justify-center mb-0">
                          <div className="bg-yellow-300 border-2 border-black rounded-lg px-8 py-4 min-w-[400px]">
                            <h3 className="font-bold text-lg text-center text-black">
                              {stage.title}
                            </h3>
                            <p className="text-xs text-center text-gray-700 mt-1">
                              {stage.level} • {stage.recommended_duration_months} months
                            </p>
                          </div>
                        </div>

                        {/* Solid connector to sections */}
                        <div className="flex justify-center">
                          <div className="w-1 h-12 bg-blue-600"></div>
                        </div>

                        {/* Sections - Horizontal layout with proper spacing */}
                        {stage.sections && stage.sections.length > 0 && (
                        <div className="flex justify-center gap-6 mb-0 flex-wrap">
                          {stage.sections.map((section, sectionIdx) => (
                            <div key={sectionIdx} className="relative">
                              {/* Dotted connector from stage to first row of sections */}
                              {sectionIdx < 3 && (
                                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                                  <div className="w-0.5 h-12 border-l-2 border-dashed border-blue-400"></div>
                                </div>
                              )}

                              {/* Section Box - Clickable with status */}
                              <button
                                onClick={() => fetchTopicDetails(section.title, stage.id, sectionIdx)}
                                className={`bg-amber-50 border-2 border-black rounded-lg p-4 w-64 text-left transition-all hover:shadow-lg hover:scale-105 cursor-pointer ${
                                  getTopicStatus(stage.id, sectionIdx) === 'done' ? 'opacity-60' :
                                  getTopicStatus(stage.id, sectionIdx) === 'in-progress' ? 'bg-yellow-100' :
                                  getTopicStatus(stage.id, sectionIdx) === 'skip' ? 'opacity-40 bg-gray-100' : ''
                                }`}
                              >
                                <h4 className={`font-bold text-sm text-black text-center mb-3 pb-2 border-b border-gray-300 ${
                                  getTopicStatus(stage.id, sectionIdx) === 'done' || getTopicStatus(stage.id, sectionIdx) === 'skip' ? 'line-through' : ''
                                }`}>
                                  {section.title}
                                </h4>
                                
                                {/* Section Items - Detailed list */}
                                {section.items && section.items.length > 0 && (
                                  <div className="space-y-2">
                                    {section.items.map((item, itemIdx) => (
                                      <div
                                        key={itemIdx}
                                        className={`text-xs bg-white border border-black rounded px-3 py-2 text-gray-800 ${
                                          isWeakItem(item) ? 'border-red-500 ring-2 ring-red-500' : ''
                                        }`}
                                      >
                                        {item}
                                        {isWeakItem(item) && (
                                          <span className="ml-1 text-red-600">⚠️</span>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </button>
                            </div>
                          ))}
                        </div>
                        )}
                      </div>
                    ))}

                    {/* Final connector and suggestions */}
                    <div className="flex justify-center mt-0">
                      <div className="w-1 h-12 bg-blue-600"></div>
                    </div>
                    <div className="text-center mb-8">
                      <div className="inline-block bg-blue-100 border-2 border-black rounded-lg px-8 py-4">
                        <p className="text-sm font-semibold text-blue-900">
                          🎯 Next Steps: Continue learning and building projects to master your skills!
                        </p>
                      </div>
                    </div>

                    {/* Practice and Coaching Links - Only for IT/Programming domains */}
                    {originalQuestion && (
                      originalQuestion.toLowerCase().includes('programming') ||
                      originalQuestion.toLowerCase().includes('software') ||
                      originalQuestion.toLowerCase().includes('developer') ||
                      originalQuestion.toLowerCase().includes('engineer') && (
                        originalQuestion.toLowerCase().includes('software') ||
                        originalQuestion.toLowerCase().includes('data') ||
                        originalQuestion.toLowerCase().includes('web') ||
                        originalQuestion.toLowerCase().includes('full stack') ||
                        originalQuestion.toLowerCase().includes('frontend') ||
                        originalQuestion.toLowerCase().includes('backend')
                      ) ||
                      originalQuestion.toLowerCase().includes('python') ||
                      originalQuestion.toLowerCase().includes('javascript') ||
                      originalQuestion.toLowerCase().includes('java') ||
                      originalQuestion.toLowerCase().includes('coding') ||
                      originalQuestion.toLowerCase().includes('computer science') ||
                      originalQuestion.toLowerCase().includes('it ')
                    ) && (
                      <div className="flex gap-4 justify-center">
                        <a
                          href="https://www.interviewcake.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                        >
                          📝 Practice Interviews
                        </a>
                        <a
                          href="https://www.tryexponent.com/?src=nav"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                        >
                          👨‍🏫 Find a Tech Coach
                        </a>
                      </div>
                    )}
                  </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-600">Loading roadmap...</p>
                    </div>
                  )}

                  {/* Topic Detail Slider */}
                  {selectedTopic && (
                    <div className="fixed inset-0 z-50 flex justify-end">
                      {/* Overlay */}
                      <div 
                        className="absolute inset-0 bg-black/30"
                        onClick={() => {
                          setSelectedTopic(null);
                          setTopicDetails(null);
                        }}
                      ></div>

                      {/* Slider Panel */}
                      <div className="relative w-full max-w-md bg-white shadow-2xl overflow-y-auto animate-slide-in-right">
                        {/* Header */}
                        <div className="sticky top-0 bg-white border-b-2 border-gray-300 p-4 flex items-center justify-between z-10">
                          <h2 className="text-xl font-bold text-black">{selectedTopic.title}</h2>
                          <button
                            onClick={() => {
                              setSelectedTopic(null);
                              setTopicDetails(null);
                            }}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <span className="text-2xl">×</span>
                          </button>
                        </div>

                        {/* Status Dropdown */}
                        <div className="p-4 bg-gray-50 border-b border-gray-200">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Status:</label>
                          <select
                            value={getTopicStatus(selectedTopic.stageId, selectedTopic.sectionIndex) || ''}
                            onChange={(e) => updateTopicStatus(
                              `${selectedTopic.stageId}-${selectedTopic.sectionIndex}`,
                              e.target.value as 'done' | 'in-progress' | 'skip'
                            )}
                            className="w-full p-2 border-2 border-black rounded"
                          >
                            <option value="">Not Started</option>
                            <option value="done">✅ Done</option>
                            <option value="in-progress">🟡 In Progress</option>
                            <option value="skip">⏭️ Skip</option>
                          </select>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          {loadingTopicDetails ? (
                            <div className="flex items-center justify-center py-12">
                              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                            </div>
                          ) : topicDetails ? (
                            <div className="space-y-6">
                              {/* Description */}
                              <div>
                                <h3 className="text-lg font-bold text-black mb-2">About</h3>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                  {topicDetails.description}
                                </p>
                              </div>

                              {/* Free Resources */}
                              <div>
                                <h3 className="text-lg font-bold text-black mb-3">💚 Free Resources</h3>

                                {/* YouTube Videos */}
                                {topicDetails.resources?.videos && topicDetails.resources.videos.length > 0 && (
                                  <div className="mb-4">
                                    <h4 className="text-sm font-semibold text-gray-800 mb-2">📹 Videos</h4>
                                    <div className="space-y-2">
                                      {topicDetails.resources.videos.map((video: any, idx: number) => (
                                        <a
                                          key={idx}
                                          href={video.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="block p-3 bg-red-50 border border-red-300 rounded hover:bg-red-100 transition-colors"
                                        >
                                          <p className="text-sm font-medium text-red-900">{video.title}</p>
                                          <p className="text-xs text-red-700 mt-1">{video.channel}</p>
                                        </a>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Articles */}
                                {topicDetails.resources?.articles && topicDetails.resources.articles.length > 0 && (
                                  <div className="mb-4">
                                    <h4 className="text-sm font-semibold text-gray-800 mb-2">📄 Articles</h4>
                                    <div className="space-y-2">
                                      {topicDetails.resources.articles.map((article: any, idx: number) => (
                                        <a
                                          key={idx}
                                          href={article.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="block p-3 bg-blue-50 border border-blue-300 rounded hover:bg-blue-100 transition-colors"
                                        >
                                          <p className="text-sm font-medium text-blue-900">{article.title}</p>
                                          <p className="text-xs text-blue-700 mt-1">{article.source}</p>
                                        </a>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Books */}
                                {topicDetails.resources?.books && topicDetails.resources.books.length > 0 && (
                                  <div className="mb-4">
                                    <h4 className="text-sm font-semibold text-gray-800 mb-2">📚 Books</h4>
                                    <div className="space-y-2">
                                      {topicDetails.resources.books.map((book: any, idx: number) => (
                                        <a
                                          key={idx}
                                          href={book.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="block p-3 bg-green-50 border border-green-300 rounded hover:bg-green-100 transition-colors"
                                        >
                                          <p className="text-sm font-medium text-green-900">{book.title}</p>
                                          <p className="text-xs text-green-700 mt-1">{book.type}</p>
                                        </a>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* GitHub Repos */}
                                {topicDetails.resources?.github && topicDetails.resources.github.length > 0 && (
                                  <div className="mb-4">
                                    <h4 className="text-sm font-semibold text-gray-800 mb-2">💻 GitHub</h4>
                                    <div className="space-y-2">
                                      {topicDetails.resources.github.map((repo: any, idx: number) => (
                                        <a
                                          key={idx}
                                          href={repo.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="block p-3 bg-gray-50 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                                        >
                                          <p className="text-sm font-medium text-gray-900">{repo.title}</p>
                                          <p className="text-xs text-gray-700 mt-1">{repo.description}</p>
                                        </a>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Practice */}
                                {topicDetails.resources?.practice && (
                                  <div className="mb-4">
                                    <h4 className="text-sm font-semibold text-gray-800 mb-2">✏️ Practice</h4>
                                    <a
                                      href={topicDetails.resources.practice.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="block p-3 bg-yellow-50 border border-yellow-300 rounded hover:bg-yellow-100 transition-colors"
                                    >
                                      <p className="text-sm font-medium text-yellow-900">{topicDetails.resources.practice.title}</p>
                                      <p className="text-xs text-yellow-700 mt-1">{topicDetails.resources.practice.description}</p>
                                    </a>
                                  </div>
                                )}
                              </div>

                              {/* Additional Links - Only for IT/Programming */}
                              {originalQuestion && (
                                originalQuestion.toLowerCase().includes('programming') ||
                                originalQuestion.toLowerCase().includes('software') ||
                                originalQuestion.toLowerCase().includes('developer') ||
                                originalQuestion.toLowerCase().includes('python') ||
                                originalQuestion.toLowerCase().includes('javascript') ||
                                originalQuestion.toLowerCase().includes('java') ||
                                originalQuestion.toLowerCase().includes('coding') ||
                                originalQuestion.toLowerCase().includes('computer science') ||
                                originalQuestion.toLowerCase().includes('web') ||
                                originalQuestion.toLowerCase().includes('data engineer') ||
                                originalQuestion.toLowerCase().includes('it ')
                              ) && (
                                <div className="pt-4 border-t border-gray-200">
                                  <h3 className="text-lg font-bold text-black mb-3">More Resources</h3>
                                  <div className="space-y-2">
                                    <a
                                      href="https://www.interviewcake.com/"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="block p-3 bg-green-50 border border-green-300 rounded hover:bg-green-100 transition-colors"
                                    >
                                      <p className="text-sm font-medium text-green-900">📝 Practice Technical Interviews</p>
                                    </a>
                                    <a
                                      href="https://www.tryexponent.com/?src=nav"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="block p-3 bg-purple-50 border border-purple-300 rounded hover:bg-purple-100 transition-colors"
                                    >
                                      <p className="text-sm font-medium text-purple-900">👨‍🏫 Find a Tech Coach</p>
                                    </a>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-center py-12">
                              <p className="text-gray-600">No details available</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Industry Insights View */}
              {workspaceView === "insights" && industryInsights && !showHistory && (
                <div className="space-y-4">
                  {/* Header with Filter */}
                  <div className="flex items-center justify-between pb-3 border-b border-gray-300">
                    <div>
                      <h3 className="text-xl font-bold text-black">Industry Insights</h3>
                      <p className="text-sm text-gray-700 mt-1">
                        {industryInsights.region || 'Global'} • Recent updates and trends
                      </p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <select
                        value={insightsFilter || 'all'}
                        onChange={(e) => setInsightsFilter(e.target.value === 'all' ? null : e.target.value)}
                        className="text-sm px-3 py-2 border border-gray-300 rounded bg-white"
                      >
                        <option value="all">All Categories</option>
                        <option value="breaking_news">🔥 Breaking News</option>
                        <option value="startup_activity">🚀 Startups</option>
                        <option value="funding_investments">💰 Funding</option>
                        <option value="research_breakthroughs">🔬 Research</option>
                        <option value="policy_regulations">🏛️ Policy</option>
                        <option value="market_trends">📊 Market Trends</option>
                        <option value="notable_achievements">🏆 Achievements</option>
                      </select>
                      <Button
                        onClick={async () => {
                          if (!insightsQuery) return;
                          
                          setLoading(true);
                          const response = await fetch("/api/industry-insights", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              query: insightsQuery,
                              region: insightsRegion,
                              category: insightsFilter
                            }),
                          });
                          
                          const data = await response.json();
                          
                          if (data.type === 'industry_insights') {
                            setIndustryInsights(data);
                            
                            const filterText = insightsFilter 
                              ? insightsFilter.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())
                              : 'All Categories';
                            
                            setChatHistory(prev => [
                              ...prev,
                              { 
                                role: "assistant", 
                                content: `Filtered to ${filterText}. Showing up to ${insightsFilter ? '10' : '2'} items per category in the Result Box.`, 
                                mode: currentMode 
                              }
                            ]);
                          }
                          
                          setLoading(false);
                        }}
                        disabled={loading}
                        size="sm"
                        className="bg-blue-600 text-white hover:bg-blue-700 px-4"
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Go'}
                      </Button>
                    </div>
                  </div>

                  {/* Breaking News */}
                  {industryInsights.insights.breaking_news && industryInsights.insights.breaking_news.length > 0 && (
                    <div>
                      <h4 className="text-lg font-bold text-black mb-3 flex items-center gap-2">
                        🔥 Breaking News
                      </h4>
                      <div className="space-y-3">
                        {industryInsights.insights.breaking_news.map((item: any, idx: number) => (
                          <div key={idx} className="relative group">
                            <Card className="p-4 bg-white border border-gray-200/50 shadow-md hover:shadow-2xl transition-all duration-300">
                              {/* Shine border effect on hover */}
                              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                style={{
                                  background: 'linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.5), transparent)',
                                  backgroundSize: '200% 100%',
                                  animation: 'shine 3s infinite',
                                  padding: '1px',
                                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                  WebkitMaskComposite: 'xor',
                                  maskComposite: 'exclude'
                                }}
                              />
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h5 className="font-bold text-base text-gray-900 mb-2">{item.title}</h5>
                                <p className="text-sm text-gray-700 mb-2">{item.summary}</p>
                                <div className="flex items-center gap-3 text-xs text-gray-600">
                                  <span>📅 {new Date(item.date).toLocaleDateString()}</span>
                                  <span>•</span>
                                  <span>📰 {item.source}</span>
                                </div>
                              </div>
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-4 px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors flex-shrink-0"
                              >
                                Read Article →
                              </a>
                            </div>
                          </Card>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Startup Activity */}
                  {industryInsights.insights.startup_activity && industryInsights.insights.startup_activity.length > 0 && (
                    <div>
                      <h4 className="text-lg font-bold text-black mb-3 flex items-center gap-2">
                        🚀 Startup Activity
                      </h4>
                      <div className="space-y-3">
                        {industryInsights.insights.startup_activity.map((item: any, idx: number) => (
                          <div key={idx} className="relative group">
                            <Card className="p-4 bg-white border border-gray-200/50 shadow-md hover:shadow-2xl transition-all duration-300">
                              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                style={{
                                  background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), transparent)',
                                  backgroundSize: '200% 100%',
                                  animation: 'shine 3s infinite',
                                  padding: '1px',
                                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                  WebkitMaskComposite: 'xor',
                                  maskComposite: 'exclude'
                                }}
                              />
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h5 className="font-bold text-base text-gray-900 mb-2">{item.title}</h5>
                                <p className="text-sm text-gray-700 mb-2">{item.summary}</p>
                                <div className="flex items-center gap-3 text-xs text-gray-600">
                                  <span>📅 {new Date(item.date).toLocaleDateString()}</span>
                                  <span>•</span>
                                  <span>📰 {item.source}</span>
                                </div>
                              </div>
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-4 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors flex-shrink-0"
                              >
                                Learn More →
                              </a>
                            </div>
                          </Card>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Funding & Investments */}
                  {industryInsights.insights.funding_investments && industryInsights.insights.funding_investments.length > 0 && (
                    <div>
                      <h4 className="text-lg font-bold text-black mb-3 flex items-center gap-2">
                        💰 Funding & Investments
                      </h4>
                      <div className="space-y-3">
                        {industryInsights.insights.funding_investments.map((item: any, idx: number) => (
                          <div key={idx} className="relative group">
                            <Card className="p-4 bg-white border border-gray-200/50 shadow-md hover:shadow-2xl transition-all duration-300">
                              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                style={{
                                  background: 'linear-gradient(90deg, transparent, rgba(34, 197, 94, 0.5), transparent)',
                                  backgroundSize: '200% 100%',
                                  animation: 'shine 3s infinite',
                                  padding: '1px',
                                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                  WebkitMaskComposite: 'xor',
                                  maskComposite: 'exclude'
                                }}
                              />
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h5 className="font-bold text-base text-gray-900 mb-2">{item.title}</h5>
                                <p className="text-sm text-gray-700 mb-2">{item.summary}</p>
                                <div className="flex items-center gap-3 text-xs text-gray-600">
                                  <span>📅 {new Date(item.date).toLocaleDateString()}</span>
                                  <span>•</span>
                                  <span>📰 {item.source}</span>
                                </div>
                              </div>
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-4 px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors flex-shrink-0"
                              >
                                View Details →
                              </a>
                            </div>
                          </Card>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Research Breakthroughs */}
                  {industryInsights.insights.research_breakthroughs && industryInsights.insights.research_breakthroughs.length > 0 && (
                    <div>
                      <h4 className="text-lg font-bold text-black mb-3 flex items-center gap-2">
                        🔬 Research Breakthroughs
                      </h4>
                      <div className="space-y-3">
                        {industryInsights.insights.research_breakthroughs.map((item: any, idx: number) => (
                          <div key={idx} className="relative group">
                            <Card className="p-4 bg-white border border-gray-200/50 shadow-md hover:shadow-2xl transition-all duration-300">
                              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                style={{
                                  background: 'linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.5), transparent)',
                                  backgroundSize: '200% 100%',
                                  animation: 'shine 3s infinite',
                                  padding: '1px',
                                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                  WebkitMaskComposite: 'xor',
                                  maskComposite: 'exclude'
                                }}
                              />
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h5 className="font-bold text-base text-gray-900 mb-2">{item.title}</h5>
                                <p className="text-sm text-gray-700 mb-2">{item.summary}</p>
                                <div className="flex items-center gap-3 text-xs text-gray-600">
                                  <span>📅 {new Date(item.date).toLocaleDateString()}</span>
                                  <span>•</span>
                                  <span>📰 {item.source}</span>
                                </div>
                              </div>
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-4 px-4 py-2 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors flex-shrink-0"
                              >
                                Read Paper →
                              </a>
                            </div>
                          </Card>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Policy & Regulations */}
                  {industryInsights.insights.policy_regulations && industryInsights.insights.policy_regulations.length > 0 && (
                    <div>
                      <h4 className="text-lg font-bold text-black mb-3 flex items-center gap-2">
                        🏛️ Policy & Regulations
                      </h4>
                      <div className="space-y-3">
                        {industryInsights.insights.policy_regulations.map((item: any, idx: number) => (
                          <div key={idx} className="relative group">
                            <Card className="p-4 bg-white border border-gray-200/50 shadow-md hover:shadow-2xl transition-all duration-300">
                              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                style={{
                                  background: 'linear-gradient(90deg, transparent, rgba(234, 179, 8, 0.5), transparent)',
                                  backgroundSize: '200% 100%',
                                  animation: 'shine 3s infinite',
                                  padding: '1px',
                                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                  WebkitMaskComposite: 'xor',
                                  maskComposite: 'exclude'
                                }}
                              />
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h5 className="font-bold text-base text-gray-900 mb-2">{item.title}</h5>
                                <p className="text-sm text-gray-700 mb-2">{item.summary}</p>
                                <div className="flex items-center gap-3 text-xs text-gray-600">
                                  <span>📅 {new Date(item.date).toLocaleDateString()}</span>
                                  <span>•</span>
                                  <span>📰 {item.source}</span>
                                </div>
                              </div>
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-4 px-4 py-2 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 transition-colors flex-shrink-0"
                              >
                                Read More →
                              </a>
                            </div>
                          </Card>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Market Trends */}
                  {industryInsights.insights.market_trends && industryInsights.insights.market_trends.length > 0 && (
                    <div>
                      <h4 className="text-lg font-bold text-black mb-3 flex items-center gap-2">
                        📊 Market Trends
                      </h4>
                      <div className="space-y-3">
                        {industryInsights.insights.market_trends.map((item: any, idx: number) => (
                          <div key={idx} className="relative group">
                            <Card className="p-4 bg-white border border-gray-200/50 shadow-md hover:shadow-2xl transition-all duration-300">
                              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                style={{
                                  background: 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.5), transparent)',
                                  backgroundSize: '200% 100%',
                                  animation: 'shine 3s infinite',
                                  padding: '1px',
                                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                  WebkitMaskComposite: 'xor',
                                  maskComposite: 'exclude'
                                }}
                              />
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h5 className="font-bold text-base text-gray-900 mb-2">{item.title}</h5>
                                <p className="text-sm text-gray-700 mb-2">{item.summary}</p>
                                <div className="flex items-center gap-3 text-xs text-gray-600">
                                  <span>📅 {new Date(item.date).toLocaleDateString()}</span>
                                  <span>•</span>
                                  <span>📰 {item.source}</span>
                                </div>
                              </div>
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-4 px-4 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition-colors flex-shrink-0"
                              >
                                View Analysis →
                              </a>
                            </div>
                          </Card>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Notable Achievements */}
                  {industryInsights.insights.notable_achievements && industryInsights.insights.notable_achievements.length > 0 && (
                    <div>
                      <h4 className="text-lg font-bold text-black mb-3 flex items-center gap-2">
                        🏆 Notable Achievements
                      </h4>
                      <div className="space-y-3">
                        {industryInsights.insights.notable_achievements.map((item: any, idx: number) => (
                          <div key={idx} className="relative group">
                            <Card className="p-4 bg-white border border-gray-200/50 shadow-md hover:shadow-2xl transition-all duration-300">
                              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                style={{
                                  background: 'linear-gradient(90deg, transparent, rgba(249, 115, 22, 0.5), transparent)',
                                  backgroundSize: '200% 100%',
                                  animation: 'shine 3s infinite',
                                  padding: '1px',
                                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                  WebkitMaskComposite: 'xor',
                                  maskComposite: 'exclude'
                                }}
                              />
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h5 className="font-bold text-base text-gray-900 mb-2">{item.title}</h5>
                                <p className="text-sm text-gray-700 mb-2">{item.summary}</p>
                                <div className="flex items-center gap-3 text-xs text-gray-600">
                                  <span>📅 {new Date(item.date).toLocaleDateString()}</span>
                                  <span>•</span>
                                  <span>📰 {item.source}</span>
                                </div>
                              </div>
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-4 px-4 py-2 bg-orange-600 text-white text-sm rounded hover:bg-orange-700 transition-colors flex-shrink-0"
                              >
                                Learn More →
                              </a>
                            </div>
                          </Card>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Universities View */}
              {workspaceView === "sources" && !showHistory && (
                <div className="space-y-4">
                  {/* Admission Guide Display */}
                  {admissionGuide && admissionGuide.type === 'admission_guide' && (
                    <div className="space-y-4 mb-6">
                      <div className="pb-3 border-b border-gray-300">
                        <h3 className="text-2xl font-bold text-black mb-2">🎯 Admission Guide: {admissionGuide.university}</h3>
                        <p className="text-base text-gray-700 font-medium">{admissionGuide.program}</p>
                        <p className="text-sm text-gray-600 mt-2">{admissionGuide.overview}</p>
                        <p className="text-sm text-blue-600 font-semibold mt-2">⏰ Timeline: {admissionGuide.timeline}</p>
                      </div>

                      {/* Step-by-Step Process */}
                      <div>
                        <h4 className="text-xl font-bold text-black mb-4">📋 Step-by-Step Admission Process</h4>
                        <div className="space-y-4">
                          {admissionGuide.steps?.map((step: any, idx: number) => (
                            <div key={idx} className="group">
                              <Card className="p-5 bg-white border border-gray-200/50 border-l-4 transition-all duration-300 hover:scale-[1.02] admission-card" 
                                style={{ 
                                  borderLeftColor: 'rgb(237, 143, 56)',
                                  boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
                                }}>
                                <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                  style={{
                                    background: 'linear-gradient(90deg, transparent, rgba(247, 248, 212, 0.8), transparent)',
                                    backgroundSize: '200% 100%',
                                    animation: 'shine 3s infinite',
                                    padding: '1px',
                                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                    WebkitMaskComposite: 'xor',
                                    maskComposite: 'exclude'
                                  }}
                                />
                              <h5 className="text-lg font-bold text-black mb-2">
                                Step {step.step_number}: {step.title}
                              </h5>
                              <p className="text-sm text-gray-700 mb-3 leading-relaxed">{step.description}</p>
                              <p className="text-xs text-black font-semibold mb-2">⏱️ {step.timeline}</p>
                              
                              {step.tips && step.tips.length > 0 && (
                                <div className="mt-3">
                                  <p className="text-sm font-bold text-gray-800 mb-2">💡 Tips:</p>
                                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                    {step.tips.map((tip: string, i: number) => (
                                      <li key={i}>{tip}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {step.resources && step.resources.length > 0 && (
                                <div className="mt-3">
                                  <p className="text-sm font-bold text-gray-800 mb-2">🔗 Resources:</p>
                                  <div className="space-y-1">
                                    {step.resources.map((resource: any, i: number) => (
                                      <a
                                        key={i}
                                        href={resource.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block text-sm text-blue-600 hover:text-blue-800 hover:underline"
                                      >
                                        → {resource.title}
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </Card>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Requirements */}
                      {admissionGuide.requirements && (
                        <div className="group">
                          <Card className="p-5 bg-white border border-gray-200/50 border-l-4 transition-all duration-300 hover:scale-[1.02] admission-card"
                            style={{ 
                              borderLeftColor: 'rgb(237, 143, 56)',
                              boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
                            }}>
                            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                              style={{
                                background: 'linear-gradient(90deg, transparent, rgba(247, 248, 212, 0.8), transparent)',
                                backgroundSize: '200% 100%',
                                animation: 'shine 3s infinite',
                                padding: '1px',
                                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                WebkitMaskComposite: 'xor',
                                maskComposite: 'exclude'
                              }}
                            />
                          <h4 className="text-xl font-bold text-black mb-4">📝 Requirements</h4>
                          
                          {admissionGuide.requirements.academic && admissionGuide.requirements.academic.length > 0 && (
                            <div className="mb-4">
                              <p className="text-sm font-bold text-gray-800 mb-2">🎓 Academic:</p>
                              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                {admissionGuide.requirements.academic.map((req: string, i: number) => (
                                  <li key={i}>{req}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {admissionGuide.requirements.tests && admissionGuide.requirements.tests.length > 0 && (
                            <div className="mb-4">
                              <p className="text-sm font-bold text-gray-800 mb-2">📊 Tests:</p>
                              <div className="space-y-2">
                                {admissionGuide.requirements.tests.map((test: any, i: number) => (
                                  <div key={i} className="text-sm text-gray-700">
                                    <span className="font-semibold">{test.name}:</span> {test.minimum_score}
                                    {test.notes && <span className="text-gray-600"> - {test.notes}</span>}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {admissionGuide.requirements.documents && admissionGuide.requirements.documents.length > 0 && (
                            <div>
                              <p className="text-sm font-bold text-gray-800 mb-2">📄 Documents:</p>
                              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                {admissionGuide.requirements.documents.map((doc: string, i: number) => (
                                  <li key={i}>{doc}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </Card>
                        </div>
                      )}

                      {/* Success Tips */}
                      {admissionGuide.success_tips && admissionGuide.success_tips.length > 0 && (
                        <div className="group">
                          <Card className="p-5 bg-white border border-gray-200/50 border-l-4 transition-all duration-300 hover:scale-[1.02] admission-card"
                            style={{ 
                              borderLeftColor: 'rgb(237, 143, 56)',
                              boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
                            }}>
                            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                              style={{
                                background: 'linear-gradient(90deg, transparent, rgba(247, 248, 212, 0.8), transparent)',
                                backgroundSize: '200% 100%',
                                animation: 'shine 3s infinite',
                                padding: '1px',
                                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                WebkitMaskComposite: 'xor',
                                maskComposite: 'exclude'
                              }}
                            />
                          <h4 className="text-xl font-bold text-black mb-3">✨ Success Tips</h4>
                          <ul className="list-disc list-inside text-sm text-gray-700 space-y-2">
                            {admissionGuide.success_tips.map((tip: string, i: number) => (
                              <li key={i} className="leading-relaxed">{tip}</li>
                            ))}
                          </ul>
                        </Card>
                        </div>
                      )}

                      {/* Common Mistakes */}
                      {admissionGuide.common_mistakes && admissionGuide.common_mistakes.length > 0 && (
                        <div className="group">
                          <Card className="p-5 bg-white border border-gray-200/50 border-l-4 transition-all duration-300 hover:scale-[1.02] admission-card"
                            style={{ 
                              borderLeftColor: 'rgb(237, 143, 56)',
                              boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
                            }}>
                            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                              style={{
                                background: 'linear-gradient(90deg, transparent, rgba(247, 248, 212, 0.8), transparent)',
                                backgroundSize: '200% 100%',
                                animation: 'shine 3s infinite',
                                padding: '1px',
                                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                WebkitMaskComposite: 'xor',
                                maskComposite: 'exclude'
                              }}
                            />
                          <h4 className="text-xl font-bold text-black mb-3">⚠️ Common Mistakes to Avoid</h4>
                          <ul className="list-disc list-inside text-sm text-gray-700 space-y-2">
                            {admissionGuide.common_mistakes.map((mistake: string, i: number) => (
                              <li key={i} className="leading-relaxed">{mistake}</li>
                            ))}
                          </ul>
                        </Card>
                        </div>
                      )}

                      {/* Helpful Links */}
                      {admissionGuide.helpful_links && admissionGuide.helpful_links.length > 0 && (
                        <div className="group">
                          <Card className="p-5 bg-white border border-gray-200/50 border-l-4 transition-all duration-300 hover:scale-[1.02] admission-card"
                            style={{ 
                              borderLeftColor: 'rgb(237, 143, 56)',
                              boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
                            }}>
                            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                              style={{
                                background: 'linear-gradient(90deg, transparent, rgba(247, 248, 212, 0.8), transparent)',
                                backgroundSize: '200% 100%',
                                animation: 'shine 3s infinite',
                                padding: '1px',
                                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                WebkitMaskComposite: 'xor',
                                maskComposite: 'exclude'
                              }}
                            />
                          <h4 className="text-xl font-bold text-black mb-3">🔗 Helpful Resources</h4>
                          <div className="space-y-2">
                            {admissionGuide.helpful_links.map((link: any, i: number) => (
                              <a
                                key={i}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`block p-3 rounded border hover:shadow-md transition-all ${
                                  link.type === 'youtube' 
                                    ? 'bg-red-50 border-red-300 hover:border-red-500' 
                                    : 'bg-white border-purple-200 hover:border-purple-400'
                                }`}
                              >
                                <span className={`text-sm font-semibold ${
                                  link.type === 'youtube' 
                                    ? 'text-red-700 hover:text-red-900' 
                                    : 'text-purple-700 hover:text-purple-900'
                                }`}>
                                  {link.type === 'youtube' && '▶️ '}
                                  {link.title} →
                                </span>
                              </a>
                            ))}
                          </div>
                        </Card>
                        </div>
                      )}

                      <Button
                        onClick={() => {
                          setAdmissionGuide(null);
                          setShowFollowUpQuestions(true);
                          // Cycle to next university
                          setCurrentFollowUpIndex((prev) => (prev + 1) % collegeResults.length);
                        }}
                        variant="outline"
                        className="w-full bg-gray-200 hover:bg-black hover:text-white transition-colors duration-300"
                      >
                        ← Back to Universities
                      </Button>
                    </div>
                  )}

                  {/* University Info Display */}
                  {admissionGuide && admissionGuide.type === 'university_info' && (
                    <div className="space-y-4 mb-6">
                      <div className="pb-3 border-b border-gray-300">
                        <h3 className="text-2xl font-bold text-black mb-2">🏛️ About {admissionGuide.university}</h3>
                        <p className="text-sm text-gray-700 leading-relaxed">{admissionGuide.overview}</p>
                      </div>

                      {/* Program Faculty */}
                      {admissionGuide.program_faculty && admissionGuide.program_faculty.length > 0 && (
                        <div className="group">
                          <Card className="p-5 bg-white border border-gray-200/50 transition-all duration-300 hover:scale-[1.02] university-info-card">
                            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                              style={{
                                background: 'linear-gradient(90deg, transparent, rgba(160, 124, 254, 0.3), rgba(254, 143, 181, 0.3), rgba(255, 190, 123, 0.3), transparent)',
                                backgroundSize: '200% 100%',
                                animation: 'shine 3s infinite',
                                padding: '1px',
                                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                WebkitMaskComposite: 'xor',
                                maskComposite: 'exclude'
                              }}
                            />
                            <h4 className="text-xl font-bold text-black mb-3">👨‍🏫 Faculty in {admissionGuide.program || 'this Program'}</h4>
                            <div className="space-y-3">
                              {admissionGuide.program_faculty.map((faculty: any, i: number) => (
                                <div key={i} className="p-3 bg-gray-50 rounded border border-gray-200">
                                  <p className="text-sm font-bold text-black">{faculty.name}</p>
                                  <p className="text-xs text-gray-700 mt-1">{faculty.expertise}</p>
                                  {faculty.recent_work && (
                                    <p className="text-xs text-gray-600 mt-1 italic">{faculty.recent_work}</p>
                                  )}
                                  {faculty.url && (
                                    <a href={faculty.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:text-blue-800 hover:underline mt-1 inline-block">
                                      View Profile →
                                    </a>
                                  )}
                                </div>
                              ))}
                            </div>
                          </Card>
                        </div>
                      )}

                      {/* Recent Student/Faculty Achievements */}
                      {admissionGuide.recent_achievements && admissionGuide.recent_achievements.length > 0 && (
                        <div className="group">
                          <Card className="p-5 bg-white border border-gray-200/50 transition-all duration-300 hover:scale-[1.02] university-info-card">
                            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                              style={{
                                background: 'linear-gradient(90deg, transparent, rgba(160, 124, 254, 0.3), rgba(254, 143, 181, 0.3), rgba(255, 190, 123, 0.3), transparent)',
                                backgroundSize: '200% 100%',
                                animation: 'shine 3s infinite',
                                padding: '1px',
                                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                WebkitMaskComposite: 'xor',
                                maskComposite: 'exclude'
                              }}
                            />
                            <h4 className="text-xl font-bold text-black mb-3">🏆 Recent Achievements</h4>
                            <div className="space-y-3">
                              {admissionGuide.recent_achievements.map((achievement: any, i: number) => (
                                <div key={i} className="p-3 bg-gray-50 rounded border border-gray-200">
                                  <p className="text-sm font-bold text-black">{achievement.title}</p>
                                  <p className="text-xs text-gray-700 mt-1">{achievement.description}</p>
                                  {achievement.url && (
                                    <a href={achievement.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:text-blue-800 hover:underline mt-1 inline-block">
                                      Read More →
                                    </a>
                                  )}
                                </div>
                              ))}
                            </div>
                          </Card>
                        </div>
                      )}

                      {/* Recent Articles/Publications */}
                      {admissionGuide.recent_articles && admissionGuide.recent_articles.length > 0 && (
                        <div className="group">
                          <Card className="p-5 bg-white border border-gray-200/50 transition-all duration-300 hover:scale-[1.02] university-info-card">
                            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                              style={{
                                background: 'linear-gradient(90deg, transparent, rgba(160, 124, 254, 0.3), rgba(254, 143, 181, 0.3), rgba(255, 190, 123, 0.3), transparent)',
                                backgroundSize: '200% 100%',
                                animation: 'shine 3s infinite',
                                padding: '1px',
                                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                WebkitMaskComposite: 'xor',
                                maskComposite: 'exclude'
                              }}
                            />
                            <h4 className="text-xl font-bold text-black mb-3">📄 Recent Publications & Articles</h4>
                            <div className="space-y-3">
                              {admissionGuide.recent_articles.map((article: any, i: number) => (
                                <div key={i} className="p-3 bg-gray-50 rounded border border-gray-200">
                                  <p className="text-sm font-bold text-black">{article.title}</p>
                                  <p className="text-xs text-gray-600 mt-1">{article.author} • {article.date}</p>
                                  {article.summary && (
                                    <p className="text-xs text-gray-700 mt-1">{article.summary}</p>
                                  )}
                                  {article.url && (
                                    <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:text-blue-800 hover:underline mt-1 inline-block">
                                      Read Article →
                                    </a>
                                  )}
                                </div>
                              ))}
                            </div>
                          </Card>
                        </div>
                      )}

                      {/* Notable Founders & Startups */}
                      {admissionGuide.notable_founders && admissionGuide.notable_founders.length > 0 && (
                        <div className="group">
                          <Card className="p-5 bg-white border border-gray-200/50 transition-all duration-300 hover:scale-[1.02] university-info-card">
                            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                              style={{
                                background: 'linear-gradient(90deg, transparent, rgba(160, 124, 254, 0.3), rgba(254, 143, 181, 0.3), rgba(255, 190, 123, 0.3), transparent)',
                                backgroundSize: '200% 100%',
                                animation: 'shine 3s infinite',
                                padding: '1px',
                                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                WebkitMaskComposite: 'xor',
                                maskComposite: 'exclude'
                              }}
                            />
                            <h4 className="text-xl font-bold text-black mb-3">🚀 Notable Founders & Startups (Last 5 Years)</h4>
                            <div className="space-y-4">
                              {admissionGuide.notable_founders.map((founder: any, i: number) => (
                                <div key={i} className="p-4 bg-gradient-to-r from-orange-50/30 to-white rounded-lg border border-orange-200/50">
                                  <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                      <p className="text-base font-bold text-black">{founder.name}</p>
                                      <p className="text-xs text-gray-600 mt-1">
                                        {founder.degree} • {founder.graduation_year}
                                      </p>
                                    </div>
                                    {founder.founder_url && (
                                      <a
                                        href={founder.founder_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                                      >
                                        View Profile →
                                      </a>
                                    )}
                                  </div>
                                  
                                  <div className="mt-2 p-3 bg-white rounded border border-gray-200">
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <p className="text-sm font-semibold text-gray-900">
                                          🏢 {founder.company} ({founder.founded_year})
                                        </p>
                                        <p className="text-xs text-gray-700 mt-1">{founder.description}</p>
                                        {founder.achievement && (
                                          <p className="text-xs font-semibold mt-2" style={{ color: 'rgb(237, 143, 56)' }}>
                                            ✨ {founder.achievement}
                                          </p>
                                        )}
                                      </div>
                                      {founder.company_url && (
                                        <a
                                          href={founder.company_url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="ml-3 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors flex-shrink-0"
                                        >
                                          Visit Company →
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </Card>
                        </div>
                      )}

                      {/* Campus Environment & Culture */}
                      {admissionGuide.highlights && admissionGuide.highlights.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {admissionGuide.highlights.map((highlight: any, i: number) => (
                            <div key={i} className="group">
                              <Card className="p-4 bg-white border border-gray-200/50 transition-all duration-300 hover:scale-[1.02] university-info-card h-full">
                                <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                  style={{
                                    background: 'linear-gradient(90deg, transparent, rgba(160, 124, 254, 0.3), rgba(254, 143, 181, 0.3), rgba(255, 190, 123, 0.3), transparent)',
                                    backgroundSize: '200% 100%',
                                    animation: 'shine 3s infinite',
                                    padding: '1px',
                                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                    WebkitMaskComposite: 'xor',
                                    maskComposite: 'exclude'
                                  }}
                                />
                                <h5 className="text-base font-bold text-black mb-2">{highlight.title}</h5>
                                <p className="text-sm text-gray-700">{highlight.description}</p>
                              </Card>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Learn More Links */}
                      {admissionGuide.helpful_links && admissionGuide.helpful_links.length > 0 && (
                        <div className="group">
                          <Card className="p-5 bg-white border border-gray-200/50 transition-all duration-300 hover:scale-[1.02] university-info-card">
                            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                              style={{
                                background: 'linear-gradient(90deg, transparent, rgba(160, 124, 254, 0.3), rgba(254, 143, 181, 0.3), rgba(255, 190, 123, 0.3), transparent)',
                                backgroundSize: '200% 100%',
                                animation: 'shine 3s infinite',
                                padding: '1px',
                                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                WebkitMaskComposite: 'xor',
                                maskComposite: 'exclude'
                              }}
                            />
                            <h4 className="text-xl font-bold text-black mb-3">🔗 Learn More</h4>
                            <div className="space-y-2">
                              {admissionGuide.helpful_links.map((link: any, i: number) => (
                                <a
                                  key={i}
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block p-3 bg-gray-50 rounded border border-gray-200 hover:border-gray-400 transition-all"
                                >
                                  <span className="text-sm font-semibold text-blue-600 hover:text-blue-800">
                                    {link.title} →
                                  </span>
                                </a>
                              ))}
                            </div>
                          </Card>
                        </div>
                      )}

                      <Button
                        onClick={() => {
                          setAdmissionGuide(null);
                          setShowFollowUpQuestions(true);
                          // Cycle to next university
                          setCurrentFollowUpIndex((prev) => (prev + 1) % collegeResults.length);
                        }}
                        variant="outline"
                        className="w-full bg-gray-200 hover:bg-black hover:text-white transition-colors duration-300"
                      >
                        ← Back to Universities
                      </Button>
                    </div>
                  )}

                  {/* University Cards - Only show if no admission guide */}
                  {!admissionGuide && (
                    <>
                      <div className="pb-3">
                        <h3 className="text-xl font-bold text-black mb-2">Recommended Universities</h3>
                        <p className="text-sm text-gray-700">
                          Based on your profile and goals, here are the top universities for your field.
                        </p>
                      </div>
                      
                      {collegeResults.map((college, idx) => (
                    <div key={idx} className="relative group">
                      <Card className="p-0 bg-white border border-gray-200/50 overflow-hidden transition-all duration-300 hover:scale-[1.02] relative">
                        {/* Shine border effect on hover */}
                        <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                          style={{
                            background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), transparent)',
                            backgroundSize: '200% 100%',
                            animation: 'shine 3s infinite',
                            padding: '1px',
                            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                            WebkitMaskComposite: 'xor',
                            maskComposite: 'exclude'
                          }}
                        />
                      <div className="flex gap-4 relative z-10">
                        {/* University Image */}
                        {college.image_url && (
                          <div className="w-48 h-48 flex-shrink-0 bg-gray-200">
                            <img 
                              src={college.image_url} 
                              alt={college.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EUniversity%3C/text%3E%3C/svg%3E';
                              }}
                            />
                          </div>
                        )}
                        
                        {/* University Details */}
                        <div className="flex-1 p-5">
                          <div className="mb-3">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-bold text-xl text-black">{college.name}</h3>
                                <p className="text-sm text-gray-600 mt-1">
                                  {college.country} · {college.type}
                                  {college.ranking && <span className="ml-2 text-blue-600">• {college.ranking}</span>}
                                </p>
                              </div>
                              <a
                                href={college.website_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                              >
                                Visit Website →
                              </a>
                            </div>
                          </div>

                          {/* Why Selected */}
                          <div className="mb-4">
                            <p className="font-semibold text-sm mb-2">Why this university:</p>
                            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                              {college.reasons.map((reason, i) => (
                                <li key={i}>{reason}</li>
                              ))}
                            </ul>
                          </div>

                          {/* Key Strengths */}
                          {college.strengths && college.strengths.length > 0 && (
                            <div className="mb-4">
                              <p className="font-semibold text-sm mb-2">🎯 Key Strengths:</p>
                              <div className="flex flex-wrap gap-2">
                                {college.strengths.map((strength, i) => (
                                  <span key={i} className="text-xs px-3 py-1 bg-white rounded-full border border-gray-200" style={{ color: 'rgb(237, 143, 56)' }}>
                                    {strength}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Recent Achievements */}
                          {college.recent_achievements && college.recent_achievements.length > 0 && (
                            <div className="mb-4">
                              <p className="font-semibold text-sm mb-2">🏆 Recent Achievements & Awards:</p>
                              <div className="space-y-2">
                                {college.recent_achievements.map((achievement, i) => (
                                  <div key={i} className="group/item relative">
                                    <div className="p-2 bg-white hover:bg-[rgb(247,248,212)] rounded border border-gray-200/50 transition-all duration-300 university-section-card">
                                      <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                          <p className="text-sm font-medium text-gray-900">{achievement.title}</p>
                                          {achievement.description && (
                                            <p className="text-xs text-gray-600 mt-1">{achievement.description}</p>
                                          )}
                                          {achievement.year && (
                                            <span className="text-xs text-gray-500 mt-1 inline-block">{achievement.year}</span>
                                          )}
                                        </div>
                                        {achievement.url && (
                                          <a
                                            href={achievement.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-blue-600 hover:text-blue-800 ml-2 flex-shrink-0"
                                          >
                                            Read more →
                                          </a>
                                        )}
                                      </div>
                                    </div>
                                    <div className="absolute inset-0 rounded opacity-0 group-hover/item:opacity-100 transition-opacity duration-500 pointer-events-none"
                                      style={{
                                        background: 'linear-gradient(90deg, transparent, rgba(160, 124, 254, 0.3), rgba(254, 143, 181, 0.3), rgba(255, 190, 123, 0.3), transparent)',
                                        backgroundSize: '200% 100%',
                                        animation: 'shine 3s infinite',
                                        padding: '1px',
                                        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                        WebkitMaskComposite: 'xor',
                                        maskComposite: 'exclude'
                                      }}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Research Highlights */}
                          {college.research_highlights && college.research_highlights.length > 0 && (
                            <div className="mb-4">
                              <p className="font-semibold text-sm mb-2">🔬 Research & Innovation:</p>
                              <div className="space-y-2">
                                {college.research_highlights.map((research, i) => (
                                  <div key={i} className="group/item relative">
                                    <div className="p-2 bg-white hover:bg-[rgb(247,248,212)] rounded border border-gray-200/50 transition-all duration-300 university-section-card">
                                      <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">{research.title}</p>
                                        {research.description && (
                                          <p className="text-xs text-gray-600 mt-1">{research.description}</p>
                                        )}
                                      </div>
                                      {research.url && (
                                        <a
                                          href={research.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-xs text-blue-600 hover:text-blue-800 ml-2 flex-shrink-0"
                                        >
                                          Learn more →
                                        </a>
                                      )}
                                      </div>
                                    </div>
                                    <div className="absolute inset-0 rounded opacity-0 group-hover/item:opacity-100 transition-opacity duration-500 pointer-events-none"
                                      style={{
                                        background: 'linear-gradient(90deg, transparent, rgba(160, 124, 254, 0.3), rgba(254, 143, 181, 0.3), rgba(255, 190, 123, 0.3), transparent)',
                                        backgroundSize: '200% 100%',
                                        animation: 'shine 3s infinite',
                                        padding: '1px',
                                        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                        WebkitMaskComposite: 'xor',
                                        maskComposite: 'exclude'
                                      }}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Notable Faculty */}
                          {college.notable_faculty && college.notable_faculty.length > 0 && (
                            <div className="mb-4">
                              <p className="font-semibold text-sm mb-2">👨‍🏫 Notable Faculty & Publications:</p>
                              <div className="space-y-2">
                                {college.notable_faculty.map((faculty, i) => (
                                  <div key={i} className="group/item relative">
                                    <div className="p-2 bg-white hover:bg-[rgb(247,248,212)] rounded border border-gray-200/50 transition-all duration-300 university-section-card">
                                      <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">{faculty.name}</p>
                                        <p className="text-xs text-gray-600 mt-1">{faculty.achievement}</p>
                                      </div>
                                      {faculty.url && (
                                        <a
                                          href={faculty.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-xs text-blue-600 hover:text-blue-800 ml-2 flex-shrink-0"
                                        >
                                          View profile →
                                        </a>
                                      )}
                                      </div>
                                    </div>
                                    <div className="absolute inset-0 rounded opacity-0 group-hover/item:opacity-100 transition-opacity duration-500 pointer-events-none"
                                      style={{
                                        background: 'linear-gradient(90deg, transparent, rgba(160, 124, 254, 0.3), rgba(254, 143, 181, 0.3), rgba(255, 190, 123, 0.3), transparent)',
                                        backgroundSize: '200% 100%',
                                        animation: 'shine 3s infinite',
                                        padding: '1px',
                                        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                        WebkitMaskComposite: 'xor',
                                        maskComposite: 'exclude'
                                      }}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Courses */}
                          {college.courses && college.courses.length > 0 && (
                            <div>
                              <p className="font-semibold text-sm mb-2">📚 Relevant Programs:</p>
                              <div className="space-y-2">
                                {college.courses.map((course, i) => (
                                  <div key={i} className="group/item relative">
                                    <a
                                      href={course.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center justify-between p-3 bg-white hover:bg-[rgb(247,248,212)] rounded border border-gray-200/50 transition-all duration-300 group university-section-card"
                                    >
                                      <div>
                                        <p className="text-sm font-medium text-gray-900">{course.name}</p>
                                        <p className="text-xs text-gray-600 mt-0.5 capitalize">{course.level}</p>
                                      </div>
                                      <span className="text-blue-600 text-sm group-hover:translate-x-1 transition-transform">
                                        View Program →
                                      </span>
                                    </a>
                                    <div className="absolute inset-0 rounded opacity-0 group-hover/item:opacity-100 transition-opacity duration-500 pointer-events-none"
                                      style={{
                                        background: 'linear-gradient(90deg, transparent, rgba(160, 124, 254, 0.3), rgba(254, 143, 181, 0.3), rgba(255, 190, 123, 0.3), transparent)',
                                        backgroundSize: '200% 100%',
                                        animation: 'shine 3s infinite',
                                        padding: '1px',
                                        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                        WebkitMaskComposite: 'xor',
                                        maskComposite: 'exclude'
                                      }}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                    </div>
                  ))}
                      
                      {/* Show More Universities Button */}
                      {lastCollegeSearchContext && collegeResults.length > 0 && (
                        <div className="mt-6 flex justify-center">
                          <Button
                            onClick={handleLoadMoreUniversities}
                            disabled={loadingMoreUniversities}
                            className="bg-white hover:bg-gray-100 text-black border-2 border-gray-300 px-8 py-3 text-sm font-semibold transition-all duration-300 hover:scale-105"
                          >
                            {loadingMoreUniversities ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                Loading more universities...
                              </>
                            ) : (
                              <>
                                Show More Universities →
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Quiz Taking View - Show questions */}
              {workspaceView === "quiz_board" && currentQuiz && !quizCompleted && !showHistory && (
                <div className="w-full px-6 py-4">
                  {/* Quiz Header with Context */}
                  <div className="mb-6 pb-4 border-b-2 border-gray-300">
                    <h2 className="text-2xl font-bold text-black mb-2">📝 Your Personalized Quiz</h2>
                    {currentQuiz.quiz_context && (
                      <div className="text-sm text-gray-700 space-y-1">
                        <p>
                          <span className="font-semibold">Based on skills:</span>{" "}
                          {currentQuiz.quiz_context.based_on_skills?.join(", ") || "Your background"}
                        </p>
                        <p>
                          <span className="font-semibold">Difficulty level:</span>{" "}
                          <span className="capitalize">{currentQuiz.quiz_context.user_level || "beginner"}</span>
                        </p>
                        <p>
                          <span className="font-semibold">Total questions:</span>{" "}
                          {currentQuiz.questions.length}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-700 mb-2">
                      <span>Question {quizIndex + 1} of {currentQuiz.questions.length}</span>
                      <span>{Math.round(((quizIndex + 1) / currentQuiz.questions.length) * 100)}% Complete</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((quizIndex + 1) / currentQuiz.questions.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Current Question */}
                  <div className="bg-white border-2 border-black rounded-lg p-6 mb-6">
                    <div className="flex items-start gap-3 mb-4">
                      <span className="text-xs px-2 py-1 bg-gray-200 rounded font-semibold">
                        {currentQuiz.questions[quizIndex].difficulty.toUpperCase()}
                      </span>
                      <span className="text-xs px-2 py-1 bg-blue-100 rounded font-semibold text-blue-800">
                        {currentQuiz.questions[quizIndex].topic}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-black mb-6">
                      {currentQuiz.questions[quizIndex].question}
                    </h3>

                    {/* Answer Options */}
                    <div className="space-y-3">
                      {currentQuiz.questions[quizIndex].options.map((option, optIdx) => {
                        const optionLetter = option.charAt(0);
                        const currentAnswer = quizAnswers.find(
                          a => a.question_id === currentQuiz.questions[quizIndex].id
                        );
                        const isSelected = currentAnswer?.chosen === optionLetter;
                        const correctAnswer = currentQuiz.questions[quizIndex].correct_option;
                        const isCorrect = optionLetter === correctAnswer;
                        const showFeedback = showAnswerFeedback && currentAnswer;
                        
                        let buttonClass = "w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ";
                        
                        if (showFeedback) {
                          if (isCorrect) {
                            buttonClass += "bg-green-100 border-green-500 text-green-900";
                          } else if (isSelected && !isCorrect) {
                            buttonClass += "bg-red-100 border-red-500 text-red-900 animate-shake";
                          } else {
                            buttonClass += "bg-gray-50 border-gray-300 text-gray-600";
                          }
                        } else {
                          if (isSelected) {
                            buttonClass += "bg-blue-50 border-blue-500 text-blue-900";
                          } else {
                            buttonClass += "bg-white border-gray-300 text-gray-800 hover:border-blue-400 hover:bg-blue-50";
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => !showAnswerFeedback && answerQuizQuestion(currentQuiz.questions[quizIndex].id, optionLetter)}
                            disabled={showAnswerFeedback}
                            className={buttonClass}
                          >
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-lg">{optionLetter})</span>
                              <span className="flex-1">{option.substring(3)}</span>
                              {showFeedback && isCorrect && (
                                <span className="text-green-600 text-xl">✓</span>
                              )}
                              {showFeedback && isSelected && !isCorrect && (
                                <span className="text-red-600 text-xl">✗</span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation (shown after answer) */}
                    {showAnswerFeedback && (
                      <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-300 rounded-lg">
                        <p className="text-sm font-semibold text-blue-900 mb-2">💡 Explanation:</p>
                        <p className="text-sm text-blue-800">
                          {currentQuiz.questions[quizIndex].explanation}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex gap-3">
                    {quizIndex < currentQuiz.questions.length - 1 ? (
                      <Button
                        onClick={handleNextQuestion}
                        disabled={!showAnswerFeedback}
                        className="flex-1 bg-black text-white hover:bg-gray-800 py-6 text-lg"
                      >
                        Next Question →
                      </Button>
                    ) : (
                      <Button
                        onClick={submitQuiz}
                        disabled={loading || !showAnswerFeedback}
                        className="flex-1 bg-green-600 text-white hover:bg-green-700 py-6 text-lg"
                      >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Quiz 🎯"}
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Quiz Results View - Enhanced */}
              {workspaceView === "quiz_board" && quizResult && !showHistory && (
                <div className="space-y-4 px-6 py-4">
                  {/* Score Card */}
                  <Card className="p-6 bg-gradient-to-br from-blue-50 to-white text-center border-2 border-blue-300">
                    <p className="text-6xl font-bold mb-2 text-blue-600">{quizResult.score_percent.toFixed(0)}%</p>
                    <p className="text-gray-800 font-semibold text-lg">Your Score</p>
                    {quizResult.correct_count !== undefined && quizResult.total_count !== undefined && (
                      <p className="text-sm text-gray-600 mt-2">
                        {quizResult.correct_count} correct out of {quizResult.total_count} questions
                      </p>
                    )}
                    <p className="text-sm text-gray-700 mt-3 leading-relaxed">{quizResult.summary}</p>
                  </Card>

                  {/* Category Breakdown */}
                  {quizResult.category_breakdown && quizResult.category_breakdown.length > 0 && (
                    <Card className="p-5 bg-white border-2 border-gray-300">
                      <h3 className="font-bold text-lg mb-4 text-black">📊 Performance by Category</h3>
                      <div className="space-y-3">
                        {quizResult.category_breakdown.map((cat, i) => (
                          <div key={i} className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 rounded">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-semibold text-gray-900">{cat.category}</span>
                              <span className={`font-bold ${cat.percentage >= 70 ? 'text-green-600' : cat.percentage >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                                {cat.percentage}%
                              </span>
                            </div>
                            <p className="text-xs text-gray-600">{cat.correct} / {cat.total} correct</p>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                              <div 
                                className={`h-2 rounded-full ${cat.percentage >= 70 ? 'bg-green-500' : cat.percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                style={{ width: `${cat.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}

                  {/* Strengths */}
                  {quizResult.strengths.length > 0 && (
                    <Card className="p-5 bg-green-50 border-2 border-green-300">
                      <h3 className="font-bold text-lg mb-3 text-green-900">✅ Strengths</h3>
                      <ul className="list-disc list-inside text-sm text-green-800 space-y-2">
                        {quizResult.strengths.map((s, i) => (
                          <li key={i} className="leading-relaxed">{s}</li>
                        ))}
                      </ul>
                    </Card>
                  )}

                  {/* Weak Areas */}
                  {quizResult.weak_topics.length > 0 && (
                    <Card className="p-5 bg-red-50 border-2 border-red-300">
                      <h3 className="font-bold text-lg mb-3 text-red-900">⚠️ Areas to Improve</h3>
                      <ul className="list-disc list-inside text-sm text-red-800 space-y-2">
                        {quizResult.weak_topics.map((w, i) => (
                          <li key={i} className="leading-relaxed">{w}</li>
                        ))}
                      </ul>
                      <p className="text-xs text-red-700 mt-3 italic">
                        💡 These topics are highlighted in your roadmap for focused learning
                      </p>
                    </Card>
                  )}

                  {/* Recommended Resources */}
                  {quizResult.recommended_resources && quizResult.recommended_resources.length > 0 && (
                    <Card className="p-5 bg-purple-50 border-2 border-purple-300">
                      <h3 className="font-bold text-lg mb-3 text-purple-900">📚 Recommended Learning Resources</h3>
                      <div className="space-y-4">
                        {quizResult.recommended_resources.map((resource, i) => (
                          <div key={i} className="bg-white p-3 rounded border border-purple-200">
                            <p className="font-semibold text-purple-900 mb-2">{resource.topic}</p>
                            <ul className="list-disc list-inside text-sm text-purple-800 space-y-1">
                              {resource.resources.map((r, j) => (
                                <li key={j}>{r}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}

                  {/* Next Steps */}
                  {quizResult.next_steps.length > 0 && (
                    <Card className="p-5 bg-blue-50 border-2 border-blue-300">
                      <h3 className="font-bold text-lg mb-3 text-blue-900">🎯 Next Steps</h3>
                      <ul className="space-y-2">
                        {quizResult.next_steps.map((step, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-blue-800">
                            <span className="font-bold text-blue-600">{i + 1}.</span>
                            <span className="leading-relaxed">{step}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  )}

                  {/* Retake Quiz Button */}
                  <Button
                    onClick={() => {
                      setQuizResult(null);
                      setQuizCompleted(false);
                      setCurrentQuiz(null);
                      setWorkspaceView("welcome");
                    }}
                    className="w-full bg-black text-white hover:bg-gray-800 py-4"
                  >
                    Take Another Quiz
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Divider Line */}
          <div className="w-px bg-black/20" style={{ boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}></div>

          {/* Right Panel - Chat Box (30%) */}
          <div className="flex-[3] rounded-r-lg flex flex-col bg-white/40 overflow-hidden">
            {/* Chat Box Header */}
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Chat Box</h2>
            </div>
            {/* Messages List - Scrollable area */}
            <div 
              ref={chatScrollRef}
              className="flex-1 overflow-y-auto p-4"
              style={{ scrollBehavior: 'smooth' }}
            >
              {chatHistory.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center">
                  <div className="text-gray-700 text-sm max-w-xs">
                    <p className="mb-2 font-medium">Start a conversation...</p>
                    <p className="text-xs text-gray-600">
                      Use the + button below to choose a mode
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {chatHistory.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded ${
                        msg.role === "user"
                          ? "bg-white/70 ml-8"
                          : "bg-white/50 mr-8"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold">
                          {msg.role === "user" ? "You" : "PathGuide"}
                        </span>
                        <span className="text-xs text-gray-600 bg-gray-200 px-2 py-0.5 rounded">
                          [{msg.mode}]
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  ))}
                  {loading && (
                    <div className="p-3 rounded mr-8 bg-white/50">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                  )}
                </div>
              )}
            </div>



            {/* Test Mode - Always show Plus button and mode switcher */}
            {currentMode === "test" && (
              <div className="p-4 bg-white/60 border-t border-gray-300 flex-shrink-0 relative">
                {/* Mode Selection Menu */}
                {showModeMenu && (
                  <div className="absolute bottom-full left-4 mb-2 bg-white rounded-lg shadow-lg border border-gray-300 overflow-hidden z-10">
                    <button
                      onClick={() => switchMode("roadmap")}
                      className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm hover:bg-gray-100 transition-colors"
                    >
                      <img src="/icons/roadmap.png" alt="" className="w-5 h-5 object-contain" style={{ imageRendering: 'crisp-edges' }} />
                      <span>Roadmap</span>
                    </button>
                    <button
                      onClick={() => switchMode("insights")}
                      className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm hover:bg-gray-100 transition-colors"
                    >
                      <img src="/icons/insights.png" alt="" className="w-5 h-5 object-contain" style={{ imageRendering: 'crisp-edges' }} />
                      <span>Industry Insights</span>
                    </button>
                    <button
                      onClick={() => { 
                        switchMode("colleges"); 
                        
                        if (collegeResults.length === 0) setWorkspaceView("welcome");
                      }}
                      className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm hover:bg-gray-100 transition-colors"
                    >
                      <img src="/icons/university.png" alt="" className="w-5 h-5 object-contain" style={{ imageRendering: 'crisp-edges' }} />
                      <span>Universities</span>
                    </button>
                    <button
                      onClick={() => { 
                        switchMode("test"); 
                        
                        if (!currentQuiz && !quizResult) setWorkspaceView("welcome");
                      }}
                      className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm hover:bg-gray-100 transition-colors"
                    >
                      <img src="/icons/test me.png" alt="" className="w-5 h-5 object-contain" style={{ imageRendering: 'crisp-edges' }} />
                      <span>Test Me</span>
                    </button>
                  </div>
                )}

                {!currentRoadmap ? (
                  <div>
                    <div className="flex gap-2 items-center mb-3">
                      <Button
                        onClick={() => setShowModeMenu(!showModeMenu)}
                        size="icon"
                        variant="outline"
                        className="shrink-0 bg-white hover:bg-gray-100 h-10 w-10"
                      >
                        <Plus className="w-5 h-5" />
                      </Button>
                      <p className="text-sm text-gray-700 flex-1">
                        Create a roadmap first to generate a diagnostic test
                      </p>
                    </div>
                    <div className="text-xs text-gray-600 text-center">
                      Current mode: <span className="font-semibold text-black">{currentMode}</span>
                    </div>
                  </div>
                ) : currentQuiz && !quizCompleted ? (
                  <div>
                    <div className="flex gap-2 items-center mb-3">
                      <Button
                        onClick={() => setShowModeMenu(!showModeMenu)}
                        size="icon"
                        variant="outline"
                        className="shrink-0 bg-white hover:bg-gray-100 h-10 w-10"
                      >
                        <Plus className="w-5 h-5" />
                      </Button>
                      <p className="text-sm text-gray-700 flex-1">
                        Quiz in progress - Check Result Box
                      </p>
                    </div>
                    <div className="text-xs text-gray-600 text-center">
                      Current mode: <span className="font-semibold text-black">{currentMode}</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2 items-center mb-3">
                      <Button
                        onClick={() => setShowModeMenu(!showModeMenu)}
                        size="icon"
                        variant="outline"
                        className="shrink-0 bg-white hover:bg-gray-100 h-10 w-10"
                      >
                        <Plus className="w-5 h-5" />
                      </Button>
                      <Button
                        onClick={generateQuiz}
                        disabled={loading}
                        className="flex-1 bg-black text-white hover:bg-gray-800 py-3"
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Start Diagnostic Test
                      </Button>
                    </div>
                    <div className="text-xs text-gray-600 text-center">
                      15-20 questions based on your skills and level
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Input Area - ALWAYS VISIBLE at bottom */}
            {currentMode !== "test" && (
              <div className="p-4 bg-white/60 border-t border-gray-300 flex-shrink-0 relative">
                {/* Mode Selection Menu */}
                {showModeMenu && (
                  <div className="absolute bottom-full left-4 mb-2 bg-white rounded-lg shadow-lg border border-gray-300 overflow-hidden z-10">
                    <button
                      onClick={() => switchMode("roadmap")}
                      className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm hover:bg-gray-100 transition-colors"
                    >
                      <img src="/icons/roadmap.png" alt="" className="w-5 h-5 object-contain" style={{ imageRendering: 'crisp-edges' }} />
                      <span>Roadmap</span>
                    </button>
                    <button
                      onClick={() => switchMode("insights")}
                      className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm hover:bg-gray-100 transition-colors"
                    >
                      <img src="/icons/insights.png" alt="" className="w-5 h-5 object-contain" style={{ imageRendering: 'crisp-edges' }} />
                      <span>Industry Insights</span>
                    </button>
                    <button
                      onClick={() => { 
                        switchMode("colleges"); 
                        
                        if (collegeResults.length === 0) setWorkspaceView("welcome");
                      }}
                      className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm hover:bg-gray-100 transition-colors"
                    >
                      <img src="/icons/university.png" alt="" className="w-5 h-5 object-contain" style={{ imageRendering: 'crisp-edges' }} />
                      <span>Universities</span>
                    </button>
                    <button
                      onClick={() => { 
                        switchMode("test"); 
                        
                        if (!currentQuiz && !quizResult) setWorkspaceView("welcome");
                      }}
                      className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm hover:bg-gray-100 transition-colors"
                    >
                      <img src="/icons/test me.png" alt="" className="w-5 h-5 object-contain" style={{ imageRendering: 'crisp-edges' }} />
                      <span>Test Me</span>
                    </button>
                  </div>
                )}

                {/* Education Level Options */}
                {showEducationLevelOptions && currentMode === "colleges" && (
                  <div className="mb-3 space-y-2">
                    <p className="text-sm font-medium text-gray-700">Select education level:</p>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        onClick={() => handleEducationLevelSelect("Undergraduate")}
                        variant="outline"
                        className="bg-white hover:bg-blue-50 border-2 border-blue-500 text-sm"
                      >
                        Undergraduate
                      </Button>
                      <Button
                        onClick={() => handleEducationLevelSelect("Postgraduate")}
                        variant="outline"
                        className="bg-white hover:bg-blue-50 border-2 border-blue-500 text-sm"
                      >
                        Postgraduate
                      </Button>
                      <Button
                        onClick={() => handleEducationLevelSelect("PhD")}
                        variant="outline"
                        className="bg-white hover:bg-blue-50 border-2 border-blue-500 text-sm"
                      >
                        PhD
                      </Button>
                    </div>
                  </div>
                )}

                {/* Follow-up Questions */}
                {showFollowUpQuestions && currentMode === "colleges" && collegeResults.length > 0 && (
                  <div className="mb-3 space-y-2 animate-slide-up">
                    <p className="text-sm font-medium text-gray-700">Relevant questions:</p>
                    <div className="space-y-2">
                      <button
                        onClick={() => handleFollowUpQuestion(`How to get into ${collegeResults[currentFollowUpIndex].name}?`)}
                        className="w-full text-left p-3 bg-white hover:bg-gray-100 border border-gray-200/50 rounded-lg text-sm transition-all"
                      >
                        🎯 How to get into <span className="font-semibold">{collegeResults[currentFollowUpIndex].name}</span>?
                      </button>
                      <button
                        onClick={() => handleFollowUpQuestion(`Learn more about ${collegeResults[currentFollowUpIndex].name}`)}
                        className="w-full text-left p-3 bg-white hover:bg-gray-100 border border-gray-200/50 rounded-lg text-sm transition-all"
                      >
                        📚 Learn more about <span className="font-semibold">{collegeResults[currentFollowUpIndex].name}</span>
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 items-center">
                  <Button
                    onClick={() => setShowModeMenu(!showModeMenu)}
                    size="icon"
                    variant="outline"
                    className="shrink-0 bg-white hover:bg-gray-100 h-10 w-10"
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                  <Input
                    placeholder="Ask PathGuide anything..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                    className="flex-1 bg-white h-10"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={loading || !chatInput.trim()}
                    size="icon"
                    className="bg-black text-white hover:bg-gray-800 shrink-0 h-10 w-10"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </Button>
                </div>

                <div className="mt-2 text-xs text-gray-600 text-center">
                  Current mode: <span className="font-semibold text-black">{currentMode}</span>
                </div>
              </div>
            )}


          </div>
        </div>
      </div>
    </div>
  );
}