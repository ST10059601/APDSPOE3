import https from "https";  // Use https instead of http
import fs from "fs";
import users from "./Routes/user.mjs";
import payments from "./Routes/payment.mjs";  // Payment request routes
import employees from "./Routes/employee.mjs"; // Employer-specific routes
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import session from 'express-session';
import hpp from "hpp";
import { checkEmployerRole } from "./checkEmployerRole.mjs"; // Middleware for employer role check
//code attribution:

//Author: Helmet.js Contributors
//Title: Helmet.js Documentation
//Available at: https://helmetjs.github.io/

//Author: Express Rate Limit Maintainers
//Title: Express Rate Limit Documentation
//Available at: https://www.npmjs.com/package/express-rate-limit

//Author: HPP Maintainers
//Title: HPP Middleware for Express Documentation
//Available at: https://www.npmjs.com/package/hpp

//Author: Express.js Team
//Title: Express Session Middleware
//Available at: https://www.npmjs.com/package/express-session

//Author:  OWASP Foundation
//Title: OWASP Input Validation Cheat Sheet
//Available at: https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html

const PORT = 3000;
const app = express();

// SSL Certificates for HTTPS
const options = {
    key: fs.readFileSync('keys/privatekey.pem'),  // Path to private key
    cert: fs.readFileSync('keys/certificate.pem') // Path to certificate
};

// Middleware for security headers
app.use(helmet());

// Simplified CORS settings
app.use(cors({
  origin: "https://localhost:3001",  
  methods: ["GET", "POST","PUT"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Middleware for parsing JSON request bodies
app.use(express.json());

// Rate limiting to prevent DDoS attacks
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100 
});
app.use(limiter);

// HTTP Parameter Pollution protection
app.use(hpp());

// Secure session management
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true, httpOnly: true, maxAge: 60000 } 
}));

// Routes for users and payments
app.use("/user", users);
app.use("/payment", payments);  // Payment request routes
app.use("/employee", checkEmployerRole, employees); // Employer-specific routes with role check

// HTTPS Server Setup
let server = https.createServer(options, app);  
server.listen(PORT, () => {
    console.log(`Server running securely on https://localhost:${PORT}`);
});
