import { Project } from "../models/project.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const checkProjectVisibility = async (req, res, next) => {
    try {
        const projectId = req.query?.projectId || req.body?.projectId;
        if (!projectId || !projectId.trim()) return res.status(400).json(new ApiResponse(400, {}, "Project Id is required"));

        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json(new ApiResponse(404, null, "Invalid Project Id"));

        req.isProjectVisible = project.visibilityStatus;
        next();
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, "Something went wrong while checking project visibility"));
    }
};

export {
    checkProjectVisibility,
};
