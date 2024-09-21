'use client'
import HeaderBack from '@/components/common/HeaderBack';
import Footer from '@/components/units/Main/MainFooter';
import NavigateFooter from '@/components/units/Main/NavigateFooter';
import MyPageComponent from '@/components/units/Mypage/MyPage';

export default function Mypage() {
  return (
    <>
      <div className="flex w-full flex-col bg-BG-black">
        <HeaderBack url="/" />
        <MyPageComponent />
        <div className="pt-10">
          <Footer />
        </div>
        <NavigateFooter/>

      </div>
    </>
  );
}
