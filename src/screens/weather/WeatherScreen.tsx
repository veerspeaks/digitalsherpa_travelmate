import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useTrips } from '@contexts/TripContext';
import { weatherService } from '@services/weatherService';
import { WeatherData } from '@types';
import { Card } from '@components/common/Card';
import { LoadingSpinner } from '@components/common/LoadingSpinner';
import { EmptyState } from '@components/common/EmptyState';
import { Input } from '@components/common/Input';
import { Button } from '@components/common/Button';
import { CitySearchInput } from '@components/common/CitySearchInput';
import { COLORS } from '@utils/constants';

export const WeatherScreen: React.FC = () => {
  const { trips } = useTrips();
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (trips.length > 0) {
      const recentTrip = trips[trips.length - 1];
      loadWeather(recentTrip.destination.split(',')[0]);
    }
  }, [trips]);

  const loadWeather = async (loc: string) => {
    if (!loc.trim()) return;

    setLoading(true);
    setError('');
    const data = await weatherService.getWeather(loc.trim());

    if (data) {
      setWeather(data);
    } else {
      setWeather(null);
      setError('Could not fetch weather. Please check your API Key or the city name.');
    }
    setLoading(false);
  };

  const handleRefresh = async () => {
    if (weather) {
      setRefreshing(true);
      await loadWeather(weather.location.split(',')[0]);
      setRefreshing(false);
    } else if (location) {
      handleSearch();
    } else {
      setRefreshing(false);
    }
  };

  const handleSearch = () => {
    if (location.trim()) {
      loadWeather(location);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }>
      <View style={styles.content}>
        <View style={styles.searchSection}>
          <CitySearchInput
            value={location}
            onSelect={(city: string) => {
              setLocation(city);
              loadWeather(city);
            }}
            placeholder="Search city..."
            containerStyle={{ marginBottom: 0 }}
          />
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {loading && !weather ? (
          <LoadingSpinner />
        ) : weather ? (
          <>
            <Card style={styles.weatherCard}>
              <Text style={styles.location}>{weather.location}</Text>
              <Text style={styles.temperature}>{weather.temperature}°C</Text>
              <Text style={styles.condition}>{weather.condition}</Text>
              <Text style={styles.description}>{weather.description}</Text>

              <View style={styles.details}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Humidity</Text>
                  <Text style={styles.detailValue}>{weather.humidity}%</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Wind Speed</Text>
                  <Text style={styles.detailValue}>{weather.windSpeed} km/h</Text>
                </View>
              </View>
            </Card>

            <View style={styles.forecastSection}>
              <Text style={styles.forecastTitle}>5-Day Forecast</Text>
              {weather.forecast.map((day, index) => (
                <Card key={index} style={styles.forecastCard}>
                  <View style={styles.forecastRow}>
                    <View style={styles.forecastLeft}>
                      <Text style={styles.forecastDate}>{day.date}</Text>
                      <Text style={styles.forecastCondition}>{day.condition}</Text>
                    </View>
                    <View style={styles.forecastRight}>
                      <Text style={styles.forecastTemp}>
                        {day.high}° / {day.low}°
                      </Text>
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          </>
        ) : (
          !error && (
            <EmptyState
              image={require('../../assets/4.png')}
              message="Enter a city name to get weather information"
            />
          )
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 16,
  },
  searchSection: {
    marginBottom: 16,
  },
  searchInput: {
    marginBottom: 12,
  },
  searchButton: {
    marginTop: 0,
  },
  errorContainer: {
    padding: 16,
    backgroundColor: '#FFE5E5',
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    textAlign: 'center',
    fontSize: 14,
  },
  weatherCard: {
    alignItems: 'center',
    padding: 24,
    marginBottom: 16,
  },
  location: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  temperature: {
    fontSize: 64,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  condition: {
    fontSize: 20,
    color: COLORS.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 16,
    textTransform: 'capitalize',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  forecastSection: {
    marginTop: 8,
  },
  forecastTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  forecastCard: {
    marginBottom: 8,
  },
  forecastRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forecastLeft: {
    flex: 1,
  },
  forecastRight: {
    alignItems: 'flex-end',
  },
  forecastDate: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  forecastCondition: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  forecastTemp: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
});

