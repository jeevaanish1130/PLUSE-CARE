/**
 * AI Health Assistant Service
 * Abstracted service layer designed for clean plug-and-play with real LLM APIs (Gemini/OpenAI).
 * Follows strict medical safety boundaries:
 * - Does NOT diagnose
 * - Does NOT prescribe medications
 * - Always reminds that guidance is educational and does not replace medical advice
 */

const KNOWLEDGE_BASE = [
  {
    keywords: ['symptom', 'feel', 'hurt', 'pain', 'fever', 'cough'],
    response: "I can help you explore what might typically cause these symptoms and how to communicate them clearly to your doctor. For example, noting when the symptom started, its intensity (1-10), and what makes it better or worse will help your physician accurately evaluate your health. If you are experiencing sudden severe pain or difficulty breathing, please consult a healthcare professional immediately."
  },
  {
    keywords: ['prepare', 'appointment', 'visit', 'doctor'],
    response: "Preparing for a doctor's visit helps you get the most out of your appointment! Here is a recommended checklist:\n1. Write down your main symptoms and when they began.\n2. Bring an up-to-date list of all current medications, vitamins, and supplements.\n3. Note any recent health measurements (blood pressure, glucose, temperature).\n4. Write down your top 3 questions so you don't forget them during your consultation."
  },
  {
    keywords: ['ask', 'question', 'physician', 'what to ask'],
    response: "Here are high-impact questions to ask your physician:\n• What do you think is the most likely cause of my symptoms?\n• Are there any diagnostic tests or labs we should consider?\n• What are the benefits and potential side effects of the recommended approach?\n• What signs should prompt me to contact you sooner or seek urgent care?\n• When should I schedule a follow-up appointment?"
  },
  {
    keywords: ['blood pressure', 'hypertension', 'bp', 'systolic', 'diastolic'],
    response: "Blood pressure is recorded as two numbers: Systolic (the top number, measuring pressure when the heart beats) and Diastolic (the bottom number, measuring pressure when the heart rests between beats).\n• Normal: Less than 120/80 mmHg\n• Elevated: 120-129 systolic and less than 80 diastolic\n• Stage 1: 130-139 systolic or 80-89 diastolic\nLifestyle habits like regular walking, reducing sodium, and stress management support cardiovascular health. Always discuss personal targets with your physician."
  },
  {
    keywords: ['organize', 'record', 'information', 'history'],
    response: "You can use PulseCare's 'Medical Records' and 'Health Tracking' sections to keep all your consultations, lab panels, and vital readings organized in one encrypted place. You can even filter reports by category (Prescriptions, Lab Reports, Scans) to easily show them to your doctor during a visit."
  },
  {
    keywords: ['medical term', 'explain', 'meaning', 'definition'],
    response: "Medical terms can often sound intimidating! Feel free to share the exact term or phrase from your lab report or doctor's notes, and I will break it down into clear, plain language so you feel informed and confident."
  }
];

export const aiAssistantService = {
  async sendMessage(userMessage) {
    // Simulated realistic response delay (500-800ms)
    await new Promise((resolve) => setTimeout(resolve, 600));

    const query = userMessage.toLowerCase();
    
    // Check safety triggers
    if (query.includes('emergency') || query.includes('heart attack') || query.includes('stroke') || query.includes('suicide') || query.includes('severe bleeding')) {
      return {
        text: "⚠️ **IMPORTANT SAFETY ALERT:** The symptoms or situation you mentioned may indicate an emergency. Please immediately call your local emergency service (e.g., 911 or 112) or proceed to the nearest hospital emergency room. This AI assistant cannot handle urgent medical crises.",
        suggestedNext: ["How do I contact emergency services?", "What are heart attack warning signs?"]
      };
    }

    // Match keywords
    const match = KNOWLEDGE_BASE.find(k => k.keywords.some(kw => query.includes(kw)));

    if (match) {
      return {
        text: match.response,
        suggestedNext: [
          "What should I ask my doctor?",
          "How can I prepare for my appointment?",
          "Help me understand blood pressure readings"
        ]
      };
    }

    // Default supportive educational response
    return {
      text: `Thank you for sharing. Regarding "${userMessage}": In healthcare, understanding how changes in your body connect with your daily lifestyle and medical history is essential. \n\nWhile I cannot provide an individual medical diagnosis or prescribe treatments, I can help you formulate specific questions for your doctor, explain lab results, or guide you on tracking your vitals. Would you like suggestions on how to discuss this with your physician?`,
      suggestedNext: [
        "What questions should I ask my doctor?",
        "Help me understand my symptoms",
        "How do I track my vitals?"
      ]
    };
  }
};
