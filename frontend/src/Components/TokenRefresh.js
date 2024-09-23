import axios from 'axios';

const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  try {
    const response = await axios.post('http://localhost:8000/api/token/refresh/', {
      refresh: refreshToken,
    });
    localStorage.setItem('access_token', response.data.access);
    console.log('Access token refreshed');
  } catch (error) {
    console.error('Failed to refresh token');
  }
};

// Call refreshToken() as needed, for example, on token expiration or as a part of an API request handler.

export default refreshToken;