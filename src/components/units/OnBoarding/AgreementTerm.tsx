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
import Prev from '@/components/common/Prev';

export default function AgreementTerm() {
  const [terms, setTerms] = useState<Term[]>(termsData);
  const [allChecked, setAllChecked] = useState(false);
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState);

  const userType = searchParams.get('userType'); // ⬅️ business or null

  useEffect(() => {
    const access = searchParams.get('access');
    if (access) setAccessToken(access);
  }, [searchParams, setAccessToken]);

  useEffect(() => {
    const requiredTermsChecked = terms.filter((t) => t.isRequired).every((t) => t.checked);
    setButtonEnabled(requiredTermsChecked);
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
          // ✅ 쿼리에 따라 라우팅
          if (userType === 'business') {
            router.push('/signup/business');
          } else {
            router.push('/onBoarding/name');
          }
        }
      } catch (error) {
        console.error('Error submitting agreement:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="w-full">
      <Prev url={'/login'} />
      {loading && <Loading />}
      <div className="flex w-full flex-col px-4">
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
                  alt="check"
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
                  onClick={() => window.open(term.url, '_blank')}>
                  보기
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-10 z-50 flex w-full justify-center px-4">
        <button
          onClick={onClickSubmit}
          disabled={!buttonEnabled}
          className={`w-full max-w-md rounded-md py-4 text-lg font-bold ${
            buttonEnabled ? 'bg-[#EE1171] text-BG-black hover:brightness-105' : 'bg-gray400 text-gray300'
          }`}>
          동의하고 가입하기
        </button>
      </div>
    </div>
  );
}
