import { Project } from "../models/project.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const checkUserAuthorization = async (req, res, next) => {
    try {
        const user = req.user;
        const projectId = req.query?.projectId || req.body?.projectId;

        if (!projectId || !projectId.trim()) {
            return res
                .status(400)
                .json(new ApiResponse(400, {}, "Project Id is required"));
        }

        const project = await Project.findById(projectId);

        if (!project) {
            return res
                .status(404)
                .json(new ApiResponse(404, {}, "Invalid Project Id"));
        }

        const projectMembers = project.projectGroup;
        const projectAdmins = projectMembers.filter(
            (member) => member.designation === "Admin"
        );

        let isAdmin = false;
        let isMember = false;

        for (let admin of projectAdmins) {
            if (admin.groupMember.equals(user._id)) {
                isAdmin = true;
                break;
            }
        }

        for (let member of projectMembers) {
            if (member.groupMember.equals(user._id)) {
                isMember = true;
                break;
            }
        }

        req.isAdmin = isAdmin;
        req.isMember = isMember;
        next();
    } catch (error) {
        return res
            .status(404)
            .json(new ApiResponse(404, {}, "Valid Project Code Required!"));
    }
};

export { checkUserAuthorization };
