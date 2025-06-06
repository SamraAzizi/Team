// Generate a random ID
const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Validate fact data
const validateFactData = (factData) => {
  const { title, content } = factData;
  const errors = [];
  
  if (!title || title.trim() === '') {
    errors.push('Title is required');
  }
  
  if (!content || content.trim() === '') {
    errors.push('Content is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  generateId,
  validateFactData
};