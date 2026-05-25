const express = require('express');
const https = require('https');
const router = express.Router();

const PEOPLEWORKS_API_URL = process.env.PEOPLEWORKS_API_URL;
const PEOPLEWORKS_TOKEN   = process.env.PEOPLEWORKS_TOKEN;

/**
 * Helper — make a GET request to the PeopleWorks API.
 * @param {string} url  Full URL to call
 * @returns {Promise<any>} Parsed JSON body
 */
function fetchPeopleWorks(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        Authorization: `Bearer ${PEOPLEWORKS_TOKEN}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    };

    https.get(url, options, (res) => {
      let raw = '';
      res.on('data', (chunk) => (raw += chunk));
      res.on('end', () => {
        try {
          const data = JSON.parse(raw);
          resolve({ statusCode: res.statusCode, data });
        } catch (err) {
          reject(new Error(`Failed to parse PeopleWorks response: ${raw}`));
        }
      });
    }).on('error', reject);
  });
}

/**
 * GET /api/peopleworks/employees
 * Fetch all employee details from PeopleWorks.
 * Optional query params are forwarded as-is (e.g. ?department=IT).
 */
router.get('/employees', async (req, res) => {
  try {
    // Build URL — forward any query params the caller passed
    const queryString = new URLSearchParams(req.query).toString();
    const url = queryString
      ? `${PEOPLEWORKS_API_URL}?${queryString}`
      : PEOPLEWORKS_API_URL;

    const { statusCode, data } = await fetchPeopleWorks(url);
    res.status(statusCode).json(data);
  } catch (err) {
    console.error('[PeopleWorks] Error fetching employees:', err.message);
    res.status(502).json({ error: 'Failed to fetch employee data from PeopleWorks', details: err.message });
  }
});

/**
 * GET /api/peopleworks/employees/:id
 * Fetch a single employee by ID from PeopleWorks.
 */
router.get('/employees/:id', async (req, res) => {
  try {
    const url = `${PEOPLEWORKS_API_URL}?id=${encodeURIComponent(req.params.id)}`;
    const { statusCode, data } = await fetchPeopleWorks(url);
    res.status(statusCode).json(data);
  } catch (err) {
    console.error('[PeopleWorks] Error fetching employee:', err.message);
    res.status(502).json({ error: 'Failed to fetch employee data from PeopleWorks', details: err.message });
  }
});

module.exports = router;
