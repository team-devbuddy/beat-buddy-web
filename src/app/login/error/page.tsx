export default function LoginErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <h1 className="mb-4 text-2xl font-bold">로그인에 실패했어요 😢</h1>
      <p className="mb-2">SNS 로그인 도중 문제가 발생했어요.</p>
      <p className="mb-6">다시 시도하거나 다른 로그인 방식을 선택해주세요.</p>
      <a href="/" className="text-blue-400 underline">
        홈으로 돌아가기
      </a>
    </div>
  );
}
