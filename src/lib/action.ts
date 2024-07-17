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
