import {User} from "../models/user.model.js"
import {Project} from "../models/project.model.js"
import {MainTodo} from "../models/mainTodo.model.js"

import mongoose from "mongoose"

const getUserWithProjects = async (userId, projectFields={}) => {

    return await User.aggregate([

        // First Pipeline : Matching the user through id
        {
            $match : {
                _id : new mongoose.Types.ObjectId(userId),
            }
        }, 

        // Second Pipeline
        {
            $lookup : {
                from : "projects",                  // Collection name
                let : {userId : "$_id"},
                pipeline : [
                    {
                        $match : {
                            $expr: {
                                $gt : [
                                    {
                                        $size : {
                                            $filter : {
                                                input : "$projectGroup",        // Field name which will be visited/traversed
                                                as : "group",                   // Each Element of project group : {groupMember, designation}
                                                cond : {
                                                    $eq : ["$$group.groupMember", "$$userId"]
                                                }
                                            }
                                        }
                                    }, 
                                    0
                                ]
                            }
                        }
                    }
                ],
                as : "projects",
            }
        },

        // Last Pipeline : Exclude password and refreshToken
        {
            $project : projectFields,
        }
    ])
}

const getUserSummary = async (userId, projectFields={}) => {
    return await User.aggregate([
        {
            $match : {
                _id : new mongoose.Schema.Types.ObjectId(userId)
            }
        },
        {
            $project : projectFields,
        }
    ])
}

const getProjectWithFields = async (projectId, authorization=false) => {

    const pipeline = [];

    pipeline.push({
        $match : {
            _id : new mongoose.Types.ObjectId(projectId),
        }
    });

    pipeline.push({
        $lookup : {
            from : "maintodos",
            localField: "_id",
            foreignField: "projectId",
            as: "tasks",
        }
    });

    if (authorization) {
        pipeline.push({
            $lookup : {
                from : "projectrequests",
                localField: "_id",
                foreignField: "requestReceiver",
                as: "projectRequests",
            }
        })
    }

    pipeline.push({
        $project: {
            __v : 0,
        }
    });

    return await Project.aggregate(pipeline);
}

const getTodosWithFields = async (todoId) => {

    return await MainTodo.aggregate([
        {
            $match : {
                _id : new mongoose.Types.ObjectId(todoId),
            }
        },
        {
            $lookup : {
                from : "subtodos",
                localField: "_id",
                foreignField: "todoId",
                as: "subTodos",
            }
        },
        {
            $project: {
                __v : 0,
            }
        },
    ])
}

export {
    getUserWithProjects,
    getUserSummary,
    getTodosWithFields,
    getProjectWithFields,
}