import mongoose, {Schema} from "mongoose";

const projectRequestSchema = new Schema({
    requestSender : {
        type: mongoose.Types.ObjectId,
        ref: "User",
        require: true,
    },
    requestReceiver : {
        type: mongoose.Types.ObjectId,
        ref: "Project",
        require: true,
    },
    requestText : {
        type: "String",
        trim: true,
    }
}, {
    timestamps: true,
})

export const projectRequest = mongoose.model("ProjectRequest", projectRequestSchema);