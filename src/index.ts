import express from "express";
import dotenv from "dotenv";
import admin from "./routes/admin.route";
import cors from "cors";
import path from 'path';

dotenv.config();

const corsOptions = {
    origin: ['http://localhost:5173','https://assent-ai.oclocksoftware.info'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'x-api-key'],
    credentials: true,
  };


const app = express();
const port = process.env.PORT || 5700;
//app.use(cors());
app.use(cors(corsOptions));
app.use(express.json()); 
app.use('/admin', admin);

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
})