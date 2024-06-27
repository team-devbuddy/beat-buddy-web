// 온보딩 - 이용약관
export interface Term {
  id: number;
  label: string;
  isRequired: boolean;
  checked?: boolean;
}

export interface Club {
  id: number;
  name: string;
  location: string;
  genre1: string;
  genre2: string;
  imageUrl: string;
  likes: number;
}
