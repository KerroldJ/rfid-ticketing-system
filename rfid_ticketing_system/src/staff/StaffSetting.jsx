import React, { useState } from "react";
import axios from "axios";

function Settings() {
  const [passwordData, setPasswordData] = useState({
    username: "",  // Add username to the state (you can set it dynamically)
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Handle input field changes
  const handleInputChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    // Ensure new password and confirm password match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    try {
      // Send request to the backend
      const response = await axios({
        method: 'POST',
        url: 'http://127.0.0.1:8000/api/update-password/',  // Backend URL
        data: {
          username: passwordData.username,  // Send the username
          old_password: passwordData.currentPassword,  // Send current password as old password
          new_password: passwordData.newPassword,  // Send new password
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Handle success response from the backend
      if (response.data.message) {
        setMessage(response.data.message);
        setError(''); // Clear error if the password update is successful
      }
    } catch (err) {
      // Handle errors from the backend
      if (err.response?.data?.error) {
        setError(err.response.data.error); // Display the error message from backend
      } else {
        setError("Something went wrong. Please try again.");
      }
      setMessage(""); // Clear the success message if there's an error
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>

      {/* Username Section */}
      <div className="bg-white shadow-md rounded px-8 py-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Username</h2>
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            type="text"
            name="username"
            id="username"
            value={passwordData.username}
            onChange={handleInputChange}
            placeholder="Enter your username"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Password Section */}
      <div className="bg-white shadow-md rounded px-8 py-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Change Password</h2>
        <form onSubmit={handlePasswordSubmit}>
          {/* Current Password */}
          <div className="mb-4">
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              id="currentPassword"
              value={passwordData.currentPassword}
              onChange={handleInputChange}
              placeholder="Enter your current password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* New Password */}
          <div className="mb-4">
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              id="newPassword"
              value={passwordData.newPassword}
              onChange={handleInputChange}
              placeholder="Enter your new password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your new password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
            >
              Save Password
            </button>
          </div>
        </form>
      </div>

      {/* Message or Error */}
      {message && <div className="text-green-500">{message}</div>}
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
}

export default Settings;
