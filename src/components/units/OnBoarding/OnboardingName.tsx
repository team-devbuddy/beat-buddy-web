'use client';
import { useRouter } from 'next/navigation';
import { useState, ChangeEvent } from 'react';

export default function OnboardingName() {
  const [inputValue, setInputValue] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  const router = useRouter();

  const onClickSubmit = () => {
    router.push('/onBoarding');
  };

  return (
    <>
      <div className="flex w-full flex-col px-4">
        <h1 className="py-5 text-2xl font-bold leading-9 text-white">
          비트버디에서 사용할
          <br />
          닉네임을 입력해주세요
        </h1>

        <div className="mt-3">
          <div className="flex flex-col py-3">
            <div className="relative flex">
              <input
                className="w-full border-b border-white bg-transparent py-4 pl-2 text-white outline-none placeholder:text-gray400"
                placeholder="Text Field"
                value={inputValue}
                onChange={handleChange}
              />
              <button
                className={`absolute right-5 top-4 rounded-[0.13rem] px-3 py-[0.38rem] text-xs font-bold ${inputValue ? 'bg-main text-BG-black' : 'bg-gray500 text-gray200'}`}
                disabled={!inputValue}>
                중복확인
              </button>
            </div>

            <p className="px-2 py-[0.62rem] text-xs text-gray300">
              공백없이 12자 이하로 입력해주세요. 특수 기호는 불가능해요.{' '}
            </p>
          </div>
        </div>
      </div>
      <button
        onClick={onClickSubmit}
        className={`absolute bottom-0 flex w-full justify-center bg-[#EE1171] py-4 text-lg font-bold text-BG-black`}>
        저장
      </button>
    </>
  );
}
