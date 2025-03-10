import React from 'react'

export const PharmacistDashboard = () => {
  const users = [
    {
        id: 1,
        name: 'John Doe',
        email: "John @gmail.com",
        role: 'Admin',
    },

]
  return (
    <div className='w-full min-h-screen bg-gray-100'>
      <div className='w-full min-h-screen bg-gray-100'>
        <div className="p-6">
          {/* Cards Section */}
          <div className="flex gap-6 mb-8">
            <div className="flex-1 bg-blue-500 text-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold">Total Users</h3>
              <p className="text-2xl">150</p> {/* Replace with dynamic data */}
            </div>
            <div className="flex-1 bg-green-500 text-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold">Active Users</h3>
              <p className="text-2xl">100</p> {/* Replace with dynamic data */}
            </div>
            <div className="flex-1 bg-yellow-500 text-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold">Inactive Users</h3>
              <p className="text-2xl">50</p> {/* Replace with dynamic data */}
            </div>
          </div>

          {/* Table Section */}
          <div>
            <h3 className="text-2xl font-semibold mb-4">User List</h3>
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">#</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Role</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((user, index) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-3 text-sm text-gray-700">{index + 1}</td>
                        <td className="px-6 py-3 text-sm text-gray-700">{user.name}</td>
                        <td className="px-6 py-3 text-sm text-gray-700">{user.email}</td>
                        <td className="px-6 py-3 text-sm text-gray-700">{user.role}</td>
                        <td className="px-6 py-3 text-sm text-gray-700">
                          <Link to={`/user/${user.id}`} className="text-blue-500 hover:text-blue-700">
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-3 text-sm text-gray-700 text-center">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
