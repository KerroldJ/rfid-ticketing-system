import React, { useState, useEffect } from 'react';
import axios from 'axios';

function History() {
  const [historyData, setHistoryData] = useState([]);  // Initialize as an empty array
  const [loading, setLoading] = useState(true);  // To handle loading state
  const [error, setError] = useState(null);  // To handle errors

  // Fetch history data when the component mounts
  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/api/card-logs/')  // Replace with your actual API endpoint
      .then((response) => {
        setHistoryData(response.data || []);  // Ensure it's an empty array if data is missing
        setLoading(false);
      })
      .catch((error) => {
        setError(error.response?.data?.detail || error.message || "Something went wrong");
        setLoading(false);
      });
  }, []);  // Empty dependency array ensures this runs once when the component mounts

  if (loading) {
    return <div>Loading...</div>;  // Show a loading message while fetching data
  }

  if (error) {
    return <div>Error: {error}</div>;  // Show an error message if the API call fails
  }

  // Handle the delete all logs action
  const handleDeleteAll = async () => {
    try {
      const response = await axios.delete('http://127.0.0.1:8000/api/card-logs/');
      if (response.status === 204) {
        // If deletion is successful, clear the history data and notify user
        setHistoryData([]);
        alert('All logs have been deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting logs:', error);
      alert('There was an error deleting the logs.');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Activity History</h1>
        <button  onClick={handleDeleteAll} className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600" > Delete All Logs </button>
      </div>


      <div className="overflow-x-auto" style={{ maxHeight: '500px', overflowY: 'auto' }}>
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="sticky top-0 bg-gray-800 text-white">
            <tr>
              <th className="px-6 py-3 text-center text-sm font-medium uppercase tracking-wider">Card ID</th>
              <th className="px-6 py-3 text-center text-sm font-medium uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-center text-sm font-medium uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-center text-sm font-medium uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-center text-sm font-medium uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-center text-sm font-medium uppercase tracking-wider">Time</th>
            </tr>
          </thead>
          <tbody>
            {historyData.length > 0 ? (
              historyData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="px-6 py-4 text-center text-sm text-gray-700">{item.card_id}</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-700">{item.role}</td>
                  <td className={`px-6 py-4 text-center text-sm ${item.status === 'Reactivated' ? 'text-green-500' : 'text-red-500'}`}>{item.status}</td>
                  <td className={`px-6 py-4 text-center text-sm ${item.type === 'Regular' ? 'text-blue-500' : 'text-yellow-500'}`}>{item.type}</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-700">{item.date}</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-700">{item.time}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-700">No history available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default History;
