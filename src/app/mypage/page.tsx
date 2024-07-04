import HeaderBack from '@/components/common/HeaderBack';
import MyPageComponent from '@/components/units/Mypage/MyPage';

export default function Mypage() {
  return (
    <>
      <div className="flex w-full flex-col">
        <HeaderBack url="/" />
        <MyPageComponent />
      </div>
    </>
  );
}
