const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const approvalRoutes = require('./routes/approvalRoutes');
const { startEngine } = require('./utils/autonomousEngine');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/approvals', approvalRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  startEngine(); 
});

app.get('/api/cron/run-agents', async (req, res) => {
  try {
    console.log("Cron job triggered agent engine...");
    
    // Trigger the SDR campaigns
    await startEngine(); 
    
    res.status(200).json({ success: true, message: "Engine executed successfully" });
  } catch (error) {
    console.error("Engine failed during cron execution:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});