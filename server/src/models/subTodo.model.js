import mongoose, {Schema} from "mongoose";

const subTodoSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    }, 
    projectId : {
        type: mongoose.Types.ObjectId,
        ref: "Project",
        required: true,
    },
    todoId: {
        type: mongoose.Types.ObjectId,
        ref: "MainTodo",
        required: true,
    },
    description: {
        type: String,
    }, 
    status: {
        type: String,
        default: 'Todo',
    },
    doneBy: {
        type : Schema.Types.ObjectId,
        ref : "User",
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

export const SubTodo = mongoose.model("SubTodo", subTodoSchema);