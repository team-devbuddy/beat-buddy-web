import HeaderBack from '@/components/common/HeaderBack';
import OptionNickname from '@/components/units/Mypage/MyPageOptionNickname';

export default function MyPageOptionNickname() {
  return (
    <div className="flex w-full flex-col">
      <HeaderBack url="/mypage/option" />
      <OptionNickname />
    </div>
  );
}
