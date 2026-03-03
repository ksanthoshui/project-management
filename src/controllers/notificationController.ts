import { Notification } from "../models/Notification.ts";

export const getNotifications = async (req: any, res: any) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .populate("sender", "name avatar")
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const markAsRead = async (req: any, res: any) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ message: "Marked as read" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
