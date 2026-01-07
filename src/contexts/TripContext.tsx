import React, {createContext, useContext, useState, useEffect} from 'react';
import {Trip} from '@types';
import {storageService} from '@services/storageService';
import {STORAGE_KEYS} from '@utils/constants';
import {useAuth} from './AuthContext';

interface TripContextType {
  trips: Trip[];
  loading: boolean;
  addTrip: (trip: Omit<Trip, 'id' | 'userId'>) => Promise<boolean>;
  updateTrip: (id: string, trip: Partial<Trip>) => Promise<boolean>;
  deleteTrip: (id: string) => Promise<boolean>;
  getTrip: (id: string) => Trip | undefined;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const {user} = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadTrips();
    } else {
      setTrips([]);
      setLoading(false);
    }
  }, [user]);

  const loadTrips = async () => {
    try {
      const allTrips = await storageService.getItem<Trip[]>(STORAGE_KEYS.TRIPS) || [];
      const userTrips = allTrips.filter(trip => trip.userId === user?.id);
      setTrips(userTrips);
    } catch (error) {
      console.error('Error loading trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTrip = async (tripData: Omit<Trip, 'id' | 'userId'>): Promise<boolean> => {
    if (!user) return false;

    try {
      const allTrips = await storageService.getItem<Trip[]>(STORAGE_KEYS.TRIPS) || [];
      const newTrip: Trip = {
        ...tripData,
        id: Date.now().toString(),
        userId: user.id,
      };

      allTrips.push(newTrip);
      await storageService.setItem(STORAGE_KEYS.TRIPS, allTrips);
      setTrips([...trips, newTrip]);
      return true;
    } catch (error) {
      console.error('Error adding trip:', error);
      return false;
    }
  };

  const updateTrip = async (id: string, tripData: Partial<Trip>): Promise<boolean> => {
    try {
      const allTrips = await storageService.getItem<Trip[]>(STORAGE_KEYS.TRIPS) || [];
      const index = allTrips.findIndex(trip => trip.id === id);
      
      if (index === -1) return false;

      allTrips[index] = {...allTrips[index], ...tripData};
      await storageService.setItem(STORAGE_KEYS.TRIPS, allTrips);
      
      const userTrips = allTrips.filter(trip => trip.userId === user?.id);
      setTrips(userTrips);
      return true;
    } catch (error) {
      console.error('Error updating trip:', error);
      return false;
    }
  };

  const deleteTrip = async (id: string): Promise<boolean> => {
    try {
      const allTrips = await storageService.getItem<Trip[]>(STORAGE_KEYS.TRIPS) || [];
      const filteredTrips = allTrips.filter(trip => trip.id !== id);
      await storageService.setItem(STORAGE_KEYS.TRIPS, filteredTrips);
      
      const userTrips = filteredTrips.filter(trip => trip.userId === user?.id);
      setTrips(userTrips);
      return true;
    } catch (error) {
      console.error('Error deleting trip:', error);
      return false;
    }
  };

  const getTrip = (id: string): Trip | undefined => {
    return trips.find(trip => trip.id === id);
  };

  return (
    <TripContext.Provider
      value={{
        trips,
        loading,
        addTrip,
        updateTrip,
        deleteTrip,
        getTrip,
      }}>
      {children}
    </TripContext.Provider>
  );
};

export const useTrips = (): TripContextType => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrips must be used within TripProvider');
  }
  return context;
};

