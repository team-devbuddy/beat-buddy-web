// 약관 동의
export async function PostAgree(access: string, terms: { isLocationConsent: boolean; isMarketingConsent: boolean }) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/members/onboarding/consent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Access: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJtZW1iZXJJZCI6MSwiY2F0ZWdvcnkiOiJhY2Nlc3MiLCJ1c2VybmFtZSI6IktBS0FPXzM2MTEzNjY5NjMiLCJyb2xlIjoiVVNFUiIsImlhdCI6MTcyMDg4MjUzOCwiZXhwIjoxNzIwODg5NzM4fQ.s471P0zSm44yLSueHq8EqSkfVIc3IOC69HI37oGHM7o`,
    },
    body: JSON.stringify(terms),
  });

  return response;
}
