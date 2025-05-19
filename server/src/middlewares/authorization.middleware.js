import { Project } from "../models/project.model.js";


const checkUserAuthorization = async (req, res, next) => {

    try{
        const user = req.user;
        const projectId = req.params?.projectId || req.body?.projectId;

        if (!!projectId || projectId.trim()){
            throw Error("Project Id is required");
        }

        const project = await Project.findById(projectId);
        
        if (!project){
            throw Error("Invalid Project Id");
        }

        const projectMembers = project.projectGroup;
        const projectAdmins = project.projectGroup.filter((member) => member.designation == "Admin");

        let isAdmin = false;
        let isMember = false;

        for (let admin in projectAdmins){
            if (admin.groupMember == user._id){
                isAdmin = true;
                break;
            }
        }

        for (let member in projectMembers){
            if (member.groupMember === user._id){
                isMember = true;
                break;
            }
        }

        res.isAdmin = isAdmin;
        res.isMember = isMember;
        next();

    } catch (error){
        throw Error("Something went wrong! ", error);
    }
}

export {
    checkUserAuthorization,
}