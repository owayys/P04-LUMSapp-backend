import * as FirebaseService from "../services/FirebaseService.js";
import { User } from "../models/user.js";
import { Notification } from "../models/notification.js";

export const registerPushToken = async (req, res) => {
    const { token } = req.body;
    const userId = req.user._id;
    if (!userId || !token) {
        return res.status(400).json({ err: "Invalid request" });
    }
    try {
        await FirebaseService.saveToken(userId, token);
        res.json({ success: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: "Internal server error" });
    }
};

export const getUserNotifs = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
            });
        }

        let notifs = await Notification.find({ recipient: user })
            .sort({ timestamp: -1 })
            .limit(20)
            .select("actor entity type timestamp onModel")
            .populate({
                path: "actor",
                select: "fullname profile_picture", // Select the fields you want from the referenced User model
            })
            .populate({
                path: "entity",
                select: "title text", // Select the fields you want from the referenced Post or Comment model
            });

        res.status(200).json({
            success: true,
            message: "User notifs fetched successfully",
            notifs,
        });
    } catch (error) {
        console.log("Error: Unable to get user notifs");
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
