import Question from "../models/question-model.js";
import Session from "../models/session-model.js";

// @desc    Pin / Unpin a question
// @route   PATCH /api/questions/:id/pin
// @access  Private
export const togglePin = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);

        if (!question) {
            return res.status(404).json({ success: false, message: "Question not found" });
        }

        // Toggle isPinned
        question.isPinned = !question.isPinned;
        await question.save();

        res.status(200).json({ success: true, question });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @desc    Add / Update note on a question
// @route   PATCH /api/questions/:id/note
// @access  Private
export const updateNote = async (req, res) => {
    try {
        const { note } = req.body;

        const question = await Question.findByIdAndUpdate(
            req.params.id,
            { note },
            { new: true }
        );

        if (!question) {
            return res.status(404).json({ success: false, message: "Question not found" });
        }

        res.status(200).json({ success: true, question });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @desc    Search questions in a session
// @route   GET /api/questions/search?sessionId=xxx&q=react
// @access  Private
export const searchQuestions = async (req, res) => {
    try {
        const { sessionId, q } = req.query;

        if (!sessionId || !q) {
            return res.status(400).json({ success: false, message: "sessionId and q are required" });
        }

        const questions = await Question.find({
            session: sessionId,
            question: { $regex: q, $options: "i" }, // case-insensitive search
        });

        res.status(200).json({ success: true, questions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};