'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import classNames from 'classnames';
import { useRecoilState } from 'recoil';
import { eventFormState } from '@/context/recoil-context';

export default function EventRegisterStepForm() {
  const [eventForm, setEventForm] = useRecoilState(eventFormState);
  const [step, setStep] = useState(1);
  const [isReceivingInfo, setIsReceivingInfo] = useState<boolean | null>(null);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');

  const handleReceiveClick = (value: boolean) => {
    setIsReceivingInfo(value);
    if (value) {
      setStep(2);
    } else {
      setStep(3);
    }
  };

  const toggleField = (field: string) => {
    setSelectedFields((prev) => (prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]));
  };

  useEffect(() => {
    if (isReceivingInfo && selectedFields.length > 0) {
      setStep(3);
    }
  }, [selectedFields, isReceivingInfo]);

  useEffect(() => {
    const options: string[] = [];

    if (isReceivingInfo !== null) {
      options.push(isReceivingInfo ? '정보 수집' : '정보 수집 안함');
    }

    if (selectedFields.length > 0) {
      options.push(...selectedFields);
    }

    if (bankName.trim() && accountNumber.trim()) {
      options.push(`${bankName} ${accountNumber}`);
    }

    if (amount.trim()) {
      options.push(`예약금 ${amount}원`);
    }

    // boolean 필드들 업데이트
    setEventForm({
      ...eventForm,
      receiveInfo: isReceivingInfo === true,
      receiveName: selectedFields.includes('이름'),
      receiveGender: selectedFields.includes('성별'),
      receivePhoneNumber: selectedFields.includes('전화번호'),
      receiveTotalCount: selectedFields.includes('동행 인원'),
      receiveSNSId: selectedFields.includes('SNS 아이디'),
      receiveMoney: selectedFields.includes('사전 예약금 입금 여부'),
      depositAccount: bankName.trim() && accountNumber.trim() ? `${bankName} ${accountNumber}` : '',
      depositAmount: amount.trim() ? amount.replace(/,/g, '') : '', // 콤마 제거 후 저장
    });
  }, [isReceivingInfo, selectedFields, bankName, accountNumber, amount]);

  const fields = [
    { label: '이름', row: 0 },
    { label: '성별', row: 0 },
    { label: '전화번호', row: 0 },
    { label: '동행 인원', row: 1 },
    { label: 'SNS 아이디', row: 1 },
    { label: '사전 예약금 입금 여부', row: 2 },
  ];

  return (
    <div className="bg-BG-black px-5 text-white">
      <h2 className="mb-[0.62rem] text-[1rem] font-bold">행사 참석 명단 받기</h2>
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => handleReceiveClick(true)}
          className={classNames(
            'flex-1 rounded-[0.38rem] py-3 transition-colors',
            isReceivingInfo === true
              ? 'border border-main bg-sub1 text-[0.875rem] font-bold text-white'
              : 'bg-gray500 text-[0.875rem] text-gray300',
          )}>
          받을게요
        </button>
        <button
          onClick={() => handleReceiveClick(false)}
          className={classNames(
            'flex-1 rounded-[0.38rem] py-3 transition-colors',
            isReceivingInfo === false
              ? 'border border-main bg-sub1 text-[0.875rem] font-bold text-white'
              : 'bg-gray500 text-[0.875rem] text-gray300',
          )}>
          받지 않을게요
        </button>
      </div>

      <AnimatePresence>
        {step >= 2 && isReceivingInfo === true && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mb-6">
            <h2 className="mb-4 text-[1rem] font-bold">행사 참석자 필수 수집 정보</h2>

            <div className="mb-2 grid grid-cols-3 gap-2">
              {fields
                .filter((f) => f.row === 0)
                .map((f) => (
                  <button
                    key={f.label}
                    onClick={() => toggleField(f.label)}
                    className={classNames(
                      'rounded-[0.38rem] py-3 text-[0.875rem] transition-colors',
                      selectedFields.includes(f.label)
                        ? 'border border-main bg-sub1 text-white'
                        : 'bg-gray500 text-[0.875rem] text-gray300',
                    )}>
                    {f.label}
                  </button>
                ))}
            </div>

            <div className="mb-2 grid grid-cols-2 gap-2">
              {fields
                .filter((f) => f.row === 1)
                .map((f) => (
                  <button
                    key={f.label}
                    onClick={() => toggleField(f.label)}
                    className={classNames(
                      'rounded-[0.38rem] py-3 text-[0.875rem] transition-colors',
                      selectedFields.includes(f.label)
                        ? 'border border-main bg-sub1 text-white'
                        : 'bg-gray500 text-[0.875rem] text-gray300',
                    )}>
                    {f.label}
                  </button>
                ))}
            </div>

            <div className="mb-6">
              {fields
                .filter((f) => f.row === 2)
                .map((f) => (
                  <button
                    key={f.label}
                    onClick={() => toggleField(f.label)}
                    className={classNames(
                      'w-full rounded-[0.38rem] py-3 text-[0.875rem] transition-colors',
                      selectedFields.includes(f.label)
                        ? 'border border-main bg-sub1 text-white'
                        : 'bg-gray500 text-[0.875rem] text-gray300',
                    )}>
                    {f.label}
                  </button>
                ))}
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mb-6">
            {/* 입금 계좌 - 사전 예약금 입금 여부가 선택된 경우에만 표시 */}
            {selectedFields.includes('사전 예약금 입금 여부') && (
              <>
                <h2 className="mb-[0.62rem] text-[1rem] font-bold">사전 예약금 정보</h2>
                <div className="flex items-center gap-4 pb-[0.62rem]">
                  <label className="whitespace-nowrap text-[0.875rem] text-gray100">입금 계좌</label>

                  <div
                    className={`flex items-center border-b px-3 py-2 ${bankName.trim() ? 'border-main' : 'border-gray300'}`}>
                    <input
                      type="text"
                      placeholder="은행 입력"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-[80px] bg-transparent text-center text-[0.875rem] text-gray100 placeholder-gray300 safari-input-fix focus:outline-none"
                    />
                  </div>

                  <div
                    className={`flex flex-1 items-center border-b px-3 py-2 ${accountNumber.trim() ? 'border-main' : 'border-gray300'}`}>
                    <input
                      type="text"
                      placeholder="계좌번호 입력"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="w-full bg-transparent text-[0.875rem] text-gray100 placeholder-gray300 safari-input-fix focus:outline-none"
                    />
                  </div>
                </div>

                {/* 입금 금액 - 사전 예약금 입금 여부가 선택된 경우에만 표시 */}
                <div className="flex items-center gap-4">
                  <label className="whitespace-nowrap text-[0.875rem] text-gray100">입금 금액</label>

                  <div
                    className={`flex flex-1 items-center gap-2 border-b px-3 py-2 ${amount.trim() ? 'border-main' : 'border-gray300'}`}>
                    <input
                      type="text"
                      placeholder="0"
                      value={amount}
                      onChange={(e) => {
                        // 숫자와 콤마만 허용
                        const value = e.target.value.replace(/[^\d,]/g, '');
                        // 콤마 제거 후 숫자만 추출
                        const numericValue = value.replace(/,/g, '');
                        // 숫자를 콤마가 포함된 형태로 변환
                        const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                        setAmount(formattedValue);
                      }}
                      className="w-full bg-transparent text-right text-[0.875rem] text-gray100 placeholder-gray300 safari-input-fix focus:outline-none"
                    />
                    <span className="whitespace-nowrap text-[0.875rem] text-gray100">원</span>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
