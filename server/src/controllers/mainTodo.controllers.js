import { MainTodo } from "../models/mainTodo.model.js";

const addTodo = async (req, res) => {

    const isAdmin = req.isAdmin;
    const {projectId, todoTitle, shortDescription, detailedDescription, deadline, priority, status, backgroundColor, foregroundColor} = req.body;

    if (!projectId){
        throw Error("Project Id required!");
    }

    if (!isAdmin){
        throw Error("You are not authorized to add a todo to this project");
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
        throw Error("Couldn't create todo");
    }

    return res.status(200).json(
        {
            status: 200,
            message: "Todo created successfully",
            todo,
        }
    );

}


const removeTodo = async (req, res) => {

    const projectId = req.query?.projectId;
    const todoId = req.query?.todoId;
    const isAdmin = req.isAdmin;

    if (!isAdmin){
        throw Error("You are not authorized to remove todos in this project");
    }

    const todo = await MainTodo.findById(todoId);

    if (!todo){
        throw Error("Invalid todo Id");
    }

    if (!todo.projectId.equals(projectId)){
        throw Error("The projectId of todo is not same as the id provided");
    }

    const deletedTodo = await todo.deleteOne();

    if (!deletedTodo){
        throw Error("Invalid Todo Id");
    }

    return res.status(200).json(
        {
            status: 200,
            message: "Todo deleted successfully",
            deletedTodo
        }
    )

}


const updateTodo = async (req, res) => {

    const isAdmin = req.isAdmin;
    const {projectId, todoId, todoTitle, shortDescription, detailedDescription, deadline, priority, status, backgroundColor, foregroundColor} = req.body;

    if (!projectId){
        throw Error("Project Id required!");
    }

    if (!isAdmin){
        throw Error("You are not authorized to add a todo to this project");
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
        throw Error("Couldn't update todo");
    }

    return res.status(200).json(
        {
            status: 200,
            message: "Todo updated successfully",
            updatedTodo,
        }
    );
}


const getTodos = async (req, res) => {

    const isMember = req.isMember;
    const projectVisibility = req.isProjectVisible;
    const projectId = req.query?.projectId;

    if (!isMember && !projectVisibility){
        throw Error("You are not authorized to get todos of this project");
    }

    const todos = await MainTodo.find(
        {
            projectId,
        }
    )

    if (!todos){
        throw Error("Couldn't access todos");
    }

    res.status(200).json(
        {
            status: 200,
            message: "Todos fetched successfully",
            todos
        }
    )

}


const changeProgressStatus = (req, res) => {

    

}


const changeTodoPriority = async (req, res) => {

    const projectId = req.query?.projectId;
    const todoId = req.query?.todoId;
    const isAdmin = req.isAdmin;
    const todoPriority = req.query?.todoPriority;

    if (!isAdmin){
        throw Error("You are not authorized to remove todos in this project");
    }

    const todo = await MainTodo.findById(todoId);

    if (!todo){
        throw Error("Invalid Todo Id");
    }

    if (!todo.projectId.equals(projectId)){
        throw Error("The projectId of todo is not same as the id provided");
    }

    if (todoPriority === null){
        throw Error("priority of todo is required");
    } else if (todoPriority!=="High" && todoPriority!=="Medium" && todoPriority!=="Low"){
        throw Error("priority of todo can have only these values: Low, Medium , High");
    }

    todo.priority = todoPriority;
    todo.save({validateBeforeSave: false});

    return res.status(200).json(
        {
            status: 200,
            message: `Priority of todo changed to ${todoPriority}.`,
            todo
        }
    )

}


export {
    addTodo,
    removeTodo,
    updateTodo,
    getTodos,
    changeProgressStatus,
    changeTodoPriority,
}