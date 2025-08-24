'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, ChangeEvent, useEffect } from 'react';
import Image from 'next/image';
import { PostDuplicateCheck, PostNickname } from '@/lib/action'; // API 요청 함수의 경로를 적절히 수정하세요
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { accessTokenState, userProfileState } from '@/context/recoil-context';
import { motion } from 'framer-motion';

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
  const [successMessage, setSuccessMessage] = useState<string>('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const access = useRecoilValue(accessTokenState) || '';
  const setUserProfile = useSetRecoilState(userProfileState);

  // 수정 모드 확인
  const isEditMode = searchParams.get('edit') === 'true';
  const originalNickname = searchParams.get('nickname') || '';

  // 수정 모드일 때 기존 닉네임으로 초기값 설정
  useEffect(() => {
    if (isEditMode && originalNickname) {
      setInputValue(originalNickname);
      // 수정 모드에서는 초기에 중복 확인 상태를 false로 설정
      setIsDuplicateChecked(false);
      setIsDuplicateValid(false);
    }
  }, [isEditMode, originalNickname]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // 수정 모드에서 기존 닉네임과 동일한 경우 중복 확인 상태 초기화
    if (isEditMode && newValue === originalNickname) {
      setIsDuplicateChecked(false);
      setIsDuplicateValid(false);
    } else {
      setIsDuplicateChecked(false); // 닉네임이 변경되면 중복 확인 상태 초기화
    }

    setErrorMessage(''); // 에러 메시지 초기화
    setSuccessMessage(''); // 성공 메시지 초기화
    setShowBanner(false); // 배너 숨김
  };

  // 입력 값 검증 함수
  const validateInput = (value: string): string | null => {
    const regex = /^[a-zA-Z0-9가-힣]{1,12}$/;
    if (!regex.test(value)) {
      return '공백 없이, 12자 이하로 입력해주세요 특수 기호는 불가능해요 ';
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
        const isValid = data; // 서버 응답의 형태에 따라 조정하세요
        setIsDuplicateValid(isValid);
        setIsDuplicateChecked(true);

        if (isValid) {
          setSuccessMessage('사용 가능한 닉네임이에요!');
          setErrorMessage(''); // 에러 메시지 초기화
        } else {
          setErrorMessage('닉네임이 중복이에요 다른 닉네임을 입력해주세요');
          setSuccessMessage(''); // 성공 메시지 초기화
        }
      } else {
        const responseJson = await response.json();
        setErrorMessage(responseJson.message || '중복 확인 중 오류가 발생했습니다.');
        setSuccessMessage(''); // 성공 메시지 초기화
      }
    } catch (error) {
      console.error('Error during duplicate check:', error);
      setErrorMessage('중복 확인 중 오류가 발생했습니다.');
      setSuccessMessage(''); // 성공 메시지 초기화
    }
  };

  const onClickSubmit = async () => {
    const response = await PostNickname(access, inputValue);
    if (response.ok) {
      // 닉네임 변경 시 userProfileState 업데이트
      if (isEditMode && originalNickname !== inputValue) {
        setUserProfile((prev) => {
          if (prev) {
            return {
              ...prev,
              nickname: inputValue,
            };
          }
          return prev;
        });
      }
      router.push(redirectUrl);
    } else {
      const responseJson = await response.json();
      setErrorMessage(responseJson.message || '닉네임 저장 중 오류가 발생했습니다.');
      setSuccessMessage(''); // 성공 메시지 초기화
    }
  };

  return (
    <>
      <div className="flex w-full flex-col px-5">
        <div className="">
          <div className="flex flex-col">
            <div className="relative flex">
              <input
                className="w-full border-b border-white bg-transparent py-[0.97rem] pl-1 text-body-14-medium text-white outline-none safari-input-fix placeholder:text-gray200"
                placeholder="닉네임을 입력해주세요"
                value={inputValue}
                onChange={handleChange}
              />
              {isDuplicateChecked && isDuplicateValid ? (
                <div className="absolute right-5 top-4 text-white">
                  <Image src="/icons/PinkCheck.svg" alt="check" width={16} height={16} />
                </div>
              ) : // 수정 모드에서 현재 닉네임과 다른 경우에만 중복확인 버튼 렌더링
              (isEditMode && inputValue !== originalNickname) || !isEditMode ? (
                <button
                  className={`absolute right-1 top-1 rounded-[0.5rem] px-3 py-[0.38rem] text-body3-12-bold ${inputValue ? 'bg-gray700 text-main' : 'bg-gray700 text-gray200'}`}
                  disabled={!inputValue}
                  onClick={handleDuplicateCheck}>
                  중복 확인
                </button>
              ) : null}
            </div>

            <p
              className={`px-1 py-[0.63rem] text-body3-12-medium ${
                errorMessage ? 'text-main' : successMessage ? 'text-main' : 'text-gray300'
              }`}>
              {errorMessage || successMessage || '공백 없이, 12자 이하로 입력해주세요 특수 기호는 불가능해요 '}
            </p>
          </div>
        </div>
      </div>
      <div className="fixed bottom-5 left-0 right-0 z-50 flex w-full justify-center px-5">
        <motion.button
          onClick={onClickSubmit}
          disabled={!isDuplicateChecked || !isDuplicateValid}
          whileHover={isDuplicateChecked && isDuplicateValid ? { scale: 1.02 } : {}}
          whileTap={isDuplicateChecked && isDuplicateValid ? { scale: 0.98 } : {}}
          className={`w-full max-w-[560px] rounded-[0.5rem] py-[0.81rem] text-button-16-semibold ${
            isDuplicateChecked && isDuplicateValid ? 'bg-main text-sub2' : 'bg-gray500 text-gray300'
          }`}>
          {buttonText}
        </motion.button>
      </div>
    </>
  );
}
