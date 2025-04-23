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
import { EditMedicine } from './pages/admin/medcine/EditMedicine';
import { AddInventory } from './pages/admin/inventory/AddInventory';
import ContactPage from './landing/ContactPage';
import PharmacistMedicine from './pages/pharmacist/medicine/PharmacistMedicine';
import PharmacistInventory from './pages/pharmacist/inventory/PharmacistInventory';
import AdminReadCategory from './pages/admin/category/AdminReadCategory';
import PharmacistReadCategory from './pages/pharmacist/category/PharmacistReadCategory';
import AdminAddCategory from './pages/admin/category/AdminAddCategory';
import PharmacistAddCategory from './pages/pharmacist/category/PharmacistAddCategory';
import AdminSales from './pages/admin/sales/AdminSales';
import SalesDetailsPage from '../components/sales/SalesDetailsPage';
import AdminSalesAdd from './pages/admin/sales/AdminSalesAdd';
import { PatientViewSchedule } from './pages/patent/schedule/PatientViewSchedule';
import ViewAppointments from './pages/pharmacist/appointment/ViewAppointments';
import { ViewAppointmentById } from './pages/pharmacist/appointment/ViewAppointmentById';
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
          path: "/contact", element: <ContactPage />
        },
        {
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
          path: "/patient/schedule/add", element:
            <PatientSchedule />
        },
        {
          path: "/patient/schedule/view", element:
            <PatientViewSchedule />
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
          path: "/admin/inventory/add", element: <AddInventory />
        },
        {
          path: "/admin/medicine", element: <AdminMedicine />,
        },
        {
          path: "/admin/medicine/add", element: <AddMedicine />
        },
        {
          path: "/admin/medicine/edit/:id", element: <EditMedicine />
        }, {
          path: "/admin/category", element: <AdminReadCategory />
        },
        , {
          path: "/admin/add/category", element: <AdminAddCategory />
        }, {
          path: "/admin/sales", element: <AdminSales />
        }, {
          path: "/admin/sales/:id", element: <SalesDetailsPage />
        },
        {
          path: "/admin/sales/add", element: <AdminSalesAdd />
        },
      ]
    },
    {
      path: "/pharmacist",
      element: <ProtectedRoute isProtected={true}><PharmacistLayout /></ProtectedRoute>,
      children: [
        {
          path: "/pharmacist/dashboard", element: <PharmacistDashboard />
        },
        {
          path: "/pharmacist/medicine", element: <PharmacistMedicine />,
        },
        {
          path: "/pharmacist/medicine/add", element: <AddMedicine />
        },
        {
          path: "/pharmacist/medicine/edit/:id", element: <EditMedicine />
        },
        {
          path: "/pharmacist/inventory", element: <PharmacistInventory />
        },
        {
          path: "/pharmacist/inventory/add", element: <AddInventory />
        },
        {
          path: "/pharmacist/category", element: <PharmacistReadCategory />
        },
        {
          path: "/pharmacist/add/category", element: <PharmacistAddCategory />
        },
        {
          path: "/pharmacist/appointments", element: <ViewAppointments />
        },
        {
          path: "/pharmacist/appointments/view/:id", element: <ViewAppointmentById />
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
