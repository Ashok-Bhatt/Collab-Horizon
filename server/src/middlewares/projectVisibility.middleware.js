import { Project } from "../models/project.model.js";


const checkProjectVisibility = async (req, res, next) => {

    try{
        const projectId = req.query?.projectId || req.body?.projectId;
        const project = await Project.findById(projectId);
        
        if (!project){
            throw Error("Invalid Project Id");
        }

        const visibility = project.visibilityStatus;

        req.isProjectVisible = visibility;
        next();

    } catch (error){
        throw Error("Something went wrong! ", error);
    }
}

export {
    checkProjectVisibility,
}