import React, { createContext, useContext, useState, useEffect } from 'react';
import { Event } from '@types';
import { storageService } from '@services/storageService';
import { STORAGE_KEYS } from '@utils/constants';
import { useAuth } from './AuthContext';

interface EventContextType {
  events: Event[];
  loading: boolean;
  addEvent: (event: Omit<Event, 'id' | 'createdBy' | 'currentParticipants'>) => Promise<boolean>;
  updateEvent: (id: string, event: Partial<Event>) => Promise<boolean>;
  deleteEvent: (id: string) => Promise<boolean>;
  joinEvent: (id: string) => Promise<boolean>;
  leaveEvent: (id: string) => Promise<boolean>;
  getEvent: (id: string) => Event | undefined;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const allEvents = await storageService.getItem<Event[]>(
        STORAGE_KEYS.EVENTS,
      ) || [];
      allEvents.sort((a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      setEvents(allEvents);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const addEvent = async (
    eventData: Omit<Event, 'id' | 'createdBy' | 'currentParticipants'>,
  ): Promise<boolean> => {
    if (!user) return false;

    try {
      const allEvents = await storageService.getItem<Event[]>(
        STORAGE_KEYS.EVENTS,
      ) || [];
      const newEvent: Event = {
        ...eventData,
        id: Date.now().toString(),
        createdBy: user.id,
        currentParticipants: [],
      };

      allEvents.push(newEvent);
      await storageService.setItem(STORAGE_KEYS.EVENTS, allEvents);
      setEvents(allEvents);
      return true;
    } catch (error) {
      console.error('Error adding event:', error);
      return false;
    }
  };

  const updateEvent = async (
    id: string,
    eventData: Partial<Event>,
  ): Promise<boolean> => {
    try {
      const allEvents = await storageService.getItem<Event[]>(
        STORAGE_KEYS.EVENTS,
      ) || [];
      const index = allEvents.findIndex(event => event.id === id);

      if (index === -1) return false;

      allEvents[index] = { ...allEvents[index], ...eventData };
      await storageService.setItem(STORAGE_KEYS.EVENTS, allEvents);
      setEvents(allEvents);
      return true;
    } catch (error) {
      console.error('Error updating event:', error);
      return false;
    }
  };

  const deleteEvent = async (id: string): Promise<boolean> => {
    try {
      const allEvents = await storageService.getItem<Event[]>(
        STORAGE_KEYS.EVENTS,
      ) || [];
      const filteredEvents = allEvents.filter(event => event.id !== id);
      await storageService.setItem(STORAGE_KEYS.EVENTS, filteredEvents);
      setEvents(filteredEvents);
      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      return false;
    }
  };

  const joinEvent = async (id: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const allEvents = await storageService.getItem<Event[]>(
        STORAGE_KEYS.EVENTS,
      ) || [];
      const eventIndex = allEvents.findIndex(event => event.id === id);

      if (eventIndex === -1) return false;

      const event = allEvents[eventIndex];
      
      if (event.currentParticipants.includes(user.id)) {
        return false;
      }

      if (event.maxParticipants && event.currentParticipants.length >= event.maxParticipants) {
        return false;
      }

      event.currentParticipants.push(user.id);
      await storageService.setItem(STORAGE_KEYS.EVENTS, allEvents);
      setEvents(allEvents);
      return true;
    } catch (error) {
      console.error('Error joining event:', error);
      return false;
    }
  };

  const leaveEvent = async (id: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const allEvents = await storageService.getItem<Event[]>(
        STORAGE_KEYS.EVENTS,
      ) || [];
      const eventIndex = allEvents.findIndex(event => event.id === id);

      if (eventIndex === -1) return false;

      const event = allEvents[eventIndex];
      const participantIndex = event.currentParticipants.indexOf(user.id);

      if (participantIndex > -1) {
        event.currentParticipants.splice(participantIndex, 1);
        await storageService.setItem(STORAGE_KEYS.EVENTS, allEvents);
        setEvents(allEvents);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error leaving event:', error);
      return false;
    }
  };

  const getEvent = (id: string): Event | undefined => {
    return events.find(event => event.id === id);
  };

  return (
    <EventContext.Provider
      value={{
        events,
        loading,
        addEvent,
        updateEvent,
        deleteEvent,
        joinEvent,
        leaveEvent,
        getEvent,
      }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = (): EventContextType => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within EventProvider');
  }
  return context;
};

