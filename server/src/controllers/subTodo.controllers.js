import { SubTodo } from "../models/subTodo.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const addSubTodo = async (req, res) => {
    try {
        const isAdmin = req.isAdmin;
        const { projectId, todoId, subTodoTitle, description, status } = req.body;

        if (!projectId) return res.status(400).json(new ApiResponse(400, null, "Project Id required!"));

        if (!isAdmin) return res.status(403).json(new ApiResponse(403, null, "You are not authorized to add a todo to this project"));

        const subTodo = await SubTodo.create({
            title: subTodoTitle,
            projectId,
            todoId,
            description,
            status,
        });

        if (!subTodo) return res.status(500).json(new ApiResponse(500, null, "Couldn't create todo"));

        return res.status(201).json(new ApiResponse(200, subTodo, "Todo created successfully"));
    } catch (error) {
        console.log("Error in subTodo controller", error);
        return res.status(500).json(new ApiResponse(500, null, "Something went wrong!"));
    }
};


const removeSubTodo = async (req, res) => {
    try {
        const projectId = req.query?.projectId;
        const subTodoId = req.query?.subTodoId;
        const isAdmin = req.isAdmin;

        if (!isAdmin) return res.status(403).json(new ApiResponse(403, null, "You are not authorized to remove todos in this project"));

        const subTodo = await SubTodo.findById(subTodoId);

        if (!subTodo) return res.status(404).json(new ApiResponse(404, null, "Invalid Todo Id"));

        if (!subTodo.projectId.equals(projectId)) return res.status(400).json(new ApiResponse(400, null, "The projectId of todo is not same as the id provided"));

        const deletedSubTodo = await subTodo.deleteOne();

        return res.status(200).json(new ApiResponse(200, deletedSubTodo, "Todo deleted successfully"));
    } catch (error) {
        console.log("Error in subTodo controller", error);
        return res.status(500).json(new ApiResponse(500, null, "Something went wrong!"));
    }
};


const updateSubTodo = async (req, res) => {
    try {
        const isAdmin = req.isAdmin;
        const { projectId, subTodoId, subTodoTitle, description, status } = req.body;

        if (!projectId) return res.status(400).json(new ApiResponse(400, null, "Project Id required!"));

        if (!isAdmin) return res.status(403).json(new ApiResponse(403, null, "You are not authorized to add a todo to this project"));

        const updatedSubTodo = await SubTodo.findByIdAndUpdate(
            subTodoId,
            {
                title: subTodoTitle,
                description,
                status,
            },
            { new: true }
        );

        if (!updatedSubTodo) return res.status(500).json(new ApiResponse(500, null, "Couldn't update todo"));

        return res.status(200).json(new ApiResponse(200, updatedSubTodo, "Todo updated successfully"));
    } catch (error) {
        console.log("Error in subTodo controller", error);
        return res.status(500).json(new ApiResponse(500, null, "Something went wrong!"));
    }
};


const getSubTodos = async (req, res) => {
    try {
        const isMember = req.isMember;
        const projectVisibility = req.isProjectVisible;
        const todoId = req.query?.todoId;

        if (!isMember && !projectVisibility) return res.status(403).json(new ApiResponse(403, null, "You are not authorized to get todos of this project"));

        const subTodos = await SubTodo.find({ todoId });

        if (!subTodos) return res.status(500).json(new ApiResponse(500, null, "Couldn't access todos"));

        return res.status(200).json(new ApiResponse(200, subTodos, "Todos fetched successfully"));
    } catch (error) {
        console.log("Error in subTodo controller", error);
        return res.status(500).json(new ApiResponse(500, null, "Something went wrong!"));
    }
};


const changeProgressStatus = async (req, res) => {
    try {
        const projectId = req.query?.projectId;
        const subTodoId = req.query?.subTodoId;
        const isMember = req.isMember;
        const subTodoStatus = req.query?.todoPriority;

        if (!isMember) return res.status(403).json(new ApiResponse(403, null, "You are not authorized to modify todos in this project"));

        if (subTodoStatus === null) return res.status(400).json(new ApiResponse(400, null, "status of todo is required"));

        if (subTodoStatus !== "Done" && subTodoStatus !== "Todo" && subTodoStatus !== "Pending") return res.status(400).json(new ApiResponse(400, null, "status of todo can have only these values: Done, Todo and Pending"));

        const subTodo = await SubTodo.findById(subTodoId);

        if (!subTodo) return res.status(404).json(new ApiResponse(404, null, "Invalid Todo Id"));

        if (!subTodo.projectId.equals(projectId)) return res.status(400).json(new ApiResponse(400, null, "The projectId of todo is not same as the id provided"));

        subTodo.status = subTodoStatus;
        await subTodo.save({ validateBeforeSave: false });

        return res.status(200).json(new ApiResponse(200, subTodo, "Priority of todo changed successfully"));
    } catch (error) {
        console.log("Error in subTodo controller", error);
        return res.status(500).json(new ApiResponse(500, null, "Something went wrong!"));
    }
};


export {
    addSubTodo,
    removeSubTodo,
    updateSubTodo,
    getSubTodos,
    changeProgressStatus,
}
