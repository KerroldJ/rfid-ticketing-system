import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";

function ScanCards() {
  const [cards, setCards] = useState([]);
//=================================================================//
// ===== PRE FETCH CARDS ===== //
  useEffect(() => {
    // Fetch initial card data
    fetch("http://127.0.0.1:8000/api/cards/")
      .then((response) => response.json())
      .then((data) => setCards(data))
      .catch((error) => console.error("Error fetching initial data:", error));
  }, []);

//=================================================================//
// ===== FOR DEACTIVATING CARDS ===== //
  // ===== FOR DEACTIVATING CARDS ===== //
  const handleScanCardClick = () => {
    // Open the scanner modal
    Swal.fire({
      title: "Scan RFID Card",
      input: "text", // Use text input field
      inputPlaceholder: "...Waiting for the ID", // Placeholder
      focusConfirm: false,
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Submit",
      preConfirm: () => {
        const rfidCard = Swal.getInput().value; // Directly access the input value

        // Check if the card ID is valid (10 characters long)
        if (!rfidCard || rfidCard.length !== 10) {
          Swal.showValidationMessage("Card ID must be 10 characters long!");
          return false;
        }

        // Fetch the card details to check if it's deactivated
        return axios
          .get(`http://127.0.0.1:8000/api/check-status/${rfidCard}/`)
          .then((response) => {
            const cardStatus = response.data.status; // Assuming the status is returned in the response

            if (cardStatus === "Deactivated") {
              // Show error modal if the card is already deactivated
              return Swal.fire({
                title: "Error",
                text: "This card is already deactivated.",
                icon: "error",
                timer: 2500,
                timerProgressBar: true, 
                showConfirmButton: false,
              }).then(() => {
                handleScanCardClick();
              });
            } else {
              const localDate = new Date();
              const formattedDate = localDate.toISOString().split('T')[0]; // 'YYYY-MM-DD'
              const formattedTime = localDate.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); // 'HH:MM AM/PM'

              // Send the local time and date in the POST request to deactivate the card
              return axios
                .post(`http://127.0.0.1:8000/api/deactivate/${rfidCard}/`, {
                  deactivated_date: formattedDate,
                  deactivated_time: formattedTime,
                })
                .then(async (response) => {
                  const data = response.data;
                  if (data.success) {
                    // Show success modal immediately after success
                    await Swal.fire({
                      html: `<div style="font-size: 46px; font-weight: bold; text-align: center;"><span>Welcome to the Island.</span></div>`,
                      icon: 'success',
                      showConfirmButton: false,
                      timer: 2500,  // Modal will close after 2.5 seconds
                      timerProgressBar: true,  // Adds a progress bar
                      footer: '',
                    });
                    
                    fetch("http://127.0.0.1:8000/api/cards/")
                      .then((response_1) => response_1.json())
                      .then((updatedData) => setCards(updatedData))
                      .catch((error) => {
                        console.error("Error fetching updated data:", error);
                      });
                    handleScanCardClick();
                  } else {
                    await Swal.fire({
                      title: "Error",
                      text: data.message,
                      icon: "error",
                      timer: 2500,
                      showConfirmButton: false
                    });
                    handleScanCardClick();
                  }
                });
            }
          })
          .catch((error) => {
            // Handle error in the GET request
            console.error("Error:", error);
            Swal.fire({
              title: "Error",
              text: "An error occurred while checking the card status.",
              icon: "error",
              timer: 2500,
              showConfirmButton: false,
            }).then(() => {
              handleScanCardClick();
            });
          });
      },
      didOpen: () => {
        const inputElement = Swal.getInput();
        inputElement.style.color = "transparent"; 
        inputElement.style.caretColor = "transparent";
        // Hide the border of the input field
        inputElement.style.border = "none"; // Remove border
        inputElement.style.outline = "none"; // Remove outline (focus border)
        inputElement.style.boxShadow = "none"; // Remove box-shadow if any
        // Center the text (though it is invisible)
        inputElement.style.textAlign = "center"; // Center the text (but the value is hidden)
        inputElement.style.direction = "rtl"; // Ensure right-to-left alignment for any future text
        // Ensure the input gets focused initially
        inputElement.focus();
      },
    });

    // Automatically submit if card ID is 10 characters long
    const inputElement = Swal.getInput();
    inputElement.addEventListener("input", () => {
      const rfidCard = inputElement.value;
      // Automatically submit the form if card ID is 10 characters long
      if (rfidCard.length === 10) {
        Swal.getConfirmButton().click(); // Programmatically click the "Submit" button to trigger the submission
      }
    });
    // Hide the submit button initially
    Swal.getConfirmButton().style.display = "none"; // Hide the submit button

    // Center the cancel button
    Swal.getCancelButton().style.display = "block"; // Ensure the cancel button is visible
    Swal.getCancelButton().style.margin = "0 auto"; // Center the cancel button
    Swal.getCancelButton().style.textAlign = "center"; // Ensure the text is centered
  };


//=================================================================//

  return (
    <div className="flex flex-col bg-gray-100">
      {/* Header Section */}
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

      {/* Actions Section */}
      <div className="flex justify-between p-6">
        <button onClick={handleScanCardClick} className="bg-green-500 text-white py-2 px-4 rounded-md shadow-md"> Scan Card</button>
      </div>

      {/* Cards Table Section */}
      <div className="flex gap-8 overflow-x-auto text-sm">
        {/* Activated Cards Table */}
        <div className="w-1/2">
          <h2 className="text-lg font-bold mb-4 text-center">Activated Cards</h2>
          <div className="max-h-[500px] overflow-y-auto relative">
            <table className="min-w-full bg-white shadow-md rounded-lg">
              <thead className="bg-gray-800 text-white sticky top-0 z-10">
                <tr>
                  <th className="text-center p-3">Card ID</th>
                  <th className="text-center p-3">Status</th>
                  <th className="text-center p-3">Type</th>
                  <th className="text-center p-3">Date</th>
                  <th className="text-center p-3">Time</th>
                </tr>
              </thead>
              <tbody>
                {cards
                  .filter((card) => card.status === 'Activated')
                  .map((card) => (
                    <tr key={card.card_id} className="border-b">
                      <td className="text-center p-3">{card.card_id}</td>
                      <td className="text-center p-3 text-green-500">{card.status}</td>
                      <td className={`text-center p-3 ${card.type === 'Regular' ? 'text-blue-500' : 'text-yellow-500'}`}>{card.type}</td>
                      <td className="text-center p-3">{card.date}</td>
                      <td className="text-center p-3">{card.time}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Deactivated Cards Table */}
        <div className="w-1/2">
          <h2 className="text-lg font-bold mb-4 text-center">Deactivated Cards</h2>
          <div className="max-h-[500px] overflow-y-auto relative">
            <table className="min-w-full bg-white shadow-md rounded-lg">
              <thead className="bg-gray-800 text-white sticky top-0 z-10">
                <tr>
                  <th className="text-center p-3">Card ID</th>
                  <th className="text-center p-3">Status</th>
                  <th className="text-center p-3">Type</th>
                  <th className="text-center p-3">Date</th>
                  <th className="text-center p-3">Time</th>
                </tr>
              </thead>
              <tbody>
                {cards
                  .filter((card) => card.status !== 'Activated')
                  .map((card) => (
                    <tr key={card.card_id} className="border-b">
                      <td className="text-center p-3">{card.card_id}</td>
                      <td className="text-center p-3 text-red-500">{card.status}</td>
                      <td className={`text-center p-3 ${card.type === 'Regular' ? 'text-blue-500' : 'text-yellow-500'}`}>{card.type}</td>
                      <td className="text-center p-3">{card.date}</td>
                      <td className="text-center p-3">{card.time}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScanCards;
