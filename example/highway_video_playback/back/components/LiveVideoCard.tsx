import React, { useState } from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';

interface LiveVideoCardProps {
    cameraNo: string;
    title: string;
    mjpegUrl: string;
    isMain?: boolean;
    onPress?: () => void;
}

export const LiveVideoCard: React.FC<LiveVideoCardProps> = ({
    cameraNo,
    title,
    mjpegUrl,
    isMain = false,
    onPress,
}) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    return (
        <TouchableOpacity
            style={[styles.container, isMain ? styles.mainCard : styles.secondaryCard]}
            onPress={onPress}
            activeOpacity={0.8}
            disabled={!onPress}>
            {/* LIVE 標籤 */}
            <View style={styles.liveTag}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>LIVE</Text>
            </View>

            {/* 影像容器 */}
            <View style={styles.videoContainer}>
                {loading && !error && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                )}

                {error ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>影像載入失敗</Text>
                    </View>
                ) : (
                    <Image
                        source={{ uri: mjpegUrl }}
                        style={styles.video}
                        resizeMode="cover"
                        onLoadStart={() => setLoading(true)}
                        onLoad={() => setLoading(false)}
                        onError={() => {
                            setLoading(false);
                            setError(true);
                        }}
                    />
                )}

                {/* 播放 icon（純視覺） */}
                {!loading && !error && (
                    <View style={styles.playIconContainer}>
                        <View style={styles.playIcon} />
                    </View>
                )}
            </View>

            {/* 攝影機名稱 */}
            <View style={styles.titleContainer}>
                <Text style={styles.title} numberOfLines={1}>
                    {title}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: colors.cardBackground,
    },
    mainCard: {
        marginBottom: 16,
    },
    secondaryCard: {
        marginBottom: 12,
    },
    liveTag: {
        position: 'absolute',
        top: 12,
        left: 12,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.live,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        zIndex: 10,
    },
    liveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.textPrimary,
        marginRight: 4,
    },
    liveText: {
        ...typography.caption,
        color: colors.textPrimary,
        fontWeight: 'bold',
    },
    videoContainer: {
        width: '100%',
        aspectRatio: 16 / 9,
        backgroundColor: '#000',
        position: 'relative',
    },
    video: {
        width: '100%',
        height: '100%',
    },
    loadingContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.overlay,
    },
    errorContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.cardBackground,
    },
    errorText: {
        ...typography.bodySmall,
        color: colors.textSecondary,
    },
    playIconContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -30 }, { translateY: -30 }],
    },
    playIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        borderLeftWidth: 20,
        borderLeftColor: colors.textPrimary,
        borderTopWidth: 15,
        borderTopColor: 'transparent',
        borderBottomWidth: 15,
        borderBottomColor: 'transparent',
    },
    titleContainer: {
        padding: 12,
    },
    title: {
        ...typography.bodySmall,
        color: colors.textPrimary,
    },
});
