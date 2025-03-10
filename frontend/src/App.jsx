import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from './landing/HomePage';
import { HomeLayout } from './layout/HomeLayout';
import { AboutPage } from './landing/AboutPage';
import { SignUpPage } from './auth/SignUpPage';
import { SignInPage } from './auth/SignInPage';
import { AuthLayout } from './layout/AuthLayout';
import GetStarted from './landing/GetStarted';
import { ProtectedRoute } from '../configuration/ProtectedRoute';
import { PatientDashboard } from './pages/patent/PatientDashboard';
import { PatientLayout } from './layout/PatientLayout';
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <ProtectedRoute isPublic={true}><HomeLayout /></ProtectedRoute>,
      children: [
        {
          path: "/", element: <HomePage />
        }, {
          path: "/about", element: <AboutPage />
        }, {
          path: "/get-started", element: <GetStarted />
        }
      ]
    }, {
      path: "/auth",
      element: <ProtectedRoute isPublic={true}> <AuthLayout /></ProtectedRoute>,
      children: [
        {
          path: "/auth/patient/signup", element: <SignUpPage />
        },
        {
          path: "/auth/signin", element: <SignInPage />
        }
      ]
    }
    ,
    {
      path: "/patient",
      element: <PatientLayout />,
      children: [
        {
          path: "/patient/dashboard", element: <ProtectedRoute isProtected={true}>
            <PatientDashboard />
          </ProtectedRoute>
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
