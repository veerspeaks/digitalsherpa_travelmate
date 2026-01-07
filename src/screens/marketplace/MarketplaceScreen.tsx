import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useMarketplace } from '@contexts/MarketplaceContext';
import { MarketplaceItemCard } from '@components/marketplace/MarketplaceItemCard';
import { EmptyState } from '@components/common/EmptyState';
import { LoadingSpinner } from '@components/common/LoadingSpinner';
import { Input } from '@components/common/Input';
import { CATEGORIES } from '@utils/constants';
import { COLORS } from '@utils/constants';

export const MarketplaceScreen: React.FC<{ navigation: any }> = ({
  navigation,
}) => {
  const { items, loading } = useMarketplace();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredItems = items.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Marketplace</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() =>
            navigation.navigate('MarketplaceItemDetail', { itemId: null })
          }>
          <Text style={styles.addButtonText}>+ Sell Item</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filters}>
        <Input
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search items..."
          containerStyle={styles.searchInput}
        />

        <View style={styles.categories}>
          <TouchableOpacity
            style={[
              styles.categoryChip,
              !selectedCategory && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(null)}>
            <Text
              style={[
                styles.categoryChipText,
                !selectedCategory && styles.categoryChipTextActive,
              ]}>
              All
            </Text>
          </TouchableOpacity>
          {CATEGORIES.MARKETPLACE.map(category => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                selectedCategory === category && styles.categoryChipActive,
              ]}
              onPress={() =>
                setSelectedCategory(
                  selectedCategory === category ? null : category,
                )
              }>
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === category && styles.categoryChipTextActive,
                ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {filteredItems.length === 0 ? (
        <EmptyState
          image={require('../../assets/6.png')}
          message="No items found"
          subMessage={
            items.length === 0
              ? "Tap the button above to list your first item"
              : "Try adjusting your search or filters"
          }
        />
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <MarketplaceItemCard
              item={item}
              onPress={() =>
                navigation.navigate('MarketplaceItemDetail', { itemId: item.id })
              }
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  brandingContainer: {
    backgroundColor: COLORS.white,
    paddingTop: 50,
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF7F50',
    letterSpacing: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 30,
  },
  addButtonText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  filters: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchInput: {
    marginBottom: 12,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  categoryChipText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
  },
  categoryChipTextActive: {
    color: COLORS.white,
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
});

