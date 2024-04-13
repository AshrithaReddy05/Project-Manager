import React from 'react';
import { FaSignOutAlt } from 'react-icons/fa'; // Import the logout icon from react-icons
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:5000/api/logout');
      // Clear any local user data or session data on the client-side
      // For example, if using localStorage, you can clear user-related data like this:
      localStorage.removeItem('token'); // Assuming you store a token for authentication
      // Redirect to the login page or any other desired page
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <button className="btn btn-outline-danger" onClick={handleLogout}>
      Logout <FaSignOutAlt /> {/* Include the logout icon */}
    </button>
  );
};

export default LogoutButton;