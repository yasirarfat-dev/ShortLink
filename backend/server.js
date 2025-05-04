import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { fileURLToPath } from 'url';
import path from 'path';

// Derive __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Express app setup
const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

// Middleware and routes
import urlrouter from "./routes/shorturl.js";
import userrouter from "./routes/user.js";
import auth from "./middlewares/auth.js";

app.use(auth);

app.use((req, res, next) => {
    console.log("Path: ", req.path);
    console.log("Method: ", req.method);
    console.log("Body: ", req.body);
    console.log("Params: ", req.params);
    console.log("Query: ", req.query);
    next();
});

// app.use("/u", userrouter);
app.use("/s", urlrouter);

// Serve static files and fallback route
app.use(express.static(path.join(__dirname, 'public')));
// UNDEFINED ROUTES
app.use((req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});



// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB connected successfully');

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server is running on http://192.168.1.2:${PORT}`);
    });
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
});
