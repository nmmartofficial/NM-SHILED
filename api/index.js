// api/index.js - Vercel Serverless Proxy for Tmailor API
module.exports = async (req, res) => {
  // Add CORS headers to allow requests from our frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Tmailor API configuration
  const TMAILOR_API_URL = 'https://tmailor.com/api';
  const headers = {
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.5',
    'content-type': 'application/json',
    'origin': 'https://tmailor.com',
    'referer': 'https://tmailor.com/en/',
    'user-agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:145.0) Gecko/20100101 Firefox/145.0'
  };

  try {
    const { action, token, email } = req.query;
    let tmailorPayload = {};

    if (action === 'newemail') {
      // Generate new email
      tmailorPayload = {
        action: 'newemail',
        curentToken: token || ''
      };
    } else if (action === 'getmessages' && token) {
      // Get messages for existing email using token
      tmailorPayload = {
        action: 'getmessages',
        curentToken: token
      };
    } else {
      throw new Error('Invalid action or missing required parameters');
    }

    // Call Tmailor API
    const response = await fetch(TMAILOR_API_URL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(tmailorPayload)
    });

    if (!response.ok) {
      throw new Error(`Tmailor API request failed: ${response.status}`);
    }

    const data = await response.json();

    // Send the data back to frontend
    res.status(200).json(data);
  } catch (error) {
    console.error('Proxy server error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch data from Tmailor',
      details: error.message 
    });
  }
};
