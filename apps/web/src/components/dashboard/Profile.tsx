'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { User, Mail, Coins, Edit, Save, X, Plus, History } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { formatDate, formatTokens } from '@/lib/utils';
import { tokensApi } from '@/lib/api/tokens';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import toast from 'react-hot-toast';

export function Profile() {
  const { user, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Profile updated successfully!');
      setIsEditing(false);
      await refreshUser();
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-8"
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-gold-400 to-emerald-400 rounded-2xl flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-600 capitalize">{user.role?.toLowerCase()}</p>
              <p className="text-sm text-gray-500">
                Member since {formatDate(user.createdAt)}
              </p>
            </div>
          </div>
          
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-outline flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>

        {/* Profile Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="input-primary"
              />
            ) : (
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <User className="w-4 h-4 text-gray-400" />
                <span>{user.name}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            {isEditing ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="input-primary"
              />
            ) : (
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>{user.email}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Type
            </label>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <span className={`px-2 py-1 text-xs rounded-full ${
                user.role?.toUpperCase() === 'ADMIN' 
                  ? 'bg-purple-100 text-purple-700'
                  : user.role?.toUpperCase() === 'AGENT'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {user.role?.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="btn-primary flex items-center gap-2"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" color="white" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Changes
            </button>
            
            <button
              onClick={handleCancel}
              className="btn-outline flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        )}
      </motion.div>

      {/* Token Balance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Token Balance</h2>
        
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gold-50 to-emerald-50 rounded-xl">
          <div className="flex items-center gap-3">
            <Coins className="w-8 h-8 text-gold-600" />
            <div>
              <p className="text-2xl font-bold text-gold-600">
                {formatTokens(user.tokenBalance || 0)}
              </p>
              <p className="text-sm text-gray-600">Available Tokens</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setShowHistoryModal(true)}
              className="btn-outline flex items-center gap-2"
            >
              <History className="w-4 h-4" />
              History
            </button>
            <button 
              onClick={() => setShowTokenModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Buy Tokens
            </button>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-xl">
          <p className="text-sm text-blue-700">
            <strong>How tokens work:</strong> Use tokens to create posts (10+ tokens each), 
            share files in chat, and access premium features. Request tokens and an admin will 
            approve your purchase.
          </p>
        </div>
      </motion.div>

      {/* Token Request Modal */}
      {showTokenModal && (
        <TokenRequestModal onClose={() => setShowTokenModal(false)} onSuccess={refreshUser} />
      )}

      {/* Transaction History Modal */}
      {showHistoryModal && (
        <TransactionHistoryModal onClose={() => setShowHistoryModal(false)} />
      )}
    </div>
  );
}

function TokenRequestModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [amount, setAmount] = useState(100);
  const [isLoading, setIsLoading] = useState(false);

  const tokenPackages = [
    { amount: 100, price: 5 },
    { amount: 500, price: 20 },
    { amount: 1000, price: 35 },
    { amount: 5000, price: 150 },
  ];

  const selectedPackage = tokenPackages.find(p => p.amount === amount) || tokenPackages[0];

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await tokensApi.requestTokens(selectedPackage.amount, selectedPackage.price);
      toast.success('Token request submitted! Waiting for admin approval.');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Failed to submit token request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-md card-premium p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gradient-premium">Buy Tokens</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-gray-600 text-sm">
            Select a token package. Your request will be reviewed by an admin.
          </p>

          <div className="grid grid-cols-2 gap-3">
            {tokenPackages.map((pkg) => (
              <button
                key={pkg.amount}
                onClick={() => setAmount(pkg.amount)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  amount === pkg.amount
                    ? 'border-gold-500 bg-gold-50'
                    : 'border-gray-200 hover:border-gold-300'
                }`}
              >
                <p className="text-lg font-bold text-gray-900">{formatTokens(pkg.amount)}</p>
                <p className="text-sm text-gray-600">tokens</p>
                <p className="text-gold-600 font-medium mt-1">${pkg.price}</p>
              </button>
            ))}
          </div>

          <div className="p-4 bg-gradient-to-r from-gold-50 to-emerald-50 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Selected Package:</span>
              <span className="font-bold text-gold-600">
                {formatTokens(selectedPackage.amount)} tokens for ${selectedPackage.price}
              </span>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {isLoading ? <LoadingSpinner size="sm" color="white" /> : <Coins className="w-4 h-4" />}
            {isLoading ? 'Submitting...' : 'Request Tokens'}
          </button>

          <p className="text-xs text-gray-500 text-center">
            Payment will be processed after admin approval
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function TransactionHistoryModal({ onClose }: { onClose: () => void }) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const data = await tokensApi.getTransactions();
      setTransactions(data.transactions || []);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-md card-premium p-6 max-h-[80vh] overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gradient-premium">Transaction History</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <History className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div key={tx.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{tx.description}</p>
                      <p className="text-xs text-gray-500">{formatDate(tx.createdAt)}</p>
                    </div>
                    <span className={`font-bold ${tx.amount > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}