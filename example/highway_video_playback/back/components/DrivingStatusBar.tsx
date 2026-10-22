import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import { Direction } from '../data/types';

interface DrivingStatusBarProps {
    speed: number; // km/h
    gpsStatus: string;
    direction: Direction;
}

export const DrivingStatusBar: React.FC<DrivingStatusBarProps> = ({
    speed,
    gpsStatus,
    direction,
}) => {
    return (
        <View style={styles.container}>
            {/* 目前速度 */}
            <View style={styles.item}>
                <Text style={styles.label}>目前速度</Text>
                <View style={styles.valueContainer}>
                    <Text style={styles.value}>{speed}</Text>
                    <Text style={styles.unit}>km/h</Text>
                </View>
            </View>

            {/* GPS 訊號 */}
            <View style={styles.item}>
                <Text style={styles.label}>GPS 訊號</Text>
                <View style={styles.valueContainer}>
                    <View style={styles.gpsIcon} />
                    <Text style={styles.gpsValue}>{gpsStatus}</Text>
                </View>
            </View>

            {/* 行進方向 */}
            <View style={styles.item}>
                <Text style={styles.label}>行進方向</Text>
                <View style={styles.valueContainer}>
                    <Text style={styles.directionIcon}>{direction === 'N' ? '↑' : '↓'}</Text>
                    <Text style={styles.value}>{direction === 'N' ? '往北' : '往南'}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: colors.cardBackground,
        borderRadius: 12,
        padding: 16,
        marginVertical: 16,
    },
    item: {
        flex: 1,
        alignItems: 'center',
    },
    label: {
        ...typography.caption,
        color: colors.textSecondary,
        marginBottom: 8,
    },
    valueContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    value: {
        ...typography.h2,
        color: colors.textPrimary,
    },
    unit: {
        ...typography.caption,
        color: colors.textSecondary,
        marginLeft: 4,
    },
    gpsIcon: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.success,
        marginRight: 6,
        marginTop: 6,
    },
    gpsValue: {
        ...typography.body,
        color: colors.success,
    },
    directionIcon: {
        fontSize: 24,
        color: colors.primary,
        marginRight: 4,
    },
});
