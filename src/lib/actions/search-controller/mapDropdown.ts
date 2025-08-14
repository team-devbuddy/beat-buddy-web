// 맵 검색 드롭다운 기능
export const searchMapDropdown = async (
  filters: {
    keyword?: string;
    regionTag?: string;
    genreTag?: string;
    sortCriteria: string;
    page?: number;
    size?: number;
    latitude?: number;
    longitude?: number;
  },
  accessToken: string | null,
) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/search/map/drop-down`;
    const params = new URLSearchParams();

    // 페이지 정보 추가
    const page = filters.page || 1;
    const size = filters.size || 10;
    params.append('page', page.toString());
    params.append('size', size.toString());

    // 필수 파라미터: sortCriteria
    params.append('criteria', filters.sortCriteria);

    // 가까운 순 정렬 시 위치 정보 추가
    if (filters.sortCriteria === '가까운 순') {
      if (filters.latitude && filters.longitude) {
        params.append('latitude', filters.latitude.toString());
        params.append('longitude', filters.longitude.toString());
      } else {
        console.warn('가까운 순 정렬을 위해 latitude와 longitude가 필요합니다.');
      }
    }

    // 선택적 파라미터들
    if (filters.keyword && filters.keyword.trim()) {
      params.append('keyword', filters.keyword.trim());
    }
    if (filters.genreTag && filters.genreTag.trim()) {
      params.append('genreTag', filters.genreTag.trim());
    }
    if (filters.regionTag && filters.regionTag.trim()) {
      params.append('regionTag', filters.regionTag.trim());
    }

    const fullUrl = `${url}?${params.toString()}`;
    console.log('맵 드롭다운 API 호출:', {
      url: fullUrl,
      filters,
    });

    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Access: `Bearer ${accessToken}`,
      },
      body: '', // POST 요청이지만 body는 비어있음
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('맵 드롭다운 API 에러 응답:', {
        status: response.status,
        statusText: response.statusText,
        errorText,
        url: fullUrl,
        filters,
      });
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('맵 드롭다운 API 응답:', data);

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
      const hasMoreData = data.length === size;

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
    console.error('맵 드롭다운 API 호출 실패:', error);
    throw error;
  }
};
