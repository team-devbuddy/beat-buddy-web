export const createEvent = async (
  isFormValid: boolean,
  uploadedImages: string[],
  title: string,
  intro: string,
  startDate: string,
  endDate: string,
  startTime: string,
  endTime: string,
  receiveInfo: boolean,
  receiveName: string,
  receiveGender: string,
  receivePhoneNumber: string,
  receiveTotalCount: number,
  receiveSNSId: string,
  receiveMoney: number,
  depositAccount: string,
  depositAmount: number,
  isFreeEntrance: boolean,
  region: string,
  location: string,
  entranceNotice: string,
  notice: string,
  accessToken: string,
  fee: string,
) => {
  if (!isFormValid) {
    alert('모든 필수 항목을 입력해주세요.');
    return;
  }

  const formData = new FormData();

  // 이미지 파일들 추가
  uploadedImages.forEach((imageUrl, index) => {
    // URL에서 파일을 가져와서 FormData에 추가 (실제 구현에서는 File 객체 사용)
    // 여기서는 이미지 URL만 전송하는 것으로 가정
  });

  const eventCreateRequestDTO = {
    title,
    content: intro,
    images: uploadedImages, // 이미지 URL 배열
    likes: 0,
    views: 0,
    liked: false,
    startDate: `${startDate}T${startTime || '00:00'}:00`, // ISO 형식
    endDate: `${endDate}T${endTime || '00:00'}:00`, // ISO 형식
    receiveInfo,
    receiveName,
    receiveGender,
    receivePhoneNumber,
    receiveTotalCount,
    receiveSNSId,
    receiveMoney,
    depositAccount,
    depositAmount: receiveMoney ? Number(depositAmount) : 0,
    isAuthor: true,
    entranceFee: isFreeEntrance ? 0 : Number(fee.replace(/,/g, '')),
    entranceNotice: entranceNotice || '', // 선택 필드
    notice: notice || '', // 선택 필드
    isFreeEntrance,
    region,
    location, // venue 주소
    isAttending: false,
  };

  formData.append('eventCreateRequestDTO', JSON.stringify(eventCreateRequestDTO));

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/events`, {
      method: 'POST',
      headers: {
        Access: `Bearer ${accessToken}`, // 인증 헤더 추가
      },
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`이벤트 생성 실패: ${res.status} - ${errorText}`);
    }

    const result = await res.json();
    // 성공 시 이벤트 목록 페이지로 이동
    window.location.href = `/event/detail/${result.id}`;
  } catch (error) {
    console.error('이벤트 생성 에러:', error);
    alert(`이벤트 생성 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
  }
};
