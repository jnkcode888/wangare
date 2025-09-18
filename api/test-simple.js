// Simple test function to check if Vercel functions work
module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).json({ message: 'CORS preflight OK' });
    return;
  }
  
  res.status(200).json({
    message: 'Test function working',
    method: req.method,
    timestamp: new Date().toISOString()
  });
};
