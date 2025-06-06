const request = require('supertest');
const app = require('../app');
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/facts.json');

describe('Science Facts API', () => {
  beforeEach(() => {
    // Reset test data before each test
    const testData = [
      {
        id: "test1",
        title: "Test Fact 1",
        content: "This is a test fact",
        category: "Test",
        source: "Test Source",
        createdAt: "2023-01-01T00:00:00.000Z",
        updatedAt: "2023-01-01T00:00:00.000Z"
      }
    ];
    fs.writeFileSync(dataPath, JSON.stringify(testData), 'utf8');
  });

  afterAll(() => {
    // Clean up after tests
    fs.writeFileSync(dataPath, JSON.stringify([]), 'utf8');
  });

  it('GET /api/facts - should return all facts', async () => {
    const response = await request(app).get('/api/facts');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('POST /api/facts - should create a new fact', async () => {
    const newFact = {
      title: "New Test Fact",
      content: "This is a new test fact",
      category: "Test"
    };

    const response = await request(app)
      .post('/api/facts')
      .send(newFact);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe(newFact.title);
  });

  it('GET /api/facts/random - should return a random fact', async () => {
    const response = await request(app).get('/api/facts/random');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('title');
  });
});