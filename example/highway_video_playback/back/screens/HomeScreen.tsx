import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import { LiveVideoCard } from '../components/LiveVideoCard';
import { DrivingStatusBar } from '../components/DrivingStatusBar';
import { CameraListItem } from '../components/CameraListItem';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import {
    getAheadCameras,
    calculateDistance,
    getMjpegUrl,
} from '../data/cameraService';
import { CameraData, Direction } from '../data/types';

export const HomeScreen: React.FC = () => {
    // 模擬狀態（DEMO 用）
    const [currentKm, setCurrentKm] = useState(20.0); // 當前里程
    const [direction, setDirection] = useState<Direction>('N'); // 行進方向
    const [speed] = useState(85); // 模擬速度

    // 前方攝影機列表
    const [aheadCameras, setAheadCameras] = useState<CameraData[]>([]);
    const [mainCamera, setMainCamera] = useState<CameraData | null>(null);
    const [secondaryCamera, setSecondaryCamera] = useState<CameraData | null>(null);

    // 載入前方攝影機
    useEffect(() => {
        const cameras = getAheadCameras(currentKm, direction, 5);
        setAheadCameras(cameras);

        if (cameras.length > 0) {
            setMainCamera(cameras[0]);
        }
        if (cameras.length > 1) {
            setSecondaryCamera(cameras[1]);
        }
    }, [currentKm, direction]);

    // 切換主次影像
    const handleSwapCameras = () => {
        if (mainCamera && secondaryCamera) {
            setMainCamera(secondaryCamera);
            setSecondaryCamera(mainCamera);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={colors.background} />

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>前方路況</Text>
                    <View style={styles.notificationIcon}>
                        <Text style={styles.notificationText}>🔔</Text>
                    </View>
                </View>

                {/* 主影像卡 */}
                {mainCamera && (
                    <LiveVideoCard
                        cameraNo={mainCamera.cameraNo!}
                        title={mainCamera.title}
                        mjpegUrl={getMjpegUrl(mainCamera.cameraNo!)}
                        isMain={true}
                    />
                )}

                {/* 次要影像卡 */}
                {secondaryCamera && (
                    <LiveVideoCard
                        cameraNo={secondaryCamera.cameraNo!}
                        title={secondaryCamera.title}
                        mjpegUrl={getMjpegUrl(secondaryCamera.cameraNo!)}
                        isMain={false}
                        onPress={handleSwapCameras}
                    />
                )}

                {/* 行車狀態列 */}
                <DrivingStatusBar
                    speed={speed}
                    gpsStatus="良好"
                    direction={direction}
                />

                {/* 即將經過的攝影機清單 */}
                <View style={styles.listHeader}>
                    <Text style={styles.listTitle}>即將經過的攝影機</Text>
                    <Text style={styles.autoRefresh}>自動更新</Text>
                </View>

                {aheadCameras.slice(2).map((camera, index) => (
                    <CameraListItem
                        key={`${camera.cameraNo}-${index}`}
                        camera={camera}
                        distance={calculateDistance(currentKm, camera.km)}
                        mjpegUrl={getMjpegUrl(camera.cameraNo!)}
                    />
                ))}

                {/* 底部間距 */}
                <View style={styles.bottomSpacer} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
    },
    headerTitle: {
        ...typography.h1,
        color: colors.textPrimary,
    },
    notificationIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.cardBackground,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationText: {
        fontSize: 20,
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    listTitle: {
        ...typography.h3,
        color: colors.textPrimary,
    },
    autoRefresh: {
        ...typography.caption,
        color: colors.textSecondary,
    },
    bottomSpacer: {
        height: 32,
    },
});
