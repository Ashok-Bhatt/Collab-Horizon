import mongoose, {Schema} from "mongoose";

const mainTodoSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
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
        type : [
            {
                member: {
                    type: Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                contribution : [
                    {
                        type: Schema.Types.ObjectId,
                        ref: "SubTodo",
                        required: true,

                    }
                ]
                
            },
        ],
        default : [],
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

export const mainTodo = mongoose.model("MainTodo", mainTodoSchema);