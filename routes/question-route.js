import express from "express";
import {
  togglePin,
  updateNote,
  searchQuestions,
} from "../controller/question-controller.js";
import { protect } from "../middlewares/auth-middleware.js";

const router = express.Router();

router.patch("/:id/pin", protect, togglePin);          // Pin/Unpin
router.patch("/:id/note", protect, updateNote);        // Note add
router.get("/search", protect, searchQuestions);       // Search

export default router;