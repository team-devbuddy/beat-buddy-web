import HeaderBack from '@/components/common/HeaderBack';
import PutNickName from '@/components/common/component/User/PutNickname';
import OptionNickname from '@/components/common/component/User/PutNickname';

export default function MyPageOptionNickname() {
  return (
    <div className="flex w-full flex-col">
      <HeaderBack url="/mypage/option" />
      <h1 className="px-4 py-5 text-2xl font-bold leading-9 text-white">닉네임 수정</h1>
      <PutNickName />
    </div>
  );
}
