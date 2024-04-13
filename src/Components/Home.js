import React from 'react';
import Navbar from './Navbar';

const Home = () => {
  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <div className="jumbotron">
          <h1 className="display-4">Welcome to the Projects Section</h1>
          <p className="lead">Explore and manage your projects with ease.</p>
          <hr className="my-4" />
          <p>Click on "<a href='/Admin'>Admin</a>" to access admin features or "<a href='User'>User</a>" for user features.</p>
          <p>Navigate to respective roles with the help of Navbar</p>
        </div>
      </div>
    </div>
  );
}

export default Home;