import HeaderBack from '@/components/common/HeaderBack';
import MyPageOption from '@/components/units/Mypage/MyPageOption';

export default function MyPageOptionPage() {
  return (
    <div className="flex w-full flex-col">
      <HeaderBack url="/mypage" />
      <MyPageOption />
    </div>
  );
}
