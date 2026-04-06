import express from 'express';
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/database-config.js";
import userRoutes from "./routes/auth-route.js";
import sessionRoutes from "./routes/session-route.js";
import aiRoutes from "./routes/ai-route.js";
import questionRoutes from "./routes/question-route.js";
import userProfileRoute from "./routes/user-route.js";

dotenv.config();

connectDB();

let app = express();
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/user", userProfileRoute);

app.get("/", (req, res) => {
    res.status(500).json({
        success: true,
        message: "error occurred",
        err: {
            name: "some error",
        }
    });
});

app.get("/about", (req, res) => {
    res.status(122).json({
        message: "about page"
    });
});

const PORT = process.env.PORT || 9001;

app.listen(PORT, () => {
    console.log(`Server has Started on port ${PORT}....`);
});