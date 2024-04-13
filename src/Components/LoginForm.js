import React, { useState } from 'react';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './LoginForm.css';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rPassword, setRPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [registrationStatus, setRegistrationStatus] = useState(''); // Track registration status
      const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/login', { username, password },{withCredentials:true});
            console.log(response.data);
            // Assuming the token is received in the response data
                navigate('/Home');
            } 
            
        catch (error) {
            console.error('Login error:', error);
        }
    };
    const handleRegister = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/register', { username: name, password: rPassword },{withCredentials:true});
    
            if (response.status === 201) {
                const getCookies = () => {
                    const cookies = document.cookie.split(';')
                      .reduce((acc, cookie) => {
                        const [name, value] = cookie.trim().split('=');
                        acc[name] = value;
                        return acc;
                      }, {});
                    return cookies;
                  };
                  
                  console.log(getCookies());
                setUsername('');
                setPassword('');
                navigate('/Home');
            }
    
            console.log(response.data);
        } catch (error) {
            if (error.response && error.response.status === 400) {
                // User is already registered
                setRegistrationStatus('User already registered');
            } else {
                // Other errors
                console.error('Registration error:', error);
            }
        }
    };
    

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    

    return (
        <div className="section">
            <div className="container">
                <div className="row full-height justify-content-center">
                    <div className="col-12 text-center align-self-center py-5">
                        <div className="section pb-5 pt-5 pt-sm-2 text-center">
                            <h6 className="mb-0 pb-3"><span>Log In </span><span>Sign Up</span></h6>
                            <input className="checkbox" type="checkbox" id="reg-log" name="reg-log" />
                            <label htmlFor="reg-log"></label>
                            <div className="card-3d-wrap mx-auto">
                                <div className="card-3d-wrapper">
                                    <div className="card-front">
                                        <div className="center-wrap">
                                            <div className="section text-center">
                                                <h4 className="mb-4 pb-3">Log In</h4>
                                                <div className="form-group">
                                                    <input type="text" className="form-style" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete='off'/>
                                                    <i className="input-icon uil uil-at"></i>
                                                </div>
                                                <div className="form-group mt-2">
                                                    <div className="input-with-icon">
                                                        <input 
                                                            type={showPassword ? "text" : "password"} 
                                                            className="form-style" 
                                                            placeholder="Password" 
                                                            value={password} 
                                                            autoComplete='new-password'
                                                            onChange={(e) => setPassword(e.target.value)} 
                                                        />
                                                        <span className="password-icon" onClick={togglePasswordVisibility}>
                                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                                        </span>
                                                    </div>
                                                </div>
                                                <button className="btn mt-4" onClick={handleLogin}>Login</button>
                                                <p className="mb-0 mt-4 text-center"><a href="/" className="link">Forgot your password?</a></p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-back">
                                        <div className="center-wrap">
                                            <div className="section text-center">
                                                <h4 className="mb-3 pb-3">Sign Up</h4>
                                                <div className="form-group">
                                                    <input type="text" className="form-style" placeholder="User Name" value={name} onChange={(e) => setName(e.target.value)} />
                                                    <i className="input-icon uil uil-user"></i>
                                                </div>
                                                <div className="form-group mt-2">
                                                    <div className="input-with-icon">
                                                        <input 
                                                            type={showPassword ? "text" : "password"} 
                                                            className="form-style" 
                                                            placeholder="Password" 
                                                            value={rPassword} 
                                                            onChange={(e) => setRPassword(e.target.value)} 
                                                        />
                                                        <span className="password-icon" onClick={togglePasswordVisibility}>
                                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                                        </span>
                                                    </div>
                                                </div>
                                                <button className="btn mt-4" onClick={handleRegister}>Register</button>
                                                {registrationStatus && <p className="text-danger">{registrationStatus}</p>} {/* Display registration status message */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginForm;