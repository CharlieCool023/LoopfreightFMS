import { useState, useEffect, useCallback } from 'react';
import type { SimulatedTracker } from '@/types';
import { trackerSimulation } from '@/lib/trackerSimulation';

export function useTrackerSimulation() {
  const [trackers, setTrackers] = useState<SimulatedTracker[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    // Subscribe to tracker updates
    const unsubscribe = trackerSimulation.subscribe((updatedTrackers) => {
      setTrackers(updatedTrackers);
    });

    // Start simulation
    trackerSimulation.start();
    setIsRunning(true);

    return () => {
      unsubscribe();
    };
  }, []);

  const start = useCallback(() => {
    trackerSimulation.start();
    setIsRunning(true);
  }, []);

  const stop = useCallback(() => {
    trackerSimulation.stop();
    setIsRunning(false);
  }, []);

  const getTracker = useCallback((id: string) => {
    return trackerSimulation.getTracker(id);
  }, []);

  const getStatistics = useCallback(() => {
    return trackerSimulation.getStatistics();
  }, []);

  const simulateEvent = useCallback((trackerId: string, eventType: 'speeding' | 'geofence' | 'offline') => {
    trackerSimulation.simulateEvent(trackerId, eventType);
  }, []);

  return {
    trackers,
    isRunning,
    start,
    stop,
    getTracker,
    getStatistics,
    simulateEvent,
  };
}

export default useTrackerSimulation;
