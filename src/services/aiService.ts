import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface AssessmentData {
  skills: string[];
  interests: string[];
  personality: string;
  cgpa: number;
  targetCareer: string;
  resumeText?: string;
}

export interface CareerAnalysis {
  career: string;
  score: number;
  strengths: string[];
  gaps: { name: string; gapLevel: number }[];
  roadmap: { 
    title: string; 
    completed: boolean; 
    link?: string;
    duration: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
  }[];
}

export const analyzeCareer = async (data: AssessmentData): Promise<CareerAnalysis> => {
  const prompt = `
    Analyze this student profile for the target career: ${data.targetCareer}.
    ${data.resumeText ? `Resume Content: ${data.resumeText}` : ""}
    Skills: ${data.skills.join(", ")}
    Interests: ${data.interests.join(", ")}
    Personality: ${data.personality}
    CGPA: ${data.cgpa} (Scale: 0-10)

    Calculate a Career Compatibility Score (0-100) based on:
    (SkillMatch * 0.5) + (CGPA Weight * 0.2) + (InterestMatch * 0.2) + (PersonalityMatch * 0.1)
    
    If a resume was provided, use it to deeply analyze their experience and bridge it with their target career.

    Provide:
    1. The calculated score.
    2. A list of strengths.
    3. A list of skill gaps with a 'gapLevel' (0-100, where 100 means a huge gap).
    4. A 5-step roadmap to bridge the gaps. For each step, provide:
       - title
       - duration (e.g., "3 weeks", "1 month")
       - level (Beginner, Intermediate, or Advanced)
       - a high-quality external learning resource URL.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          career: { type: Type.STRING },
          score: { type: Type.NUMBER },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          gaps: { 
            type: Type.ARRAY, 
            items: { 
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                gapLevel: { type: Type.NUMBER }
              }
            } 
          },
          roadmap: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                completed: { type: Type.BOOLEAN },
                duration: { type: Type.STRING },
                level: { type: Type.STRING, enum: ["Beginner", "Intermediate", "Advanced"] },
                link: { type: Type.STRING, description: "URL to a learning resource" }
              }
            }
          }
        },
        required: ["career", "score", "strengths", "gaps", "roadmap"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};

export interface CourseRecommendation {
  title: string;
  provider: string;
  link: string;
  description: string;
}

export const recommendCourses = async (interests: string): Promise<CourseRecommendation[]> => {
  const prompt = `
    The user is interested in learning about: ${interests}.
    Provide a list of 3 high-quality online courses or learning resources for these interests.
    For each course, provide:
    - title
    - provider (e.g., Coursera, Udemy, YouTube, Documentation)
    - link (a real URL)
    - description (a brief summary of what they will learn)
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            provider: { type: Type.STRING },
            link: { type: Type.STRING },
            description: { type: Type.STRING }
          },
          required: ["title", "provider", "link", "description"]
        }
      }
    }
  });

  return JSON.parse(response.text || "[]");
};
