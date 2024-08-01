'use client';
import Image from 'next/image';
import Link from 'next/link';
import History from './History/History';
import { useEffect, useState } from 'react';
import { GetHistory, GetMyHeartbeat, GetNickname, PutArchive } from '@/lib/action';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';
import { HeartBeat } from '@/lib/types';
import RecommendationModal from './RecommendationModal';
import { toast } from '@/components/common/toast/CustomToastContainer';
import { CustomToast, CustomToastContainer } from '@/components/common/toast/CustomToastContainer';

export interface HistoryData {
  archiveId: number;
  preferenceList: string[];
  updatedAt: string;
}

export default function MyPageComponent() {
  const access = useRecoilValue(accessTokenState) || '';
  const [nickname, setNickname] = useState('');
  const [heartBeat, setHeartBeat] = useState<HeartBeat[]>([]);
  const [history, setHistory] = useState<HistoryData[]>([]); // 타입 지정
  const [showModal, setShowModal] = useState(false);
  const [selectedArchiveId, setSelectedArchiveId] = useState<number | null>(null);

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
    const imagePattern = /\.(jpeg|jpg|gif|png|heic|jfif)$/i;
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
        <Link href="/mypage/option">
          <div className="flex gap-1 px-4 py-5">
            <p className="text-xl font-bold text-white hover:text-main2">{nickname} 버디</p>
            <Image src="/icons/gray-right-arrow.svg" alt="edit" width={24} height={24} />
          </div>
        </Link>

        {/* 구분선 */}
        <div className="flex justify-center py-2">
          <div className="w-[90%] border-b border-gray500"></div>
        </div>

        {/* My Heart Beat */}
        <Link href="/myheartbeat">
          <div className="flex justify-between px-4 py-2 font-queensides text-xl text-main2 hover:brightness-75">
            <p>My Heart Beat</p>
            <Image src="/icons/gray-right-arrow.svg" alt="edit" width={24} height={24} />
          </div>
        </Link>

        {/* My Heart Beat Icon*/}
        <div className="my-6 flex gap-3 overflow-x-auto px-4 hide-scrollbar">
          {heartBeat.map((data, index) => (
            <Link key={index} href={`/detail/${data.venueId}`}>
              <div className="relative h-14 w-14 flex-shrink-0 rounded-full">
                <Image
                  src={getDefaultImageIfInvalid(data?.logoUrl)}
                  alt="icon"
                  layout="fill"
                  objectFit="cover"
                  className="cursor-pointer rounded-full"
                />
              </div>
            </Link>
          ))}
        </div>

        {/* History */}

        <div className="mb-6 flex justify-between px-4 py-2">
          <p className="font-queensides text-xl text-main2">History</p>
          <Link href="/onBoarding/custom">
            <button className="rounded-[0.13rem] bg-gray500 px-3 py-[0.38rem] text-gray200 hover:brightness-75">
              취향 수정하기
            </button>
          </Link>
        </div>

        <div className="ml-4 flex gap-3 overflow-x-auto hide-scrollbar">
          {/* MyHistoy Card */}
          {history.map((data, index) => (
            <div
              onClick={() => onClickHistory(data.archiveId)}
              key={index}
              className="cursor-pointer hover:brightness-75">
              <History data={data} />
            </div>
          ))}
        </div>

        {/* 구분선 */}
        <div className="flex justify-center pt-[2.5rem]">
          <div className="w-full border-b border-gray500"></div>
        </div>

        {/* 정보 수정 */}
        <Link href="https://forms.gle/rcSfxUegbNykLnZD7" target="_blank" className="mt-6">
          <div className="flex justify-between px-4 py-5 hover:brightness-75">
            <div className="flex flex-col gap-1">
              <div className="text-[0.93rem] font-bold text-white">잘못된 정보가 있나요?</div>
              <div className="text-xs text-gray300">수정이 필요하거나 폐업한 업장이라면 알려주세요!</div>
            </div>

            <Image src="/icons/gray-right-arrow.svg" alt="edit" width={24} height={24} />
          </div>
        </Link>
      </div>
      {showModal && selectedArchiveId !== null && (
        <RecommendationModal
          archiveId={selectedArchiveId}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirm}
        />
      )}
      <CustomToastContainer />
    </>
  );
}
