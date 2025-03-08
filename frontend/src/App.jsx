import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from './information/HomePage';
import { HomeLayout } from './layout/HomeLayout';
import { AboutPage } from './information/AboutPage';
import { SignUpPage } from './auth/SignUpPage';
import { SignInPage } from './auth/SignInPage';
import { AuthLayout } from './layout/AuthLayout';
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomeLayout />,
      children: [
        {
          path: "/", element: <HomePage />
        }, {
          path: "/about", element: <AboutPage />
        }
      ]
    }, {
      path: "/auth",
      element: <AuthLayout />,
      children: [
        {
          path: "/auth/signup", element: <SignUpPage />
        },
        {
          path: "/auth/signin", element: <SignInPage />
        }
      ]
    }
  ])

  return (
    <RouterProvider router={router}>
    </RouterProvider>
  )
}

export default App
