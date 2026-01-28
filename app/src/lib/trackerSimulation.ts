import type { SimulatedTracker, GeoLocation, AssetType } from '@/types';
import { createSimulatedTrackers } from './mockData';

// Asset type speed ranges (km/h)
const SPEED_RANGES: Record<AssetType, { min: number; max: number }> = {
  bike: { min: 0, max: 80 },
  car: { min: 0, max: 120 },
  suv: { min: 0, max: 140 },
  van: { min: 0, max: 100 },
  truck: { min: 0, max: 90 },
  boat: { min: 0, max: 50 },
  helicopter: { min: 0, max: 250 },
  plane: { min: 0, max: 900 },
  ship: { min: 0, max: 30 },
  heavy_equipment: { min: 0, max: 40 },
};

// Lagos area bounds for simulation
const LAGOS_BOUNDS = {
  north: 6.65,
  south: 6.35,
  east: 3.55,
  west: 3.15,
};

class TrackerSimulationService {
  private trackers: SimulatedTracker[] = [];
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private subscribers: ((trackers: SimulatedTracker[]) => void)[] = [];
  private isRunning = false;

  constructor() {
    this.trackers = createSimulatedTrackers();
  }

  // Start the simulation
  start(updateInterval = 3000) {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.intervalId = setInterval(() => {
      this.updateTrackers();
      this.notifySubscribers();
    }, updateInterval);
  }

  // Stop the simulation
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
  }

  // Get current tracker states
  getTrackers(): SimulatedTracker[] {
    return [...this.trackers];
  }

  // Get a specific tracker
  getTracker(id: string): SimulatedTracker | undefined {
    return this.trackers.find(t => t.id === id);
  }

  // Subscribe to updates
  subscribe(callback: (trackers: SimulatedTracker[]) => void): () => void {
    this.subscribers.push(callback);
    // Immediately call with current state
    callback(this.getTrackers());
    
    // Return unsubscribe function
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  // Update tracker positions
  private updateTrackers() {
    this.trackers.forEach(tracker => {
      // Randomly decide if vehicle should change state
      const shouldChangeState = Math.random() < 0.1; // 10% chance
      
      if (shouldChangeState) {
        tracker.ignition_status = Math.random() > 0.2; // 80% chance of being on
        tracker.is_moving = tracker.ignition_status && Math.random() > 0.1;
      }

      if (tracker.is_moving && tracker.ignition_status) {
        // Update speed based on asset type
        const speedRange = SPEED_RANGES[tracker.asset_type];
        const targetSpeed = Math.random() * (speedRange.max - speedRange.min) + speedRange.min;
        // Smooth speed transition
        tracker.speed = tracker.speed * 0.7 + targetSpeed * 0.3;
        
        // Update heading (gradual turns)
        const headingChange = (Math.random() - 0.5) * 30; // Max 15 degree turn
        tracker.heading = (tracker.heading + headingChange) % 360;
        
        // Calculate new position based on speed and heading
        const speedKmh = tracker.speed;
        const speedMs = speedKmh / 3.6; // Convert to m/s
        const timeSeconds = 3; // Update interval
        const distanceMeters = speedMs * timeSeconds;
        
        // Convert distance to degrees (approximate)
        const distanceDegrees = distanceMeters / 111320; // ~111km per degree
        
        const headingRad = (tracker.heading * Math.PI) / 180;
        const newLat = tracker.currentLocation.lat + distanceDegrees * Math.cos(headingRad);
        const newLng = tracker.currentLocation.lng + distanceDegrees * Math.sin(headingRad) / Math.cos(tracker.currentLocation.lat * Math.PI / 180);
        
        // Keep within Lagos bounds (wrap around)
        tracker.currentLocation = {
          lat: this.clamp(newLat, LAGOS_BOUNDS.south, LAGOS_BOUNDS.north),
          lng: this.clamp(newLng, LAGOS_BOUNDS.west, LAGOS_BOUNDS.east),
          timestamp: new Date().toISOString(),
        };
        
        // Add to route history
        tracker.route.push(tracker.currentLocation);
        if (tracker.route.length > 50) {
          tracker.route.shift(); // Keep last 50 points
        }
      } else {
        // Vehicle stopped
        tracker.speed = tracker.speed * 0.8; // Decelerate
        if (tracker.speed < 1) tracker.speed = 0;
      }
    });
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }

  private notifySubscribers() {
    const trackers = this.getTrackers();
    this.subscribers.forEach(callback => {
      try {
        callback(trackers);
      } catch (error) {
        console.error('Error in tracker subscriber:', error);
      }
    });
  }

  // Simulate a specific event (speeding, geofence breach, etc.)
  simulateEvent(trackerId: string, eventType: 'speeding' | 'geofence' | 'offline') {
    const tracker = this.getTracker(trackerId);
    if (!tracker) return;

    switch (eventType) {
      case 'speeding':
        tracker.speed = 150; // Exceed typical limits
        break;
      case 'geofence':
        // Move tracker to a "restricted" area
        tracker.currentLocation = {
          lat: 6.40,
          lng: 3.30,
          timestamp: new Date().toISOString(),
        };
        break;
      case 'offline':
        tracker.ignition_status = false;
        tracker.is_moving = false;
        tracker.speed = 0;
        break;
    }
    
    this.notifySubscribers();
  }

  // Get tracker statistics
  getStatistics() {
    const total = this.trackers.length;
    const moving = this.trackers.filter(t => t.is_moving).length;
    const idle = this.trackers.filter(t => t.ignition_status && !t.is_moving).length;
    const offline = this.trackers.filter(t => !t.ignition_status).length;
    
    return {
      total,
      moving,
      idle,
      offline,
      averageSpeed: this.trackers.reduce((sum, t) => sum + t.speed, 0) / total,
    };
  }
}

// Export singleton instance
export const trackerSimulation = new TrackerSimulationService();

// Hook for React components
export function useTrackerSimulation() {
  return trackerSimulation;
}
