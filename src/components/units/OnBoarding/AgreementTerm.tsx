'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Term } from '@/lib/types';
import { termsData } from '@/lib/data';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRecoilState } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';

export default function AgreementTerm() {
  const [terms, setTerms] = useState<Term[]>(termsData);
  const [allChecked, setAllChecked] = useState<boolean>(false);
  const [buttonEnabled, setButtonEnabled] = useState<boolean>(false);
  const router = useRouter();

  // access 쿼리 받아오기
  const searchParams = useSearchParams();
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState);

  useEffect(() => {
    const access = searchParams.get('access');
    if (access) {
      setAccessToken(access);
    }
  }, [searchParams]);

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

  const onClickSubmit = () => {
    router.push('/onBoarding/name');
  };

  return (
    <>
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
          <p className="text-white">모두 동의 (선택 동의 포함)</p>
        </div>

        <div className="flex flex-col pt-3">
          {terms.map((term) => (
            <div key={term.id} className="flex justify-between py-3 pl-[0.38rem]">
              <div className="flex gap-2">
                <Image
                  src={term.checked ? '/icons/Check.svg' : '/icons/NotCheck.svg'}
                  alt="unchecked"
                  width={16}
                  height={16}
                  className="cursor-pointer"
                  onClick={() => handleCheckboxClick(term.id)}
                />
                <p className="text-[0.9375rem] text-white">{term.label}</p>
              </div>
              <div className="pr-2 text-xs text-gray400">보기</div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onClickSubmit}
        disabled={!buttonEnabled}
        className={`absolute bottom-0 flex w-full justify-center py-4 text-lg font-bold ${
          buttonEnabled ? 'bg-[#EE1171] text-BG-black' : 'bg-gray400 text-gray300'
        }`}>
        동의하고 가입하기
      </button>
    </>
  );
}
