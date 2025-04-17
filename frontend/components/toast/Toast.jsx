import React from 'react'
import { ToastContainer } from 'react-toastify'

const Toast = () => {
    return (
        <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
     
        />
    )
}

export default Toast