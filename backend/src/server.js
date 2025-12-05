const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const taskRoutes = require('./routes/tasks');
const aiRoutes = require('./routes/ai');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/tasks', taskRoutes);
app.use('/parse-voice', aiRoutes);

app.get('/', (req, res) => {
  res.send('Voice Task Tracker API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
