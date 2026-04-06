import express from "express";
import {
    generateInterviewQuestions,
    generateConceptExplanation,
    getSessionById,
} from "../controller/ai-controller.js";
import { protect } from "../middlewares/auth-middleware.js";

const router = express.Router();

router.post("/generate-questions", protect, generateInterviewQuestions);
router.post("/generate-explanation", protect, generateConceptExplanation);
router.get("/session/:id", protect, getSessionById);

export default router;


