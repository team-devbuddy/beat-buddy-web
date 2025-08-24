export function useVenueHours(operationHours: Record<string, string>) {
  const now = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayMapping: Record<string, string> = {
    일요일: 'Sunday',
    월요일: 'Monday',
    화요일: 'Tuesday',
    수요일: 'Wednesday',
    목요일: 'Thursday',
    금요일: 'Friday',
    토요일: 'Saturday',
  };

  function toMinutes(str: string) {
    const [h, m] = str.split(':').map(Number);
    return h * 60 + m;
  }

  const today = days[now.getDay()];
  const todayKor = Object.keys(dayMapping).find((k) => dayMapping[k] === today);
  const todayHours = operationHours[todayKor || ''];

  let todayOpen = '';
  let todayClose = '';

  if (todayHours && todayHours !== '휴무') {
    const [open, close] = todayHours.split('~').map((t) => t.trim());
    todayOpen = open;
    todayClose = close;
  }

  const nowMin = now.getHours() * 60 + now.getMinutes();

  // 상태 판별
  let status: 'OPEN' | 'ALMOST_CLOSE' | 'CLOSE_RECENT' | 'BEFORE_OPEN' | 'HOLIDAY' = 'HOLIDAY';

  if (todayHours && todayHours !== '휴무') {
    const openMin = toMinutes(todayOpen);
    let closeMin = todayClose === 'late' ? 5 * 60 : toMinutes(todayClose);

    // 자정 넘어가는 경우 보정
    const spansMidnight = closeMin < openMin;

    if (spansMidnight) {
      if (nowMin >= openMin || nowMin <= closeMin) {
        // OPEN
        if ((closeMin - nowMin + 1440) % 1440 <= 60) status = 'ALMOST_CLOSE';
        else status = 'OPEN';
      } else {
        // CLOSE
        if ((nowMin - closeMin + 1440) % 1440 <= 60) status = 'CLOSE_RECENT';
        else if (nowMin < openMin) status = 'BEFORE_OPEN';
      }
    } else {
      if (nowMin >= openMin && nowMin <= closeMin) {
        // OPEN
        if (closeMin - nowMin <= 60) status = 'ALMOST_CLOSE';
        else status = 'OPEN';
      } else if (nowMin > closeMin) {
        // 방금 닫음?
        if (nowMin - closeMin <= 60) status = 'CLOSE_RECENT';
      } else if (nowMin < openMin) {
        status = 'BEFORE_OPEN';
      }
    }
  }

  return { status, todayOpen, todayClose, now };
}

export function getVenueHoursText({
  status,
  todayOpen,
  todayClose,
  now,
}: {
  status: string;
  todayOpen?: string;
  todayClose?: string;
  now: Date;
}) {
  switch (status) {
    case 'OPEN':
      return { label: '영업 중', detail: `${todayClose}에 영업 종료`, color: 'text-main' };
    case 'ALMOST_CLOSE':
      return { label: '곧 영업종료', detail: `${todayClose}에 영업 종료`, color: 'text-gray100' };
    case 'CLOSE_RECENT':
      return { label: '영업종료', detail: `${todayClose}에 영업 종료`, color: 'text-gray100' };
    case 'BEFORE_OPEN':
      return { label: '영업 전', detail: `${todayOpen}에 영업 시작`, color: 'text-gray100' };
    case 'HOLIDAY':
      const todayStr = `${(now.getMonth() + 1)
        .toString()
        .padStart(2, '0')}/${now.getDate().toString().padStart(2, '0')}`;
      return { label: '오늘 휴무', detail: `${todayStr} 휴무`, color: 'text-gray100' };
    default:
      return { label: '정보없음', detail: '', color: 'text-gray300' };
  }
}
