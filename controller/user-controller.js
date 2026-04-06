import User from "../models/user-model.js";
import bcrypt from "bcryptjs";

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Check karo email already kisi aur ne use ki hai
    const emailExists = await User.findOne({ 
      email, 
      _id: { $ne: req.user._id } // Apne aap ko exclude karo
    });

    if (emailExists) {
      return res.status(400).json({ 
        success: false, 
        message: "Email already in use" 
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true }
    ).select("-password");

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Change password
// @route   PUT /api/user/change-password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // User with password fetch karo
    const user = await User.findById(req.user._id);

    // Current password check karo
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false, 
        message: "Current password is incorrect" 
      });
    }

    // Naya password hash karo
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ 
      success: true, 
      message: "Password changed successfully!" 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Get user stats
// @route   GET /api/user/stats
// @access  Private
export const getUserStats = async (req, res) => {
  try {
    const Session = (await import("../models/session-model.js")).default;
    const Question = (await import("../models/question-model.js")).default;

    // Total sessions
    const totalSessions = await Session.countDocuments({ 
      user: req.user._id 
    });

    // Total questions
    const sessions = await Session.find({ user: req.user._id });
    const sessionIds = sessions.map((s) => s._id);
    const totalQuestions = await Question.countDocuments({ 
      session: { $in: sessionIds } 
    });

    // Total pinned questions
    const pinnedQuestions = await Question.countDocuments({
      session: { $in: sessionIds },
      isPinned: true,
    });

    res.status(200).json({
      success: true,
      stats: {
        totalSessions,
        totalQuestions,
        pinnedQuestions,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};