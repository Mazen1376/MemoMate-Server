import { asyncHandler } from "../utils/asyncHandler.js";
import messageModel from "../models/messageModel.js";

export const getMessages = asyncHandler(async (req: any, res: any) => {
  const { recieverId } = req.params;
  const senderId = req.decodedToken.id;

  if (!recieverId) {
    res.status(400);
    throw new Error("Reciever ID is required");
  }

  const messages = await messageModel
    .find({
      $or: [
        { doctorId: senderId, patientId: recieverId },
        { doctorId: recieverId, patientId: senderId },
      ],
    })
    .sort({ createdAt: 1 });

  res.status(200).json({ success: true, count: messages.length, data: messages });
});
