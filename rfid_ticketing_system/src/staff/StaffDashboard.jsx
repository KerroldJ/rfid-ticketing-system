import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function StaffDashboard() {
  const [cards, setCards] = useState([]);
  const [data, setData] = useState({
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Weekly Clients",
        data: [0, 0, 0, 0, 0, 0, 0],
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.4,
        pointBackgroundColor: "rgba(255, 99, 132, 1)",
      },
    ],
  });

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 12,
          },
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          display: false,
        },
        grid: {
          drawTicks: false,
        },
      },
    },
  };
// ====================================================================== //
// Fetching weekly deactivated cards data
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/weekly-clients/")
      .then((response) => {
        const { labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], data = [0, 0, 0, 0, 0, 0, 0] } = response.data;

        setData((prevData) => ({
          ...prevData,
          labels,
          datasets: [
            {
              ...prevData.datasets[0],
              data,
            },
          ],
        }));
      })
      .catch((error) => {
        console.error("Error fetching weekly deactivated cards:", error);
      });
  }, []);
// ====================================================================== //
// Fetch cards from backend initially
  const fetchCards = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/cards/");
      if (response.ok) {
        const data = await response.json();
        setCards(data);
      } else {
        console.error("Error fetching cards");
      }
    } catch (error) {
      console.error("Error fetching cards:", error);
    }
  };
  useEffect(() => {
    fetchCards();
  }, []);

  // ====================================================================== //
  return (
    <div className="flex-1 bg-gray-100 w-full p-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-6 p-6">
        <div className="bg-blue-600 text-white p-4 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold">Active Cards</h3>
          <p className="text-3xl font-bold">{cards.filter((card) => card.status === "Activated").length}</p>
        </div>
        <div className="bg-red-600 text-white p-4 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold">Deactivated Cards</h3>
          <p className="text-3xl font-bold">{cards.filter((card) => card.status === "Deactivated").length}</p>
        </div>
        <div className="bg-green-600 text-white p-4 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold">Total Cards</h3>
          <p className="text-3xl font-bold">{cards.length}</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="flex gap-6 mt-10">
        <div className="bg-white rounded-lg shadow-lg w-full h-[500px] max-w-[1200px] mx-auto p-6">
          <h2 className="text-xl font-bold text-center mb-4">Weekly Clients</h2>
          <div className="h-[400px] w-full">
            <Line data={data} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default StaffDashboard;
