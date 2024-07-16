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

export interface ClubProps {
  club: Club;
}

export interface VenueHoursProps {
  hours: { [day: string]: string };
}

export interface HotVenuesProps {
  clubs: Club[];
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
  address: string;
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