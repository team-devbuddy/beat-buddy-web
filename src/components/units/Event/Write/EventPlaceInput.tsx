'use client';

import { useEffect, useState } from 'react';
import { getESsearch } from '@/lib/actions/event-controller/event-write-controller/getESsearch';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';

const TOP_ROW_PLACES = ['이태원', '홍대', '강남 신사'];
const BOTTOM_ROW_PLACES = ['압구정로데오', '기타'];

interface Venue {
  venueId: number;
  englishName: string;
  koreanName: string;
  address: string;
}

export default function EventPlaceInput() {
  const [place, setPlace] = useState('');
  const [suggestions, setSuggestions] = useState<Venue[]>([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedRecommendedPlace, setSelectedRecommendedPlace] = useState<string | null>(null);
  const [isFinalSelected, setIsFinalSelected] = useState(false); // ✅ 장소 최종 선택 여부

  const accessToken = useRecoilValue(accessTokenState) || '';
  const [debouncedPlace, setDebouncedPlace] = useState('');

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (!isFinalSelected) {
        setDebouncedPlace(place.trim());
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [place, isFinalSelected]);

  useEffect(() => {
    if (debouncedPlace) fetchSuggestions(debouncedPlace);
    else setSuggestions([]);
  }, [debouncedPlace]);

  const fetchSuggestions = async (keyword: string) => {
    try {
      const data = await getESsearch(keyword, accessToken);
      setSuggestions(data?.slice(0, 3) || []);
    } catch (error) {
      console.error('장소 검색 실패', error);
      setSuggestions([]);
    }
  };

  const handleSelectVenue = (venue: Venue) => {
    setPlace(venue.koreanName);
    setSelectedAddress(venue.address);
    setSelectedRecommendedPlace(null);
    setSuggestions([]);
    setIsFinalSelected(true); // ✅ 최종 장소 선택 완료
  };

  const handleRecommendedClick = (loc: string) => {
    setSelectedRecommendedPlace(loc);
    // ✅ 추천 선택은 검색이나 인풋값에 영향을 주지 않음
  };

  return (
    <div className="bg-BG-black px-5 pt-7">
      <label className="mb-[0.62rem] flex items-center text-[1rem] font-bold text-white">장소</label>

      <input
        type="text"
        className="w-full border-b border-gray300 bg-BG-black px-4 py-3 text-sm text-gray100 placeholder-gray300 focus:outline-none"
        placeholder="ex) 서울특별시 마포구 와우산로 94"
        value={place}
        onChange={(e) => {
          setPlace(e.target.value);
          setSelectedRecommendedPlace(null);
          setIsFinalSelected(false); // ✅ 인풋값 변경 시 다시 검색 가능하도록
        }}
      />

      {/* 검색 결과 */}
      {suggestions.length > 0 && !isFinalSelected && (
        <div className="mt-2 flex justify-between">
          <div className="flex flex-wrap gap-[0.5rem]">
            {suggestions.map((venue) => (
              <button
                key={venue.venueId}
                onClick={() => handleSelectVenue(venue)}
                className="truncate rounded-[0.38rem] bg-gray700 px-[0.38rem] py-1 text-xs text-main">
                {venue.koreanName}
              </button>
            ))}
          </div>
          <button
            onClick={() => setSuggestions([])}
            className="whitespace-nowrap rounded-[0.38rem] px-[0.38rem] py-1 text-xs text-gray400">
            이 장소가 아니에요
          </button>
        </div>
      )}

      {/* 추천 버튼 - 윗줄 */}
      <div className="mt-4 grid grid-cols-3 gap-[0.62rem]">
        {TOP_ROW_PLACES.map((loc) => {
          const isSelected = selectedRecommendedPlace === loc;
          return (
            <button
              key={loc}
              onClick={() => handleRecommendedClick(loc)}
              className={`rounded-[0.38rem] py-3 text-sm ${
                isSelected ? 'border border-main bg-sub2 text-white' : 'bg-gray500 text-gray300'
              }`}>
              {loc}
            </button>
          );
        })}
      </div>

      {/* 추천 버튼 - 아랫줄 */}
      <div className="mt-3 grid grid-cols-2 gap-[0.62rem]">
        {BOTTOM_ROW_PLACES.map((loc) => {
          const isSelected = selectedRecommendedPlace === loc;
          return (
            <button
              key={loc}
              onClick={() => handleRecommendedClick(loc)}
              className={`rounded-[0.38rem] py-3 text-sm ${
                isSelected ? 'border border-main bg-sub2 text-white' : 'bg-gray500 text-gray300'
              }`}>
              {loc}
            </button>
          );
        })}
      </div>
    </div>
  );
}
