import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import { CameraData } from '../data/types';

interface CameraListItemProps {
    camera: CameraData;
    distance: number;
    mjpegUrl: string;
    onPress?: () => void;
}

export const CameraListItem: React.FC<CameraListItemProps> = ({
    camera,
    distance,
    mjpegUrl,
    onPress,
}) => {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.7}>
            {/* 縮圖 */}
            <View style={styles.thumbnailContainer}>
                <Image
                    source={{ uri: mjpegUrl }}
                    style={styles.thumbnail}
                    resizeMode="cover"
                />
            </View>

            {/* 資訊 */}
            <View style={styles.infoContainer}>
                <Text style={styles.title} numberOfLines={1}>
                    {camera.title}
                </Text>
                <View style={styles.distanceContainer}>
                    <Text style={styles.distanceIcon}>↑</Text>
                    <Text style={styles.distance}>距離 {distance.toFixed(1)} 公里</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: colors.cardBackground,
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
    },
    thumbnailContainer: {
        width: 80,
        height: 60,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#000',
    },
    thumbnail: {
        width: '100%',
        height: '100%',
    },
    infoContainer: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    title: {
        ...typography.body,
        color: colors.textPrimary,
        marginBottom: 4,
    },
    distanceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    distanceIcon: {
        fontSize: 14,
        color: colors.primary,
        marginRight: 4,
    },
    distance: {
        ...typography.bodySmall,
        color: colors.primary,
    },
});
