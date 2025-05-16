import mongoose, {Schema} from "mongoose";

const notificationSchema = new Schema({
    notificationText : {
        type: String,
        required: true,
    },
    notificationSender: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    notificationReceiver: {
        type: Schema.Types.ObjectId,
        ref: "Project",
    }
}, {
    timestamps: true,
})

export const notification = new mongoose.model("Notification", notificationSchema)