const Anthropic = require('@anthropic-ai/sdk');
const InterviewSession = require('../models/InterviewSession');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY, 
});

// Helper for the Claude System Prompt
const getSystemPrompt = (role, difficulty) => {
  return `You are an expert technical interviewer conducting a mock interview for a ${difficulty} level ${role} software engineering position. 
Follow these strict rules:
1. Ask ONE technical question at a time relevant to the role and difficulty.
2. Wait for the user to answer.
3. After the user answers, provide brief (+/- 2 sentences) constructive feedback on their answer. Then logically transition to the next question.
4. Total questions: Ask exactly 5 questions across the entire interview.
5. Once the 5th question is answered and you provide your final feedback, output a final Performance Summary. The final paragraph MUST be valid JSON (and only JSON) formatted exactly like this:
{"score": 8, "strengths": ["list", "of", "strengths"], "weaknesses": ["list", "of", "weaknesses"], "summary": "overall summary"}`;
};

// @desc    Start Interview Session
// @route   POST /api/interview/start
// @access  Private
const startInterview = async (req, res) => {
  try {
    const { role, difficulty } = req.body;

    if (!role || !difficulty) {
      return res.status(400).json({ message: 'Role and difficulty are required.' });
    }

    // Initialize session in db
    const session = await InterviewSession.create({
      user: req.user._id,
      interviewRole: role,
      difficulty,
      messages: []
    });

    const systemPrompt = getSystemPrompt(role, difficulty);

    // Call Claude for the first question
    const msg = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 300,
      system: systemPrompt,
      messages: [
        { role: "user", content: `Hi, I'm ready to begin my ${difficulty} ${role} interview.` }
      ],
    });

    const claudeResponse = msg.content[0].text;

    // Save Claude's first message to session
    session.messages.push({
      role: 'assistant',
      content: claudeResponse
    });
    
    await session.save();

    res.status(200).json({
      sessionId: session._id,
      message: claudeResponse,
      status: session.status
    });

  } catch (error) {
    console.error('Start Interview Error:', error);
    res.status(500).json({ message: 'Error initializing interview session', error: error.message });
  }
};

// @desc    Respond to Interview Chat
// @route   POST /api/interview/respond
// @access  Private
const respondToInterview = async (req, res) => {
  try {
    const { sessionId, userMessage } = req.body;

    if (!sessionId || !userMessage) {
      return res.status(400).json({ message: 'Session ID and user message required.' });
    }

    const session = await InterviewSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.status === 'completed') {
      return res.status(400).json({ message: 'Interview already completed' });
    }

    // Append user message
    session.messages.push({
      role: 'user',
      content: userMessage
    });

    // Reconstruct conversation history for Claude API
    const conversationHistory = session.messages.map(m => ({
        role: m.role,
        content: m.content
    }));

    // Reconstruct start context (first user intro isn't persisted exactly in our message loop to save space, but we inject it here)
    const apiMessages = [
      { role: "user", content: `Hi, I'm ready to begin my ${session.difficulty} ${session.interviewRole} interview.` },
      ...conversationHistory
    ];

    const systemPrompt = getSystemPrompt(session.interviewRole, session.difficulty);

    const msg = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1000,
      system: systemPrompt,
      messages: apiMessages,
    });

    let claudeResponse = msg.content[0].text;
    
    // Check if Claude included the final JSON snippet indicating end of interview
    let isCompleted = false;
    let finalFeedback = null;
    let score = null;

    try {
      const jsonMatch = claudeResponse.match(/\{[\s\S]*score[\s\S]*\}/);
      if (jsonMatch) {
         const parsedData = JSON.parse(jsonMatch[0]);
         if (parsedData.score !== undefined) {
             isCompleted = true;
             finalFeedback = {
               strengths: parsedData.strengths || [],
               weaknesses: parsedData.weaknesses || [],
               summary: parsedData.summary || ''
             };
             score = parsedData.score;
             
             // Clean the JSON from Claude's text response sent to client
             claudeResponse = claudeResponse.replace(jsonMatch[0], '').trim();
         }
      }
    } catch(e) {
      console.log('Failed to parse Claude Summary JSON block', e.message);
    }

    // Append assistant response
    session.messages.push({
      role: 'assistant',
      content: claudeResponse
    });

    if (isCompleted) {
      session.status = 'completed';
      session.endedAt = new Date();
      session.score = score;
      session.feedback = finalFeedback;
    }

    await session.save();

    res.status(200).json({
      message: claudeResponse,
      status: session.status,
      score: session.score,
      feedback: session.feedback
    });

  } catch (error) {
    console.error('Respond Interview Error:', error);
    res.status(500).json({ message: 'Error communicating with AI assistant' });
  }
};

module.exports = {
  startInterview,
  respondToInterview
};
