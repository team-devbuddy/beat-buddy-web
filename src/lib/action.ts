const ACCESS =
  'Bearer eyJhbGciOiJIUzI1NiJ9.eyJtZW1iZXJJZCI6MiwiY2F0ZWdvcnkiOiJhY2Nlc3MiLCJ1c2VybmFtZSI6IktBS0FPXzM2MTEzNjY5NjMiLCJyb2xlIjoiVVNFUiIsImlhdCI6MTcyMDg4ODQ2MiwiZXhwIjoxNzIwODk1NjYyfQ.0N_0CkZdwXEtohM7dZUK00fAv9jm-2yxCqXvESDRra0';

// 약관 동의
export async function PostAgree(access: string, terms: { isLocationConsent: boolean; isMarketingConsent: boolean }) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/members/onboarding/consent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Access: ACCESS,
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
      Access: ACCESS,
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
      Access: ACCESS,
    },
    body: JSON.stringify({ nickname }),
  });

  return response;
}

// 온보딩 - 선호 장르
export async function PostGenre(access: string, genres: { [key: string]: number }) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/member-genre`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Access: ACCESS,
    },
    body: JSON.stringify(genres),
  });

  return response;
}
