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
