const axios = require('axios');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Enhanced Caring Responses - Empathy First!
const conversationResponses = {
  sad: {
    score: 3,
    responseList: [
      "Oh, I'm so sorry you're feeling this way. 💙 That kind of pain is real, and you deserve to have someone sit with you in it. You are not alone in this - I'm right here.",
      "My heart goes out to you right now. 💙 What you're feeling is completely valid, and it makes sense that you're hurting. You don't have to carry this by yourself.",
      "That sounds really painful, and I'm genuinely sorry you're going through this. 💙 Sadness like this deserves to be acknowledged, not rushed away. I'm here with you.",
      "I can feel how heavy things are for you right now. 💙 You reached out, and that matters so much. Whatever is weighing on you - you don't have to face it alone.",
      "I'm really glad you're here, even if things feel dark right now. 💙 Your pain is real and it's valid. You matter, and you deserve care and kindness - especially from yourself."
    ],
    suggestionList: [
      "Be gentle with yourself today. You don't have to fix everything - just rest in this moment.",
      "Sometimes a warm drink, a soft blanket, and permission to just feel - that's enough for now.",
      "Write down what's in your heart, even if it's messy. Getting it out can bring a little relief.",
      "Is there one small comfort you could give yourself right now? Even something tiny counts.",
      "You don't have to feel better immediately. Just being here, feeling what you feel - that's okay."
    ],
    needsHelp: true
  },

  happy: {
    score: 8,
    responseList: [
      "This genuinely warms my heart to hear! 😊 Happiness like this is so precious, and you deserve every bit of it. What's been bringing this beautiful energy into your life?",
      "Oh, this makes me so happy for you! 🌟 You deserve all of this joy - soak it in completely. What's been going so wonderfully?",
      "I love this! 😄 There's something so beautiful about you sharing this moment. Your happiness matters, and right now it's lighting up this whole conversation!",
      "That's absolutely wonderful! 🌟 Joy like this deserves to be celebrated fully. Tell me everything - what's been making life feel this good?",
      "You sound so alive and joyful right now! 😊 I'm genuinely smiling for you. What beautiful thing has been happening in your world?"
    ],
    suggestionList: [
      "Write this moment down - your future self will want to remember exactly how this feels.",
      "Share this joy with someone you love. Happiness multiplies when it's shared.",
      "Take a photo, write a note, do something to capture this beautiful feeling.",
      "Let yourself fully enjoy this - no guilt, no second-guessing. You deserve this.",
      "What's one thing you could do today to celebrate how good life feels right now?"
    ],
    needsHelp: false
  },

  anxious: {
    score: 3,
    responseList: [
      "Oh, that sounds so overwhelming, and I'm sorry you're carrying this right now. 🌿 Anxiety can make everything feel so much heavier than it already is. You're safe here, and I'm not going anywhere.",
      "I can feel how unsettled you are, and I want you to know - what you're feeling is completely valid. 🌿 Your nervous system is trying to protect you, even when it feels out of control. Take a slow breath - I'm right here.",
      "That sounds genuinely exhausting - when your mind won't let you rest, it takes so much out of you. 💚 You don't have to figure everything out right now. Just breathe. I'm with you.",
      "Anxiety can feel so isolating, like you're the only one who feels this way - but you're not alone. 🌱 What you're experiencing is real and it matters. I'm here, let's slow down together.",
      "I hear how much this is affecting you, and I'm truly sorry. 🌿 You don't have to white-knuckle through this alone. I'm right here with you, and we can take this one breath at a time."
    ],
    suggestionList: [
      "Try box breathing: in for 4, hold for 4, out for 4, hold for 4. Repeat slowly 3 times.",
      "Place both feet flat on the floor. Feel the ground. You are here. You are safe right now.",
      "Name 5 things you can see around you right now - this brings you back to the present.",
      "You don't have to solve everything today. What's one small thing that could make this moment easier?",
      "Sometimes anxiety needs movement - even a short walk can help release some of that tension."
    ],
    needsHelp: false
  },

  angry: {
    score: 2,
    responseList: [
      "Your anger makes complete sense, and I'm not going to ask you to calm down. 🌊 Something clearly hurt or frustrated you deeply, and that deserves to be acknowledged. I'm here - tell me what happened.",
      "That sounds genuinely infuriating, and I'm sorry you had to experience that. 💜 Anger like this usually means something important to you was crossed or disrespected. Your feelings are completely valid.",
      "I hear the frustration in what you're saying, and honestly? It makes total sense. 🔥 You don't have to justify feeling angry. I'm here to listen, not to judge. What's been going on?",
      "Oh, that sounds so unfair and hurtful. 💜 The fact that you're this angry tells me something really meaningful to you was affected. I see you, and your feelings are valid.",
      "That kind of frustration is exhausting to carry. 🌊 I'm not going to minimize what you're feeling - your anger is telling you something important. I'm listening."
    ],
    suggestionList: [
      "Write it all out - everything you're feeling, uncensored. No filter, just let it out on paper.",
      "Physical movement can help release anger energy - a walk, some stretching, anything that moves your body.",
      "You don't have to respond or react right now. Give yourself permission to just feel this first.",
      "What do you need most in this moment - to vent, to be heard, or to figure out what to do next?",
      "Sometimes anger is grief or hurt wearing a different face. What's underneath this feeling?"
    ],
    needsHelp: false
  },

  stressed: {
    score: 3,
    responseList: [
      "That sounds absolutely exhausting, and I'm sorry you're carrying all of this. 💜 When everything piles up like that, it's completely natural to feel overwhelmed - you're not weak for feeling this way, you're human.",
      "Oh, you've been carrying so much. 💜 I can hear how drained you are, and it makes complete sense. You don't have to keep pushing through alone - I'm here with you.",
      "That sounds like a lot - really, a lot. 💙 The fact that you're still showing up every day through all of this says something about your strength. But you deserve rest and care too.",
      "I'm so sorry things have been this heavy lately. 💜 Stress like this wears on you in ways people don't always see. You don't have to pretend everything is fine here - I see you.",
      "You sound like you've been running on empty for a while now. 🌿 That takes a real toll. You matter beyond what you produce or accomplish - please don't forget that."
    ],
    suggestionList: [
      "Just for the next 5 minutes - nothing. No tasks, no scrolling. Just breathe and rest.",
      "What's one thing on your plate that could wait, even just for today? You don't have to do it all.",
      "You matter more than your to-do list. What's one kind thing you could do for yourself right now?",
      "When did you last truly rest - not scroll or watch, but actually rest? You might need that today.",
      "Talk to someone you trust today - sometimes just saying it out loud to another person helps so much."
    ],
    needsHelp: false
  },

  neutral: {
    score: 5,
    responseList: [
      "I'm really glad you're here. 🤝 Even on the ordinary days, checking in with yourself takes courage. How are you honestly doing today - beneath the surface?",
      "Hey, it's good to have you here. 🌿 Sometimes we don't have big feelings - and that's perfectly okay too. What's been on your mind lately?",
      "I'm here for you - whether you have a lot to share or just wanted someone to talk to. 💙 No pressure, no rush. How are you today, really?",
      "There's something meaningful about showing up even when you're not sure what to say. 🤝 I'm glad you're here. What's going on in your world right now?",
      "Sometimes 'okay' is carrying more than it shows. 💙 I have time, and I genuinely want to listen. How have you been feeling lately?"
    ],
    suggestionList: [
      "Take a quiet moment today to check in with yourself - how does your heart actually feel?",
      "Is there something you've been meaning to process but haven't had space for? Now might be the time.",
      "What's one small thing that could make today feel a little better or lighter?",
      "How has your energy been lately - are you giving yourself enough care?",
      "Sometimes the ordinary days need attention too. What would feel good to do for yourself today?"
    ],
    needsHelp: false
  }
};

// Smart Mood Detection
const detectMood = (message) => {
  const msg = message.toLowerCase();

  const patterns = {
    sad: /sad|cry|crying|tears|upset|depress|lonely|heartbreak|heartbroken|miss|missing|loss|grief|hopeless|empty|broken|terrible|horrible|awful|hurt|pain|suffer|suffering|bad|down|low|feel lost|lost|alone|unloved|worthless|meaningless|வருத்தம்|அழுகை|தனிமை|கஷ்டம்|துக்கம்|மனசு சரியில்ல|மனசு|சரியில்ல|dull|numb|dark/,
    happy: /happy|happiness|joy|joyful|great|wonderful|excited|love|loving|amazing|good|excellent|fantastic|glad|blessed|awesome|perfect|beautiful|grateful|thrilled|elated|மகிழ்ச்சி|சந்தோஷம்|நல்லா|ஆனந்தம்|கொண்டாட்டம்|cheerful|delighted/,
    anxious: /anxious|anxiety|worry|worried|worrying|nervous|scared|fear|fearful|panic|panicking|overwhelm|overwhelmed|uncertain|tense|tensed|scary|terrified|dread|dreading|uneasy|restless|கவலை|பதட்டம்|பயம்|நடுக்கம்|tension|பரபரப்பு/,
    angry: /angry|anger|mad|furious|fury|irritated|irritating|frustrated|frustration|annoyed|annoying|rage|raging|hate|hating|unfair|betrayed|betrayal|upset with|sick of|fed up|livid|outraged|கோபம்|எரிச்சல்|ஆத்திரம்|வெறுப்பு|கோவம்/,
    stressed: /stress|stressed|stressing|tired|tiredness|exhaust|exhausted|burnout|burnt out|pressure|pressured|deadline|overwork|overworked|cant cope|can't cope|too much|so much|overwhelming|சோர்வு|அலுப்பு|டென்ஷன்|பிரஷர்|களைப்பு|work stress|overwhelmed/
  };

  for (const [mood, pattern] of Object.entries(patterns)) {
    if (pattern.test(msg)) {
      return mood;
    }
  }

  return 'neutral';
};

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Main function
const getMoodAndResponse = async (userMessage) => {
  try {
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    await delay(1000);

    const prompt = `You are Mitra, a warm and deeply caring AI companion - like a best friend who truly listens and genuinely cares.

The person just said: "${userMessage}"

Your response MUST follow this exact structure:
1. FIRST - Lead with genuine warmth and empathy (NOT a question)
2. SECOND - Validate their feeling completely
3. THIRD - Only optionally ask ONE gentle question at the very end

GOOD response examples:

Sad: "Oh, I'm so sorry you're feeling this way. 💙 That kind of pain is real, and you deserve to have someone sit with you in it. You are not alone - I'm right here with you."

Stressed: "That sounds absolutely exhausting, and I'm sorry you're carrying all of this. 💜 When everything piles up like that, it's completely natural to feel overwhelmed - you're not weak, you're human."

Anxious: "I can feel how unsettled you are right now, and I'm sorry. 🌿 Anxiety can make everything feel so heavy. You're safe here, and I'm not going anywhere."

Happy: "This genuinely warms my heart! 😊 You deserve every bit of this joy - soak it in completely."

STRICT RULES:
- NEVER start with a question
- NEVER say "I understand" or "I hear you" as openers
- Sound like a warm best friend, NOT a therapist or chatbot
- Maximum 3 sentences
- Lead with care, warmth, empathy ALWAYS
- If Tamil → respond in Tamil with same warmth
- Make them feel genuinely loved and not alone

Return ONLY this JSON (no markdown, no backticks):
{
  "mood": "sad",
  "moodScore": 3,
  "response": "your warm caring empathetic response here",
  "suggestion": "one gentle kind suggestion",
  "needsProfessionalHelp": false
}

mood: happy, sad, anxious, angry, stressed, neutral
moodScore: 1-10`;

    const response = await axios.post(GEMINI_URL, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.9,
        maxOutputTokens: 400,
        topP: 0.95
      }
    });

    const text = response.data.candidates[0].content.parts[0].text;
    console.log('Gemini raw:', text);

    let parsed;

    try {
      const cleanText = text
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
      parsed = JSON.parse(cleanText);
    } catch (e) {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No valid JSON found');
      }
    }

    if (!parsed.mood || !parsed.response) {
      throw new Error('Invalid response structure');
    }

    console.log('✅ Gemini mood:', parsed.mood);
    console.log('✅ Response:', parsed.response);
    return parsed;

  } catch (error) {
    console.log('⚡ Gemini unavailable:', error.message);
    console.log('Using Smart Caring Responses...');

    const detectedMood = detectMood(userMessage);
    const moodData = conversationResponses[detectedMood];

    const result = {
      mood: detectedMood,
      moodScore: moodData.score,
      response: getRandom(moodData.responseList),
      suggestion: getRandom(moodData.suggestionList),
      needsProfessionalHelp: moodData.needsHelp
    };

    console.log('✅ Fallback mood:', result.mood);
    console.log('✅ Fallback response:', result.response);
    return result;
  }
};

const analyzeJournals = async (journals, moods) => {
  try {
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    await delay(1000);

    const journalText = journals.map(j => `Title: ${j.title}\nContent: ${j.content}\nMood: ${j.mood}`).join('\n\n');
    const moodSummary = moods.map(m => `${m.mood} (Score: ${m.score})`).join(', ');

    const prompt = `You are a compassionate AI mental health companion analyzing a user's past 7 days of journal entries and mood logs.

Journals:
${journalText}

Recent Moods:
${moodSummary}

Based on this data, provide a brief, empathetic summary of their emotional patterns and themes over the past week.
Your response MUST follow this exact structure:
1. Provide an empathetic summary (max 3 sentences).
2. Suggest one actionable, gentle coping strategy based on their specific themes.
3. Determine if they need a "Proactive Check-in". Set "needsProactiveCheckin" to true ONLY IF you notice a strong downward trend, consistent high anxiety, deep sadness, or if they explicitly mention feeling overwhelmed/hopeless across multiple entries. Otherwise, set it to false.
4. Identify 1-3 emotional themes (e.g., "Work Stress", "Relationship Anxiety", "Finding Joy in Small Things").

Return ONLY this JSON (no markdown, no backticks):
{
  "summary": "Your empathetic summary here",
  "themes": ["Theme 1", "Theme 2"],
  "suggestion": "One gentle coping strategy",
  "needsProactiveCheckin": true/false
}`;

    const response = await axios.post(GEMINI_URL, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
        topP: 0.95
      }
    });

    const text = response.data.candidates[0].content.parts[0].text;
    
    let parsed;
    try {
      const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleanText);
    } catch (e) {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No valid JSON found');
      }
    }

    return parsed;

  } catch (error) {
    console.log('⚡ Gemini unavailable for analysis:', error.message);
    
    // Fallback response
    return {
      summary: "I've been looking over your recent entries, and I see how much you've been reflecting. It takes courage to track your feelings so consistently.",
      themes: ["Self-Reflection", "Tracking Progress"],
      suggestion: "Take a deep breath and acknowledge the effort you're putting into understanding yourself.",
      needsProactiveCheckin: false
    };
  }
};

const reframeThought = async (thought) => {
  try {
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    await delay(1000);

    const prompt = `You are a compassionate Cognitive Behavioral Therapy (CBT) assistant.
A user has shared a negative or anxious thought: "${thought}"

Analyze this thought for any common cognitive distortions (e.g., all-or-nothing thinking, catastrophizing, mind reading, overgeneralization).
Provide an empathetic validation, identify the distortions, and suggest a healthy, balanced reframe.

Return ONLY this JSON (no markdown, no backticks):
{
  "distortions": ["Distortion 1", "Distortion 2"],
  "analysis": "Brief empathetic explanation of why this thought is happening and what distortions are present.",
  "reframe": "A balanced, rational, and kinder way to think about the situation."
}`;

    const response = await axios.post(GEMINI_URL, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
        topP: 0.95
      }
    });

    const text = response.data.candidates[0].content.parts[0].text;
    
    let parsed;
    try {
      const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleanText);
    } catch (e) {
      const jsonMatch = text.match(/\\{[\\s\\S]*\\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No valid JSON found');
      }
    }

    return parsed;

  } catch (error) {
    console.log('⚡ Gemini unavailable for CBT:', error.message);
    
    return {
      distortions: ["Possible Catastrophizing or Overgeneralization"],
      analysis: "It's completely normal to feel overwhelmed. When we're stressed, our minds often jump to the worst-case scenario to protect us.",
      reframe: "This is a difficult moment, but it does not define the entire situation. I can handle this one step at a time."
    };
  }
};

module.exports = { getMoodAndResponse, analyzeJournals, reframeThought };