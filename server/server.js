require('dotenv').config(); // Load environment variables from .env
const app = require('./src/app');
const { connectDB } = require('./src/config/prisma');

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Hello AssetFLow!');
});

// API Health Check
app.get('/api/health', async(req,res)=>{
    try {
        res.status(200).json({ message: 'Server is healthy' });
    } catch (error) {
        console.error('Error checking API health:', error);
        res.status(500).json({ message: 'API health check failed' });
    }
});

const startServer = async () => {
    try {
        // First, establish database connection
        await connectDB();
        
        // Then, start the Express server
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Initialize application
startServer();
