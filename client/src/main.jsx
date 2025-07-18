import { Children, Component, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import {
  Home, Login, Signup, Profile, ErrorPage, Project, Todo, Dashboard, Explore, Settings, AddProject, About, Contact,
} from "./Pages/export.js";
import {
  AuthLayout,
} from "./Components/export.js"
import {
  ThemeContextProvider, 
  UserContextProvider,
} from "./Contexts/export.js";

const router = createBrowserRouter(
  [
    {
      path : "/",
      element: <App/>,
      children: [
        {
          path: "/",
          element: <Home/>,
          children: [
            {
              path: "/",
              element: <Explore/>
            },
            {
              path: "/dashboard",
              element: <AuthLayout authentication={true} children={<Dashboard/>}/>
            },
            {
              path: "/project/:id",
              element: <AuthLayout authentication={true} children={<Project/>}/>
            },
            {
              path: "/todo",
              element: <AuthLayout authentication={true} children={<Todo/>}/>
            },
            {
              path: "/settings",
              element: <AuthLayout authentication={true} children={<Settings/>}/>
            },
            {
              path: "/addProject",
              element: <AuthLayout authentication={true} children={<AddProject/>}/>
            },
            {
              path: "/contact",
              element: <Contact/>
            },
            {
              path: "/about",
              element: <About/>
            }
          ]
        },
        {
          path : "/login",
          element: <AuthLayout authentication={false} children={<Login/>}/>
        },
        {
          path : "/signup",
          element: <AuthLayout authentication={false} children={<Signup/>}/>
        },
        {
          path : "/profile/:id",
          element: <AuthLayout authentication={true} children={<Profile/>}/>
        },
      ]
    },
    {
      path: "*",
      element: <ErrorPage/>
    },
  ]
)

createRoot(document.getElementById('root')).render(
  <ThemeContextProvider>
    <UserContextProvider>
      <RouterProvider router={router}/>
    </UserContextProvider>
  </ThemeContextProvider>
)
