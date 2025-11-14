// This is a Vercel Serverless Function, which runs on the server, not the browser.
// Ensure this file is located at /api/login.ts in your project root.
export default async function handler(req, res) {
  // Only allow POST requests for security
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  // The secret password is now hardcoded on the server as per the request.
  const secretPassword = '#teamknu11CTF';

  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ success: false, error: 'Password is required.' });
    }

    if (password === secretPassword) {
      return res.status(200).json({ success: true });
    } else {
      // For security, return a specific failure message
      return res.status(401).json({ success: false, error: 'Authentication failed. Incorrect password.' });
    }

  } catch (error) {
    console.error('Error in /api/login:', error);
    return res.status(500).json({ success: false, error: 'An internal server error occurred during authentication.' });
  }
}
