export interface Term {
  id: number;
  label: string;
  isRequired: boolean;
  checked?: boolean;
  url: string;
}

// src/lib/types.ts
export interface Club {
  id: number;
  venueId?: number; // 하트비트 상태와 매핑을 위한 필드 추가
  entranceFee: number;
  entranceNotice: string;
  isHeartbeat?: boolean; // optional로 변경
  tagList: any;
  createdAt: string;
  updatedAt: string;
  englishName: string;
  koreanName: string;
  region: string;
  phoneNum?: string;
  description: string | null;
  address: string;
  latitude?: number;
  longitude?: number;
  instaId: string;
  instaUrl: string;
  operationHours: {
    [key: string]: string;
  };
  logoUrl: string | null;
  backgroundUrl: string[];
  heartbeatNum: number;
  smokingAllowed: boolean;
  freeEntrance?: boolean; // API 응답에 있는 필드 추가
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
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

export interface SearchResultsProps {
  filteredClubs: Club[];
  searchQuery?: string;
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
export interface MapClub {
  id: number;
  address: string;
  englishName: string;
  tagList?: string[];
  isHeartbeat?: boolean;
}

export interface MagazineProps {
  magazineId: number;
  thumbImageUrl: string;
  title: string;
  content: string;
  totalCount: number;
  orderInHome: number;
  isLiked: boolean;
  currentIndex: number;
  picked: boolean;
}

export interface UserProfile {
  memberId: number;
  nickname: string;
  profileImageUrl: string;
  role: string;
  postCount: number;
  followerCount: number;
  followingCount: number;
  businessName?: string;
  isPostProfileCreated: boolean;
  postProfileNickname: string;
  postProfileImageUrl: string;
}

export interface EventDetail {
  eventId: number;
  title: string;
  content: string;
  images: string[];
  liked: boolean;
  likes: number;
  views: number;
  startDate: string;
  endDate: string;
  receiveInfo: boolean;
  receiveName: boolean;
  receiveGender: boolean;
  receivePhoneNumber: boolean;
  receiveSNSId: boolean;
  receiveAccompany: boolean;
  receiveMoney: boolean;
  depositAccount: string;
  depositAmount: number;
  entranceFee: number;
  entranceNotice: string;
  notice: string;
  region: string;
  isFreeEntrance: boolean;
  location: string;
  isAttending: boolean;
  isAuthor: boolean;
  memberName?: string;
  memberId?: number;
  isAnonymous?: boolean;
}

export interface Participant {
  eventId: number;
  memberId: number;
  name: string;
  gender: string;
  phoneNumber: string;
  isPaid: boolean;
  totalMember: number;
  createdAt: string;
}

export interface EventForm {
  title: string;
  content: string;
  images: string[];
  liked: boolean;
  likes: number;
  views: number;
  startDate: string;
  endDate: string;
}
