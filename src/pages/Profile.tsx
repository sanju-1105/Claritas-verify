import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  User,
  Mail,
  Phone,
  Building2,
  Briefcase,
  MapPin,
  Camera,
  Edit3,
  Save,
  X,
  LogOut,
  ChevronLeft,
  Link2,
  Calendar,
  Hash,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Home,
  Users,
} from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateProfile, logout, isAuthenticated } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    position: '',
    companyName: '',
    department: '',
    employeeId: '',
    location: '',
    linkedin: '',
    bio: '',
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Initialize form data from user
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        position: user.position || '',
        companyName: user.companyName || '',
        department: user.department || '',
        employeeId: user.employeeId || '',
        location: user.location || '',
        linkedin: user.linkedin || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfile({ avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    updateProfile(formData);
    setIsSaving(false);
    setIsEditing(false);
    setSaveSuccess(true);
    
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        position: user.position || '',
        companyName: user.companyName || '',
        department: user.department || '',
        employeeId: user.employeeId || '',
        location: user.location || '',
        linkedin: user.linkedin || '',
        bio: user.bio || '',
      });
    }
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="bg-navy-900 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-teal-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight leading-none text-white font-[Poppins]">
                  Claritas Verify
                </span>
                <span className="text-[9px] font-medium tracking-[0.15em] uppercase leading-none mt-0.5 text-teal-400">
                  Your Global Screening Partner
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all text-sm font-medium"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Profile Hero */}
      <div className="bg-navy-900 pb-32 pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-white/60 text-sm mb-4">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronLeft className="w-4 h-4 rotate-180" />
            <span className="text-white">My Profile</span>
          </div>
          <h1 className="text-3xl font-bold text-white font-[Poppins]">My Profile</h1>
          <p className="text-white/60 mt-2">Manage your account settings and profile information</p>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 pb-16">
        {/* Success Toast */}
        {saveSuccess && (
          <div className="fixed top-24 right-4 z-50 flex items-center gap-3 px-5 py-4 bg-teal-500 text-white rounded-xl shadow-lg animate-fade-in-up">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-medium">Profile updated successfully!</span>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Avatar & Quick Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Avatar Card */}
            <div className="bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
              <div className="text-center">
                {/* Avatar */}
                <div className="relative inline-block mb-4">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-teal-400 to-teal-600 mx-auto ring-4 ring-white shadow-lg">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold">
                        {getInitials(formData.fullName || 'U')}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleAvatarClick}
                    className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-navy-900 text-white flex items-center justify-center shadow-lg hover:bg-navy-800 transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                <h2 className="text-xl font-bold text-navy-900 font-[Poppins]">
                  {formData.fullName}
                </h2>
                <p className="text-slate-500 text-sm mt-1">{formData.position}</p>
                <p className="text-teal-600 text-sm font-medium">{formData.companyName}</p>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-navy-900">12</div>
                    <div className="text-xs text-slate-500 mt-0.5">Verifications</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-navy-900">98%</div>
                    <div className="text-xs text-slate-500 mt-0.5">Success Rate</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Info Card */}
            <div className="bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                Account Info
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                    <Hash className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Employee ID</div>
                    <div className="text-sm font-semibold text-navy-900">{formData.employeeId}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Member Since</div>
                    <div className="text-sm font-semibold text-navy-900">
                      {formatDate(user.joinedDate)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-teal-500" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Account Status</div>
                    <div className="text-sm font-semibold text-teal-600">Active & Verified</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Form Card */}
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
              {/* Card Header */}
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-navy-900 font-[Poppins]">
                    Profile Information
                  </h3>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Update your personal and professional details
                  </p>
                </div>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-navy-900 text-white text-sm font-semibold hover:bg-navy-800 transition-all shadow-lg shadow-navy-900/20"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500 text-white text-sm font-semibold hover:bg-teal-600 transition-all shadow-lg shadow-teal-500/20 disabled:opacity-70"
                    >
                      {isSaving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      Save Changes
                    </button>
                  </div>
                )}
              </div>

              {/* Form Fields */}
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-navy-900 mb-2">
                      <User className="w-4 h-4 text-slate-400" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleChange('fullName', e.target.value)}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none ${
                        isEditing
                          ? 'border-slate-200 bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10'
                          : 'border-transparent bg-slate-50 text-navy-900'
                      }`}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-navy-900 mb-2">
                      <Mail className="w-4 h-4 text-slate-400" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none ${
                        isEditing
                          ? 'border-slate-200 bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10'
                          : 'border-transparent bg-slate-50 text-navy-900'
                      }`}
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-navy-900 mb-2">
                      <Phone className="w-4 h-4 text-slate-400" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      disabled={!isEditing}
                      placeholder={isEditing ? '+91 92660 89223' : 'Not provided'}
                      className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none ${
                        isEditing
                          ? 'border-slate-200 bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 placeholder:text-slate-300'
                          : 'border-transparent bg-slate-50 text-navy-900'
                      }`}
                    />
                  </div>

                  {/* Position */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-navy-900 mb-2">
                      <Briefcase className="w-4 h-4 text-slate-400" />
                      Position / Role
                    </label>
                    <input
                      type="text"
                      value={formData.position}
                      onChange={(e) => handleChange('position', e.target.value)}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none ${
                        isEditing
                          ? 'border-slate-200 bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10'
                          : 'border-transparent bg-slate-50 text-navy-900'
                      }`}
                    />
                  </div>

                  {/* Company */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-navy-900 mb-2">
                      <Building2 className="w-4 h-4 text-slate-400" />
                      Company / Firm
                    </label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => handleChange('companyName', e.target.value)}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none ${
                        isEditing
                          ? 'border-slate-200 bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10'
                          : 'border-transparent bg-slate-50 text-navy-900'
                      }`}
                    />
                  </div>

                  {/* Department */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-navy-900 mb-2">
                      <Users className="w-4 h-4 text-slate-400" />
                      Department
                    </label>
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => handleChange('department', e.target.value)}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none ${
                        isEditing
                          ? 'border-slate-200 bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10'
                          : 'border-transparent bg-slate-50 text-navy-900'
                      }`}
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-navy-900 mb-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleChange('location', e.target.value)}
                      disabled={!isEditing}
                      placeholder={isEditing ? 'City, Country' : 'Not provided'}
                      className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none ${
                        isEditing
                          ? 'border-slate-200 bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 placeholder:text-slate-300'
                          : 'border-transparent bg-slate-50 text-navy-900'
                      }`}
                    />
                  </div>

                  {/* LinkedIn */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-navy-900 mb-2">
                      <Link2 className="w-4 h-4 text-slate-400" />
                      LinkedIn Profile
                    </label>
                    <input
                      type="url"
                      value={formData.linkedin}
                      onChange={(e) => handleChange('linkedin', e.target.value)}
                      disabled={!isEditing}
                      placeholder={isEditing ? 'https://linkedin.com/in/username' : 'Not provided'}
                      className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none ${
                        isEditing
                          ? 'border-slate-200 bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 placeholder:text-slate-300'
                          : 'border-transparent bg-slate-50 text-navy-900'
                      }`}
                    />
                  </div>

                  {/* Bio - Full Width */}
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-navy-900 mb-2">
                      <FileText className="w-4 h-4 text-slate-400" />
                      Bio / About
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => handleChange('bio', e.target.value)}
                      disabled={!isEditing}
                      rows={4}
                      placeholder={isEditing ? 'Tell us a bit about yourself and your role...' : 'No bio added yet'}
                      className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none resize-none ${
                        isEditing
                          ? 'border-slate-200 bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 placeholder:text-slate-300'
                          : 'border-transparent bg-slate-50 text-navy-900'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h4 className="font-semibold text-amber-800 text-sm">Security Reminder</h4>
                <p className="text-amber-700 text-sm mt-1">
                  To change your password or email, please contact our support team at{' '}
                  <a href="https://mail.google.com/mail/?view=cm&fs=1&to=info@claritasverify.com&su=Account%20Support%20Request&body=Hi%20Claritas%20Verify%20Support%2C%0A%0A" target="_blank" rel="noopener noreferrer" className="font-semibold underline">
                    info@claritasverify.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
