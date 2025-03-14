const { loadCSV, searchFaiss, generateAnswer, filterByCriteria } = require('../lib/utils');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Get query and filters from request body
    const { query, filters } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Missing query parameter' });
    }
    
    // Load data
    const data = await loadCSV();
    
    // Apply filters if provided
    let filteredData = data;
    if (filters && Object.keys(filters).length > 0) {
      filteredData = filterByCriteria(data, filters);
      
      if (filteredData.length === 0) {
        return res.status(200).json({ 
          answer: "No rooms match your filter criteria.", 
          contexts: [] 
        });
      }
    }
    
    // Search for relevant contexts
    const allContexts = await searchFaiss(query, 20);
    
    // Filter out contexts that don't match the filter criteria
    // This is a simplification. In reality, you'd need to map contexts back to original data
    const contexts = allContexts.slice(0, 5);
    
    // Generate answer
    const answer = await generateAnswer(query, contexts);
    
    // Return response
    return res.status(200).json({ 
      answer, 
      contexts 
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};