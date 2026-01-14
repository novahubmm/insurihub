'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  User, Bell, Shield, Palette, Globe, 
  Save, Camera, Mail, Lock, Eye, EyeOff 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

type SettingsTab = 'profile' | 'notifications' | 'privacy' | 'appearance';

export function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    emailNotifications: true,
    pushNotifications: true,
    postApprovalNotifications: true,
    messageNotifications: true,
    tokenNotifications: true,
    profileVisibility: 'public',
    showOnlineStatus: true,
    theme: 'light',
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ] as const;

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-gold-500 to-emerald-500 p-6">
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-white/80 mt-1">Manage your account preferences</p>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Tabs */}
          <div className="md:w-64 border-b md:border-b-0 md:border-r border-gray-200 p-4">
            <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-gold-50 text-gold-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            {activeTab === 'profile' && (
              <ProfileSettings 
                formData={formData} 
                setFormData={setFormData}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
              />
            )}
            {activeTab === 'notifications' && (
              <NotificationSettings formData={formData} setFormData={setFormData} />
            )}
            {activeTab === 'privacy' && (
              <PrivacySettings formData={formData} setFormData={setFormData} />
            )}
            {activeTab === 'appearance' && (
              <AppearanceSettings formData={formData} setFormData={setFormData} />
            )}

            {/* Save Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-white rounded-lg font-medium hover:from-gold-600 hover:to-gold-700 disabled:opacity-50 transition-all"
              >
                <Save className="w-5 h-5" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}


interface SettingsProps {
  formData: any;
  setFormData: (data: any) => void;
  showPassword?: boolean;
  setShowPassword?: (show: boolean) => void;
}

function ProfileSettings({ formData, setFormData, showPassword, setShowPassword }: SettingsProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
      
      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-gold-400 to-emerald-500 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {formData.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <button className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50">
            <Camera className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        <div>
          <p className="font-medium text-gray-900">{formData.name}</p>
          <p className="text-sm text-gray-500">Update your profile photo</p>
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Name
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
        </div>
      </div>

      {/* Change Password */}
      <div className="pt-4 border-t border-gray-200">
        <h3 className="text-md font-medium text-gray-900 mb-4">Change Password</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword?.(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotificationSettings({ formData, setFormData }: SettingsProps) {
  const toggles = [
    { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
    { key: 'pushNotifications', label: 'Push Notifications', desc: 'Receive push notifications in browser' },
    { key: 'postApprovalNotifications', label: 'Post Approvals', desc: 'Get notified when your posts are approved/rejected' },
    { key: 'messageNotifications', label: 'Messages', desc: 'Get notified for new messages' },
    { key: 'tokenNotifications', label: 'Token Updates', desc: 'Get notified for token transactions' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
      
      <div className="space-y-4">
        {toggles.map((toggle) => (
          <div key={toggle.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">{toggle.label}</p>
              <p className="text-sm text-gray-500">{toggle.desc}</p>
            </div>
            <button
              onClick={() => setFormData({ ...formData, [toggle.key]: !formData[toggle.key] })}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                formData[toggle.key] ? 'bg-gold-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  formData[toggle.key] ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function PrivacySettings({ formData, setFormData }: SettingsProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Privacy Settings</h2>
      
      {/* Profile Visibility */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Profile Visibility
        </label>
        <select
          value={formData.profileVisibility}
          onChange={(e) => setFormData({ ...formData, profileVisibility: e.target.value })}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
        >
          <option value="public">Public - Anyone can see your profile</option>
          <option value="registered">Registered Users Only</option>
          <option value="private">Private - Only you can see your profile</option>
        </select>
      </div>

      {/* Online Status */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <p className="font-medium text-gray-900">Show Online Status</p>
          <p className="text-sm text-gray-500">Let others see when you're online</p>
        </div>
        <button
          onClick={() => setFormData({ ...formData, showOnlineStatus: !formData.showOnlineStatus })}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            formData.showOnlineStatus ? 'bg-gold-500' : 'bg-gray-300'
          }`}
        >
          <div
            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
              formData.showOnlineStatus ? 'translate-x-7' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Danger Zone */}
      <div className="pt-6 border-t border-gray-200">
        <h3 className="text-md font-medium text-red-600 mb-4">Danger Zone</h3>
        <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
          Delete Account
        </button>
      </div>
    </div>
  );
}

function AppearanceSettings({ formData, setFormData }: SettingsProps) {
  const themes = [
    { id: 'light', label: 'Light', colors: ['bg-white', 'bg-gray-100'] },
    { id: 'dark', label: 'Dark', colors: ['bg-gray-900', 'bg-gray-800'] },
    { id: 'gold', label: 'Gold Premium', colors: ['bg-gold-50', 'bg-gold-100'] },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Appearance</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Theme
        </label>
        <div className="grid grid-cols-3 gap-4">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setFormData({ ...formData, theme: theme.id })}
              className={`p-4 rounded-lg border-2 transition-all ${
                formData.theme === theme.id
                  ? 'border-gold-500 ring-2 ring-gold-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex gap-1 mb-2">
                {theme.colors.map((color, i) => (
                  <div key={i} className={`w-6 h-6 rounded ${color}`} />
                ))}
              </div>
              <p className="text-sm font-medium text-gray-900">{theme.label}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 p-4 bg-gold-50 rounded-lg">
        <Globe className="w-5 h-5 text-gold-600" />
        <p className="text-sm text-gold-700">
          More themes coming soon with premium subscription!
        </p>
      </div>
    </div>
  );
}
