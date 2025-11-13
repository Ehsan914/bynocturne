import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import './register.css'

const Register = () => {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        street_address: '',
        city: '',
        state: '',
        zip_code: '',
        country: ''
    });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!agreeTerms) {
            const errorMsg = 'You must agree to the Terms of Service and Privacy Policy';
            setError(errorMsg);
            toast.error(errorMsg);
            return;
        }

        if (formData.password !== confirmPassword) {
            const errorMsg = 'Passwords do not match';
            setError(errorMsg);
            toast.error(errorMsg);
            return;
        }

        setError('');
        setLoading(true);

        try {
            await register(formData);
            toast.success('Registration successful! Welcome!');
            navigate('/');
        } catch (err) {
            const errorMsg = err.response?.data?.error || "Registration failed. Please try again";
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="register-page">
            <div className="register-page-content">
                <div className="back-link-container">
                    <Link to="/" className="back-link">
                            <ArrowLeft size={16} className="arrow-left" />
                            <span className="back-link-text">Back to Store</span>
                    </Link>
                </div>
                <div className="register-container">
                    
                    {/* Header */}
                    <h2>Create Account</h2>
                    <p className="subtitle">Join ByNocturne and discover amazing deals</p>

                    {/* Error Message */}
                    {error && <p className="error-message" style={{color: 'red'}}>{error}</p>}

                    {/* Register Form */}
                    <form onSubmit={handleSubmit}>
                        {/* Name Field */}
                        <div className="form-group">
                            <label htmlFor="name" className="form-head-txt">Full Name</label>
                            <input 
                                id="name"
                                name="name"
                                type="text"
                                className="text-input"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                required
                            />
                        </div>

                        {/* Email Field */}
                        <div className="form-group">
                            <label htmlFor="email" className="form-head-txt">Email</label>
                            <input 
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                    
                        {/* Password Field */}
                        <div className="form-group">
                            <label htmlFor="password" className="form-head-txt">Password</label>
                            <div className="password-input-wrapper">
                                <input 
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Create a password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="password-toggle-btn"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div className="form-group">
                            <label htmlFor="confirmPassword" className="form-head-txt">Confirm Password</label>
                            <div className="password-input-wrapper">
                                <input 
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm your password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="password-toggle-btn"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Phone Field */}
                        <div className="form-group">
                            <label htmlFor="phone" className="form-head-txt">Phone</label>
                            <input 
                                id="phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter your phone number"
                                required
                            />
                        </div>

                        {/* Street Address Field */}
                        <div className="form-group">
                            <label htmlFor="street_address" className="form-head-txt">Street Address</label>
                            <input 
                                id="street_address"
                                name="street_address"
                                type="text"
                                className="text-input"
                                value={formData.street_address}
                                onChange={handleChange}
                                placeholder="Enter your street address"
                                required
                            />
                        </div>

                        {/* City and State Row */}
                        <div className="form-row">
                            <div className="form-group-half">
                                <label htmlFor="city" className="form-head-txt">City</label>
                                <input 
                                    id="city"
                                    name="city"
                                    type="text"
                                    className="text-input"
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="Enter your city"
                                    required
                                />
                            </div>

                            <div className="form-group-half">
                                <label htmlFor="state" className="form-head-txt">State</label>
                                <input 
                                    id="state"
                                    name="state"
                                    type="text"
                                    className="text-input"
                                    value={formData.state}
                                    onChange={handleChange}
                                    placeholder="Enter your state"
                                    required
                                />
                            </div>
                        </div>

                        {/* ZIP Code and Country Row */}
                        <div className="form-row">
                            <div className="form-group-half">
                                <label htmlFor="zip_code" className="form-head-txt">ZIP Code</label>
                                <input 
                                    id="zip_code"
                                    name="zip_code"
                                    type="text"
                                    className="text-input"
                                    value={formData.zip_code}
                                    onChange={handleChange}
                                    placeholder="Enter your ZIP code"
                                    required
                                />
                            </div>

                            <div className="form-group-half">
                                <label htmlFor="country" className="form-head-txt">Country</label>
                                <input 
                                    id="country"
                                    name="country"
                                    type="text"
                                    className="text-input"
                                    value={formData.country}
                                    onChange={handleChange}
                                    placeholder="Enter your country"
                                    required
                                />
                            </div>
                        </div>

                        {/* Terms Agreement */}
                        <div className="form-options">
                            <label className="terms-checkbox">
                                <input 
                                    type="checkbox"
                                    checked={agreeTerms}
                                    onChange={(e) => setAgreeTerms(e.target.checked)}
                                    required
                                />
                                <span>I agree to the Terms of Service and Privacy Policy</span>
                            </label>
                        </div>
                        
                        {/* Sign Up Button */}
                        <button type="submit" className="sign-in-btn" disabled={loading}>
                            {loading ? 'Creating account...' : 'Sign Up'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="register-divider">
                        <span className="half-divider"></span>
                        <span className="divider-txt">or continue with</span>
                        <span className="half-divider"></span>
                    </div>

                    {/* Google Button */}
                    <button 
                        className="google-btn" 
                        type="button"
                        onClick={() => alert('Google Sign-Up coming soon! 🚀')}
                    >
                        <svg viewBox="0 0 24 24" width="20" height="20">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        <span>Continue with Google</span>
                    </button>

                    {/* Sign In Link */}
                    <p className="signup-link">
                        Already have an account? <Link to="/login" className="signup-link-txt">Sign In</Link>
                    </p>
                </div>
                <div className="tnm-credit">
                    <p>By continuing, you agree to our Terms of Service and Privacy Policy.</p>
                    <p>© 2024 ByNocturne. All rights reserved.</p>
                </div>
            </div>
            
            
        </div>
    )
}

export default Register