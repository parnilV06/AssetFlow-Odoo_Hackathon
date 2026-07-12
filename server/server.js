require('dotenv').config(); // Load environment variables from .env
const app = require('./src/app');
const { connectDB } = require('./src/config/database');

const PORT = process.env.PORT || 5000;

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
