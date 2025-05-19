import {User} from "../models/user.model.js";
import {Project} from "../models/project.model.js";
import {projectRequest} from "../models/projectRequest.model.js";
import {nanoid} from "nanoid";

const createProject = async (req, res) => {

    const loggedInUser = req.user;
    
    const {projectName, projectTagline, projectDescription, startDate, deadline, visibilityStatus, backgroundColor, foregroundColor} = req.body;

    if (!projectName.trim()){
        throw Error("Project name is required!");
    }

    if (!projectTagline.trim()){
        throw Error("Project tagline is required! Kindly enter a one-liner description of project.");
    }

    const newProject = await Project.create({
        projectName,
        projectTagline,
        projectDescription,
        startDate,
        deadline,
        visibilityStatus,
        backgroundColor,
        foregroundColor,
        projectGroup : [                // Initially a project should have only admin, that is the user who created project
            {
                groupMember : loggedInUser._id,
                designation : "Admin",
            }
        ],
        uniqueCode : nanoid(),          // Assigning a unique id to each project
    });

    if (!newProject){
        throw Error("Unable to create new project");
    }

    await newProject.save({validateBeforeSave: false});

    return res.status(200).json({
        status: 200,
        message: "Project Created Successfully",
        newProject,
    })

}


const getProjectInfo = async(req, res) => {

    const projectId = req.params?.projectId;
    const projectVisibility = req.isProjectVisible;

    if (!projectVisibility){
        throw Error("You are not authorized to see the project information.");
    }

    const project = await Project.findById(projectId);

    if (!project){
        throw Error("Invalid project Id");
    }

    return res
    .status(200)
    .json(project);
}


const changeInfo = async (req, res) => {

    const {projectId, projectTagline, projectDescription, startDate, deadline, visibilityStatus, srcCodeLink, backgroundColor, foregroundColor} = req.body;
    const isAdmin = req.isAdmin;

    if (!isAdmin){
        throw Error("You are not authorized to make modifications in this project");
    }

    if (!projectTagline.trim){
        throw Error("Project tagline is required");
    }

    const project = await Project.findById(projectId);

    if (!project){
        throw Error("Invalid Project Id");
    }

    const updatedProject = await Project.findByIdAndUpdate(
        projectId,
        {
            projectTagline,
            projectDescription,
            startDate,
            deadline,
            visibilityStatus,
            srcCodeLink,
            backgroundColor,
            foregroundColor,
        },
        {
            new : true,
        }
    )

    if (!updatedProject){
        throw Error("Couldn't update the project.")
    }

    return res.status(200).json(
        {
            status: 200,
            message: "Updation Successful",
            updatedProject,
        }
    )
}


const removeProject = async(req, res) => {

    const projectId = req.params?.projectId;
    const isAdmin = req.isAdmin;

    if (isAdmin){
        throw Error("You are not authorized to delete this project");
    }

    const project = await findById(projectId);

    if (!project){
        throw Error("Invalid Project Id!");
    }

    deletedProject = await Project.findByIdAndDelete(projectId);

    if (!deletedProject){
        throw Error("Unable to delete project!");
    }

    return res.status(200).json(
        {
            status: 200,
            "message": "projected deleted successfully",
            deletedProject,
        }
    )

}


const toggleVisibilityStatus = async(req, res) => {

    const projectId = req.params?.projectId;
    const isAdmin = req.isAdmin;

    if (!isAdmin){
        throw Error("You are not authorized to change visibility of the project");
    }

    const project = await Project.findByIdAndUpdate(
        projectId,
        {
            visibilityStatus : !visibilityStatus,
        },
        {
            new: true,
        },
    )

    if (!project){
        throw Error("Couldn't delete the project.");
    }

    res.status(200).json(
        {
            status: 200,
            message: "project visibility updated!",
            project,
        }
    )

}


const sendProjectJoiningRequest = async(req, res) => {

    const loggedInUser = req.user;
    const projectCode = req.body.projectCode;
    const requestText = req.body.requestText;

    if (!projectCode || !projectCode.trim()){
        throw Error("Project Code is required")
    }

    const project = await Project.find({projectCode});

    if (!project){
        throw Error("Invalid Project code!");
    }

    const projectRequest = await ProjectRequest.create(
        {
            requestSender: loggedInUser._id,
            requestReceiver: project._id,
            requestText : requestText,
        }
    )

    if (!projectRequest){
        throw Error("Unable to send project joining request");
    }

    return res.status(200).json(
        {
            status: 200,
            message: "Project Joining request sent successfully!"
        }
    )

}


const getAllProjectJoiningRequests = async (req, res) => {

    const isMember = req.isMember;
    const projectId = req.params.projectId;

    if (!isMember){
        throw Error("You are not authorized to see project joining requests.");
    }

    const projectJoiningRequests = await ProjectRequest.findAll(
        {
            requestReceiver : projectId,
        }
    )

    res.status(200).json(projectJoiningRequests);

}


const handleProjectJoiningRequest = async(req, res) => {

    const isAdmin = req.admin;
    const projectId = req.params.projectId;
    const requestId = req.params.requestId;
    const isRequestAccepted = req.params.requestAction;

    if (!isAdmin){
        throw Error("You are not authorized to respond to project joining requests");
    }

    const projectJoiningRequest = await ProjectRequest.findById(requestId);

    if (!projectJoiningRequest){
        throw Error("No project joining request found!");
    }

    if (projectJoiningRequest.requestReceiver !== projectId){
        throw Error("Invalid projectId for given project request");
    }

    if (isRequestAccepted){
        const project = await Project.findById(projectId);
        
        if (!project){
            throw Error("Couldn't find project for given project id!")
        }

        await project.projectGroup.push(
            {
                groupMember: projectJoiningRequest.requestSender,
                designation: "Team Member",
            }
        );

        project.save({validateBeforeSave : false,})
    }

}


export {
    createProject,
    getProjectInfo,
    changeInfo,
    removeProject,
    toggleVisibilityStatus,
    sendProjectJoiningRequest,
    getAllProjectJoiningRequests,

}