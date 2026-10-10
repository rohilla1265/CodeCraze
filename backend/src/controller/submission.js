import Submission from "../models/submission.js";

export const getProblemSubmissions = async (req, res) => {
    try {
        const { problemId } = req.params;
        const userId = req.result._id; // Auth middleware se user ID

        // Newest submissions sabse upar dikhane ke liye sort lagaya hai
        const submissions = await Submission.find({ userId, problemId })
                                            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            submissions
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};