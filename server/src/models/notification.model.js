import mongoose, {Schema} from "mongoose";

const notificationSchema = new Schema({
    notificationMessage : {
        type: String,
        required: true,
    },
    notificationReceiver: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
}, {
    timestamps: true,
})

export const Notification = new mongoose.model("Notification", notificationSchema);