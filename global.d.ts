
export {};

declare global {
  interface Window {
    naver: typeof naver;
  }

  namespace naver.maps {
    interface LatLngBounds {
      hasLatLng(latlng: LatLng): boolean;
    }
  }
}