import Prev from '@/components/common/Prev';
import PutNickName from '@/components/common/component/User/PutNickname';

export default function OnBoardingNamePage() {
  return (
    <div className="w-full ">
      <Prev url={'/onBoarding'} />
      <h1 className="px-5 pt-[0.62rem] pb-[1.88rem] text-[1.5rem] font-bold leading-9 text-white">
        비트버디에서 사용할
        <br />
        닉네임을 입력해주세요
      </h1>
      <PutNickName buttonText="다음" redirectUrl="/onBoarding/custom" />
    </div>
  );
}
