import Prev from '@/components/common/Prev';
import PutNickName from '@/components/common/component/User/PutNickname';

export default function OnBoardingNamePage() {
  return (
    <div className="w-full ">
      <Prev url={'/onBoarding'} />
      <h1 className="px-5 py-5 text-2xl font-bold leading-9 text-white">
        비트버디에서 사용할
        <br />
        닉네임을 입력해주세요
      </h1>
      <PutNickName buttonText="다음" redirectUrl="/onBoarding/custom" />
    </div>
  );
}
