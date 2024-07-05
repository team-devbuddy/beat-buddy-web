'use client';
import { useState } from 'react';

export default function OptionNickname() {
  const [nickname, setNickname] = useState('');

  return (
    <>
      <div className="flex w-full flex-col">
        <div className="px-4 py-2">
          <p className="text-2xl font-bold text-white">닉네임 수정</p>
        </div>

        <div className="mt-3 w-full px-4 pt-3">
          <div className="relative flex items-center">
            <input
              placeholder="Text Field"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full border-b border-white bg-transparent px-2 py-4 pr-24 text-white outline-none placeholder:text-gray400"
            />
            {nickname && (
              <button className="absolute right-2 top-1/2 -translate-y-1/2 transform rounded bg-gray500 px-3 py-[0.38rem] text-xs text-gray200">
                중복 확인
              </button>
            )}
          </div>
          <p className="px-2 pt-[0.62rem] text-gray300">공백없이 12자 이하로 입력해주세요. 특수 기호는 불가능해요.</p>
        </div>
      </div>
      <button
        className={`absolute bottom-0 flex w-full justify-center py-4 text-lg font-bold ${'bg-gray400 text-gray300'}`}>
        저장
      </button>
    </>
  );
}
