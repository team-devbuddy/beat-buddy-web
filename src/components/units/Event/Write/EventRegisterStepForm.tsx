'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import classNames from 'classnames';

export default function EventRegisterStepForm() {
  const [step, setStep] = useState(1);
  const [isReceivingInfo, setIsReceivingInfo] = useState<null | boolean>(null);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');

  const handleReceiveClick = (value: boolean) => {
    setIsReceivingInfo(value);
    if (value) {
      setStep(2);
    } else {
      setStep(3); // 정보 안 받더라도 사전예약금은 보여야 함
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

  const fields = [
    { label: '이름', row: 0 },
    { label: '성별', row: 0 },
    { label: '전화번호', row: 0 },
    { label: '동행 인원', row: 1 },
    { label: 'SNS 아이디', row: 1 },
    { label: '사전 예약금 입금 여부', row: 2 },
  ];

  return (
    <div className="bg-BG-black p-5 text-white">
      <h2 className="mb-4 text-lg font-bold">행사 참석 명단 받기</h2>
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => handleReceiveClick(true)}
          className={classNames(
            'flex-1 rounded-md py-2 transition-colors',
            isReceivingInfo === true ? 'bg-white font-semibold text-black' : 'bg-gray700 text-white hover:bg-gray600',
          )}>
          받을게요
        </button>
        <button
          onClick={() => handleReceiveClick(false)}
          className={classNames(
            'flex-1 rounded-md py-2 transition-colors',
            isReceivingInfo === false ? 'bg-white font-semibold text-black' : 'bg-gray700 text-white hover:bg-gray600',
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
            <h2 className="mb-4 text-lg font-bold">행사 참석자 필수 수집 정보</h2>

            <div className="mb-2 grid grid-cols-3 gap-2">
              {fields
                .filter((f) => f.row === 0)
                .map((f) => (
                  <button
                    key={f.label}
                    onClick={() => toggleField(f.label)}
                    className={classNames(
                      'rounded-md py-2 text-sm transition-colors',
                      selectedFields.includes(f.label)
                        ? 'bg-white font-semibold text-black'
                        : 'bg-gray700 text-gray300',
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
                      'rounded-md py-2 text-sm transition-colors',
                      selectedFields.includes(f.label)
                        ? 'bg-white font-semibold text-black'
                        : 'bg-gray700 text-gray300',
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
                      'w-full rounded-md py-2 text-sm transition-colors',
                      selectedFields.includes(f.label)
                        ? 'bg-white font-semibold text-black'
                        : 'bg-gray700 text-gray300',
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
            transition={{ duration: 0.3 }}>
            <h2 className="mb-4 text-lg font-bold">사전 예약금 정보</h2>

            {/* 입금 계좌 */}
            {/* 입금 계좌 */}
            <div className="mb-4">
              <label className="mb-1 block text-sm font-semibold text-white">입금 계좌</label>
              <div className="flex flex-wrap gap-2">
                {/* 은행명 */}
                <input
                  placeholder="은행명"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="max-w-[100px] rounded-md border border-gray500 bg-black px-3 py-2 text-white placeholder-gray500"
                />
                {/* 계좌번호 */}
                <input
                  type="text"
                  placeholder="계좌번호"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="min-w-[100px] flex-1 rounded-md border border-gray500 bg-black px-3 py-2 text-white placeholder-gray500"
                />
              </div>
            </div>

            {/* 입금 금액 */}
            <div className="mb-6">
              <label className="mb-1 block text-sm font-semibold text-white">입금 금액</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex-1 rounded-md border border-gray500 bg-black px-3 py-2 text-white placeholder-gray500"
                />
                <span className="text-sm text-gray300">원</span>
              </div>
            </div>

            <button className="bg-primary hover:bg-primary-dark w-full rounded-md py-3 text-white">
              이벤트 등록하기
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
