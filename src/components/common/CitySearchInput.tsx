import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ViewStyle,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '@utils/constants';
import { POPULAR_CITIES } from '@utils/cities';

interface CitySearchInputProps {
    value: string;
    onSelect: (city: string) => void;
    placeholder?: string;
    containerStyle?: ViewStyle;
}

export const CitySearchInput: React.FC<CitySearchInputProps> = ({
    value,
    onSelect,
    placeholder = 'Select City',
    containerStyle,
}) => {
    const [query, setQuery] = useState(value);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleTextChange = (text: string) => {
        setQuery(text);
        if (text.length > 0) {
            const filtered = POPULAR_CITIES.filter(city =>
                city.toLowerCase().includes(text.toLowerCase())
            );
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const handleSelect = (city: string) => {
        setQuery(city);
        onSelect(city);
        setShowSuggestions(false);
    };

    // Sync internal state if external value changes (optional, but good for controlled components)
    React.useEffect(() => {
        setQuery(value);
    }, [value]);

    return (
        <View style={[styles.container, containerStyle, { zIndex: 1000 }]}>
            <View style={styles.inputContainer}>
                <Ionicons name="location-outline" size={20} color={COLORS.textLight} style={styles.icon} />
                <TextInput
                    style={styles.input}
                    value={query}
                    onChangeText={handleTextChange}
                    placeholder={placeholder}
                    placeholderTextColor={COLORS.textLight}
                />
            </View>

            {showSuggestions && suggestions.length > 0 && (
                <View style={styles.suggestionsContainer}>
                    <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled" style={{ maxHeight: 200 }}>
                        {suggestions.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.suggestionItem}
                                onPress={() => handleSelect(item)}>
                                <Ionicons name="location-sharp" size={16} color={COLORS.textLight} />
                                <Text style={styles.suggestionText}>{item}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        paddingHorizontal: 12,
        height: 50,
    },
    icon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: COLORS.text,
    },
    suggestionsContainer: {
        position: 'absolute',
        top: 55, // Height of input + margin
        left: 0,
        right: 0,
        backgroundColor: COLORS.white,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        overflow: 'hidden',
    },
    suggestionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        gap: 8,
    },
    suggestionText: {
        fontSize: 14,
        color: COLORS.text,
    },
});
