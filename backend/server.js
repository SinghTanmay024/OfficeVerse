require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const employeesRouter = require('./routes/employees');
const achievementsRouter = require('./routes/achievements');
const celebrationsRouter = require('./routes/celebrations');
const policiesRouter = require('./routes/policies');
const announcementsRouter = require('./routes/announcements');
const kudosRouter = require('./routes/kudos');
const feedbackRouter = require('./routes/feedback');
const leavesRouter = require('./routes/leaves');
const analyticsRouter = require('./routes/analytics');
const pulseRouter = require('./routes/pulse');
const projectsRouter = require('./routes/projects');
const journeysRouter = require('./routes/journeys');
const fridayRouter        = require('./routes/friday');
const peopleWorksRouter   = require('./routes/peopleworks');

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Render health checks)
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.some(o => origin.startsWith(o)) ||
      origin.endsWith('.vercel.app') ||
      origin.endsWith('.netlify.app')
    ) {
      return callback(null, true);
    }
    callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
}));
app.use(express.json());

app.use('/api/employees', employeesRouter);
app.use('/api/achievements', achievementsRouter);
app.use('/api/celebrations', celebrationsRouter);
app.use('/api/policies', policiesRouter);
app.use('/api/announcements', announcementsRouter);
app.use('/api/kudos', kudosRouter);
app.use('/api/feedback', feedbackRouter);
app.use('/api/leaves', leavesRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/pulse', pulseRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/journeys', journeysRouter);
app.use('/api/friday',       fridayRouter);
app.use('/api/peopleworks',  peopleWorksRouter);


app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'OfficeVerse API is running', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`\n🌌 OfficeVerse Backend running on http://localhost:${PORT}`);
  console.log(`📊 API Health: http://localhost:${PORT}/api/health\n`);
});
