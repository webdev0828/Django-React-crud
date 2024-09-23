import React, { useState } from 'react';
import axios from 'axios';
import '../style.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/register/', {
        username,
        email,
        password,
        password2,
      });
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      window.location.href="/login";

    } catch (err) {
      console.error('Registration error:', err.response?.data);
      const errors = err.response?.data;
        let errorMsg = 'Registration failed. Please check your input.';
        if (errors) {
            errorMsg = Object.keys(errors)
                .map(key => `${key}: ${errors[key].join(', ')}`)
                .join('; ');
        }
        alert(errorMsg);
    }
  };

  return (
    <div>
        <center>
            <h2>Register</h2>
        </center>
        <form onSubmit={handleRegister}>
            <div className="form-group">
                <div className="field">
                    <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div className="field">
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="field">
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className="field">
                    <input type="password" placeholder="Confirm Password" value={password2} onChange={(e) => setPassword2(e.target.value)} required />
                </div>
            </div>
            
            <div className="button-area">
                <button type="submit">Register</button>
                <div> 
                    <a href="/login">Login</a>
                </div>
            </div>
        </form>
    </div>
  );
};

export default Register;