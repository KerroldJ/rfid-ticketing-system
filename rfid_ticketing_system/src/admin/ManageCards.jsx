import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";

function ManageCards() {
  const [cards, setCards] = useState([]); 

// ===== FOR AUTO DEATIVATING THE ACTIVATED CARDS ===== //
  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 18 && now.getMinutes() === 0) {
        fetch('http://127.0.0.1:8000/api/deactivate_all_cards/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(response => response.json())
          .then(data => {
            console.log(data);
            if (data.success) {
              console.log('All cards deactivated at 6 PM');
            } else {
              console.log('It is not time to deactivate cards yet');
            }
          })
          .catch(error => {
            console.error('Error:', error);
          });
      }
    }, 60000);
    return () => clearInterval(intervalId);
  }, []);

//=================================================================//
// ===== Fetch initial card data when the component mounts ===== //
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/cards/")
      .then((response) => response.json())
      .then((data) => setCards(data))
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
//=================================================================//
// Handle Add button click and submit new card data //
  const handleAddButtonClick = () => {
    Swal.fire({
      title: "Activate New Card",
      html: `
      <form id="add-item-form" class="space-y-4 text-left">
        <div>
          <label for="cardID" class="block text-sm font-medium text-gray-700">Card ID</label>
          <input type="text" id="cardID" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" placeholder="Scan Card ID" required />
        </div>

        <div>
          <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
          <select id="status" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" required>
            <option value="">Select Status</option>
            <option value="Activated">Activated</option>
            <option value="Deactivated">Deactivated</option>
          </select>
        </div>

        <div>
          <label for="type" class="block text-sm font-medium text-gray-700">Type</label>
          <select id="type" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" required>
            <option value="">Select Type</option>
            <option value="VIP">VIP</option>
            <option value="Regular">Regular</option>
          </select>
        </div>
      </form>
    `,
      showCancelButton: true,
      confirmButtonText: "Add",
      cancelButtonText: "Cancel",
      focusConfirm: false,
      preConfirm: () => {
        const cardID = document.getElementById("cardID").value;
        const status = document.getElementById("status").value;
        const type = document.getElementById("type").value; // Make sure to use `type` instead of `role`

        if (cardID.length !== 10) {
          Swal.showValidationMessage("Card ID must be exactly 10 characters.");
          return false;
        }
        if (!cardID || !status || !type) {  // Ensure all fields are checked including `type`
          Swal.showValidationMessage("All fields are required!");
          return false;
        }
        return { card_id: cardID, status, type };  // Return `type` here
      },
      didOpen: () => {
        const cardIDInput = document.getElementById("cardID");
        cardIDInput.addEventListener("input", () => {
          setTimeout(() => {
            if (cardIDInput.value.length === 10) {
              console.log("Full Card ID scanned:", cardIDInput.value);
              cardIDInput.disabled = true;
            }
          }, 100);
        });
        cardIDInput.addEventListener("keyup", () => {
          console.log("Card ID on keyup:", cardIDInput.value);
          if (cardIDInput.value.length === 10) {
            cardIDInput.disabled = true;
          }
        });
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const { card_id, status, type } = result.value;
        axios
          .post("http://127.0.0.1:8000/api/cards/", { card_id, status, type }) // Corrected field name to `type`
          .then((response) => {
            const card = response.data;
            const formattedCard = {
              id: card.id,
              card_id: card.card_id,
              status: card.status,
              type: card.type, // Use `type` instead of `role`
              date: card.created_date,
              time: card.created_time,
            };
            console.log(`Formatted card: ${JSON.stringify(formattedCard)}`);

            fetch("http://127.0.0.1:8000/api/cards/")
              .then((response) => response.json())
              .then((data) => setCards(data));

            Swal.fire("Added!", "Your card has been added.", "success");
          })
          .catch((error) => {
            console.error("Error:", error);
            Swal.fire("Error!", "Failed to add card.", "error");
          });
      }
    });
  };

//=================================================================//
// Function to handle Clear button click
  const handleClearButtonClick = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/cards/", {
        method: "DELETE", // Send DELETE request to the server
      });

      if (response.ok) {
        setCards([]); // Clear the local state after successful deletion
        alert("All cards have been deleted");
      } else {
        console.error("Error deleting cards");
      }
    } catch (error) {
      console.error("Error clearing cards:", error);
    }
  };

//=================================================================//
// Function to activate card //
  const handleScanCardClick = () => {
    Swal.fire({
      title: "Scan RFID Card",
      input: "text",
      inputPlaceholder: "...Waiting for the ID",
      focusConfirm: false,
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Submit",
      preConfirm: () => {
        const rfidCard = Swal.getInput().value;
        if (!rfidCard || rfidCard.length !== 10) {
          Swal.showValidationMessage("Card ID must be 10 characters long!");
          return false;
        }
        return rfidCard;
      },
      didOpen: () => {
        const inputElement = Swal.getInput();
        if (inputElement) {
          
          inputElement.style.color = 'transparent'; 
          inputElement.style.caretColor = 'transparent'; 
          inputElement.style.border = 'none';
          inputElement.style.outline = 'none'; 
          inputElement.style.boxShadow = 'none';
          inputElement.style.textAlign = 'center';
          inputElement.style.direction = 'rtl';
          inputElement.focus();
        }
        inputElement.addEventListener('input', () => {
          const rfidCard = inputElement.value;

          if (rfidCard.length === 10) {
            Swal.getConfirmButton().click(); 
          }
        });
        Swal.getConfirmButton().style.display = 'none'; 
        Swal.getCancelButton().style.display = 'block';
        Swal.getCancelButton().style.margin = '0 auto';
        Swal.getCancelButton().style.textAlign = 'center';
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const cardId = result.value;

        // Get the local date and time
        const localDate = new Date();
        const formattedDate = localDate.toISOString().split('T')[0]; // 'YYYY-MM-DD'
        const formattedTime = localDate.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); // 'HH:MM AM/PM'

        fetch(`http://127.0.0.1:8000/api/activate/${cardId}/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            created_date: formattedDate,
            created_time: formattedTime,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              Swal.fire({
                title: "Activated!",
                text: data.message,
                icon: "success",
                timer: 2500, 
                timerProgressBar: true, // Show the progress ba
              });

              // Fetch the updated card list after reactivation
              fetch("http://127.0.0.1:8000/api/cards/")
                .then((response_1) => response_1.json())
                .then((updatedData) => setCards(updatedData))
                .catch((error) => {
                  // Display error alert when there's a problem fetching the updated data
                  Swal.fire("Error", "Error fetching updated data: " + error.message, "error");
                });

              handleScanCardClick();
            } else {
              Swal.fire({
                title: "Error",
                text: data.message,
                icon: "error",
                timer: 1500, // Automatically close the alert after 2.5 seconds
                timerProgressBar: true, // Show the progress bar
                didOpen: () => {
                  Swal.showLoading(); // Show loading animation during the 2.5 seconds
                },
              }).then(() => {
                // After the error message is closed, handle the card scan click
                handleScanCardClick();
              });
            }
          })
          .catch((error) => {
            // Display a SweetAlert error if the initial fetch fails
            Swal.fire("Error", "Something went wrong: " + error.message, "error");
          });
      }
    });
  };
  
//=================================================================//
  return (
    <div className="flex flex-col bg-gray-100">
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

      <div className="flex p-6 space-x-4">
        <button onClick={handleAddButtonClick} className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-md">
          Add Card
        </button>
        <button onClick={handleScanCardClick} className="bg-green-500 text-white py-2 px-4 rounded-md shadow-md">
          Activate Card
        </button>
        <button onClick={handleClearButtonClick} className="bg-red-500 text-white py-2 px-4 rounded-md shadow-md ml-auto">
          Clear All Cards
        </button>
      </div>

      <div className="flex gap-8 overflow-x-auto text-sm">
        {/* Activated Cards Table */}
        <div className="w-1/2">
          <h2 className="text-lg mb-4 text-center font-bold">Activated Cards</h2>
          <div className="max-h-[500px] overflow-y-auto">
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
          <h2 className="text-lg mb-4 text-center font-bold">Deactivated Cards</h2>
          <div className="max-h-[500px] overflow-y-auto">
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

export default ManageCards;