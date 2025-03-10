import React from 'react'

export const AboutPage = () => {
    return (
        <div className="container mx-auto p-6 text-center">
            <h1 className="text-4xl font-bold">About Our Pharmacy Management System</h1>
            <p className="text-gray-600 mt-4">We provide an all-in-one solution for pharmacies to manage inventory, sales, and appointments efficiently.</p>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <img src="https://source.unsplash.com/500x300/?pharmacy" alt="Pharmacy" className="rounded shadow-md" />
                </div>
                <div className="text-left">
                    <h2 className="text-2xl font-semibold">Our Mission</h2>
                    <p className="text-gray-600 mt-2">Our goal is to enhance pharmacy efficiency by automating processes, reducing manual work, and ensuring accuracy in tracking medicines.</p>
                </div>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-left">
                    <h2 className="text-2xl font-semibold">Why Choose Us?</h2>
                    <p className="text-gray-600 mt-2">We prioritize security, user-friendliness, and scalability, making our system the best choice for modern pharmacies.</p>
                </div>
                <div>
                    <img src="https://source.unsplash.com/500x300/?medicine" alt="Medicine" className="rounded shadow-md" />
                </div>
            </div>
        </div>
    )
}
