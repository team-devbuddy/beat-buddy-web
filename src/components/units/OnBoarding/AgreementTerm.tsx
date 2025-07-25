'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Term } from '@/lib/types';
import { termsData } from '@/lib/data';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { accessTokenState, isBusinessState } from '@/context/recoil-context';
import { PostAgree } from '@/lib/action';
import Loading from '@/app/loading';
import Prev from '@/components/common/Prev';

export default function AgreementTerm() {
  const [terms, setTerms] = useState<Term[]>(termsData);
  const [allChecked, setAllChecked] = useState(false);
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const isInitialLoad = useRef(true); // 초기 로드 플래그

  const router = useRouter();
  const searchParams = useSearchParams();
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
  const isBusiness = useRecoilValue(isBusinessState); // recoil state에서 비즈니스 여부 확인
  const setIsBusiness = useSetRecoilState(isBusinessState);

  useEffect(() => {
    const access = searchParams.get('access');
    if (access) setAccessToken(access);

    // 쿼리 파라미터에서 userType 확인
    const userType = searchParams.get('userType');
    console.log('AgreementTerm - URL userType:', userType);
    console.log('AgreementTerm - recoil isBusiness:', isBusiness);

    // 쿼리 파라미터가 business이면 recoil state 업데이트
    if (userType === 'business') {
      console.log('쿼리 파라미터에서 비즈니스 확인 -> recoil state 업데이트');
      setIsBusiness(true);
    }
  }, [searchParams, setAccessToken, setIsBusiness]);

  // 초기 로드 시 localStorage 백업에서 복원
  useEffect(() => {
    if (isInitialLoad.current) {
      // localStorage 백업에서 복원 시도
      const backupUserType = localStorage.getItem('userType');
      const backupIsBusiness = localStorage.getItem('isBusiness');

      // recoil-persist 내용 파싱
      try {
        const recoilPersist = localStorage.getItem('recoil-persist');
        if (recoilPersist) {
          const parsedRecoil = JSON.parse(recoilPersist);
        }
      } catch (error) {}

      // recoil state가 초기값이고 localStorage에 백업이 있으면 복원
      if (!isBusiness && backupIsBusiness === 'true') {
        setIsBusiness(true);
      }

      isInitialLoad.current = false; // 초기 로드 완료 표시
    }
  }, [isBusiness, setIsBusiness]);

  useEffect(() => {
    const requiredTermsChecked = terms.filter((t) => t.isRequired).every((t) => t.checked);
    setButtonEnabled(requiredTermsChecked);

    // 모든 약관이 선택되었는지 확인하여 allChecked 상태 업데이트
    const allTermsChecked = terms.every((t) => t.checked);
    setAllChecked(allTermsChecked);
  }, [terms]);

  const handleCheckboxClick = (id: number) => {
    setTerms((prev) => prev.map((term) => (term.id === id ? { ...term, checked: !term.checked } : term)));
  };

  const handleAllCheckboxClick = () => {
    const newState = !allChecked;
    setAllChecked(newState);
    setTerms((prev) => prev.map((term) => ({ ...term, checked: newState })));
  };

  const onClickSubmit = async () => {
    const locationConsent = terms.find((t) => t.id === 3)?.checked || false;
    const marketingConsent = terms.find((t) => t.id === 4)?.checked || false;

    const requestData = {
      isLocationConsent: locationConsent,
      isMarketingConsent: marketingConsent,
    };

    if (accessToken) {
      try {
        setLoading(true);
        const response = await PostAgree(accessToken, requestData);
        if (response.ok) {
          // ✅ recoil state에 따라 라우팅
          if (isBusiness) {
            router.push('/signup/business');
          } else {
            router.push('/onBoarding/name');
          }
        } else {
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    } else {
    }
  };

  return (
    <div className="w-full">
      <Prev url={'/login'} />
      {loading && <Loading />}
      <div className="flex w-full flex-col px-5">
        <h1 className="pt-[1.25rem] text-title-24-bold text-white">
          서비스 이용 동의서에
          <br />
          동의해주세요
        </h1>

        <div className="flex w-full gap-2 border-b border-gray700 pb-6 pt-[2.75rem]">
          <Image
            src={allChecked ? '/icons/CheckActive.svg' : '/icons/CheckDisabled.svg'}
            alt="checked"
            width={24}
            height={24}
            className="cursor-pointer"
            onClick={handleAllCheckboxClick}
          />
          <p
            className={`cursor-pointer ${allChecked ? 'text-white' : 'text-gray400'}`}
            onClick={handleAllCheckboxClick}>
            모두 동의 (선택 동의 포함)
          </p>
        </div>

        <div className="flex flex-col pt-3">
          {terms.map((term) => (
            <div key={term.id} className="flex justify-between py-3 pl-[0.38rem]">
              <div className="flex gap-2">
                <Image
                  src={term.checked ? '/icons/Check.svg' : '/icons/NotCheck.svg'}
                  alt="check"
                  width={16}
                  height={16}
                  className="cursor-pointer"
                  onClick={() => handleCheckboxClick(term.id)}
                />
                <p
                  className={`cursor-pointer text-[0.9375rem] ${term.checked ? 'text-white' : 'text-gray400'}`}
                  onClick={() => handleCheckboxClick(term.id)}>
                  {term.label}
                </p>
              </div>
              {term.url && (
                <div
                  className="cursor-pointer pr-2 text-xs text-gray400 hover:text-main"
                  onClick={() => window.open(term.url, '_blank')}>
                  보기
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-5 left-0 right-0 z-50 flex w-full justify-center px-5">
        <button
          onClick={onClickSubmit}
          disabled={!buttonEnabled}
          className={`w-full max-w-md rounded-[0.5rem] py-4 text-[1rem] font-bold ${
            buttonEnabled ? 'bg-main text-sub2' : 'bg-gray400 text-gray300'
          }`}>
          동의하고 가입하기
        </button>
      </div>
    </div>
  );
}
