import { create } from 'zustand';
import type { Tracker, SimulatedTracker, GeoLocation, AssetType } from '@/types';
import { mockTrackers, getTrackersByOwner, getTrackerById } from '@/lib/mockData';
import { trackerSimulation } from '@/lib/trackerSimulation';
import { v4 as uuidv4 } from 'uuid';

interface TrackerState {
  // State
  trackers: Tracker[];
  simulatedTrackers: SimulatedTracker[];
  selectedTracker: Tracker | null;
  isLoading: boolean;
  error: string | null;
  unsubscribeSimulation: (() => void) | null;

  // Actions
  loadTrackers: (ownerId: string, ownerType: 'partner' | 'end_user') => void;
  addTracker: (tracker: Omit<Tracker, 'id' | 'created_at' | 'updated_at'>) => Promise<boolean>;
  addTrackersBulk: (trackers: Omit<Tracker, 'id' | 'created_at' | 'updated_at'>[]) => Promise<boolean>;
  updateTracker: (id: string, updates: Partial<Tracker>) => Promise<boolean>;
  deleteTracker: (id: string) => Promise<boolean>;
  selectTracker: (tracker: Tracker | null) => void;
  getTrackerById: (id: string) => Tracker | undefined;
  startSimulation: () => void;
  stopSimulation: () => void;
  clearError: () => void;
}

export const useTrackerStore = create<TrackerState>((set, get) => ({
  // Initial state
  trackers: [],
  simulatedTrackers: [],
  selectedTracker: null,
  isLoading: false,
  error: null,
  unsubscribeSimulation: null,

  // Load trackers for an owner
  loadTrackers: (ownerId: string, ownerType: 'partner' | 'end_user') => {
    set({ isLoading: true });
    
    const trackers = getTrackersByOwner(ownerId, ownerType);
    set({ 
      trackers, 
      isLoading: false,
    });
    
    // Start simulation if not already running
    if (!get().unsubscribeSimulation) {
      get().startSimulation();
    }
  },

  // Add single tracker
  addTracker: async (trackerData) => {
    set({ isLoading: true, error: null });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newTracker: Tracker = {
        ...trackerData,
        id: uuidv4(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      mockTrackers.push(newTracker);
      
      set(state => ({
        trackers: [...state.trackers, newTracker],
        isLoading: false,
      }));
      
      return true;
    } catch (error) {
      set({ isLoading: false, error: 'Failed to add tracker' });
      return false;
    }
  },

  // Add multiple trackers (bulk)
  addTrackersBulk: async (trackersData) => {
    set({ isLoading: true, error: null });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newTrackers: Tracker[] = trackersData.map(data => ({
        ...data,
        id: uuidv4(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));
      
      mockTrackers.push(...newTrackers);
      
      set(state => ({
        trackers: [...state.trackers, ...newTrackers],
        isLoading: false,
      }));
      
      return true;
    } catch (error) {
      set({ isLoading: false, error: 'Failed to add trackers' });
      return false;
    }
  },

  // Update tracker
  updateTracker: async (id: string, updates: Partial<Tracker>) => {
    set({ isLoading: true, error: null });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const trackerIndex = mockTrackers.findIndex(t => t.id === id);
      
      if (trackerIndex === -1) {
        set({ isLoading: false, error: 'Tracker not found' });
        return false;
      }
      
      mockTrackers[trackerIndex] = {
        ...mockTrackers[trackerIndex],
        ...updates,
        updated_at: new Date().toISOString(),
      };
      
      set(state => ({
        trackers: state.trackers.map(t => t.id === id ? mockTrackers[trackerIndex] : t),
        selectedTracker: state.selectedTracker?.id === id ? mockTrackers[trackerIndex] : state.selectedTracker,
        isLoading: false,
      }));
      
      return true;
    } catch (error) {
      set({ isLoading: false, error: 'Failed to update tracker' });
      return false;
    }
  },

  // Delete tracker
  deleteTracker: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const trackerIndex = mockTrackers.findIndex(t => t.id === id);
      
      if (trackerIndex === -1) {
        set({ isLoading: false, error: 'Tracker not found' });
        return false;
      }
      
      mockTrackers.splice(trackerIndex, 1);
      
      set(state => ({
        trackers: state.trackers.filter(t => t.id !== id),
        selectedTracker: state.selectedTracker?.id === id ? null : state.selectedTracker,
        isLoading: false,
      }));
      
      return true;
    } catch (error) {
      set({ isLoading: false, error: 'Failed to delete tracker' });
      return false;
    }
  },

  // Select tracker
  selectTracker: (tracker: Tracker | null) => {
    set({ selectedTracker: tracker });
  },

  // Get tracker by ID
  getTrackerById: (id: string) => {
    return getTrackersByOwner(id, 'partner').find(t => t.id === id) || 
           getTrackersByOwner(id, 'end_user').find(t => t.id === id);
  },

  // Start tracker simulation
  startSimulation: () => {
    const unsubscribe = trackerSimulation.subscribe((simulatedTrackers) => {
      set({ simulatedTrackers });
    });
    
    trackerSimulation.start();
    set({ unsubscribeSimulation: unsubscribe });
  },

  // Stop tracker simulation
  stopSimulation: () => {
    const { unsubscribeSimulation } = get();
    if (unsubscribeSimulation) {
      unsubscribeSimulation();
    }
    trackerSimulation.stop();
    set({ unsubscribeSimulation: null });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));

export default useTrackerStore;
