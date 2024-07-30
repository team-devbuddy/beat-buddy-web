'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Term } from '@/lib/types';
import { termsData } from '@/lib/data';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRecoilState } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';
import { PostAgree } from '@/lib/action';
import Loading from '@/app/loading';

const LoadingOverlay = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
    <div className="flex flex-col items-center">
      <Image src="/icons/loader.svg" alt="Loading" width={50} height={50} />
      <p className="mt-4 text-white">로딩 중...</p>
    </div>
  </div>
);

export default function AgreementTerm() {
  const [terms, setTerms] = useState<Term[]>(termsData);
  const [allChecked, setAllChecked] = useState<boolean>(false);
  const [buttonEnabled, setButtonEnabled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false); // 로딩 상태 추가
  const router = useRouter();

  // access 쿼리 받아오기
  const searchParams = useSearchParams();
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState);

  useEffect(() => {
    const access = searchParams.get('access');
    if (access) {
      setAccessToken(access);
    }
  }, [searchParams, setAccessToken]);

  useEffect(() => {
    const requiredTermsChecked = terms.filter((term) => term.isRequired).every((term) => term.checked);
    setButtonEnabled(requiredTermsChecked);
  }, [terms]);

  const handleCheckboxClick = (id: number) => {
    setTerms((prevTerms) => prevTerms.map((term) => (term.id === id ? { ...term, checked: !term.checked } : term)));
  };

  const handleAllCheckboxClick = () => {
    const newState = !allChecked;
    setAllChecked(newState);
    setTerms((prevTerms) =>
      prevTerms.map((term) => ({
        ...term,
        checked: newState,
      })),
    );
  };

  const handleViewClick = (url: string) => {
    router.push(url);
  };

  const onClickSubmit = async () => {
    const locationConsent = terms.find((term) => term.id === 3)?.checked || false;
    const marketingConsent = terms.find((term) => term.id === 4)?.checked || false;

    const requestData = {
      isLocationConsent: locationConsent,
      isMarketingConsent: marketingConsent,
    };

    if (accessToken) {
      try {
        setLoading(true); // 로딩 상태 활성화
        const response = await PostAgree(accessToken, requestData);
        if (response.ok) {
          router.push('/onBoarding/name');
        }
      } catch (error) {
        console.error('Error submitting terms agreement:', error);
      } finally {
        setLoading(false); // 로딩 상태 비활성화
      }
    } else {
      console.error('Access token is not available');
    }
  };

  return (
    <>
      {loading && <Loading />}
      <div className="flex w-full flex-col px-4">
        <h1 className="text-2xl font-bold leading-9 text-white">
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
          <p className="cursor-pointer text-white hover:brightness-75" onClick={handleAllCheckboxClick}>
            모두 동의 (선택 동의 포함)
          </p>
        </div>

        <div className="flex flex-col pt-3">
          {terms.map((term) => (
            <div key={term.id} className="flex justify-between py-3 pl-[0.38rem]">
              <div className="flex gap-2 hover:brightness-75">
                <Image
                  src={term.checked ? '/icons/Check.svg' : '/icons/NotCheck.svg'}
                  alt="unchecked"
                  width={16}
                  height={16}
                  className="cursor-pointer"
                  onClick={() => handleCheckboxClick(term.id)}
                />
                <p className="cursor-pointer text-[0.9375rem] text-white" onClick={() => handleCheckboxClick(term.id)}>
                  {term.label}
                </p>
              </div>
              {term.url && (
                <div
                  className="cursor-pointer pr-2 text-xs text-gray400 hover:text-main"
                  onClick={() => handleViewClick(term.url)}>
                  보기
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onClickSubmit}
        disabled={!buttonEnabled}
        className={`absolute bottom-0 flex w-full justify-center py-4 text-lg font-bold ${
          buttonEnabled ? 'bg-[#EE1171] text-BG-black hover:brightness-105' : 'bg-gray400 text-gray300'
        }`}>
        동의하고 가입하기
      </button>
    </>
  );
}
