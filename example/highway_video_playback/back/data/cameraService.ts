import { CameraData, CameraDataSet, Direction } from './types';

// 載入本地 JSON 資料
const cameraDataSet: CameraDataSet = require('../../assets/data/N3_NS_filtered.json');

/**
 * 取得指定方向的所有攝影機（僅 type === 'camera'）
 */
export const getCamerasByDirection = (direction: Direction): CameraData[] => {
    const key = `N3${direction}` as keyof CameraDataSet;
    const allData = cameraDataSet[key] || [];

    // 僅回傳有 cameraNo 的攝影機
    return allData.filter(item => item.type === 'camera' && item.cameraNo !== null);
};

/**
 * 計算前方攝影機
 * @param currentKm 當前里程
 * @param direction 行進方向（N: 北上, S: 南下）
 * @param limit 回傳數量限制（預設 5）
 */
export const getAheadCameras = (
    currentKm: number,
    direction: Direction,
    limit: number = 5,
): CameraData[] => {
    const cameras = getCamerasByDirection(direction);

    // 根據方向篩選前方攝影機
    const aheadCameras = cameras.filter(camera => {
        if (direction === 'N') {
            // 北上：攝影機里程 > 當前里程
            return camera.km > currentKm;
        } else {
            // 南下：攝影機里程 < 當前里程
            return camera.km < currentKm;
        }
    });

    // 排序
    const sorted = aheadCameras.sort((a, b) => {
        if (direction === 'N') {
            // 北上：由近到遠（km 遞增）
            return a.km - b.km;
        } else {
            // 南下：由近到遠（km 遞減）
            return b.km - a.km;
        }
    });

    // 取前 N 支
    return sorted.slice(0, limit);
};

/**
 * 計算距離（公里）
 */
export const calculateDistance = (
    currentKm: number,
    targetKm: number,
): number => {
    return Math.abs(targetKm - currentKm);
};

/**
 * 產生 MJPEG URL
 */
export const getMjpegUrl = (cameraNo: string): string => {
    return `https://cctvn.freeway.gov.tw/abs2mjpg/bmjpg?camera=${cameraNo}`;
};
