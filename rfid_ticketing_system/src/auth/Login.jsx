import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // ======================================================================== //
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login/', {
        username,
        password,
      });
      if (response.status === 200) {
        const userRole = response.data.userRole;
        localStorage.setItem('userRole', userRole);
        if (userRole === 'admin') {
          navigate('/admin');
        } else if (userRole === 'staff') {
          navigate('/staff');
        } else {
          alert('Unexpected user role. Please contact support.');
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setErrorMessage('Invalid username or password');
      } else {
        setErrorMessage('Something went wrong. Please try again.');
      }
    }
  };

// ======================================================================== //
  const handleRFIDLogin = async () => {
    Swal.fire({
      title: 'Login with RFID Card',
      icon: 'info',
      input: 'text',
      inputPlaceholder: "...Waiting for the ID",
      showCancelButton: true,
      focusConfirm: false,
      showConfirmButton: false,
      didOpen: () => {
        const inputElement = Swal.getInput();
        inputElement.style.color = "transparent"; 
        inputElement.style.caretColor = "transparent";
        inputElement.style.border = "none"; 
        inputElement.style.outline = "none"; 
        inputElement.style.boxShadow = "none";
        inputElement.style.textAlign = "center"; 
        inputElement.style.direction = "rtl"; 
        inputElement.focus();
      },
      preConfirm: async (rfidCode) => {
        if (!rfidCode) {
          Swal.showValidationMessage('RFID Code is required!');
        } else {
          try {
            const response = await axios.post('http://127.0.0.1:8000/api/rfid_login/', {
              rfidCode,
            });

            if (response.status === 200) {
              const userRole = response.data.userRole;
              localStorage.setItem('userRole', userRole);

              if (userRole === 'admin') {
                navigate('/admin');
              } else {
                Swal.fire('Access Denied', 'You are not authorized to access the admin page.', 'error');
              }
            }
          } catch (error) {
            Swal.fire('Error', 'Invalid RFID code or something went wrong.', 'error');
          }
        }
      },
    });
    const inputElement = Swal.getInput();
    inputElement.addEventListener("input", () => {
      const rfidCard = inputElement.value;
      if (rfidCard.length === 10) {
        Swal.getConfirmButton().click();
      }
    });
    Swal.getConfirmButton().style.display = "none"; 
    Swal.getCancelButton().style.display = "block"; 
    Swal.getCancelButton().style.margin = "0 auto"; 
    Swal.getCancelButton().style.textAlign = "center";
  };
  // ======================================================================== //


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-sm w-full p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-3xl font-semibold text-center mb-6">Login</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
            >
              {showPassword ? (
                <FaEyeSlash className="h-6 w-6 text-gray-500" />
              ) : (
                <FaEye className="h-6 w-6 text-gray-500" />
              )}
            </button>
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Login
            </button>
          </div>
          {errorMessage && (
            <p className="text-red-500 text-center mt-4">{errorMessage}</p>
          )}
        </form>
        <p
          onClick={handleRFIDLogin}
          className="text-blue-500 text-center mt-4 cursor-pointer hover:underline"
        >
          LOGIN WITH RFID CARD
        </p>
      </div>
    </div>
  );
}

export default Login;
