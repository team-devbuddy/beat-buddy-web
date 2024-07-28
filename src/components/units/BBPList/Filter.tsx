import { useEffect, useState } from 'react';
import { GetHistory } from '@/lib/action';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';

const Filter = () => {
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
            setPreferences(recentArchive.preferenceList);
          }
        } catch (error) {
          console.error('Error fetching preferences:', error);
        }
      }
    };

    fetchPreferences();
  }, [accessToken]);

  const handleFilterClick = (filter: string) => {
    setSelectedFilters((prevFilters) =>
      prevFilters.includes(filter) ? prevFilters.filter((item) => item !== filter) : [...prevFilters, filter],
    );
  };

  const handleAllFilterClick = () => {
    if (selectedFilters.length === preferences.length) {
      setSelectedFilters([]);
    } else {
      setSelectedFilters(preferences);
    }
  };

  return (
    <div className="mt-[1.75rem] flex flex-wrap gap-[0.5rem] bg-BG-black px-[1rem] text-body2-15-medium">
      <button
        className={`box-border rounded-sm border px-[0.62rem] py-[0.25rem] ${
          selectedFilters.length === preferences.length
            ? 'border-main2 bg-gray500 text-main2'
            : 'border-transparent bg-gray500 text-gray400'
        }`}
        onClick={handleAllFilterClick}>
        전체
      </button>
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
