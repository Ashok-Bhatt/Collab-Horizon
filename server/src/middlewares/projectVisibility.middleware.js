import { Project } from "../models/project.model.js";
import { ApiError } from "../utils/ApiError.js";


const checkProjectVisibility = async (req, res, next) => {

    try{
        const projectId = req.query?.projectId || req.body?.projectId;
        const project = await Project.findById(projectId);
        
        if (!project){
            throw new ApiError(statusCode=404, message="Invalid Project Id");
        }

        const visibility = project.visibilityStatus;

        req.isProjectVisible = visibility;
        next();

    } catch (error){
        throw new ApiError(statusCode=404, message="Invalid Project Id");
    }
}

export {
    checkProjectVisibility,
}