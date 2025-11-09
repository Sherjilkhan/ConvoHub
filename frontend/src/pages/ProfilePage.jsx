import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, Loader2, Calendar, CheckCircle } from "lucide-react"; // Added Loader2, Calendar, CheckCircle

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [isUploadSuccess, setIsUploadSuccess] = useState(false); // New state for success feedback

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      setIsUploadSuccess(false); // Reset success state

      try {
        await updateProfile({ profilePic: base64Image });
        setIsUploadSuccess(true); // Set success state on completion
        setTimeout(() => setIsUploadSuccess(false), 3000); // Clear after 3 seconds
      } catch (error) {
        // Handle error feedback here (e.g., show a toast/alert)
        console.error("Profile update failed:", error);
      }
    };
  };

  const memberSinceDate = authUser.createdAt 
    ? new Date(authUser.createdAt).toLocaleDateString(undefined, {
        year: 'numeric', month: 'long', day: 'numeric'
      })
    : "N/A";


  return (
    // Cleaned up padding and width for a modern page container
    <div className="min-h-screen pt-12 pb-20 bg-base-100">
      <div className="max-w-xl mx-auto p-4">
        
        {/* Main Profile Card: Lighter background, better shadow */}
        <div className="bg-base-100 rounded-2xl shadow-2xl p-6 sm:p-10 space-y-10 border border-base-300">
          
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-extrabold text-base-content">Your Profile</h1>
            <p className="text-base-content/70">Manage your photo and account details</p>
          </div>

          {/* Avatar Upload Section - Refined UX and Feedback */}
          <div className="flex flex-col items-center gap-4 border-b pb-6 border-base-200">
            <div className="relative group">
              {/* Avatar Image */}
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className={`size-36 rounded-full object-cover border-4 transition-all duration-500 
                  ${isUpdatingProfile ? "border-primary/50 grayscale" : "border-base-content/10"}`} // Subtle border change
              />
              
              {/* Camera Icon/Overlay */}
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute inset-0 flex items-center justify-center rounded-full cursor-pointer 
                  bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                  ${isUpdatingProfile ? "opacity-100 pointer-events-none bg-primary/80" : ""}
                `}
              >
                {isUpdatingProfile ? (
                  <Loader2 className="w-7 h-7 text-white animate-spin" />
                ) : (
                  <Camera className="w-7 h-7 text-white" />
                )}
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            
            {/* Feedback Message */}
            <div className="h-5 text-sm">
                {isUpdatingProfile ? (
                    <span className="text-primary flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Uploading photo...
                    </span>
                ) : isUploadSuccess ? (
                    <span className="text-success flex items-center gap-2 font-medium">
                        <CheckCircle className="w-4 h-4" />
                        Photo updated successfully!
                    </span>
                ) : (
                    <span className="text-base-content/60">
                        Click the photo to update your profile image
                    </span>
                )}
            </div>
          </div>

          {/* User Data Section - Clean, List-Style Presentation */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-base-content mb-4">Personal Information</h2>
            
            {/* Full Name */}
            <div className="flex items-center justify-between p-3 bg-base-200/50 rounded-lg">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-primary" />
                <span className="font-medium text-base-content">Full Name</span>
              </div>
              <p className="text-base-content/90 font-semibold">{authUser?.fullName}</p>
            </div>

            {/* Email Address */}
            <div className="flex items-center justify-between p-3 bg-base-200/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <span className="font-medium text-base-content">Email Address</span>
              </div>
              <p className="text-base-content/90">{authUser?.email}</p>
            </div>
          </div>

          {/* Account Details Section - Refined list structure */}
          <div className="pt-6 border-t border-base-200">
            <h2 className="text-xl font-bold text-base-content mb-4">Account Details</h2>
            
            <div className="space-y-3 text-base">
             
              
              {/* Account Status */}
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3 text-base-content/80">
                    <CheckCircle className="w-5 h-5" />
                    <span>Account Status</span>
                </div>
                <span className="font-medium text-success flex items-center gap-1">
                    Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;