import { MainTodo } from "../models/mainTodo.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { getTodosWithFields } from "../utils/aggregationPipeline.js";

const getTodoInfo = async (req, res) => {
    try{
        const todoId = req.query?.todoId;
        const projectVisibility = req.isProjectVisible;
        const isMember = req.isMember;

        if (!projectVisibility && !isMember) return res.status(403).json(new ApiResponse(403, null, "You are not authorized to see the todo information."));

        const todo = await getTodosWithFields(todoId);
        if (!todo) return res.status(404).json(new ApiResponse(404, null, "Invalid Todo Id"));

        return res.status(200).json(new ApiResponse(200, todo, "Todo info fetched successfully"));
    } catch (error){
        console.log("Error in mainTodo controller", error);
        res.status(500).json(new ApiResponse(500, null, "Something went wrong!"));
    }
};


const addTodo = async (req, res) => {
    try {
        const isAdmin = req.isAdmin;
        const { projectId, todoTitle, shortDescription, detailedDescription, deadline, priority, status } = req.body;

        if (!projectId) return res.status(400).json(new ApiResponse(400, null, "Project Id required!"));
        if (!isAdmin) return res.status(403).json(new ApiResponse(403, null, "Not authorized to create todos!"));

        const todo = await MainTodo.create({
            title: todoTitle,
            projectId,
            shortDescription,
            detailedDescription,
            deadline,
            priority,
            status,
        });

        if (!todo) return res.status(500).json(new ApiResponse(500, null, "Couldn't create todo!"));

        return res.status(201).json(new ApiResponse(201, todo, "Todo created successfully!"));
    } catch (error) {
        console.log("Error in mainTodo controller", error);
        return res.status(500).json(new ApiResponse(500, null, "Something went wrong!"));
    }
};


const removeTodo = async (req, res) => {
    try {
        const projectId = req.query?.projectId;
        const todoId = req.query?.todoId;
        const isAdmin = req.isAdmin;

        if (!isAdmin) return res.status(403).json(new ApiResponse(403, null, "You are not authorized to remove todos in this project"));

        const todo = await MainTodo.findById(todoId);

        if (!todo) return res.status(404).json(new ApiResponse(404, null, "Invalid todo Id"));

        if (!todo.projectId.equals(projectId)) return res.status(400).json(new ApiResponse(400, null, "The projectId of todo is not same as the id provided"));

        const deletedTodo = await todo.deleteOne();

        return res.status(200).json(new ApiResponse(200, deletedTodo, "Todo deleted successfully!"));
    } catch (error) {
        console.log("Error in mainTodo controller", error);
        return res.status(500).json(new ApiResponse(500, null, "Something went wrong!"));
    }
};


const updateTodo = async (req, res) => {
    try {
        const isAdmin = req.isAdmin;
        const { projectId, todoId, todoTitle, shortDescription, detailedDescription, deadline, priority, status } = req.body;

        if (!projectId) return res.status(400).json(new ApiResponse(400, null, "Project Id required!"));

        if (!isAdmin) return res.status(403).json(new ApiResponse(403, null, "You are not authorized to update this todo"));

        const updatedTodo = await MainTodo.findByIdAndUpdate(
            todoId,
            { title: todoTitle, shortDescription, detailedDescription, deadline, priority, status },
            { new: true }
        );

        if (!updatedTodo) return res.status(500).json(new ApiResponse(500, null, "Couldn't update todo"));

        return res.status(200).json(new ApiResponse(200, updatedTodo, "Todo updated successfully"));
    } catch (error) {
        console.log("Error in mainTodo controller", error);
        return res.status(500).json(new ApiResponse(500, null, "Something went wrong!"));
    }
};


const getTodos = async (req, res) => {
    try {
        const isMember = req.isMember;
        const projectVisibility = req.isProjectVisible;
        const projectId = req.query?.projectId;

        if (!isMember && !projectVisibility) return res.status(403).json(new ApiResponse(403, null, "You are not authorized to get todos of this project"));

        const todos = await MainTodo.find({ projectId });

        if (!todos) return res.status(500).json(new ApiResponse(500, null, "Couldn't access todos"));

        return res.status(200).json(new ApiResponse(200, todos, "Todos fetched successfully"));
    } catch (error) {
        console.log("Error in mainTodo controller", error);
        return res.status(500).json(new ApiResponse(500, null, "Something went wrong!"));
    }
};


const changeTodoPriority = async (req, res) => {
    try {
        const projectId = req.query?.projectId;
        const todoId = req.query?.todoId;
        const isAdmin = req.isAdmin;
        const todoPriority = req.query?.todoPriority;

        if (!isAdmin) return res.status(403).json(new ApiResponse(403, null, "You are not authorized to change todo priority in this project"));

        const todo = await MainTodo.findById(todoId);

        if (!todo) return res.status(404).json(new ApiResponse(404, null, "Invalid Todo Id"));

        if (!todo.projectId.equals(projectId)) return res.status(400).json(new ApiResponse(400, null, "The projectId of todo is not same as the id provided"));

        if (!todoPriority) return res.status(400).json(new ApiResponse(400, null, "priority of todo is required"));

        if (!["High", "Medium", "Low"].includes(todoPriority)) return res.status(400).json(new ApiResponse(400, null, "priority of todo can only be: Low, Medium, High"));

        todo.priority = todoPriority;
        await todo.save({ validateBeforeSave: false });

        return res.status(200).json(new ApiResponse(200, todo, `Priority of todo changed to ${todo.priority}`));
    } catch (error) {
        console.log("Error in mainTodo controller", error);
        return res.status(500).json(new ApiResponse(500, null, "Something went wrong!"));
    }
};


export {
    getTodoInfo,
    addTodo,
    removeTodo,
    updateTodo,
    getTodos,
    changeProgressStatus,
    changeTodoPriority,
}