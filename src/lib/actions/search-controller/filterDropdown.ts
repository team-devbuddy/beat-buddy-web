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

// 통합된 검색 함수 (fetchVenues + filterDropdown)
export const searchVenues = async (filters: any, accessToken: string | null) => {
  try {
    // 통합된 API 엔드포인트 사용
    let url = `${process.env.NEXT_PUBLIC_SERVER_URL}/search/home/drop-down`;
    const params = new URLSearchParams();

    if (filters.sortCriteria === '거리순') {
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

    console.log('검색 API 호출:', {
      url,
      filters,
      hasLocation: params.has('latitude'),
    });

    const requestBody: any = {
      sortCriteria: filters.sortCriteria || '거리순', // 거리순을 기본값으로
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

    console.log('검색 API 요청 본문:', requestBody);

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
    sortCriteria = '거리순',
    page = 1,
    size = 10,
  } = {
    keyword: query.join(' '),
    sortCriteria: '거리순', // 거리순을 기본값으로
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
