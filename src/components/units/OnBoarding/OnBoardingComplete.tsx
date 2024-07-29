'use client';
import { useRouter } from 'next/navigation';
import { accessTokenState, memberGenreIdState, memberMoodIdState } from '@/context/recoil-context';
import { PostArchive } from '@/lib/action';
import { useRecoilValue } from 'recoil';

export default function OnBoardingComplete() {
  const memberMoodId = useRecoilValue(memberMoodIdState);
  const memberGenreId = useRecoilValue(memberGenreIdState);
  const access = useRecoilValue(accessTokenState) || '';
  const router = useRouter();

  const onClickSubmit = async () => {
    console.log('memberGenreId:', memberGenreId);
    if (memberGenreId !== null && memberMoodId !== null) {
      try {
        const response = await PostArchive(access, { memberGenreId, memberMoodId });
        if (response.ok) {
          router.push('/');
        } else {
          alert('Error creating archive');
        }
      } catch (error) {
        console.error('Error submitting archive:', error);
      }
    } else {
      console.error('Error: memberGenreId or memberMoodId is null');
    }
  };

  return (
    <div>
      <div className="flex w-full flex-col">
        <div className="flex w-full flex-col px-4 pt-[3.5rem]">
          <h1 className="py-5 text-2xl font-bold leading-9 text-white">
            수빈버디님을 위한
            <br />
            맞춤 베뉴를 찾았어요!
          </h1>
        </div>

        <button
          onClick={onClickSubmit}
          className={`absolute bottom-0 flex w-full justify-center bg-main py-4 text-lg font-bold text-BG-black`}>
          확인하러 가기
        </button>
      </div>
    </div>
  );
}
