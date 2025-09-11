import { Project } from "../models/project.model.js";
import { ProjectRequest } from "../models/projectRequest.model.js";
import { nanoid } from "nanoid";
import { getProjectWithFields } from "../utils/aggregationPipeline.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import axios from "axios";
import { SERVER_URL } from "../config/config.js";
import { User } from "../models/user.model.js";

const createProject = async (req, res) => {
    try {
        const loggedInUser = req.user;
        const { projectName, projectTagline, projectDescription, startDate, deadline, visibilityStatus } = req.body;

        let projectImage, projectImageUrl;
        if (req.files && req.files.projectImage) {
            if (Array.isArray(req.files.projectImage) && req.files.projectImage.length > 0) {
                projectImage = req.files.projectImage[0].path;
            } else {
                projectImage = req.files.projectImage.path;
            }
        }

        if (!projectName?.trim()) return res.status(400).json(new ApiResponse(400, null, "Project name is required!"));

        if (!projectTagline?.trim()) return res.status(400).json(new ApiResponse(400, null, "Project tagline is required! Kindly enter a one-liner description of project."));

        if (projectImage) {
            const imageUploadResponse = await uploadOnCloudinary(projectImage);
            if (imageUploadResponse) {
                projectImageUrl = imageUploadResponse.url;
            }
        }

        const newProject = await Project.create({
            projectName,
            projectTagline,
            projectDescription,
            projectImage: projectImageUrl,
            startDate,
            deadline,
            visibilityStatus,
            projectGroup: [
                {
                    groupMember: loggedInUser._id,
                    designation: "Admin",
                },
            ],
            uniqueCode: nanoid(),
        });

        if (!newProject) return res.status(500).json(new ApiResponse(500, null, "Unable to create new project"));

        await newProject.save({ validateBeforeSave: false });

        return res.status(201).json(new ApiResponse(201, newProject, "Project created successfully!"));
    } catch (error) {
        console.log("Error in project controller", error);
        return res.status(500).json(new ApiResponse(500, null, "Something went wrong!"));
    }
};


const getProjectInfo = async (req, res) => {
    try {
        const projectId = req.query?.projectId;
        const projectVisibility = req.isProjectVisible;
        const isMember = req.isMember;

        if (!projectVisibility && !isMember) return res.status(403).json(new ApiResponse(403, null, "You are not authorized to see the project information."));

        const project = await getProjectWithFields(projectId, isMember);

        if (!project) return res.status(404).json(new ApiResponse(404, null, "Invalid project Id"));

        return res.status(200).json(new ApiResponse(200, project, "Project info fetched successfully"));
    } catch (error) {
        console.log("Error in project controller", error);
        return res.status(500).json(new ApiResponse(500, null, "Something went wrong!"));
    }
};


const changeInfo = async (req, res) => {
    try {
        const { projectId, projectName, projectImage, projectTagline, projectDescription, startDate, deadline, visibilityStatus, srcCodeLink } = req.body;
        const isAdmin = req.isAdmin;

        if (!isAdmin) return res.status(403).json(new ApiResponse(403, null, "You are not authorized to make modifications in this project"));

        if (!projectTagline?.trim()) return res.status(400).json(new ApiResponse(400, null, "Project tagline is required"));

        const project = await Project.findById(projectId);

        if (!project) return res.status(404).json(new ApiResponse(404, null, "Invalid Project Id"));

        const updatedProject = await Project.findByIdAndUpdate(
            projectId,
            {
                projectName,
                projectImage,
                projectTagline,
                projectDescription,
                startDate,
                deadline,
                visibilityStatus,
                srcCodeLink,
            },
            { new: true }
        );

        if (!updatedProject) return res.status(500).json(new ApiResponse(500, null, "Couldn't update the project."));

        return res.status(200).json(new ApiResponse(200, updatedProject, "Project updated successfully!"));
    } catch (error) {
        console.log("Error in project controller", error);
        return res.status(500).json(new ApiResponse(500, null, "Something went wrong!"));
    }
};


const removeProject = async (req, res) => {
    try {
        const projectId = req.query?.projectId;
        const isAdmin = req.isAdmin;

        if (!isAdmin) return res.status(403).json(new ApiResponse(403, null, "You are not authorized to delete this project"));

        const project = await Project.findById(projectId);

        if (!project) return res.status(404).json(new ApiResponse(404, null, "Invalid Project Id!"));

        const deletedProject = await Project.findByIdAndDelete(projectId);

        if (!deletedProject) return res.status(500).json(new ApiResponse(500, null, "Unable to delete project!"));

        return res.status(200).json(new ApiResponse(200, deletedProject, "Project deleted successfully"));
    } catch (error) {
        console.log("Error in project controller", error);
        return res.status(500).json(new ApiResponse(500, null, "Something went wrong!"));
    }
};


const toggleVisibilityStatus = async (req, res) => {
    try {
        const projectId = req.query?.projectId;
        const isAdmin = req.isAdmin;

        if (!isAdmin) return res.status(403).json(new ApiResponse(403, null, "You are not authorized to change visibility of the project"));

        const project = await Project.findById(projectId);

        if (!project) return res.status(404).json(new ApiResponse(404, null, "Couldn't find the project."));

        project.visibilityStatus = !project.visibilityStatus;
        await project.save({ validateBeforeSave: false });

        return res.status(200).json(new ApiResponse(200, project, "Project visibility updated!"));
    } catch (error) {
        console.log("Error in project controller", error);
        return res.status(500).json(new ApiResponse(500, null, "Something went wrong!"));
    }
};


const sendProjectJoiningRequest = async (req, res) => {
    try {
        const loggedInUser = req.user;
        const projectCode = req.body.projectCode;
        const requestText = req.body.requestText;

        if (!projectCode?.trim()) return res.status(400).json(new ApiResponse(400, null, "Project Code is required"));

        const project = await Project.findOne({ uniqueCode: projectCode });

        if (!project) return res.status(404).json(new ApiResponse(404, null, "Invalid Project code!"));

        for (let i = 0; i < project.projectGroup.length; i++) {
            if (project.projectGroup[i].groupMember.toString() === loggedInUser._id.toString()) {
                return res.status(403).json(new ApiResponse(403, null, "Users already in the project group cannot send project joining requests."));
            }
        }

        const searchedProjectRequest = await ProjectRequest.findOne({
            requestSender: loggedInUser._id,
            requestReceiver: project._id,
        });

        if (searchedProjectRequest) return res.status(403).json(new ApiResponse(403, null, "User cannot make another project joining request to the project until previous request is not resolved"));

        const projectRequest = await ProjectRequest.create({
            requestSender: loggedInUser._id,
            requestReceiver: project._id,
            requestText: requestText,
        });

        if (!projectRequest) return res.status(500).json(new ApiResponse(500, null, "Unable to send project joining request"));

        return res.status(200).json(new ApiResponse(200, projectRequest, "Project Joining request sent successfully!"));
    } catch (error) {
        console.log("Error in project controller", error);
        return res.status(500).json(new ApiResponse(500, null, "Something went wrong!"));
    }
};


const getAllProjectJoiningRequests = async (req, res) => {
    try {
        const isMember = req.isMember;
        const projectId = req.query?.projectId;

        if (!isMember) return res.status(403).json(new ApiResponse(403, null, "You are not authorized to see project joining requests."));

        const projectJoiningRequests = await ProjectRequest.find({ requestReceiver: projectId });

        return res.status(200).json(new ApiResponse(200, projectJoiningRequests, "Fetched all project joining requests!"));
    } catch (error) {
        console.log("Error in project controller", error);
        return res.status(500).json(new ApiResponse(500, null, "Something went wrong!"));
    }
};


const handleProjectJoiningRequest = async (req, res) => {
    try {
        const isAdmin = req.isAdmin;
        const projectId = req.query?.projectId;
        const requestId = req.query?.requestId;
        const isRequestAccepted = req.query?.isRequestAccepted;
        const user = req.user;

        if (!isAdmin) return res.status(403).json(new ApiResponse(403, null, "You are not authorized to respond to project joining requests"));

        if (!requestId) return res.status(400).json(new ApiResponse(400, null, "Request ID is required"));

        const projectJoiningRequest = await ProjectRequest.findById(requestId);

        if (!projectJoiningRequest) return res.status(404).json(new ApiResponse(404, null, "No project joining request found!"));

        if (!projectJoiningRequest.requestReceiver.equals(projectId)) return res.status(400).json(new ApiResponse(400, null, "Invalid projectId for given project request"));

        const project = await Project.findById(projectId);
        const requestSender = await User.findById(projectJoiningRequest.requestSender);

        if (!project) return res.status(404).json(new ApiResponse(404, null, "Couldn't find project for given project id!"));

        if (isRequestAccepted === "true") {
            project.projectGroup.push({
                groupMember: projectJoiningRequest.requestSender,
                designation: "Team Member",
            });

            await project.save({ validateBeforeSave: false });
        }

        axios
            .post(`${SERVER_URL}/api/v1/notification/sendNotification`, {
                notificationReceiver: projectJoiningRequest.requestSender,
                notificationMessage: `${user.username} ${isRequestAccepted === "true" ? "accepted" : "rejected"} your request for project - ${project.projectName}`,
            })
            .catch(() => {});

        const deleteResponse = await projectJoiningRequest.deleteOne();

        if (!deleteResponse) return res.status(500).json(new ApiResponse(500, null, "Unable to remove project joining request."));

        return res.status(200).json(new ApiResponse(200, null, `Your project joining request ${isRequestAccepted === "true" ? "accepted" : "rejected"}.`));
    } catch (error) {
        console.log("Error in project controller", error);
        return res.status(500).json(new ApiResponse(500, null, "Something went wrong!"));
    }
};


export {
    createProject,
    getProjectInfo,
    changeInfo,
    removeProject,
    toggleVisibilityStatus,
    sendProjectJoiningRequest,
    getAllProjectJoiningRequests,
    handleProjectJoiningRequest,
};
