const cameraDataSet = require('./app/assets/data/N3_NS_filtered.json');

const getAllDataByDirection = (direction) => {
    const key = `N3${direction}`;
    return cameraDataSet[key] || [];
};

const getAheadCameras = (
    currentKm,
    direction,
    limit = 5,
) => {
    const allData = getAllDataByDirection(direction);

    // 根據方向篩選前方資料（包含 facility 和 camera）
    const aheadData = allData.filter(item => {
        if (direction === 'N') {
            // 北上：里程 < 當前里程 (400 -> 0)
            return item.km < currentKm;
        } else {
            // 南下：里程 > 當前里程 (0 -> 400)
            return item.km > currentKm;
        }
    });

    // 排序
    const sorted = aheadData.sort((a, b) => {
        if (direction === 'N') {
            // 北上：由近到遠（里程遞減：19.9, 19.8...）即數值由大到小
            return b.km - a.km;
        } else {
            // 南下：由近到遠（里程遞增：20.1, 20.2...）即數值由小到大
            return a.km - b.km;
        }
    });

    // 取前 N 筆
    return sorted.slice(0, limit);
};

console.log("Testing with KM=22.0, Direction=N");
const result = getAheadCameras(22.0, 'N', 10);
console.log("Found items:", result.length);
result.forEach(item => {
    console.log(`Type: ${item.type}, KM: ${item.km}, Title: ${item.title}, CameraNo: ${item.cameraNo}`);
});

const camerasOnly = result.filter(item => item.type === 'camera' && item.cameraNo);
console.log("\nCameras Only (first 5):");
camerasOnly.slice(0, 5).forEach(item => {
    console.log(`KM: ${item.km}, CameraNo: ${item.cameraNo}`);
});
