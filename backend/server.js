const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Security middleware
app.use(helmet());
const allowedOrigins = [
  'http://localhost:5173', 'http://127.0.0.1:5173',
  'http://localhost:3000', 'http://127.0.0.1:3000',
  'http://localhost:3001', 'http://127.0.0.1:3001',
  'http://localhost:3002', 'http://127.0.0.1:3002'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // Allow cookies to be sent
}));

// Rate limiting disabled for debugging

// Body parsers
app.use(express.json());
app.use(cookieParser());

// Mount routers
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/apikeys', require('./routes/apiKeyRoutes'));
app.use('/api/v1/notes', require('./routes/noteRoutes'));

// Swagger Documentation
try {
  const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (e) {
  console.log('Swagger documentation not found or invalid.');
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
