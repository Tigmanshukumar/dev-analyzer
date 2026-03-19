const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const analyzeRoutes = require('./routes/analyze');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/analyze', analyzeRoutes);

app.get('/', (req, res) => {
  res.send('GitHub Personality Analyzer API is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
