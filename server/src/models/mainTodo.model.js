import mongoose, {Schema} from "mongoose";

const mainTodoSchema = new Schema({
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
    subTodos: {
        type: [ 
            {
                type: Schema.Types.ObjectId,
                ref: "SubTodo",
            }
        ],
        default: []
    },
    shortDescription: {
        type: String,
    }, 
    detailedDescription: {
        type: String,
    },
    deadline: {
        type: Date,
    },
    priority: {
        type: String,
        default: 'Medium',
    },
    status: {
        type: String,
        default: 'Remaining',
    },
    doneBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: false,
    }
}, {
    timestamps: true,
})

export const MainTodo = mongoose.model("MainTodo", mainTodoSchema);