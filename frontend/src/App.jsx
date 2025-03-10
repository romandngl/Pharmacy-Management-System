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
import { PatientSchedule } from './pages/patent/schedule/PatientSchedule';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { PharmacistDashboard } from './pages/pharmacist/PharmacistDashboard';
import { AdminLayout } from './layout/AdminLayout';
import { PharmacistLayout } from './layout/PharmacistLayout';
import { AdminInventory } from './pages/admin/inventory/AdminInventory';
import { AdminMedicine } from './pages/admin/medcine/AdminMedicine';
import { AddMedicine } from './pages/admin/medcine/AddMedicine';
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
      element: <ProtectedRoute isProtected={true}><PatientLayout />  </ProtectedRoute>,
      children: [
        {
          path: "/patient/dashboard", element:
            <PatientDashboard />
        },
        {
          path: "/patient/schedule", element:
            <PatientSchedule />
        }
      ]
    }
    , {
      path: "/admin",
      element: <ProtectedRoute isProtected={true}><AdminLayout /></ProtectedRoute>,
      children: [
        {
          path: "/admin/dashboard", element: <AdminDashboard />
        },
        {
          path: "/admin/inventory", element: <AdminInventory />
        },
        {
          path: "/admin/medicine", element: <AdminMedicine />,

        },
        {
          path: "/admin/medicine/add", element: <AddMedicine />
        }

      ]
    },
    {
      path: "/pharmacist",
      element: <ProtectedRoute isProtected={true}><PharmacistLayout /></ProtectedRoute>,
      children: [
        {
          path: "/pharmacist/dashboard", element: <PharmacistDashboard />
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
