import mongoose, {Schema} from "mongoose";

const subTodoSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    }, 
    description: {
        type: String,
    }, 
    status: {
        type: String,
        default: 'Remaining',
    },
    doneBy: {
        type : Schema.Types.ObjectId,
        ref : "User",
        required: true,
    },
    backgroundColor : {
        type: String,
        default : "#444444",
    },
    foregroundColor : {
        type: String,
        default: "#000000",
    }
}, {
    timestamps: true,
})