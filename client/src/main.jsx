import { Children, Component, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import {
  Home, Login, Signup, Profile, ErrorPage, Project, Todo, Dashboard, Explore,
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
              element: <Dashboard/>
            },
            {
              path: "/project/:id>",
              element: <Project/>
            },
            {
              path: "/todo/:id",
              element: <Todo/>
            },
          ]
        },
        {
          path : "/login",
          element: <Login/>,
        },
        {
          path : "/signup",
          element: <Signup/>,
        },
        {
          path : "/profile/:id",
          element: <Profile/>,
        },
      ]
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
