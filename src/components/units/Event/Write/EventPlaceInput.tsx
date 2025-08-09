'use client';

import { useEffect, useState } from 'react';
import { getESsearch } from '@/lib/actions/event-controller/event-write-controller/getESsearch';
import { useRecoilValue, useRecoilState } from 'recoil';
import { accessTokenState, eventFormState } from '@/context/recoil-context';

const TOP_ROW_PLACES = ['이태원', '홍대', '강남 · 신사'];
const BOTTOM_ROW_PLACES = ['압구정로데오', '기타'];

// 화면 표시용 텍스트를 실제 요청용 텍스트로 변환하는 함수
const convertDisplayToRequest = (displayText: string): string => {
  const conversionMap: { [key: string]: string } = {
    압구정로데오: '압구정 로데오',
    '강남 · 신사': '강남 신사',
  };

  return conversionMap[displayText] || displayText;
};

interface Venue {
  venueId: number;
  englishName: string;
  koreanName: string;
  address: string;
}

export default function EventPlaceInput() {
  const [eventForm, setEventForm] = useRecoilState(eventFormState);
  const [suggestions, setSuggestions] = useState<Venue[]>([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedRecommendedPlace, setSelectedRecommendedPlace] = useState<string | null>(null);
  const [isFinalSelected, setIsFinalSelected] = useState(false); // ✅ 장소 최종 선택 여부

  const accessToken = useRecoilValue(accessTokenState) || '';
  const [debouncedPlace, setDebouncedPlace] = useState('');

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (!isFinalSelected) {
        setDebouncedPlace(eventForm.location.trim());
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [eventForm.location, isFinalSelected]);

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
    console.log('venue', venue.venueId);
    setEventForm({
      ...eventForm,
      location: venue.address,
      venueId: venue.venueId, // ✅ venueId 저장
    });
    setSelectedAddress(venue.address);
    setSelectedRecommendedPlace(null);
    setSuggestions([]);
    setIsFinalSelected(true);
  };

  const handleRecommendedClick = (loc: string) => {
    setSelectedRecommendedPlace(loc);
    const requestText = convertDisplayToRequest(loc);
    setEventForm({ ...eventForm, region: requestText });
    // ✅ 추천 선택은 검색이나 인풋값에 영향을 주지 않음
  };

  // 초기 region 값이 설정되어 있으면 해당 버튼을 선택된 상태로 표시
  useEffect(() => {
    if (eventForm.region && !selectedRecommendedPlace) {
      setSelectedRecommendedPlace(eventForm.region);
    }
  }, [eventForm.region, selectedRecommendedPlace]);

  return (
    <div className="bg-BG-black px-5">
      <label className="mb-[0.62rem] flex items-center text-[1rem] font-bold text-white">장소</label>

      <input
        type="text"
        className={`w-full border-b border-gray300 bg-BG-black px-4 py-3 text-[0.8125rem] text-gray100 placeholder-gray300 safari-input-fix focus:outline-none ${
          eventForm.location ? 'border-main' : ''
        }`}
        placeholder="ex) 서울특별시 마포구 와우산로 94"
        value={eventForm.location}
        onChange={(e) => {
          setEventForm({ ...eventForm, location: e.target.value });
          setSelectedRecommendedPlace(null);
          setIsFinalSelected(false); // ✅ 인풋값 변경 시 다시 검색 가능하도록
        }}
      />

      {/* 검색 결과 */}
      {suggestions.length > 0 && !isFinalSelected && (
        <div className="mt-[0.62rem] flex justify-between">
          <div className="flex flex-wrap gap-[0.5rem]">
            {suggestions.map((venue) => (
              <button
                key={venue.venueId}
                onClick={() => handleSelectVenue(venue)}
                className="truncate rounded-[0.5rem] bg-gray700 px-[0.38rem] py-1 text-[0.8125rem] text-main">
                {venue.koreanName}
              </button>
            ))}
          </div>
          <button onClick={() => setSuggestions([])} className="whitespace-nowrap text-[0.8125rem] text-gray400">
            이 장소가 아니에요
          </button>
        </div>
      )}

      {/* 추천 버튼 - 윗줄 */}
      <div className="mt-[0.88rem] grid grid-cols-3 gap-[0.62rem]">
        {TOP_ROW_PLACES.map((loc) => {
          const isSelected = selectedRecommendedPlace === loc;
          return (
            <button
              key={loc}
              onClick={() => handleRecommendedClick(loc)}
              className={`rounded-[0.38rem] py-3 text-[0.875rem] ${
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
