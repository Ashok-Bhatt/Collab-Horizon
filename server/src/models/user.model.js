import mongoose, {Schema} from "mongoose";

const userSchema = new Schema({
    username : {
        type: String,
        required: true,
        trim: true,
        index: true,
        unique: true,
    }, 
    password : {
        type: String,
        required: [true, "Password is required"],
    }, 
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true,
    },
    uniqueCode: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    projects: [
        {
            type: Schema.Types.ObjectId,
            ref: "Project",
        }
    ],
    bio: {
        type: String,
        trim: true,
    }, 
    skills : [ 
        {
            type: String,
        }
    ],
    socialProfilesLinks : {
        github : {
            type: String,
            trim: true,
        },
        linkedin : {
            type: String,
            trim: true,
        },
        twitter: {
            type: String,
            trim: true,
        },
        portfolioWebsite: {
            type: String,
            trim: true,
        },
        others : [
            {
                appName : {
                    type: String,
                    trim: true,
                }, 
                profileLink: {
                    type:  String,
                    trim: true,
                }
            }
        ]
    },
    avatar : {
        type: String,
        required: true,
    },
    coverImage : {
        type: String,
    },
    refreshToken: {
        type: String,
    }

}, {
    timestamps: true
})

export const User = mongoose.model("User", userSchema);