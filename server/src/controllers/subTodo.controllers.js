import { SubTodo } from "../models/subTodo.model.js"
import { MainTodo } from "../models/mainTodo.model.js"

const addSubTodo = async (req, res) => {

    const isAdmin = req.isAdmin;
    const {projectId, todoId, subTodoTitle, description, deadline, status, backgroundColor, foregroundColor} = req.body;

    if (!projectId){
        throw Error("Project Id required!");
    }

    if (!isAdmin){
        throw Error("You are not authorized to add a todo to this project");
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
        throw Error("Couldn't create todo");
    }

    return res.status(200).json(
        {
            status: 200,
            message: "Todo created successfully",
            subTodo,
        }
    );

}


const removeSubTodo = async (req, res) => {

    const projectId = req.query?.projectId;
    const subTodoId = req.query?.subTodoId;
    const isAdmin = req.isAdmin;

    if (!isAdmin){
        throw Error("You are not authorized to remove todos in this project");
    }

    const subTodo = await SubTodo.findById(subTodoId);

    if (!subTodo){
        throw Error("Invalid Todo Id");
    }

    if (!subTodo.projectId.equals(projectId)){
        throw Error("The projectId of todo is not same as the id provided");
    }

    const deletedSubTodo = await subTodo.deleteOne();

    return res.status(200).json(
        {
            status: 200,
            message: "Todo deleted successfully",
            deletedSubTodo,
        }
    )

}


const updateSubTodo = async (req, res) => {

    const isAdmin = req.isAdmin;
    const {projectId, subTodoId, subTodoTitle, description, deadline, status, backgroundColor, foregroundColor} = req.body;

    if (!projectId){
        throw Error("Project Id required!");
    }

    if (!isAdmin){
        throw Error("You are not authorized to add a todo to this project");
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
        throw Error("Couldn't create todo");
    }

    return res.status(200).json(
        {
            status: 200,
            message: "Todo updated successfully",
            updatedSubTodo,
        }
    );

}


const getSubTodos = async (req, res) => {

    const isMember = req.isMember;
    const projectVisibility = req.isProjectVisible;
    const todoId = req.query?.todoId;

    if (!isMember && !projectVisibility){
        throw Error("You are not authorized to get todos of this project");
    }

    const subTodos = await SubTodo.find(
        {
            todoId,
        }
    )

    if (!subTodos){
        throw Error("Couldn't access todos");
    }

    res.status(200).json(
        {
            status: 200,
            message: "Todos fetched successfully",
            subTodos
        }
    )
}


const changeProgressStatus = async (req, res) => {

    const projectId = req.query?.projectId;
    const subTodoId = req.query?.subTodoId;
    const isMember = req.isMember;
    const subTodoStatus = req.query?.todoPriority;

    if (!isMember){
        throw Error("You are not authorized to remove todos in this project");
    }

    if (subTodoStatus === null){
        throw Error("status of todo is required");
    } 
    
    if (subTodoStatus!=="Done" && subTodoStatus!=="Todo" && subTodoStatus!=="Pending"){
        throw Error("status of todo can have only these values: Done, Todo and Pending");
    }

    const subTodo = await SubTodo.findById(subTodoId);

    if (!subTodo){
        throw Error("Invalid Todo Id");
    }

    if (!subTodo.projectId.equals(projectId)){
        throw Error("The projectId of todo is not same as the id provided");
    }

    subTodo.status = subTodoStatus;
    subTodo.save({validateBeforeSave: false});

    return res.status(200).json(
        {
            status: 200,
            message: "Priority of todo changed successfully",
            subTodo,
        }
    )

}


export {
    addSubTodo,
    removeSubTodo,
    updateSubTodo,
    getSubTodos,
    changeProgressStatus,
}