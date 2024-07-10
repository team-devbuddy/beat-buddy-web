import GoogleMap from '@/components/common/GoogleMap';

export default function TestPage() {
  return (
    <div className="flex min-h-screen w-full flex-col justify-between">
      <>123</>
      <div className="pb-32">
        <GoogleMap address="서울특별시 강남구 테헤란로 521" />
      </div>
    </div>
  );
}
