import HeaderBack from '@/components/common/HeaderBack';
import PutNickName from '@/components/common/component/User/PutNickname';
import OptionNickname from '@/components/common/component/User/PutNickname';

export default function MyPageOptionNickname() {
  return (
    <div className="flex w-full flex-col">
      <HeaderBack url="/mypage/manage" />
      <h1 className="px-5 pt-[0.62rem] pb-[1.88rem] text-[1.5rem] font-bold leading-9 text-white">닉네임 수정</h1>
      <PutNickName buttonText="저장" redirectUrl="/mypage" />
    </div>
  );
}
