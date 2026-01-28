import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, CheckCircle, Clock, AlertTriangle, Calendar, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useTrackerStore } from '@/store/trackerStore';
import { useWalletStore } from '@/store/walletStore';
import { getPartnerByUserId, getEndUserByUserId, mockSubscriptions } from '@/lib/mockData';
import type { BillingCycle, SubscriptionTier } from '@/types';

const tierPrices: Record<SubscriptionTier, Record<BillingCycle, number>> = {
  class_a: {
    monthly: 1000,
    quarterly: 2700,
    biannual: 5400,
    yearly: 12000,
  },
  class_b: {
    monthly: 2500,
    quarterly: 6750,
    biannual: 13500,
    yearly: 30000,
  },
  class_c: {
    monthly: 10000,
    quarterly: 27000,
    biannual: 54000,
    yearly: 120000,
  },
};

const tierNames: Record<SubscriptionTier, string> = {
  class_a: 'Class A (Light)',
  class_b: 'Class B (Heavy)',
  class_c: 'Class C (Premium)',
};

const cycleNames: Record<BillingCycle, string> = {
  monthly: 'Monthly',
  quarterly: 'Quarterly (3 months)',
  biannual: 'Bi-annual (6 months)',
  yearly: 'Yearly (12 months)',
};

export function SubscriptionPage() {
  const { user } = useAuthStore();
  const { trackers, loadTrackers } = useTrackerStore();
  const { balance, payForSubscription } = useWalletStore();
  
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [selectedTracker, setSelectedTracker] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>('class_a');
  const [selectedCycle, setSelectedCycle] = useState<BillingCycle>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (user) {
      const partner = getPartnerByUserId(user.id);
      const endUser = getEndUserByUserId(user.id);
      
      if (partner) {
        loadTrackers(partner.id, 'partner');
      } else if (endUser) {
        loadTrackers(endUser.id, 'end_user');
      }
    }
  }, [user]);

  const handleRenew = async () => {
    if (!selectedTracker) return;
    
    setIsProcessing(true);
    
    const amount = tierPrices[selectedTier][selectedCycle];
    
    // Check wallet balance
    if (balance < amount) {
      alert('Insufficient wallet balance. Please fund your wallet first.');
      setIsProcessing(false);
      return;
    }
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const success = await payForSubscription(
      user?.id || '',
      amount,
      `Subscription renewal - ${tierNames[selectedTier]} - ${cycleNames[selectedCycle]}`
    );
    
    setIsProcessing(false);
    
    if (success) {
      setShowRenewModal(false);
      alert('Subscription renewed successfully!');
    }
  };

  const getDaysUntilExpiry = (expiresAt: string | undefined) => {
    if (!expiresAt) return 0;
    const expiry = new Date(expiresAt);
    const now = new Date();
    const diff = expiry.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const basePath = user?.role === 'partner' ? '/partner' : '/user';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#F2F4F8]">Subscriptions</h1>
        <p className="text-sm text-[#A6AEB8]">Manage your tracker subscriptions</p>
      </div>

      {/* Active Subscriptions */}
      <div className="glass-panel p-6">
        <h2 className="text-lg font-semibold text-[#F2F4F8] mb-4">Active Subscriptions</h2>
        
        {trackers.length > 0 ? (
          <div className="space-y-4">
            {trackers.map((tracker) => {
              const daysLeft = getDaysUntilExpiry(tracker.subscription_expires_at);
              const isExpiringSoon = daysLeft <= 7 && daysLeft > 0;
              const isExpired = daysLeft <= 0;

              return (
                <div
                  key={tracker.id}
                  className={`p-4 rounded-lg border ${
                    isExpired
                      ? 'bg-red-500/10 border-red-500/30'
                      : isExpiringSoon
                      ? 'bg-yellow-500/10 border-yellow-500/30'
                      : 'bg-[#0B0C0F]/50 border-[#C8FF2E]/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isExpired
                          ? 'bg-red-500/20'
                          : isExpiringSoon
                          ? 'bg-yellow-500/20'
                          : 'bg-[#C8FF2E]/10'
                      }`}>
                        <CreditCard className={`w-5 h-5 ${
                          isExpired
                            ? 'text-red-400'
                            : isExpiringSoon
                            ? 'text-yellow-400'
                            : 'text-[#C8FF2E]'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium text-[#F2F4F8]">{tracker.name}</p>
                        <p className="text-xs text-[#A6AEB8]">{tracker.device_id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {isExpired ? (
                        <span className="px-3 py-1 bg-red-500/20 text-red-400 text-sm rounded-full">
                          Expired
                        </span>
                      ) : isExpiringSoon ? (
                        <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-sm rounded-full">
                          {daysLeft} days left
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-[#C8FF2E]/20 text-[#C8FF2E] text-sm rounded-full">
                          Active
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#C8FF2E]/10 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-[#A6AEB8]">
                        Expires: {tracker.subscription_expires_at 
                          ? new Date(tracker.subscription_expires_at).toLocaleDateString()
                          : 'N/A'}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedTracker(tracker.id);
                        setShowRenewModal(true);
                      }}
                      className={`text-sm font-medium ${
                        isExpired || isExpiringSoon
                          ? 'text-red-400 hover:text-red-300'
                          : 'text-[#C8FF2E] hover:underline'
                      }`}
                    >
                      {isExpired ? 'Renew Now' : 'Renew'} →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <CreditCard className="w-12 h-12 text-[#A6AEB8] mx-auto mb-3" />
            <p className="text-[#A6AEB8]">No active subscriptions</p>
            <Link to={`${basePath}/trackers`} className="text-[#C8FF2E] hover:underline text-sm mt-2 inline-block">
              Add a tracker
            </Link>
          </div>
        )}
      </div>

      {/* Pricing Tiers */}
      <div className="glass-panel p-6">
        <h2 className="text-lg font-semibold text-[#F2F4F8] mb-4">Subscription Tiers</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['class_a', 'class_b', 'class_c'] as SubscriptionTier[]).map((tier) => (
            <div key={tier} className="bg-[#0B0C0F]/50 rounded-lg p-4 border border-[#C8FF2E]/20">
              <h3 className="font-semibold text-[#F2F4F8] mb-1">{tierNames[tier]}</h3>
              <p className="text-2xl font-bold text-[#C8FF2E] mb-2">
                ₦{tierPrices[tier].monthly.toLocaleString()}
                <span className="text-sm text-[#A6AEB8] font-normal">/month</span>
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-[#A6AEB8]">
                  <CheckCircle className="w-4 h-4 text-[#C8FF2E]" />
                  Real-time tracking
                </li>
                <li className="flex items-center gap-2 text-[#A6AEB8]">
                  <CheckCircle className="w-4 h-4 text-[#C8FF2E]" />
                  Geofence alerts
                </li>
                <li className="flex items-center gap-2 text-[#A6AEB8]">
                  <CheckCircle className="w-4 h-4 text-[#C8FF2E]" />
                  24/7 support
                </li>
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Renew Modal */}
      {showRenewModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="glass-panel w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-[#F2F4F8] mb-4">Renew Subscription</h2>
              
              {/* Tier Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#F2F4F8] mb-2">
                  Select Tier
                </label>
                <select
                  value={selectedTier}
                  onChange={(e) => setSelectedTier(e.target.value as SubscriptionTier)}
                  className="input-dark w-full"
                >
                  {(['class_a', 'class_b', 'class_c'] as SubscriptionTier[]).map((tier) => (
                    <option key={tier} value={tier}>
                      {tierNames[tier]} - ₦{tierPrices[tier].monthly.toLocaleString()}/month
                    </option>
                  ))}
                </select>
              </div>

              {/* Billing Cycle */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#F2F4F8] mb-2">
                  Billing Cycle
                </label>
                <div className="space-y-2">
                  {(['monthly', 'quarterly', 'biannual', 'yearly'] as BillingCycle[]).map((cycle) => (
                    <button
                      key={cycle}
                      onClick={() => setSelectedCycle(cycle)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                        selectedCycle === cycle
                          ? 'border-[#C8FF2E] bg-[#C8FF2E]/10'
                          : 'border-[#C8FF2E]/20 hover:border-[#C8FF2E]/40'
                      }`}
                    >
                      <span className="text-sm text-[#F2F4F8]">{cycleNames[cycle]}</span>
                      <span className="text-sm font-semibold text-[#C8FF2E]">
                        ₦{tierPrices[selectedTier][cycle].toLocaleString()}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-[#0B0C0F]/50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#A6AEB8]">Amount</span>
                  <span className="text-lg font-bold text-[#F2F4F8]">
                    ₦{tierPrices[selectedTier][selectedCycle].toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#A6AEB8]">Wallet Balance</span>
                  <span className={`text-sm ${
                    balance >= tierPrices[selectedTier][selectedCycle]
                      ? 'text-green-400'
                      : 'text-red-400'
                  }`}>
                    ₦{balance.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRenewModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRenew}
                  disabled={isProcessing || balance < tierPrices[selectedTier][selectedCycle]}
                  className="flex-1 btn-primary disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : 'Pay from Wallet'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SubscriptionPage;
