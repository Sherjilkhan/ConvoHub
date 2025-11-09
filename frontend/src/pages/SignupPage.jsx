import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import AuthImagePattern from "../components/AuthImagePattern";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from "lucide-react";
import toast from 'react-hot-toast'

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore();
  
  // Minor adjustment to validation logic for clarity/conciseness
  const validateForm = () => {
    if (!formData.fullName.trim()) { return toast.error("Full name is required"); }
    if (!formData.email.trim()) { return toast.error("Email is required"); }
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");
    return true;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validateForm();
    if (success === true) {
      signup(formData);
    }
  };

  return (
    // Enhanced grid layout: ensures content is centered nicely on mobile and desktop
    <div className="min-h-screen grid lg:grid-cols-2 bg-base-200"> {/* Added bg-base-200 for a slight off-white/gray background */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        {/* Adjusted max-width for slightly larger form area on desktop */}
        <div className="w-full max-w-lg space-y-10"> 
          <div className="text-center">
            <div className="flex flex-col items-center gap-3 group mb-8">
              {/* Logo: Changed background for better contrast and added shadow */}
              <div className="size-14 rounded-2xl bg-primary flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300">
                <MessageSquare className="size-8 text-base-100" />
              </div>
              {/* Typography: Made title larger and bolder */}
              <h1 className="text-4xl font-extrabold text-base-content mt-4">Create Your Account</h1>
              <p className="text-base-content/70 text-lg">
                Get Started with your **free** Account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name Input */}
              <div className="form-control">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"> {/* Moved icon slightly right */}
                    <User className="size-5 text-primary/70" /> {/* Changed icon color to primary for better look */}
                  </div>
                  <input
                    type="text"
                    className={`input input-bordered input-lg w-full pl-12 focus:border-primary transition-colors`} // input-lg for larger field, focus style
                    placeholder="Your Full Name"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    aria-label="Full Name"
                  />
                </div>
              </div>
              
              {/* Email Input */}
              <div className="form-control">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="size-5 text-primary/70" />
                  </div>
                  <input
                    type="email"
                    className={`input input-bordered input-lg w-full pl-12 focus:border-primary transition-colors`}
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    aria-label="Email"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="form-control">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="size-5 text-primary/70" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`input input-bordered input-lg w-full pl-12 pr-12 focus:border-primary transition-colors`} // input-lg and adjusted padding
                    placeholder="Minimum 6 characters" // Better placeholder for password
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    aria-label="Password"
                  />
                  {/* Password Toggle Button: Used btn-ghost for a cleaner look */}
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-2 btn btn-ghost btn-circle btn-sm"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="size-5 text-base-content/60" />
                    ) : (
                      <Eye className="size-5 text-base-content/60" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button: Added subtle hover effects */}
              <button 
                type="submit" 
                className="btn btn-primary btn-lg w-full shadow-lg hover:shadow-xl transition-all duration-300" // btn-lg for larger button, added shadow
                disabled={isSigningUp}
              >
                {isSigningUp ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Signing Up...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
            
            {/* Login Link */}
            <div className="text-center mt-6">
              <p className="text-base-content/70">
                Already have an account?{" "}
                <Link to="/login" className="link link-hover text-primary font-semibold transition-colors"> {/* Added font-semibold for emphasis */}
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* AuthImagePattern remains on the right side for desktop view */}
      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
    </div>
  );
};

export default SignupPage;