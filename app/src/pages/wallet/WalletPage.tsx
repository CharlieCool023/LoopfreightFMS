import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Wallet, ArrowDownLeft, ArrowUpRight, CreditCard, Building2, Copy, CheckCircle } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useWalletStore } from '@/store/walletStore';
import { getPartnerByUserId, getEndUserByUserId, getTransactionsByUser } from '@/lib/mockData';

export function WalletPage() {
  const { user } = useAuthStore();
  const { balance, transactions, loadWallet, deposit } = useWalletStore();
  
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositMethod, setDepositMethod] = useState<'card' | 'bank'>('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user) {
      const userType = user.role === 'partner' ? 'partner' : 'end_user';
      loadWallet(user.id, userType);
    }
  }, [user]);

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const success = await deposit(user?.id || '', parseInt(depositAmount), `DEP-${Date.now()}`);
    
    setIsProcessing(false);
    
    if (success) {
      setShowDepositModal(false);
      setDepositAmount('');
      setCardDetails({ number: '', expiry: '', cvv: '', name: '' });
    }
  };

  const copyAccountNumber = () => {
    navigator.clipboard.writeText('0123456789');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const bankDetails = {
    bankName: 'LoopFreight Bank',
    accountNumber: '0123456789',
    accountName: 'LoopFreight FMS Ltd',
  };

  const basePath = user?.role === 'partner' ? '/partner' : '/user';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#F2F4F8]">Wallet</h1>
        <p className="text-sm text-[#A6AEB8]">Manage your funds and transactions</p>
      </div>

      {/* Balance Card */}
      <div className="glass-panel p-6 lime-glow">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#C8FF2E]/10 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-[#C8FF2E]" />
            </div>
            <div>
              <p className="text-sm text-[#A6AEB8]">Available Balance</p>
              <p className="text-3xl font-bold text-[#F2F4F8]">
                ₦{balance.toLocaleString()}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowDepositModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <ArrowDownLeft className="w-4 h-4" />
            Fund Wallet
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => setShowDepositModal(true)}
          className="glass-panel p-4 text-center hover:border-[#C8FF2E]/40 transition-colors"
        >
          <ArrowDownLeft className="w-5 h-5 text-[#C8FF2E] mx-auto mb-2" />
          <span className="text-sm text-[#F2F4F8]">Deposit</span>
        </button>
        <Link
          to={`${basePath}/subscription`}
          className="glass-panel p-4 text-center hover:border-[#C8FF2E]/40 transition-colors"
        >
          <CreditCard className="w-5 h-5 text-[#C8FF2E] mx-auto mb-2" />
          <span className="text-sm text-[#F2F4F8]">Pay Subscription</span>
        </Link>
      </div>

      {/* Transaction History */}
      <div className="glass-panel p-6">
        <h2 className="text-lg font-semibold text-[#F2F4F8] mb-4">Transaction History</h2>
        
        {transactions.length > 0 ? (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-[#0B0C0F]/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    transaction.type === 'deposit' || transaction.type === 'refund'
                      ? 'bg-green-500/10'
                      : 'bg-red-500/10'
                  }`}>
                    {transaction.type === 'deposit' || transaction.type === 'refund' ? (
                      <ArrowDownLeft className={`w-5 h-5 ${
                        transaction.type === 'deposit' || transaction.type === 'refund'
                          ? 'text-green-400'
                          : 'text-red-400'
                      }`} />
                    ) : (
                      <ArrowUpRight className="w-5 h-5 text-red-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#F2F4F8]">
                      {transaction.description}
                    </p>
                    <p className="text-xs text-[#A6AEB8]">
                      {new Date(transaction.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${
                    transaction.type === 'deposit' || transaction.type === 'refund'
                      ? 'text-green-400'
                      : 'text-red-400'
                  }`}>
                    {transaction.type === 'deposit' || transaction.type === 'refund' ? '+' : ''}
                    ₦{Math.abs(transaction.amount).toLocaleString()}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    transaction.status === 'completed'
                      ? 'bg-green-500/20 text-green-400'
                      : transaction.status === 'pending'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Wallet className="w-12 h-12 text-[#A6AEB8] mx-auto mb-3" />
            <p className="text-[#A6AEB8]">No transactions yet</p>
          </div>
        )}
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="glass-panel w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-[#F2F4F8] mb-4">Fund Wallet</h2>
              
              {/* Payment Method Tabs */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setDepositMethod('card')}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                    depositMethod === 'card'
                      ? 'bg-[#C8FF2E] text-[#0B0C0F]'
                      : 'bg-[#0B0C0F]/50 text-[#A6AEB8]'
                  }`}
                >
                  <CreditCard className="w-4 h-4 inline mr-2" />
                  Card
                </button>
                <button
                  onClick={() => setDepositMethod('bank')}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                    depositMethod === 'bank'
                      ? 'bg-[#C8FF2E] text-[#0B0C0F]'
                      : 'bg-[#0B0C0F]/50 text-[#A6AEB8]'
                  }`}
                >
                  <Building2 className="w-4 h-4 inline mr-2" />
                  Bank Transfer
                </button>
              </div>

              {depositMethod === 'card' ? (
                <form onSubmit={handleDeposit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#F2F4F8] mb-2">
                      Amount (₦)
                    </label>
                    <input
                      type="number"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="input-dark w-full"
                      placeholder="Enter amount"
                      min="1000"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#F2F4F8] mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                      className="input-dark w-full"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#F2F4F8] mb-2">
                        Expiry
                      </label>
                      <input
                        type="text"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                        className="input-dark w-full"
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#F2F4F8] mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                        className="input-dark w-full"
                        placeholder="123"
                        maxLength={3}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#F2F4F8] mb-2">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                      className="input-dark w-full"
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowDepositModal(false)}
                      className="flex-1 btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessing || !depositAmount}
                      className="flex-1 btn-primary disabled:opacity-50"
                    >
                      {isProcessing ? 'Processing...' : 'Pay Now'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="bg-[#0B0C0F]/50 rounded-lg p-4">
                    <p className="text-sm text-[#A6AEB8] mb-4">
                      Transfer to the account below. Your wallet will be credited once payment is confirmed.
                    </p>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-[#A6AEB8]">Bank Name</p>
                        <p className="text-sm font-medium text-[#F2F4F8]">{bankDetails.bankName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#A6AEB8]">Account Number</p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-[#F2F4F8] font-mono">
                            {bankDetails.accountNumber}
                          </p>
                          <button
                            onClick={copyAccountNumber}
                            className="p-1 text-[#C8FF2E] hover:bg-[#C8FF2E]/10 rounded"
                          >
                            {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-[#A6AEB8]">Account Name</p>
                        <p className="text-sm font-medium text-[#F2F4F8]">{bankDetails.accountName}</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowDepositModal(false)}
                    className="w-full btn-secondary"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WalletPage;
