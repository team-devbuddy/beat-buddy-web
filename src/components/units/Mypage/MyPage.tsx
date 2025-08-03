'use client';
import Image from 'next/image';
import Link from 'next/link';
import History from './History/History';
import { useEffect, useState } from 'react';
import { GetHistory, GetMyHeartbeat, GetNickname, PutArchive } from '@/lib/action';
import { useRecoilValue } from 'recoil';
import { accessTokenState, userProfileState } from '@/context/recoil-context';
import { HeartBeat } from '@/lib/types';
import RecommendationModal from './RecommendationModal';
import { toast } from '@/components/common/toast/CustomToastContainer';
import { CustomToast, CustomToastContainer } from '@/components/common/toast/CustomToastContainer';
import BusinessMyPage from './BusinessMyPage';
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { getProfileinfo } from '@/lib/actions/boardprofile-controller/getProfileinfo';
import 'swiper/css';
import 'swiper/css/pagination';

export interface HistoryData {
  archiveId: number;
  preferenceList: string[];
  updatedAt: string;
}

export default function MyPageComponent() {
  const access = useRecoilValue(accessTokenState) || '';
  const userProfile = useRecoilValue(userProfileState);
  const [nickname, setNickname] = useState('');
  const [heartBeat, setHeartBeat] = useState<HeartBeat[]>([]);
  const [history, setHistory] = useState<HistoryData[]>([]); // 타입 지정
  const [showModal, setShowModal] = useState(false);
  const [selectedArchiveId, setSelectedArchiveId] = useState<number | null>(null);
  const [memberGenre, setMemberGenre] = useState<any[]>([]);
  const [profileInfo, setProfileInfo] = useState<any>(null);
  const [boardProfile, setBoardProfile] = useState<any>(null);
  const router = useRouter();

  // 사용자 타입 확인
  const isBusiness = userProfile?.role === 'BUSINESS';

  // 비즈니스 회원인 경우 비즈니스 마이페이지 렌더링
  if (isBusiness) {
    return <BusinessMyPage />;
  }

  // 사용자 닉네임 조회 & 나의 하트비트 조회
  useEffect(() => {
    const fetchNickname = async () => {
      try {
        const response = await GetNickname(access);
        const heartBeatResponse = await GetMyHeartbeat(access);
        const historyResponse = await GetHistory(access);
        if (response.ok && heartBeatResponse.ok && historyResponse.ok) {
          const responseJson = await response.json();
          const heartBeatResponseJson = await heartBeatResponse.json();
          const historyResponseJson = await historyResponse.json();

          setNickname(responseJson.nickname);
          setHeartBeat(heartBeatResponseJson);
          setHistory(historyResponseJson);
          const profileInfoResponse = await getProfileinfo(access, responseJson.boardProfile.memberId);
          setProfileInfo(profileInfoResponse);
        }
      } catch (error) {
        console.error('Error fetching nickname:', error);
      }
    };
    fetchNickname();
  }, [access]);

  const onClickHistory = (archiveId: number) => {
    setSelectedArchiveId(archiveId);
    setShowModal(true);
  };

  const getDefaultImageIfInvalid = (url: string) => {
    const imagePattern = /\.(jpeg|jpg|gif|png|heic|jfif|webp)$/i;
    return imagePattern.test(url) ? url : '/images/DefaultImage.png';
  };

  const handleConfirm = async () => {
    if (selectedArchiveId !== null) {
      try {
        const response = await PutArchive(access, selectedArchiveId);
        if (response.ok) {
          toast(<CustomToast>변경되었습니다!</CustomToast>);
        } else {
          toast(<CustomToast>다시 시도해주세요.</CustomToast>);
        }
      } catch (error) {
        console.error('Error putting archive:', error);
        toast(<CustomToast>추천 요청 중 오류가 발생했습니다.</CustomToast>);
      } finally {
        setShowModal(false);
      }
    }
  };

  return (
    <>
      <div className="flex flex-col">
        {/* 프로필 스와이퍼 */}
        <div className="w-full overflow-hidden">
          <Swiper
            modules={[Pagination]}
            slidesPerView={1.045}
            centeredSlides={false}
            pagination={false}
            className="profile-swiper"
            style={
              {
                '--swiper-pagination-color': 'transparent',
                '--swiper-pagination-bullet-inactive-color': 'transparent',
              } as React.CSSProperties
            }>
            {/* 첫 번째 프로필 카드 - 마이페이지 프로필 */}
            <SwiperSlide>
              <div
                className="mb-[0.62rem] ml-5 mr-1 mt-5 rounded-[0.63rem] p-5"
                style={{
                  background: `radial-gradient(127.07% 71.54% at 0% 82.92%, rgba(238, 17, 113, 0.50) 0%, rgba(34, 0, 255, 0.00) 100%), radial-gradient(72.73% 59.06% at 97.01% 32.92%, rgba(238, 17, 113, 0.50) 0%, rgba(238, 17, 113, 0.10) 100%), radial-gradient(44.88% 90.82% at 46.12% -18.01%, rgba(238, 17, 113, 0.50) 0%, rgba(238, 17, 113, 0.00) 100%), #28292A`,
                }}>
                <div className="flex h-full flex-col justify-between">
                  {/* 프로필 정보 */}
                  <div className="mb-[1.12rem] flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="h-16 w-16 rounded-full bg-gray700">
                        <Image
                          src={userProfile?.profileImageUrl || '/icons/mypage-profile.svg'}
                          alt="프로필"
                          width={64}
                          height={64}
                          className="rounded-full"
                        />
                      </div>
                      <div className="flex flex-col items-start justify-center">
                        <div className="flex items-center gap-2">
                          <span className="text-[1.125rem] font-bold text-white">{nickname}버디</span>
                          <Image
                            onClick={() => router.push(`/mypage/manage`)}
                            src="/icons/Frame 60.svg"
                            alt="편집"
                            width={14}
                            height={14}
                          />
                        </div>
                        <span className="text-[0.75rem] text-white/70">일반 회원</span>
                      </div>
                    </div>
                    <button className="rounded-[0.5rem] bg-white/20 px-2 py-[0.19rem] text-[0.6875rem] text-white/80">
                      메인 프로필
                    </button>
                  </div>

                  {/* 내 취향 태그 */}
                  <div className="">
                    <div className="mb-[0.62rem] flex items-center gap-[0.31rem]">
                      <Image src="/icons/Headers/Headers/Symbol.svg" alt="태그" width={20} height={20} />
                      <span className="text-[0.875rem] font-bold text-white">내 취향 태그</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        <span className="rounded-[0.5rem] bg-[#131415]/30 px-2 py-[0.19rem] text-[0.6875rem] text-white">
                          시끄러운
                        </span>
                        <span className="rounded-[0.5rem] bg-[#131415]/30 px-2 py-[0.19rem] text-[0.6875rem] text-white">
                          분위기 있는
                        </span>
                        <span className="rounded-[0.5rem] bg-[#131415]/30 px-2 py-[0.19rem] text-[0.6875rem] text-white">
                          홍대
                        </span>
                      </div>
                      <button
                        onClick={() => router.push('/bbp-list')}
                        className="flex items-center gap-1 rounded-[0.5rem] bg-white/10 px-2 py-[0.19rem] text-[0.6875rem] text-white">
                        내 취향 확인하기
                        <Image src="/icons/Frame 60.svg" alt="편집" width={10} height={10} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>

            {/* 두 번째 프로필 카드 - 게시판 프로필 */}
            <SwiperSlide>
              <div
                className="mb-[0.62rem] ml-1 mr-5 mt-5 rounded-[0.63rem] p-5"
                style={{
                  background: `radial-gradient(127.07% 71.54% at 0% 82.92%, rgba(117, 67, 255, 0.50) 0%, rgba(117, 67, 255, 0.00) 100%), radial-gradient(72.73% 59.06% at 97.01% 32.92%, rgba(80, 67, 255, 0.50) 0%, rgba(80, 67, 255, 0.10) 100%), radial-gradient(44.88% 90.82% at 46.12% -18.01%, rgba(142, 130, 255, 0.30) 0%, rgba(142, 130, 255, 0.00) 100%), #28292A`,
                }}>
                <div className="flex h-full flex-col justify-between">
                  {/* 프로필 정보 */}
                  <div className="mb-[1.56rem] flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="h-16 w-16 rounded-full bg-gray700">
                        <Image
                          src={profileInfo?.data?.profileImageUrl || '/icons/mypage-profile.svg'}
                          alt="프로필"
                          width={64}
                          height={64}
                          className="rounded-full"
                        />
                      </div>
                      <div className="flex flex-col items-start justify-center">
                        <div className="flex items-center gap-2">
                          <span className="text-[1.125rem] font-bold text-white">
                            {profileInfo?.data?.nickname || nickname}버디
                          </span>
                        </div>
                        <span className="text-[0.75rem] text-white/70">게시판</span>
                      </div>
                    </div>
                    <button className="rounded-[0.5rem] bg-white/20 px-2 py-[0.19rem] text-[0.6875rem] text-white/80">
                      커뮤니티 프로필
                    </button>
                  </div>

                  {/* 게시판 관련 정보 */}
                  <div className="">
                    <div className="flex items-center gap-[0.31rem]">
                      <div
                        onClick={() => router.push(`/board/profile`)}
                        className="w-full rounded-[0.5rem] bg-[#17181C]/50 px-2 py-[0.88rem] text-center text-[0.8125rem] font-bold text-white">
                        커뮤니티 프로필 바로가기
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>

        {/* My Coupon */}
        <div className="mx-5 mb-[0.62rem] rounded-lg bg-[#28292A] p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[0.9375rem] font-bold text-white">My Coupon</h3>
              <p className="text-[0.6875rem] text-gray-300">다운로드한 쿠폰을 확인할 수 있어요!</p>
            </div>
          </div>
        </div>

        {/* My Event & My Heart Beat */}
        <div className="mx-5 mb-[0.62rem] flex gap-4">
          <div onClick={() => router.push('/myevent')} className="flex-1 rounded-lg bg-[#28292A] p-4">
            <div className="mb-2 flex items-center gap-2">
              <h3 className="text-[0.9375rem] font-bold text-white">My Event</h3>
            </div>
            <p className="text-[0.6875rem] text-gray-300">참석 예정 이벤트예요!</p>
          </div>
          <div className="flex-1 rounded-lg bg-[#28292A] p-4">
            <div onClick={() => router.push('/myheartbeat')} className="mb-2 flex items-center gap-2">
              <h3 className="text-[0.9375rem] font-bold text-white">My Heart Beat</h3>
            </div>
            <p className="text-[0.6875rem] text-gray-300">내가 저장한 베뉴들이에요!</p>
          </div>
        </div>

        {/* 하단 링크들 */}
        <div className="">
          <Link href="/inquiry" className="flex items-center justify-between px-5 py-4 font-bold">
            <span className="text-white">문의 사항</span>
            <Image src="/icons/Headers/Frame60Gray.svg" alt="이동" width={20} height={20} />
          </Link>
          <Link href="/terms" className="flex items-center justify-between px-5 py-4 font-bold">
            <span className="text-white">이용 약관 및 개인 정보 활용</span>
            <Image src="/icons/Headers/Frame60Gray.svg" alt="이동" width={20} height={20} />
          </Link>
        </div>
      </div>
    </>
  );
}
