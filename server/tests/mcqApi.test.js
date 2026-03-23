const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../index');
const MCQ = require('../models/MCQ');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

let mongoServer;
let token;
let user;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  await mongoose.connect(uri);

  // Create a test user
  user = await User.create({
    name: 'Test',
    email: 'test@test.com',
    password: 'password123'
  });

  // Generate a valid token
  token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

  // Add some test MCQs
  await MCQ.create([
    {
      question: 'What does CSS stand for?',
      options: ['Colorful Style Sheets', 'Cascading Style Sheets', 'Computer Style Sheets', 'Creative Style Sheets'],
      correctOptionIndex: 1,
      topic: 'CSS',
      difficulty: 'easy',
      explanation: 'CSS stands for Cascading Style Sheets.'
    },
    {
      question: 'Is HTML a programming language?',
      options: ['Yes', 'No'],
      correctOptionIndex: 1,
      topic: 'HTML',
      difficulty: 'easy',
      explanation: 'HTML is a markup language, not a programming language.'
    }
  ]);
}, 60000);

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('MCQ API', () => {
  it('should fetch MCQs by topic', async () => {
    // We mock process.env.JWT_SECRET so our token verification works in the test
    process.env.JWT_SECRET = 'secret';

    const res = await request(app)
      .get('/api/mcq/quiz/CSS')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBe(1);
    expect(res.body[0].topic).toBe('CSS');
    // Ensure correctOptionIndex is NOT sent to client during fetch
    expect(res.body[0].correctOptionIndex).toBeUndefined();
  });

  it('should calculate MCQ score securely backend-side', async () => {
    process.env.JWT_SECRET = 'secret';
    
    const cssQuestion = await MCQ.findOne({ topic: 'CSS' });

    const res = await request(app)
      .post('/api/mcq/submit')
      .set('Authorization', `Bearer ${token}`)
      .send({
        topic: 'CSS',
        answers: [
          { questionId: cssQuestion._id.toString(), selectedOptionIndex: 1 } // correct index
        ]
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.score).toBe(1);
    expect(res.body.total).toBe(1);
  });
});
