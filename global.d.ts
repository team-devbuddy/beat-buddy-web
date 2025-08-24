export {};

declare global {
  interface Window {
    naver: typeof naver;
  }

  interface LatLngBounds {
    hasLatLng(latlng: LatLng): boolean;
  }

  interface Window {
    MarkerClustering?: any;
  }
}
