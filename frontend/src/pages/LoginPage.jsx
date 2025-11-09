import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import AuthImagePattern from "../components/AuthImagePattern";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, AlertCircle } from "lucide-react"; // Imported AlertCircle

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isError, setIsError] = useState(false); // New state for error simulation/handling
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsError(false); // Reset error state on new submission
    
    // Simple client-side validation check (can be improved)
    if (!formData.email || !formData.password) {
        setIsError(true);
        // In a real app, you might show a toast or a general error message
        return; 
    }

    try {
        await login(formData);
        // Handle successful login (e.g., redirect)
    } catch (error) {
        // Assume login failed from the store/backend
        setIsError(true); 
        // Log the error or show a specific message to the user
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Optional: clear error when user starts typing again
    if (isError) setIsError(false); 
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-base-100">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 md:p-16 lg:p-20">
        <div className="w-full max-w-lg space-y-10 bg-base-100 p-8 sm:p-10 rounded-xl shadow-2xl transition-all"> 
          
          {/* Logo and Header */}
          <div className="text-center mb-6">
            <div className="flex flex-col items-center gap-3">
              <div
                className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center 
                group-hover:bg-primary/25 transition-colors duration-300 shadow-md" 
              >
                <MessageSquare className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-extrabold mt-4 text-base-content">Welcome Back!</h1>
              <p className="text-lg text-base-content/70">Sign in to your account</p>
            </div>
          </div>
          
          {/* Error Message (Conditional Rendering) */}
          {isError && (
            <div role="alert" className="alert alert-error text-sm transition-all duration-300">
              <AlertCircle className="h-5 w-5" />
              <span>Invalid credentials or missing fields. Please try again.</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-base-content">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className={`h-5 w-5 ${isError ? 'text-error' : 'text-base-content/40'}`} />
                </div>
                <input
                  type="email"
                  name="email" // Added name for consistent handling
                  className={`input w-full pl-10 transition duration-200 
                    ${isError ? 'input-error border-error focus:border-error' : 'input-bordered focus:border-primary'}
                    focus:ring-primary/30 focus:ring-1`}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-base-content">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className={`h-5 w-5 ${isError ? 'text-error' : 'text-base-content/40'}`} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password" // Added name for consistent handling
                  className={`input w-full pl-10 transition duration-200 
                    ${isError ? 'input-error border-error focus:border-error' : 'input-bordered focus:border-primary'}
                    focus:ring-primary/30 focus:ring-1`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-primary transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-base-content/40 hover:text-primary" />
                  ) : (
                    <Eye className="h-5 w-5 text-base-content/40 hover:text-primary" />
                  )}
                </button>
              </div>
              <label className="label">
                  {/* Added a dummy link for password reset for better UX */}
                  <a href="#" className="label-text-alt link link-hover text-sm text-base-content/60 hover:text-primary">Forgot password?</a>
              </label>
            </div>

            {/* Submit Button */}
            <button 
                type="submit" 
                className="btn btn-primary w-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out" 
                disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-8">
            <p className="text-base-content/70">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="link link-primary font-semibold hover:underline">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Pattern (No change needed here, AuthImagePattern handles it) */}
      <AuthImagePattern
        title={"Welcome back!"}
        subtitle={"Sign in to continue your conversations and catch up with your messages."}
      />
    </div>
  );
};
export default LoginPage;