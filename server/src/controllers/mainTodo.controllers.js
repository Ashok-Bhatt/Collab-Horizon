import { MainTodo } from "../models/mainTodo.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addTodo = async (req, res) => {

    const isAdmin = req.isAdmin;
    const {projectId, todoTitle, shortDescription, detailedDescription, deadline, priority, status, backgroundColor, foregroundColor} = req.body;

    if (!projectId){
        throw new ApiError(400, "Project Id required!");
    }

    if (!isAdmin){
        throw new ApiError(403, "Not authorized to create todos!");
    }

    const todo = await MainTodo.create(
        {
            title: todoTitle,
            projectId,
            shortDescription,
            detailedDescription,
            deadline,
            priority,
            status,
            backgroundColor,
            foregroundColor,
        }
    )

    if (!todo){
        throw new ApiError(500, "Couldn't create todo!");
    }

    return res.status(201).json(
        new ApiResponse(200, todo, "Todo created successfully!")
    );

}


const removeTodo = async (req, res) => {

    const projectId = req.query?.projectId;
    const todoId = req.query?.todoId;
    const isAdmin = req.isAdmin;

    if (!isAdmin){
        throw new ApiError(403, "You are not authorized to remove todos in this project");
    }

    const todo = await MainTodo.findById(todoId);

    if (!todo){
        throw new ApiError(404, "Invalid todo Id");
    }

    if (!todo.projectId.equals(projectId)){
        throw new ApiError(400, "The projectId of todo is not same as the id provided");
    }

    const deletedTodo = await todo.deleteOne();

    if (!deletedTodo){
        throw new ApiError(404, "Invalid Todo Id");
    }

    return res.status(201).json(
        new ApiResponse(200, deletedTodo, "Todo deleted successfully!")
    );

}


const updateTodo = async (req, res) => {

    const isAdmin = req.isAdmin;
    const {projectId, todoId, todoTitle, shortDescription, detailedDescription, deadline, priority, status, backgroundColor, foregroundColor} = req.body;

    if (!projectId){
        throw new ApiError(400, "Project Id required!");
    }

    if (!isAdmin){
        throw new ApiError(403, "You are not authorized to add a todo to this project");
    }

    const updatedTodo = await MainTodo.findByIdAndUpdate(
        todoId,
        {
            title: todoTitle,
            shortDescription,
            detailedDescription,
            deadline,
            priority,
            status,
            backgroundColor,
            foregroundColor,
        },
        {
            new: true,
        }
    )

    if (!updatedTodo){
        throw new ApiError(500, "Couldn't update todo");
    }

    return res.status(201).json(
        new ApiResponse(200, updatedTodo, "Todo updated successfully!")
    );
}


const getTodos = async (req, res) => {

    const isMember = req.isMember;
    const projectVisibility = req.isProjectVisible;
    const projectId = req.query?.projectId;

    if (!isMember && !projectVisibility){
        throw new ApiError(403, "You are not authorized to get todos of this project");
    }

    const todos = await MainTodo.find(
        {
            projectId,
        }
    )

    if (!todos){
        throw new ApiError(500, "Couldn't access todos");
    }

    return res.status(201).json(
        new ApiResponse(200, todos, "Todos fetched successfully!")
    );

}


const changeProgressStatus = (req, res) => {

    

}


const changeTodoPriority = async (req, res) => {

    const projectId = req.query?.projectId;
    const todoId = req.query?.todoId;
    const isAdmin = req.isAdmin;
    const todoPriority = req.query?.todoPriority;

    if (!isAdmin){
        throw new ApiError(403, "You are not authorized to remove todos in this project");
    }

    const todo = await MainTodo.findById(todoId);

    if (!todo){
        throw new ApiError(404, "Invalid Todo Id");
    }

    if (!todo.projectId.equals(projectId)){
        throw new ApiError(400, "The projectId of todo is not same as the id provided");
    }

    if (todoPriority === null){
        throw new ApiError(400, "priority of todo is required");
    } else if (todoPriority!=="High" && todoPriority!=="Medium" && todoPriority!=="Low"){
        throw new ApiError(400, "priority of todo can have only these values: Low, Medium , High");
    }

    todo.priority = todoPriority;
    todo.save({validateBeforeSave: false});

    return res.status(201).json(
        new ApiResponse(200, todo, `Priority of todo changed to ${todo.priority}`)
    );

}


export {
    addTodo,
    removeTodo,
    updateTodo,
    getTodos,
    changeProgressStatus,
    changeTodoPriority,
}