import { SubTodo } from "../models/subTodo.model.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addSubTodo = async (req, res) => {

    const isAdmin = req.isAdmin;
    const {projectId, todoId, subTodoTitle, description, deadline, status, backgroundColor, foregroundColor} = req.body;

    if (!projectId){
        throw new ApiError(400, "Project Id required!");
    }

    if (!isAdmin){
        throw new ApiError(403, "You are not authorized to add a todo to this project");
    }

    const subTodo = await SubTodo.create(
        {
            title: subTodoTitle,
            projectId,
            todoId,
            description,
            deadline,
            status,
            backgroundColor,
            foregroundColor,
        }
    )

    if (!subTodo){
        throw new ApiError(500, "Couldn't create todo");
    }

    return res.status(201).json(
        new ApiResponse(200, subTodo, "Todo created successfully")
    );

}


const removeSubTodo = async (req, res) => {

    const projectId = req.query?.projectId;
    const subTodoId = req.query?.subTodoId;
    const isAdmin = req.isAdmin;

    if (!isAdmin){
        throw new ApiError(403, "You are not authorized to remove todos in this project");
    }

    const subTodo = await SubTodo.findById(subTodoId);

    if (!subTodo){
        throw new ApiError(404, "Invalid Todo Id");
    }

    if (!subTodo.projectId.equals(projectId)){
        throw new ApiError(400, "The projectId of todo is not same as the id provided");
    }

    const deletedSubTodo = await subTodo.deleteOne();

    return res.status(200).json(
        new ApiResponse(200, deletedSubTodo, "Todo deleted successfully")
    )

}


const updateSubTodo = async (req, res) => {

    const isAdmin = req.isAdmin;
    const {projectId, subTodoId, subTodoTitle, description, deadline, status, backgroundColor, foregroundColor} = req.body;

    if (!projectId){
        throw new ApiError(400, "Project Id required!");
    }

    if (!isAdmin){
        throw new ApiError(403, "You are not authorized to add a todo to this project");
    }

    const updatedSubTodo = await SubTodo.findByIdAndUpdate(
        subTodoId,
        {
            title: subTodoTitle,
            description,
            deadline,
            status,
            backgroundColor,
            foregroundColor,
        },
        {
            new: true,
        }
    )

    if (!updatedSubTodo){
        throw new ApiError(500, "Couldn't create todo");
    }

    return res.status(200).json(
        new ApiResponse(200, updatedSubTodo, "Todo updated successfully")
    );

}


const getSubTodos = async (req, res) => {

    const isMember = req.isMember;
    const projectVisibility = req.isProjectVisible;
    const todoId = req.query?.todoId;

    if (!isMember && !projectVisibility){
        throw new ApiError(403, "You are not authorized to get todos of this project");
    }

    const subTodos = await SubTodo.find(
        {
            todoId,
        }
    )

    if (!subTodos){
        throw new ApiError(500, "Couldn't access todos");
    }

    res.status(200).json(
        new ApiResponse(200, subTodos, "Todos fetched successfully")
    )
}


const changeProgressStatus = async (req, res) => {

    const projectId = req.query?.projectId;
    const subTodoId = req.query?.subTodoId;
    const isMember = req.isMember;
    const subTodoStatus = req.query?.todoPriority;

    if (!isMember){
        throw new ApiError(403, "You are not authorized to remove todos in this project");
    }

    if (subTodoStatus === null){
        throw new ApiError(400, "status of todo is required");
    } 
    
    if (subTodoStatus!=="Done" && subTodoStatus!=="Todo" && subTodoStatus!=="Pending"){
        throw new ApiError(400, "status of todo can have only these values: Done, Todo and Pending");
    }

    const subTodo = await SubTodo.findById(subTodoId);

    if (!subTodo){
        throw new ApiError(404, "Invalid Todo Id");
    }

    if (!subTodo.projectId.equals(projectId)){
        throw new ApiError(400, "The projectId of todo is not same as the id provided");
    }

    subTodo.status = subTodoStatus;
    subTodo.save({validateBeforeSave: false});

    return res.status(200).json(
        new ApiResponse(200, subTodo, "Priority of todo changed successfully")
    )

}


export {
    addSubTodo,
    removeSubTodo,
    updateSubTodo,
    getSubTodos,
    changeProgressStatus,
}