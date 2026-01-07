import React, { createContext, useContext, useState, useEffect } from 'react';
import { MarketplaceItem } from '@types';
import { storageService } from '@services/storageService';
import { STORAGE_KEYS } from '@utils/constants';
import { useAuth } from './AuthContext';

interface MarketplaceContextType {
  items: MarketplaceItem[];
  loading: boolean;
  addItem: (item: Omit<MarketplaceItem, 'id' | 'sellerId'>) => Promise<boolean>;
  updateItem: (id: string, item: Partial<MarketplaceItem>) => Promise<boolean>;
  deleteItem: (id: string) => Promise<boolean>;
  getItem: (id: string) => MarketplaceItem | undefined;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(
  undefined,
);

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const allItems = await storageService.getItem<MarketplaceItem[]>(
        STORAGE_KEYS.MARKETPLACE_ITEMS,
      ) || [];
      setItems(allItems);
    } catch (error) {
      console.error('Error loading marketplace items:', error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (
    itemData: Omit<MarketplaceItem, 'id' | 'sellerId'>,
  ): Promise<boolean> => {
    if (!user) return false;

    try {
      const allItems = await storageService.getItem<MarketplaceItem[]>(
        STORAGE_KEYS.MARKETPLACE_ITEMS,
      ) || [];
      const newItem: MarketplaceItem = {
        ...itemData,
        id: Date.now().toString(),
        sellerId: user.id,
      };

      allItems.push(newItem);
      await storageService.setItem(STORAGE_KEYS.MARKETPLACE_ITEMS, allItems);
      setItems(allItems);
      return true;
    } catch (error) {
      console.error('Error adding item:', error);
      return false;
    }
  };

  const updateItem = async (
    id: string,
    itemData: Partial<MarketplaceItem>,
  ): Promise<boolean> => {
    try {
      const allItems = await storageService.getItem<MarketplaceItem[]>(
        STORAGE_KEYS.MARKETPLACE_ITEMS,
      ) || [];
      const index = allItems.findIndex(item => item.id === id);

      if (index === -1) return false;

      allItems[index] = { ...allItems[index], ...itemData };
      await storageService.setItem(STORAGE_KEYS.MARKETPLACE_ITEMS, allItems);
      setItems(allItems);
      return true;
    } catch (error) {
      console.error('Error updating item:', error);
      return false;
    }
  };

  const deleteItem = async (id: string): Promise<boolean> => {
    try {
      const allItems = await storageService.getItem<MarketplaceItem[]>(
        STORAGE_KEYS.MARKETPLACE_ITEMS,
      ) || [];
      const filteredItems = allItems.filter(item => item.id !== id);
      await storageService.setItem(STORAGE_KEYS.MARKETPLACE_ITEMS, filteredItems);
      setItems(filteredItems);
      return true;
    } catch (error) {
      console.error('Error deleting item:', error);
      return false;
    }
  };

  const getItem = (id: string): MarketplaceItem | undefined => {
    return items.find(item => item.id === id);
  };

  return (
    <MarketplaceContext.Provider
      value={{
        items,
        loading,
        addItem,
        updateItem,
        deleteItem,
        getItem,
      }}>
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = (): MarketplaceContextType => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within MarketplaceProvider');
  }
  return context;
};

