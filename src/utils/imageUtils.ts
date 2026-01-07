import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import { Platform, PermissionsAndroid, Alert } from 'react-native';

export const pickImage = async (useCamera = false): Promise<string | null> => {
    try {
        if (Platform.OS === 'android' && useCamera) {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
            );
            if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                Alert.alert('Permission needed', 'Camera permission is required');
                return null;
            }
        }

        const options = {
            mediaType: 'photo' as const,
            quality: 1 as const,
        };

        const result = useCamera
            ? await launchCamera(options)
            : await launchImageLibrary(options);

        if (result.didCancel || !result.assets || result.assets.length === 0) {
            return null;
        }

        const originalUri = result.assets[0].uri;
        if (!originalUri) return null;

        try {
            const compressed = await ImageResizer.createResizedImage(
                originalUri,
                1024,
                1024,
                'JPEG',
                80,
                0,
                undefined,
                false,
                { mode: 'contain' },
            );
            return compressed.uri;
        } catch (resizeError) {
            console.error('Resize error:', resizeError);
            return originalUri;
        }
    } catch (error) {
        console.error('Image picker error:', error);
        Alert.alert('Error', 'Failed to pick image');
        return null;
    }
};
