export interface Term {
  id: number;
  label: string;
  isRequired: boolean;
  checked?: boolean;
  url: string;
}

// src/lib/types.ts
export interface Club {
  tagList: any;
  createdAt: string;
  updatedAt: string;
  venueId: number;
  englishName: string;
  koreanName: string;
  region: string;
  description: string | null;
  address: string;
  instaId: string;
  instaUrl: string;
  operationHours: {
    [key: string]: string;
  };
  logoUrl: string | null;
  backgroundUrl: string[];
  heartbeatNum: number;
  smokingAllowed: boolean;
}

export interface ClubProps {
  venue: Club;
  isHeartbeat: boolean;
  tagList: string[];
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
  setSearchQuery: React.Dispatch;
}

export interface SearchResultsProps {
  filteredClubs: Club[];
}

export interface RecentTermProps {
  addSearchTerm: (term: string) => void;
}

// 구글맵
export interface GoogleMapProps {
  addresses: string[];
  minHeight?: string;
}

export interface DropdownProps {
  options: string[];
  selectedOption: string;
  setSelectedOption: (option: string) => void;
  label: string;
}

export interface HeartbeatProps {
  venueId: number;
  englishName: string;
  koreanName: string;
  tagList: string[];
  heartbeatNum: number;
  logoUrl: string;
  isHeartbeat: boolean;
  backgroundUrl?: string[];
}

// 아카이브(히스토리) 페이지
export interface ArchiveHistoryProps {
  preferenceList: string[];
  updatedAt: string;
}

// 나의 하트비트
export interface HeartBeat {
  venueId: number;
  englishName: string;
  koreanName: string;
  tagList: string[];
  heartbeatNum: number;
  logoUrl: string;
  backgroundUrl: string[];
  isHeartbeat: boolean;
}
