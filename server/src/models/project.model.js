import mongoose, {Schema} from "mongoose";

const projectSchema = new Schema({
    projectName: {
        type: String,
        trim: true,
        required: true,
    }, 
    projectTagline: {
        type: String,
        trim: true,
        required: true,
    }, 
    projectDescription: {
        type: String,
    }, 
    projectGroup : [
        {
            groupMember : {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            designation: {
                type: String,
                required: true,
            },
        }
    ],
    tasks: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: "MainTodo",
            }, 
        ],
        default: [],
    },
    startDate: {
        type: Date,
    }, 
    deadline: {
        type: Date,
    }, 
    uniqueCode: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    }, 
    visibilityStatus : {
        type: Boolean,
        default: false,
    },
    srcCodeLink: {
        type: String,
        trim: true,
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

export const Project = mongoose.model("Project", projectSchema);