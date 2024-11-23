interface VenueIntroProps {
  introduction?: string;
  tableReservation?: string;
  kakaoLink?: string;
}

function VenueIntro({
  introduction = 'Doors at 10pm',
  tableReservation = 'Table Reservation: Beatbuddy / Open kakao Link ⬇️',
  kakaoLink = 'https://open.kakao.com/o/sdDHIkf',
}: VenueIntroProps) {
  return (
    <div className="bg-BG-black px-4 py-6">
      <p className="mb-2 text-body1-16-bold text-white">베뉴 소개</p>
      <p className="text-body2-15-medium text-gray200">{introduction}</p>
      <p className="text-body2-15-medium text-gray200">{tableReservation}</p>
      <a href={kakaoLink} target="_blank" rel="noopener noreferrer" className="text-main underline">
        {kakaoLink}
      </a>
    </div>
  );
}

export default VenueIntro;
