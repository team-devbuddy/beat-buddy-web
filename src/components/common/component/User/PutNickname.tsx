'use client';
import { useRouter } from 'next/navigation';
import { useState, ChangeEvent } from 'react';
import Image from 'next/image';
import { PostDuplicateCheck, PostNickname } from '@/lib/action'; // API 요청 함수의 경로를 적절히 수정하세요.
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';

interface PutNickNameProps {
  buttonText: string;
  redirectUrl: string;
}

export default function PutNickName({ buttonText, redirectUrl }: PutNickNameProps) {
  const [inputValue, setInputValue] = useState<string>('');
  const [isDuplicateChecked, setIsDuplicateChecked] = useState<boolean>(false);
  const [isDuplicateValid, setIsDuplicateValid] = useState<boolean>(false);
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const router = useRouter();
  const access = useRecoilValue(accessTokenState) || '';

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsDuplicateChecked(false); // 닉네임이 변경되면 중복 확인 상태 초기화
    setErrorMessage(''); // 에러 메시지 초기화
    setShowBanner(false); // 배너 숨김
  };

  // 입력 값 검증 함수
  const validateInput = (value: string): string | null => {
    const regex = /^[a-zA-Z0-9가-힣]{1,12}$/;
    if (!regex.test(value)) {
      return '공백없이 12자 이하로 입력해주세요. 특수 기호는 불가능해요.';
    }
    return null;
  };

  // 중복확인 버튼 클릭 시 중복 확인 로직을 실행합니다.
  const handleDuplicateCheck = async () => {
    const validationError = validateInput(inputValue);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    try {
      const response = await PostDuplicateCheck(access, inputValue);

      if (response.ok) {
        const data = await response.json();
        const isValid = data; // 서버 응답의 형태에 따라 조정하세요.
        setIsDuplicateValid(isValid);
        setIsDuplicateChecked(true);

        if (isValid) {
          setShowBanner(true);
        } else {
          setErrorMessage('닉네임이 중복이에요. 다른 닉네임을 입력해주세요.');
        }
      } else {
        const responseJson = await response.json();
        setErrorMessage(responseJson.message || '중복 확인 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Error during duplicate check:', error);
      setErrorMessage('중복 확인 중 오류가 발생했습니다.');
    }
  };

  const onClickSubmit = async () => {
    const response = await PostNickname(access, inputValue);
    if (response.ok) {
      router.push(redirectUrl);
    } else {
      const responseJson = await response.json();
      setErrorMessage(responseJson.message || '닉네임 저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
      <div className="flex w-full flex-col px-4">
        <div className="mt-3">
          <div className="flex flex-col py-3">
            <div className="relative flex">
              <input
                className="w-full border-b border-white bg-transparent py-4 pl-2 text-white outline-none placeholder:text-gray400"
                placeholder="Text Field"
                value={inputValue}
                onChange={handleChange}
              />
              {isDuplicateChecked && isDuplicateValid ? (
                <div className="absolute right-5 top-4 text-white">
                  <Image src="/icons/check.svg" alt="check" width={16} height={16} />
                </div>
              ) : (
                <button
                  className={`absolute right-5 top-4 rounded-[0.13rem] px-3 py-[0.38rem] text-xs font-bold ${inputValue ? 'bg-main text-BG-black' : 'bg-gray500 text-gray200'}`}
                  disabled={!inputValue}
                  onClick={handleDuplicateCheck}>
                  중복확인
                </button>
              )}
            </div>

            <p className={`px-2 py-[0.62rem] text-xs ${errorMessage ? 'text-main' : 'text-gray300'}`}>
              {errorMessage || '공백없이 12자 이하로 입력해주세요. 특수 기호는 불가능해요.'}
            </p>
          </div>
        </div>
      </div>
      <button
        onClick={onClickSubmit}
        disabled={!isDuplicateChecked || !isDuplicateValid}
        className={`absolute bottom-0 flex w-full justify-center py-4 text-lg font-bold ${
          isDuplicateChecked && isDuplicateValid
            ? 'bg-[#EE1171] text-BG-black hover:brightness-105'
            : 'bg-gray400 text-gray300'
        }`}>
        {buttonText}
      </button>
      {showBanner && (
        <div className="fixed bottom-20 left-1/2 flex w-[20rem] -translate-x-1/2 transform justify-center rounded bg-gray500 px-16 py-3 text-white">
          사용 가능한 닉네임이에요!
        </div>
      )}
    </>
  );
}
