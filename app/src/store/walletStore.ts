import { create } from 'zustand';
import type { WalletTransaction } from '@/types';
import { mockTransactions, getTransactionsByUser, mockPartners, mockEndUsers } from '@/lib/mockData';
import { v4 as uuidv4 } from 'uuid';

interface WalletState {
  // State
  balance: number;
  transactions: WalletTransaction[];
  isLoading: boolean;
  error: string | null;

  // Actions
  loadWallet: (userId: string, userType: 'partner' | 'end_user') => void;
  deposit: (userId: string, amount: number, reference?: string) => Promise<boolean>;
  withdraw: (userId: string, amount: number) => Promise<boolean>;
  payForSubscription: (userId: string, amount: number, description: string) => Promise<boolean>;
  clearError: () => void;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  // Initial state
  balance: 0,
  transactions: [],
  isLoading: false,
  error: null,

  // Load wallet data
  loadWallet: (userId: string, userType: 'partner' | 'end_user') => {
    set({ isLoading: true });
    
    // Get balance from profile
    let balance = 0;
    if (userType === 'partner') {
      const partner = mockPartners.find(p => p.user_id === userId);
      balance = partner?.wallet_balance || 0;
    } else {
      const endUser = mockEndUsers.find(e => e.user_id === userId);
      balance = endUser?.wallet_balance || 0;
    }
    
    const transactions = getTransactionsByUser(
      userType === 'partner' 
        ? mockPartners.find(p => p.user_id === userId)?.id || ''
        : mockEndUsers.find(e => e.user_id === userId)?.id || ''
    );
    
    set({ 
      balance, 
      transactions,
      isLoading: false,
    });
  },

  // Deposit funds
  deposit: async (userId: string, amount: number, reference?: string) => {
    set({ isLoading: true, error: null });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Find profile
      const partner = mockPartners.find(p => p.user_id === userId);
      const endUser = mockEndUsers.find(e => e.user_id === userId);
      
      if (!partner && !endUser) {
        set({ isLoading: false, error: 'User profile not found' });
        return false;
      }
      
      const profileId = partner?.id || endUser?.id || '';
      
      // Create transaction
      const transaction: WalletTransaction = {
        id: uuidv4(),
        user_id: profileId,
        type: 'deposit',
        amount,
        currency: 'NGN',
        status: 'completed',
        description: 'Wallet funding',
        reference: reference || `DEP-${Date.now()}`,
        created_at: new Date().toISOString(),
      };
      
      mockTransactions.push(transaction);
      
      // Update balance
      if (partner) {
        partner.wallet_balance += amount;
      } else if (endUser) {
        endUser.wallet_balance += amount;
      }
      
      set(state => ({
        balance: state.balance + amount,
        transactions: [transaction, ...state.transactions],
        isLoading: false,
      }));
      
      return true;
    } catch (error) {
      set({ isLoading: false, error: 'Failed to process deposit' });
      return false;
    }
  },

  // Withdraw funds
  withdraw: async (userId: string, amount: number) => {
    set({ isLoading: true, error: null });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const { balance } = get();
      
      if (balance < amount) {
        set({ isLoading: false, error: 'Insufficient balance' });
        return false;
      }
      
      const partner = mockPartners.find(p => p.user_id === userId);
      const endUser = mockEndUsers.find(e => e.user_id === userId);
      const profileId = partner?.id || endUser?.id || '';
      
      const transaction: WalletTransaction = {
        id: uuidv4(),
        user_id: profileId,
        type: 'withdrawal',
        amount: -amount,
        currency: 'NGN',
        status: 'completed',
        description: 'Wallet withdrawal',
        reference: `WDR-${Date.now()}`,
        created_at: new Date().toISOString(),
      };
      
      mockTransactions.push(transaction);
      
      if (partner) {
        partner.wallet_balance -= amount;
      } else if (endUser) {
        endUser.wallet_balance -= amount;
      }
      
      set(state => ({
        balance: state.balance - amount,
        transactions: [transaction, ...state.transactions],
        isLoading: false,
      }));
      
      return true;
    } catch (error) {
      set({ isLoading: false, error: 'Failed to process withdrawal' });
      return false;
    }
  },

  // Pay for subscription
  payForSubscription: async (userId: string, amount: number, description: string) => {
    set({ isLoading: true, error: null });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { balance } = get();
      
      if (balance < amount) {
        set({ isLoading: false, error: 'Insufficient balance' });
        return false;
      }
      
      const partner = mockPartners.find(p => p.user_id === userId);
      const endUser = mockEndUsers.find(e => e.user_id === userId);
      const profileId = partner?.id || endUser?.id || '';
      
      const transaction: WalletTransaction = {
        id: uuidv4(),
        user_id: profileId,
        type: 'subscription_payment',
        amount: -amount,
        currency: 'NGN',
        status: 'completed',
        description,
        reference: `SUB-${Date.now()}`,
        created_at: new Date().toISOString(),
      };
      
      mockTransactions.push(transaction);
      
      if (partner) {
        partner.wallet_balance -= amount;
      } else if (endUser) {
        endUser.wallet_balance -= amount;
      }
      
      set(state => ({
        balance: state.balance - amount,
        transactions: [transaction, ...state.transactions],
        isLoading: false,
      }));
      
      return true;
    } catch (error) {
      set({ isLoading: false, error: 'Failed to process payment' });
      return false;
    }
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));

export default useWalletStore;
