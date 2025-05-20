import mongoose, {Schema} from "mongoose";

const projectRequestSchema = new Schema({
    requestSender : {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
    requestReceiver : {
        type: mongoose.Types.ObjectId,
        ref: "Project",
        required: true,
    },
    requestText : {
        type: "String",
        trim: true,
    }
}, {
    timestamps: true,
})

export const ProjectRequest = mongoose.model("ProjectRequest", projectRequestSchema);