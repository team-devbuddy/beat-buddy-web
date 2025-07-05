import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';
import { GetHistory } from '@/lib/action';
import { postFilter } from '@/lib/actions/recommend-controller/postFilter';
import { shuffleArray } from '@/lib/utils/shuffleArray';

const regionTags = ['HONGDAE', 'ITAEWON', 'GANGNAM/SINSA', 'APGUJEONG', 'OTHERS'];
const genreTags = ['HIPHOP', 'R&B', 'EDM', 'HOUSE', 'TECHNO', 'SOUL&FUNK', 'ROCK', 'LATIN', 'K-POP', 'POP'];
const moodTags = ['CLUB', 'PUB', 'ROOFTOP', 'DEEP', 'COMMERCIAL', 'CHILL', 'EXOTIC', 'HUNTING'];

const atmosphereMap: { [key: string]: string } = {
  CLUB: '클럽',
  PUB: '펍',
  ROOFTOP: '루프탑',
  DEEP: '딥한',
  COMMERCIAL: '커머셜한',
  CHILL: '칠한',
  EXOTIC: '이국적인',
  HUNTING: '헌팅',
};

const genresMap: { [key: string]: string } = {
  HIPHOP: 'HIPHOP',
  'R&B': 'R&B',
  EDM: 'EDM',
  HOUSE: 'HOUSE',
  TECHNO: 'TECHNO',
  'SOUL&FUNK': 'SOUL&FUNK',
  ROCK: 'ROCK',
  LATIN: 'LATIN',
  'K-POP': 'K-POP',
  POP: 'POP',
};

const locationsMap: { [key: string]: string } = {
  HONGDAE: '홍대',
  ITAEWON: '이태원',
  'GANGNAM/SINSA': '강남/신사',
  APGUJEONG: '압구정',
  OTHERS: '기타',
};

const translateTag = (tag: string) => {
  const translatedTag = atmosphereMap[tag] || genresMap[tag] || locationsMap[tag] || tag;
  return translatedTag;
};

interface FilterProps {
  setFilteredClubs: (clubs: any[]) => void;
  BBPClubs: any[];
}

const Filter = ({ setFilteredClubs, BBPClubs }: FilterProps) => {
  const [preferences, setPreferences] = useState<string[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const accessToken = useRecoilValue(accessTokenState);

  useEffect(() => {
    const fetchPreferences = async () => {
      if (accessToken) {
        try {
          const response = await GetHistory(accessToken);
          const history = await response.json();
          const recentArchive = history[0];
          if (recentArchive && recentArchive.preferenceList) {
            const shuffledPreferences = shuffleArray([...recentArchive.preferenceList]);
            setPreferences(shuffledPreferences);
          }
        } catch (error) {
          console.error('Error fetching preferences:', error);
        }
      }
    };

    fetchPreferences();
  }, [accessToken]);

  useEffect(() => {
    const fetchFilteredClubs = async () => {
      if (selectedFilters.length > 0) {
        const filters = {
          regionTags: selectedFilters.filter(tag => regionTags.includes(tag)),
          moodTags: selectedFilters.filter(tag => moodTags.includes(tag)),
          genreTags: selectedFilters.filter(tag => genreTags.includes(tag)),
        };

        try {
          const clubs = await postFilter(filters, accessToken);
          setFilteredClubs(clubs);
        } catch (error) {
          console.error('Error fetching filtered clubs:', error);
        }
      } else {
        setFilteredClubs(BBPClubs);
      }
    };

    fetchFilteredClubs();
  }, [selectedFilters, accessToken, setFilteredClubs, BBPClubs]);

  const handleFilterClick = (filter: string) => {
    setSelectedFilters((prevFilters) =>
      prevFilters.includes(filter) ? prevFilters.filter(f => f !== filter) : [...prevFilters, filter]
    );
  };

  return (
    <div className="mt-[0.75rem]  flex flex-wrap gap-[0.5rem] bg-BG-black px-[1.25rem] text-body2-15-medium">
      {preferences.length > 0 ? (
        preferences.map((filter, index) => (
          <button
            key={index}
            className={`box-border text-body2-15-medium rounded-[0.5rem] px-[0.62rem] py-[0.25rem] ${
              selectedFilters.includes(filter) ? 'bg-sub2 text-main' : 'border-transparent bg-gray700 text-gray300'
            } active:scale-95 transition-transform duration-150`}
            onClick={() => handleFilterClick(filter)}>
            {translateTag(filter)} 
          </button>
        ))
      ) : (
        <p className="text-white">Loading filters...</p>
      )}
    </div>
  );
};

export default Filter;
