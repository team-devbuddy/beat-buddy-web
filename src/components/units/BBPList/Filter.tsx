import { useEffect, useState } from 'react';
import { GetHistory } from '@/lib/action';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';
import { postFilter } from '@/lib/actions/recommend-controller/postFilter';

const regionTags = ['HONGDAE', 'ITAEWON', 'GANGNAM/SINSA', 'APGUJEONG', 'OTHERS'];
const genreTags = ['HIPHOP', 'R&B', 'EDM', 'HOUSE', 'TECHNO', 'SOUL&FUNK', 'ROCK', 'LATIN', 'K-POP', 'POP'];
const moodTags = ['CLUB', 'PUB', 'ROOFTOP', 'DEEP', 'COMMERCIAL', 'CHILL', 'EXOTIC', 'HUNTING'];

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
            setPreferences([...recentArchive.preferenceList]);
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
    <div className="mt-[1.75rem] w-6/7 flex flex-wrap gap-[0.5rem] bg-BG-black px-[1rem] text-body2-15-medium">
      {preferences.length > 0 ? (
        preferences.map((filter, index) => (
          <button
            key={index}
            className={`box-border rounded-sm px-[0.62rem] py-[0.25rem] ${
              selectedFilters.includes(filter) ? 'bg-gray500 text-main2' : 'border-transparent bg-gray500 text-gray400'
            }`}
            onClick={() => handleFilterClick(filter)}>
            {filter}
          </button>
        ))
      ) : (
        <p className="text-white">Loading filters...</p>
      )}
    </div>
  );
};

export default Filter;