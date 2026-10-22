// 攝影機資料型別定義
export interface CameraData {
  type: 'camera' | 'facility';
  route: string;
  dir: 'N' | 'S';
  km: number;
  lat: number;
  lon: number;
  cameraNo: string | null;
  href?: string;
  title: string;
}

// JSON 資料結構
export interface CameraDataSet {
  N3N: CameraData[];
  N3S: CameraData[];
}

// 行進方向
export type Direction = 'N' | 'S';
