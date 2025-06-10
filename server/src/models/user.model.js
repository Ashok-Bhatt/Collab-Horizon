import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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
        trim: true,
    }, 
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true,
    },
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

userSchema.pre("save", async function (next){
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = async function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = async function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema);