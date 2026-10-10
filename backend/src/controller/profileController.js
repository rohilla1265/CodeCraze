import User from "../models/user.js";
import bcrypt from "bcrypt";

// 1. GET PROFILE
export const getProfile = async (req, res) => {
  try {
    if (!req.result?._id) {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const user = await User.findById(req.result._id)
      .select("-password -__v")
      .populate("problemsolved", "title difficulty tags")
      .lean();

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      user,
      stats: {
        solvedCount: user.problemsolved ? user.problemsolved.length : 0,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 2. UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const userId = req.result._id;
    const { firstname, lastname, age,bio,linkedIn,Twitter } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { firstname, lastname, age,bio,linkedIn,Twitter } },
      { new: true, runValidators: true }
    ).select("-password -__v");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 3. CHANGE PASSWORD
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const user = await User.findById(req.result._id).select("+password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Incorrect current password" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 4. DELETE ACCOUNT
export const deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.result._id);
    res.clearCookie("token");

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
