const fs = require('fs');
const path = require('path');
const helpers = require('../utils/helpers');

const dataPath = path.join(__dirname, '../data/facts.json');

// Helper function to read facts data
const readFactsData = () => {
  try {
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading facts data:', err);
    return [];
  }
};

// Helper function to write facts data
const writeFactsData = (data) => {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing facts data:', err);
  }
};

// Controller methods
const getAllFacts = (req, res) => {
  const facts = readFactsData();
  res.json(facts);
};

const getRandomFact = (req, res) => {
  const facts = readFactsData();
  if (facts.length === 0) {
    return res.status(404).json({ message: 'No facts available' });
  }
  const randomFact = facts[Math.floor(Math.random() * facts.length)];
  res.json(randomFact);
};

const getFactById = (req, res) => {
  const facts = readFactsData();
  const fact = facts.find(f => f.id === req.params.id);
  if (!fact) {
    return res.status(404).json({ message: 'Fact not found' });
  }
  res.json(fact);
};

const createFact = (req, res) => {
  const { title, content, category, source } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  const facts = readFactsData();
  const newFact = {
    id: helpers.generateId(),
    title,
    content,
    category: category || 'General',
    source: source || 'Unknown',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  facts.push(newFact);
  writeFactsData(facts);
  res.status(201).json(newFact);
};

const updateFact = (req, res) => {
  const { title, content, category, source } = req.body;
  const facts = readFactsData();
  const factIndex = facts.findIndex(f => f.id === req.params.id);

  if (factIndex === -1) {
    return res.status(404).json({ message: 'Fact not found' });
  }

  const updatedFact = {
    ...facts[factIndex],
    title: title || facts[factIndex].title,
    content: content || facts[factIndex].content,
    category: category || facts[factIndex].category,
    source: source || facts[factIndex].source,
    updatedAt: new Date().toISOString()
  };

  facts[factIndex] = updatedFact;
  writeFactsData(facts);
  res.json(updatedFact);
};

const deleteFact = (req, res) => {
  const facts = readFactsData();
  const factIndex = facts.findIndex(f => f.id === req.params.id);

  if (factIndex === -1) {
    return res.status(404).json({ message: 'Fact not found' });
  }

  facts.splice(factIndex, 1);
  writeFactsData(facts);
  res.json({ message: 'Fact deleted successfully' });
};

module.exports = {
  getAllFacts,
  getRandomFact,
  getFactById,
  createFact,
  updateFact,
  deleteFact
};