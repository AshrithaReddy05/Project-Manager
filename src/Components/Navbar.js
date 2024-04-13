import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using React Router
import LogoutButton from './Logout'; // Import the LogoutButton component

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/Home">Home</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/Admin">Admin</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/User">User</Link>
            </li>
          </ul>
          <LogoutButton /> {/* Include the LogoutButton component here */}
        </div>
      </div>
      <style>
        {`
          .navbar-nav .nav-item .nav-link:hover {
            color: #007bff; /* Change the color to your desired hover color */
          }
        `}
      </style>
    </nav>
  );
}

export default Navbar;