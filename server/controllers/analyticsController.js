const UserProgress = require('../models/UserProgress');
const MCQResult = require('../models/MCQResult');
const InterviewSession = require('../models/InterviewSession');
const Question = require('../models/Question');

// @desc    Get User Analytics Dashboard Data
// @route   GET /api/analytics/me
// @access  Private
const getMyAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Coding Questions Stats
    const totalQuestions = await Question.countDocuments();
    const userProgress = await UserProgress.find({ user: userId }).populate('question');
    
    let attempted = userProgress.length;
    let solvedCount = 0;
    let difficultyStats = { easy: 0, medium: 0, hard: 0 };

    userProgress.forEach(progress => {
      if (progress.status === 'solved') {
        solvedCount++;
        if (progress.question && progress.question.difficulty) {
          difficultyStats[progress.question.difficulty]++;
        }
      }
    });

    // 2. MCQ Stats
    const mcqResults = await MCQResult.find({ user: userId });
    const totalQuizzes = mcqResults.length;
    
    let totalScore = 0;
    let totalMCQQuestions = 0;
    let topicScores = {};

    mcqResults.forEach(r => {
      totalScore += r.score;
      totalMCQQuestions += r.totalQuestions;
      
      // Calculate average per topic later
      if (!topicScores[r.topic]) {
        topicScores[r.topic] = { totalScore: 0, count: 0, totalQuestions: 0 };
      }
      topicScores[r.topic].totalScore += r.score;
      topicScores[r.topic].totalQuestions += r.totalQuestions;
      topicScores[r.topic].count++;
    });

    const overallMCQAccuracy = totalMCQQuestions > 0 ? ((totalScore / totalMCQQuestions) * 100).toFixed(1) : 0;
    
    // Format topic scores for Recharts
    const mcqTopicAverages = Object.keys(topicScores).map(topic => ({
      topic,
      accuracy: ((topicScores[topic].totalScore / topicScores[topic].totalQuestions) * 100).toFixed(1)
    }));

    // 3. Mock Interview Stats
    const interviews = await InterviewSession.find({ user: userId, status: 'completed' });
    const totalInterviews = interviews.length;
    const avgInterviewScore = totalInterviews > 0 
      ? (interviews.reduce((acc, curr) => acc + (curr.score || 0), 0) / totalInterviews).toFixed(1)
      : 0;

    // 4. Activity Data (Heatmap - Last 30 Days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    // Collect all activities
    const activities = [
      ...userProgress.filter(p => p.solvedAt >= thirtyDaysAgo).map(p => ({ date: p.solvedAt, type: 'coding' })),
      ...mcqResults.filter(m => m.takenAt >= thirtyDaysAgo).map(m => ({ date: m.takenAt, type: 'mcq' })),
      ...interviews.filter(i => i.endedAt >= thirtyDaysAgo).map(i => ({ date: i.endedAt, type: 'interview' }))
    ];

    // Group activities by date string "YYYY-MM-DD"
    const activityMap = {};
    activities.forEach(item => {
      if (!item.date) return;
      // Convert to local YYYY-MM-DD
      const dateStr = new Date(item.date).toISOString().split('T')[0];
      if (!activityMap[dateStr]) {
        activityMap[dateStr] = { date: dateStr, count: 0, level: 0 };
      }
      activityMap[dateStr].count++;
    });

    // Format for react-activity-calendar
    // The calendar component needs data in chronological order usually, and level (0-4)
    Object.values(activityMap).forEach(day => {
      if (day.count === 0) day.level = 0;
      else if (day.count <= 2) day.level = 1;
      else if (day.count <= 4) day.level = 2;
      else if (day.count <= 6) day.level = 3;
      else day.level = 4;
    });
    
    const activityGraphData = Object.values(activityMap).sort((a, b) => new Date(a.date) - new Date(b.date));

    // 5. Daily Streak Calculation
    let currentStreak = 0;
    const sortedDates = [...new Set(activities.map(a => new Date(a.date).toISOString().split('T')[0]))].sort().reverse();
    
    if (sortedDates.length > 0) {
      const todayStr = new Date().toISOString().split('T')[0];
      const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      
      let checkDate = new Date();
      // Start checking from today or yesterday
      if (sortedDates[0] === todayStr || sortedDates[0] === yesterdayStr) {
         currentStreak = 1;
         let i = 1;
         let expectedDate = new Date(sortedDates[0]);
         
         while (i < sortedDates.length) {
            expectedDate.setDate(expectedDate.getDate() - 1);
            const expectedStr = expectedDate.toISOString().split('T')[0];
            if (sortedDates[i] === expectedStr) {
               currentStreak++;
            } else {
               break;
            }
            i++;
         }
      }
    }

    res.status(200).json({
      codingStats: {
        total: totalQuestions,
        attempted,
        solved: solvedCount,
        unsolved: attempted - solvedCount, // Assuming tracked = attempted
        byDifficulty: [
          { name: 'Easy', count: difficultyStats.easy },
          { name: 'Medium', count: difficultyStats.medium },
          { name: 'Hard', count: difficultyStats.hard }
        ]
      },
      mcqStats: {
        totalQuizzes,
        overallAccuracy: Number(overallMCQAccuracy),
        topicAverages: mcqTopicAverages,
        history: mcqResults
          .sort((a, b) => new Date(b.takenAt) - new Date(a.takenAt))
          .slice(0, 10)
          .map(m => ({ topic: m.topic, score: m.score, totalQuestions: m.totalQuestions, takenAt: m.takenAt }))
      },
      interviewStats: {
        totalInterviews,
        avgScore: Number(avgInterviewScore)
      },
      activity: {
        currentStreak,
        heatmapData: activityGraphData,
        recentFeed: activities.sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 5) // Last 5
      }
    });

  } catch (error) {
    console.error('Analytics Error:', error);
    res.status(500).json({ message: 'Error fetching analytics' });
  }
};

module.exports = {
  getMyAnalytics
};
