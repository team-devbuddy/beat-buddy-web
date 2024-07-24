// 약관 동의
export async function PostAgree(access: string, terms: { isLocationConsent: boolean; isMarketingConsent: boolean }) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/members/onboarding/consent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Access: `Bearer ${access}`,
    },
    body: JSON.stringify(terms),
  });

  return response;
}

// 닉네임 중복확인
export async function PostDuplicateCheck(access: string, nickname: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/members/onboarding/nickname/duplicate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Access: `Bearer ${access}`,
    },
    body: JSON.stringify({ nickname }),
  });

  return response;
}

// 닉네임 설정
export async function PostNickname(access: string, nickname: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/members/onboarding/nickname`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Access: `Bearer ${access}`,
    },
    body: JSON.stringify({ nickname }),
  });

  return response;
}

// 온보딩 - 선호 장르
export async function PostGenre(access: string, genres: { genrePreferences: { [key: string]: number } }) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/member-genre`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Access: `Bearer ${access}`,
    },
    body: JSON.stringify(genres),
  });

  return response;
}

// 온보딩 - 선호 분위기
export async function PostMood(
  access: string,
  moods: { moodPreferences: { [key: string]: number } },
): Promise<Response> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/member-mood`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Access: `Bearer ${access}`,
    },
    body: JSON.stringify(moods),
  });

  return response;
}

// 온보딩 - 선호 장소
export async function PostLocation(access: string, locations: string): Promise<Response> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/members/onboarding/regions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Access: `Bearer ${access}`,
    },
    body: JSON.stringify({ regions: locations }),
  });

  return response;
}

// 온보딩 - 아카이브 생성
export async function PostArchive(access: string, archive: { memberGenreId: number; memberMoodId: number }) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/archive`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Access: `Bearer ${access}`,
    },
    body: JSON.stringify(archive),
  });

  return response;
}

// 사용자 온보딩 현황 조회
export async function GetOnBoardingStatus(access: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/members/onboarding`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Access: `Bearer ${access}`,
    },
  });

  return response;
}

// 마이페이지 - 사용자 닉네임 조회
export async function GetNickname(access: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/members/nickname`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Access: `Bearer ${access}`,
    },
  });

  return response;
}

// 마이페이지 - 나의 하트비트 조회
export async function GetMyHeartbeat(access: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/heartbeat/all`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Access: `Bearer ${access}`,
    },
  });

  return response;
}

// 마이 페이지 - 내 히스토리 조회
export async function GetHistory(access: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/archive/all`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Access: `Bearer ${access}`,
    },
  });

  return response;
}
