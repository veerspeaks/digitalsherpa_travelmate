import React from 'react';
import { View, Text, StyleSheet, Image, ImageSourcePropType } from 'react-native';
import { COLORS } from '@utils/constants';

interface EmptyStateProps {
  message: string;
  subMessage?: string;
  image?: ImageSourcePropType;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  subMessage,
  image,
}) => {
  return (
    <View style={styles.container}>
      {image && <Image source={image} style={styles.image} />}
      <Text style={styles.message}>{message}</Text>
      {subMessage && <Text style={styles.subMessage}>{subMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 24,
  },
  message: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subMessage: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
  },
});

