import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_MATCHUP } from '../../utils/mutations';
import Auth from '../../utils/auth';
import './Login.css';

const Login = () => {
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [login] = useMutation(CREATE_MATCHUP);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const { data } = await login({ variables: { ...loginData } });
      if (data?.login?.token) {
        Auth.login(data.login.token);
      } else {
        setError("Invalid username or password.");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
      console.error("Failed to login", err);
    }
  };

  // Music-themed background video (replace with your actual video URL)
  const backgroundVideoUrl = "https://example.com/music-background.mp4";

  return (
    <div className='login-container'>
      {/* Background video section */}
      <div className="video-wrapper">
        <video
          autoPlay
          loop
          muted
          playsInline
          onCanPlay={() => setLoading(false)}
          className="login-BG-video"
        >
          <source src={backgroundVideoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {loading ? (
        <h1>LOADING...</h1>
      ) : (
        <>
          {/* Title and text section */}
          <div className="title-container">
            <h1 className="login-app-title">JamJar</h1>
            <p className="tagline">Your Personal Music Playlist Curator</p>
          </div>

          {/* Form section */}
          <div className="form-container">
            <form className='form' onSubmit={handleSubmit}>
              <h1 className="login-text">Login</h1>

              {error && <p className="error-message">{error}</p>}

              <label className="input-label">Username:</label>
              <input 
                type='text'
                name='username'
                value={loginData.username}
                onChange={handleChange}
                className="login-input"
              />

              <label className="input-label">Password:</label>
              <input 
                type='password'
                name='password'
                value={loginData.password}
                onChange={handleChange}
                className="login-input"
              />

              <button type='submit' className="login-submit-btn">
                Login
              </button>

              <div className="signup-link">
                New to JamJar? <a href="/signup">Create account</a>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default Login;