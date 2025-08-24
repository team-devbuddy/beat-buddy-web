
export const requestBusinessVerificationCode = async ({
    realName,
    phoneNumber,
    telCarrier,
    residentRegistration,
  }: {
    realName: string;
    phoneNumber: string;
    telCarrier: string;
    residentRegistration: string;
  }, accessToken: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/business/verify-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Access: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        realName,
        phoneNumber,
        telCarrier,
        residentRegistration,
      }),
    });
  
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || '인증번호 요청 실패');
    }
  
    return res.json(); // 인증번호를 응답한다고 했으니
  };
  