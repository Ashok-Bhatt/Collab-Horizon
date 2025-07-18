import {Project} from "../models/project.model.js";
import {ProjectRequest} from "../models/projectRequest.model.js";
import {nanoid} from "nanoid";
import {getProjectWithFields} from "../utils/aggregationPipeline.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"

const createProject = async (req, res) => {

    const loggedInUser = req.user;
    
    const {projectName, projectTagline, projectDescription, startDate, deadline, visibilityStatus, backgroundColor, foregroundColor} = req.body;

    let projectImage, projectImageUrl;
    if (req.files && req.files.projectImage){
        if (Array.isArray(req.files.projectImage) && req.files.projectImage.length > 0){
            projectImage = req.files.projectImage[0].path;
        } else {
            projectImage = req.files.projectImage.path;
        }
    }

    if (!projectName.trim()){
        throw new ApiError(400, "Project name is required!");
    }

    if (!projectTagline.trim()){
        throw new ApiError(400, "Project tagline is required! Kindly enter a one-liner description of project.");
    }

    if (projectImage){
        const imageUploadResponse = await uploadOnCloudinary(projectImage);
        if (imageUploadResponse){
            projectImageUrl = imageUploadResponse.url;
        }
    }

    const newProject = await Project.create({
        projectName,
        projectTagline,
        projectDescription,
        projectImage : projectImageUrl,
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
        throw new ApiError(500, "Unable to create new project");
    }

    await newProject.save({validateBeforeSave: false});

    return res.status(201).json(
        new ApiResponse(200, newProject, `Project created successfully!`)
    );

}


const getProjectInfo = async(req, res) => {

    const projectId = req.query?.projectId;
    const projectVisibility = req.isProjectVisible;
    const isMember = req.isMember;

    if (!projectVisibility && !isMember){
        throw new ApiError(403, "You are not authorized to see the project information.");
    }

    const project = await getProjectWithFields(projectId, isMember);

    if (!project){
        throw new ApiError(404, "Invalid project Id");
    }

    return res
    .status(200)
    .json(new ApiResponse(200, project, "Project info fetched successfully"));
}


const changeInfo = async (req, res) => {

    const {projectId, projectTagline, projectDescription, startDate, deadline, visibilityStatus, srcCodeLink, backgroundColor, foregroundColor} = req.body;
    const isAdmin = req.isAdmin;

    if (!isAdmin){
        throw new ApiError(403, "You are not authorized to make modifications in this project");
    }

    if (!projectTagline.trim){
        throw new ApiError(400, "Project tagline is required");
    }

    const project = await Project.findById(projectId);

    if (!project){
        throw new ApiError(404, "Invalid Project Id");
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
        throw new ApiError(500, "Couldn't update the project.")
    }

    return res.status(201).json(
        new ApiResponse(200, updatedProject, `Project updated successfully!`)
    );
}


const removeProject = async(req, res) => {

    const projectId = req.query?.projectId;
    const isAdmin = req.isAdmin;

    if (!isAdmin){
        throw new ApiError(403, "You are not authorized to delete this project");
    }

    const project = await Project.findById(projectId);

    if (!project){
        throw new ApiError(404, "Invalid Project Id!");
    }

    const deletedProject = await Project.findByIdAndDelete(projectId);

    if (!deletedProject){
        throw new ApiError(500, "Unable to delete project!");
    }

    return res.status(201).json(
        new ApiResponse(200, deletedProject, "project deleted successfully")
    );

}


const toggleVisibilityStatus = async(req, res) => {

    const projectId = req.query?.projectId;
    const isAdmin = req.isAdmin;

    if (!isAdmin){
        throw new ApiError(403, "You are not authorized to change visibility of the project");
    }

    const project = await Project.findById(projectId);

    if (!project){
        throw new ApiError(404, "Couldn't delete the project.");
    }

    project.visibilityStatus = !project.visibilityStatus;
    project.save({validateBeforeSave: false});

    res.status(201).json(
        new ApiResponse(200, project, "project visibility updated!")
    );

}


const sendProjectJoiningRequest = async(req, res) => {

    const loggedInUser = req.user;
    const projectCode = req.body.projectCode;
    const requestText = req.body.requestText;

    if (!projectCode || !projectCode.trim()){
        throw new ApiError(400, "Project Code is required")
    }

    const project = await Project.findOne({
        uniqueCode : projectCode,
    });

    if (!project){
        throw new ApiError(404, "Invalid Project code!");
    }

    const projectRequest = await ProjectRequest.create(
        {
            requestSender: loggedInUser._id,
            requestReceiver: project._id,
            requestText : requestText,
        }
    )

    if (!projectRequest){
        throw new ApiError(500, "Unable to send project joining request");
    }

    return res.status(200).json(
        new ApiResponse(200, projectRequest, "Project Joining request sent successfully!")
    );

}


const getAllProjectJoiningRequests = async (req, res) => {

    const isMember = req.isMember;
    const projectId = req.query?.projectId;

    if (!isMember){
        throw new ApiError(403, "You are not authorized to see project joining requests.");
    }

    const projectJoiningRequests = await ProjectRequest.find(
        {
            requestReceiver : projectId,
        }
    )

    res.status(201).json(
        new ApiResponse(200, projectJoiningRequests, "fetched all project joining requests!")
    );

}


const handleProjectJoiningRequest = async(req, res) => {

    const isAdmin = req.isAdmin;
    const projectId = req.query?.projectId;
    const requestId = req.query?.requestId;
    const isRequestAccepted = req.query?.requestAction;

    if (!isAdmin){
        throw new ApiError(403, "You are not authorized to respond to project joining requests");
    }

    const projectJoiningRequest = await ProjectRequest.findById(requestId);

    if (!projectJoiningRequest){
        throw new ApiError(404, "No project joining request found!");
    }

    if (!projectJoiningRequest.requestReceiver.equals(projectId)){
        throw new ApiError(400, "Invalid projectId for given project request");
    }

    if (isRequestAccepted === "true"){
        const project = await Project.findById(projectId);
        
        if (!project){
            throw new ApiError(404, "Couldn't find project for given project id!")
        }

        project.projectGroup.push(
            {
                groupMember: projectJoiningRequest.requestSender,
                designation: "Team Member",
            }
        );

        project.save({validateBeforeSave : false});
    }

    const deleteResponse = await projectJoiningRequest.deleteOne();

    if (!deleteResponse){
        throw new ApiError(500, "Unable to remove project joining request.");
    }

    res.status(201).json(
        {
            status: 200,
            message: `Your project joining request ${isRequestAccepted==='true' ? 'accepted' : 'rejected'}.`
        }
    )

}


export {
    createProject,
    getProjectInfo,
    changeInfo,
    removeProject,
    toggleVisibilityStatus,
    sendProjectJoiningRequest,
    getAllProjectJoiningRequests,
    handleProjectJoiningRequest,
}