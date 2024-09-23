import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import refreshToken from './TokenRefresh';
import Patient from './Patient';
import Assessment from './Assessment';
import '../style.css';

const Home = () => {
    const [activeTab, setActiveTab] = useState('patients'); // Default active tab
    const [patientData, setPatientData] = useState(null);
    const [assessmentData, setAssessmentData] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [username, setUsername] = useState(null);
    const navigate = useNavigate();

    // Fetch patient and assessment data using the provided token
    const fetchProtectedData = useCallback(async (token) => {
        try {
            const [patientResponse, assessmentResponse] = await Promise.all([
                axios.get('http://localhost:8000/api/patient_list/', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('http://localhost:8000/api/assessments_list/', { headers: { Authorization: `Bearer ${token}` } }),
            ]);
            setPatientData(patientResponse.data.patients);
            setAssessmentData(assessmentResponse.data.assessments);
        } catch (error) {
            console.log('Failed to fetch protected data:', error);
            if (error.response && error.response.status === 401) {
                 // Attempt to refresh token on 401 error
                try {
                    await refreshToken();
                    const newToken = localStorage.getItem('access_token');
                    setAccessToken(newToken);
                    if (newToken) {
                        await fetchProtectedData(newToken); // Retry fetching data with the new token
                    } else {
                        console.log('Failed to refresh token1:' + error);
                    }
                } catch (error) {
                    console.log('Failed to refresh token2:' + error);
                }
            }
        }
    }, []);

    // Load data when component mounts
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        const username = localStorage.getItem('username');
        setUsername(username);

        if (token) {
            try {
                setAccessToken(token);
                fetchProtectedData(token);
            } catch (error) {
                alert('Invalid token:', error);
                handleLogout(); // Logout on token validation failure
            }
        }
    }, [fetchProtectedData]);

    // Logout and clear stored tokens
    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('username');
        window.location.reload(); // Reload the page after logout
    };

    // Change active tab and fetch data
    const handleTabClick = (tab) => {
        setActiveTab(tab);
        const token = localStorage.getItem('access_token');
        fetchProtectedData(token);
    };

    // Render the component
    return (
        <div>
            {accessToken ? (
                <div>
                    <header className="header-area">
                        <center className="welcome">
                            <h1>Welcome To Our Website!</h1>
                        </center>
                        <div className="logout">
                            <p>User: {username}</p>
                            <button type="button" className="btn btn-primary" onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    </header>
                    <nav>
                        <ul className="nav nav-tabs">
                            {['patients', 'assessments'].map(tab => (
                                <li className="nav-item" key={tab}>
                                    <button
                                        className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                                        onClick={() => handleTabClick(tab)}
                                        type="button"
                                    >
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    </button>
                                    
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <div>
                        {activeTab === 'patients' && <Patient patientList={patientData} />}
                        {activeTab === 'assessments' && <Assessment assessmentList={assessmentData} patientList={patientData}/>}
                    </div>
                </div>
            ) : (
                <center className="homepage">
                    <h1>Welcome To Our Website!</h1>
                    <div className="mb-3 mt-3">
                        <p>Not logged in?</p>
                        <button type="button" className="btn btn-primary" onClick={() => navigate('/login')}>
                            Login now
                        </button>
                    </div>
                    <div className="mb-3 mt-3">
                        <p>Don't have an account?</p>
                        <button type="button" className="btn btn-primary" onClick={() => navigate('/register')}>
                            Register now
                        </button>
                    </div>
                </center>
            )}
        </div>
    );
};

export default Home;