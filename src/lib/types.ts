
export interface Term {
  id: number;
  label: string;
  isRequired: boolean;
  checked?: boolean;
}

export interface Club {
  venueId: number;
  englishName: string;
  koreanName: string;
  location?: string;
  tagList: string[];
  logoUrl: string;
  address?: string;
  phone?: string;
  insta?: string;
  website?: string;
  operationHours?:  string ;
  backgroundUrl?: string[];
  heartbeatNum: number;
  description?: string | null;
}
export interface ClubProps {
  venue: Club;
  isHeartbeat: boolean;
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
