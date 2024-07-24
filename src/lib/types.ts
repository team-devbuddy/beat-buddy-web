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
  tags: string[];
  imageUrl: string;
  likes: number;
  address: string;
  phone: string;
  email: string;
  website: string;
  hours: { [day: string]: string };
}
export interface Club extends HotChartProps {
  id: number;
  name: string;
  imageUrl: string;
  tags: string[];
  likes: number;
}

export interface ClubProps {
  club: Club;
}

export interface VenueHoursProps {
  hours: { [day: string]: string };
}

export interface HotVenuesProps {
  title?: string;
  description?: string;
}
export interface SearchHeaderProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

export interface SearchResultsProps {
  filteredClubs: Club[];
}
export interface RecentTermProps {
  addSearchTerm: (term: string) => void;
}

//구글맵
export interface GoogleMapProps {
  addresses: string[]; // 여러 주소를 받기 위해 배열로 수정
  minHeight?: string; // minHeight prop 추가
}

export interface HotVenuesProps {
  title?: string;
  description?: string;
}

export interface DropdownProps {
  options: string[];
  selectedOption: string;
  setSelectedOption: (option: string) => void;
  label: string;
}
export interface HotChartProps {
  heartbeatNum: number;
  tagList: any;
  venueId: number;
  englishName: string;
  koreanName: string;
}
export interface BBPProps {
  venueId: number;
  englishName: string;
  koreanName: string;
  tagList: string[];
  heartbeatNum: number;
}

export interface HeartbeatProps {
  heartbeatNum: number;
  venueId: number;
  venueName: string;
  venueImageUrl: string;
  liked: boolean;
}
