const ACCESS =
  'Bearer eyJhbGciOiJIUzI1NiJ9.eyJtZW1iZXJJZCI6MiwiY2F0ZWdvcnkiOiJhY2Nlc3MiLCJ1c2VybmFtZSI6IktBS0FPXzM2MTEzNjY5NjMiLCJyb2xlIjoiVVNFUiIsImlhdCI6MTcyMDg4NjU4NSwiZXhwIjoxNzIwODkzNzg1fQ.u-MqFUGzJElDrIbqA9x0ExsthHbXlqjeRPPm2o-pUg0';

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
