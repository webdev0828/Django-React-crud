import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/token/', {
        username,
        password,
      });
      // Store tokens in localStorage
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('username', username); // Store username
      window.location.href="/";
    } catch (err) {
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div>
        <center>
            <h2>Login</h2>
        </center>
        <form onSubmit={handleLogin}>
            <div className="form-group">
                <div className="field">
                    <label>Username:</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div className="field">
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
            </div>
            
            <div className="button-area">
                <button type="submit">Login</button>
                <div> 
                    <a href="/register">Register</a>
                </div>
            </div>
        </form>
    </div>
  );
};

export default Login;