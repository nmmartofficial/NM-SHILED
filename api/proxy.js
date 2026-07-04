// api/proxy.js
module.exports = async (req, res) => {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // For now, proxy to 1secmail API since we know it works!
    const { action, login, domain, id } = req.query;
    let apiUrl = `https://www.1secmail.com/api/v1/?action=${action}`;
    
    if (login) apiUrl += `&login=${login}`;
    if (domain) apiUrl += `&domain=${domain}`;
    if (id) apiUrl += `&id=${id}`;

    const response = await fetch(apiUrl);
    const data = await response.json();
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};