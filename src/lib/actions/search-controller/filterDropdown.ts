// 사용자의 현재 위치를 가져오는 함수
const getCurrentLocation = (): Promise<{ latitude: number; longitude: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error('위치 정보를 가져올 수 없습니다:', error);
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    );
  });
};

// 모든 베뉴 정보를 가져오는 함수 (초기 렌더링용)
export const getAllVenues = async (accessToken: string | null) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/venue-info`;

    console.log('🏢 모든 베뉴 정보 API 호출:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Access: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('모든 베뉴 정보 API 에러 응답:', {
        status: response.status,
        statusText: response.statusText,
        errorText,
        url,
      });
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('🏢 모든 베뉴 정보 API 응답:', data);

    // API 응답의 상세 구조 확인
    if (data.content && Array.isArray(data.content) && data.content.length > 0) {
      console.log('🏢 첫 번째 클럽 데이터 상세:', {
        firstClub: data.content[0],
        allKeys: Object.keys(data.content[0]),
        hasTagList: 'tagList' in data.content[0],
        tagListValue: data.content[0].tagList,
      });
    }

    // API 응답 구조에 따라 클럽 배열과 페이지 정보 분리
    if (data.content && Array.isArray(data.content)) {
      // Spring Boot Page 형태의 응답
      return {
        clubs: data.content,
        hasMore: !data.last,
        totalElements: data.totalElements,
        totalPages: data.totalPages,
        currentPage: data.number + 1,
      };
    } else if (Array.isArray(data)) {
      // 단순 배열 형태의 응답
      return {
        clubs: data,
        hasMore: false,
        totalElements: data.length,
        totalPages: 1,
        currentPage: 1,
      };
    } else {
      // 기타 형태의 응답
      return {
        clubs: data,
        hasMore: false,
        totalElements: 0,
        totalPages: 1,
        currentPage: 1,
      };
    }
  } catch (error) {
    console.error('모든 베뉴 정보 API 호출 실패:', error);
    throw error;
  }
};

// 통합된 검색 함수 (fetchVenues + filterDropdown)
export const searchVenues = async (filters: any, accessToken: string | null) => {
  try {
    // 통합된 API 엔드포인트 사용
    let url = `${process.env.NEXT_PUBLIC_SERVER_URL}/search/map/drop-down`;
    const params = new URLSearchParams();

    if (filters.sortCriteria === '가까운 순') {
      try {
        const location = await getCurrentLocation();
        params.append('latitude', location.latitude.toString());
        params.append('longitude', location.longitude.toString());
        console.log('현재 위치 정보:', location);
      } catch (error) {
        console.error('위치 정보 가져오기 실패:', error);
        // 위치 정보가 없으면 인기순으로 변경
        filters.sortCriteria = '인기순';
      }
    }

    // 페이지 정보 추가
    const page = filters.page || 1;
    const size = filters.size || 10; // 6에서 10으로 변경
    params.append('page', page.toString());
    params.append('size', size.toString());

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const requestBody: any = {
      sortCriteria: filters.sortCriteria || '인기순', // 기본값을 인기순으로 변경
    };

    // 빈 값이 아닌 경우에만 추가
    if (filters.keyword && filters.keyword.trim()) {
      requestBody.keyword = filters.keyword.trim();
    }
    if (filters.genreTag && filters.genreTag.trim()) {
      requestBody.genreTag = filters.genreTag.trim();
    }
    if (filters.regionTag && filters.regionTag.trim()) {
      requestBody.regionTag = filters.regionTag.trim();
    }

    // 가까운 순 정렬일 때 위도/경도 정보를 requestBody에도 포함
    if (filters.sortCriteria === '가까운 순' && params.has('latitude') && params.has('longitude')) {
      requestBody.latitude = parseFloat(params.get('latitude')!);
      requestBody.longitude = parseFloat(params.get('longitude')!);
    }

    console.log('검색 API 호출:', {
      url,
      filters,
      hasLocation: params.has('latitude'),
      requestBody,
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Access: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('검색 API 에러 응답:', {
        status: response.status,
        statusText: response.statusText,
        errorText,
        url,
        requestBody,
      });
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('검색 API 응답:', data);

    // API 응답 구조에 따라 클럽 배열과 페이지 정보 분리
    if (data.content && Array.isArray(data.content)) {
      // Spring Boot Page 형태의 응답
      return {
        clubs: data.content,
        hasMore: !data.last,
        totalElements: data.totalElements,
        totalPages: data.totalPages,
        currentPage: data.number + 1,
      };
    } else if (Array.isArray(data)) {
      // 단순 배열 형태의 응답
      const page = filters.page || 1;
      const size = filters.size || 20;
      const hasMoreData = data.length === size; // 요청한 크기만큼 오면 더 있을 가능성

      console.log('단순 배열 응답 처리:', {
        dataLength: data.length,
        requestedSize: size,
        currentPage: page,
        hasMore: hasMoreData,
      });

      return {
        clubs: data,
        hasMore: hasMoreData,
        totalElements: data.length,
        totalPages: 1,
        currentPage: page,
      };
    } else {
      // 기타 형태의 응답
      return {
        clubs: data,
        hasMore: false,
        totalElements: 0,
        totalPages: 1,
        currentPage: 1,
      };
    }
  } catch (error) {
    console.error('검색 API 호출 실패:', error);
    throw error;
  }
};

// 기존 함수명 호환성을 위한 별칭
export const filterDropdown = searchVenues;
export const fetchVenues = (query: string[], accessToken: string | null) => {
  const {
    keyword = '',
    genreTag = '',
    regionTag = '',
    sortCriteria = '인기순',
    page = 1,
    size = 10,
  } = {
    keyword: query.join(' '),
    sortCriteria: '인기순', // 기본값을 인기순으로 변경
  };
  return searchVenues(
    {
      keyword,
      genreTag,
      regionTag,
      sortCriteria,
      page,
      size,
    },
    accessToken,
  );
};
