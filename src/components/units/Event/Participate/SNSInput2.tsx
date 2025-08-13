'use client';

import { useState, useEffect } from 'react';

export default function SNSInput2({
  snsType,
  snsId,
  onTypeChange,
  onIdChange,
  onConfirm,
  disabled = false,
}: {
  snsType: string;
  snsId: string;
  onTypeChange: (value: string) => void;
  onIdChange: (value: string) => void;
  onConfirm: () => void;
  disabled?: boolean;
}) {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // VisualViewport API를 사용한 키보드 감지 (스크롤바 오차 보정)
  useEffect(() => {
    const handleViewportResize = () => {
      if ('visualViewport' in window) {
        const windowHeight = window.innerHeight;
        const viewportHeight = window.visualViewport?.height || windowHeight;

        // 스크롤바로 인한 오차를 보정하기 위해 threshold 추가
        const heightDiff = windowHeight - viewportHeight;
        const threshold = 50; // 50px 이상 차이나야 키보드로 인식

        console.log('🔵 SNSInput2 키보드 감지:', { windowHeight, viewportHeight, heightDiff, threshold });

        if (heightDiff > threshold) {
          setIsKeyboardVisible(true);
          setKeyboardHeight(heightDiff);
          console.log('🔵 키보드 감지됨:', heightDiff);
        } else {
          setIsKeyboardVisible(false);
          setKeyboardHeight(0);
          console.log('🔵 키보드 없음');
        }
      }
    };

    // 초기 상태 설정
    handleViewportResize();

    // 이벤트 리스너 등록
    if ('visualViewport' in window) {
      window.visualViewport?.addEventListener('resize', handleViewportResize);
    }

    return () => {
      if ('visualViewport' in window) {
        window.visualViewport?.removeEventListener('resize', handleViewportResize);
      }
    };
  }, []);

  // SNS 타입을 선택하고 ID를 입력했을 때만 완료할 수 있음
  const canConfirm =
    snsType === 'None' || // SNS 없음 선택
    (snsType === 'Instagram' && snsId.trim().length > 0) || // Instagram + ID 입력
    (snsType === 'Facebook' && snsId.trim().length > 0); // Facebook + ID 입력

  // 확인 버튼을 보여줄지 결정하는 조건
  const shouldShowConfirmButton =
    snsType === 'None' || // SNS 없음 선택 시
    (snsType === 'Instagram' && snsId.trim().length > 0) || // Instagram + ID 입력 완료 시
    (snsType === 'Facebook' && snsId.trim().length > 0); // Facebook + ID 입력 완료 시

  const getButtonClass = (sns: string) => {
    const isSelected = snsType === sns;
    return `flex-1 rounded-[0.38rem] py-3 text-body-14-medium border transition-colors ${
      isSelected ? 'bg-sub1 text-white border-main text-body-14-bold' : 'bg-gray500 text-gray300 border-gray500'
    }`;
  };

  const handleConfirm = () => {
    console.log('🔵 SNSInput2 handleConfirm 호출됨');
    console.log('🔵 canConfirm:', canConfirm, 'snsType:', snsType, 'snsId:', snsId);
    if (canConfirm) {
      console.log('🔵 onConfirm 호출함');
      // 확인 버튼 클릭 시 키보드 숨김 후 onConfirm 호출
      setIsKeyboardVisible(false);
      onConfirm();
    } else {
      console.log('🔵 SNS 입력이 완료되지 않음, onConfirm 호출 안함');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && canConfirm) {
      handleConfirm();
    }
  };

  return (
    <div>
      <div className="mb-[0.62rem] flex items-end justify-start gap-[0.38rem]">
        <label className="block text-body1-16-bold">SNS</label>
      </div>
      <div className="flex gap-[0.62rem]">
        <button
          type="button"
          className={getButtonClass('Instagram')}
          onClick={() => {
            if (!disabled) {
              onTypeChange('Instagram');
              onIdChange('');
            }
          }}
          disabled={disabled}>
          인스타그램
        </button>
        <button
          type="button"
          className={getButtonClass('Facebook')}
          onClick={() => {
            if (!disabled) {
              onTypeChange('Facebook');
              onIdChange('');
            }
          }}
          disabled={disabled}>
          페이스북
        </button>
        <button
          type="button"
          className={getButtonClass('None')}
          onClick={() => {
            if (!disabled) {
              onTypeChange('None');
              onIdChange('');
              // SNS 없음 선택 시 바로 다음 단계로 진행
              setTimeout(() => {
                onConfirm();
              }, 500);
            }
          }}
          disabled={disabled}>
          없음
        </button>
      </div>

      {snsType === 'Instagram' && (
        <input
          type="text"
          placeholder="인스타그램 아이디를 입력해주세요"
          className={`mt-3 w-full border-b border-gray300 bg-BG-black px-4 py-3 text-body-14-medium text-gray100 placeholder-gray300 safari-input-fix focus:outline-none ${
            disabled ? 'cursor-not-allowed' : ''
          }`}
          value={snsId}
          onChange={(e) => {
            if (!disabled) {
              // 영어, 숫자, 언더스코어, 점만 허용
              const value = e.target.value.replace(/[^a-zA-Z0-9._]/g, '');
              onIdChange(value);
            }
          }}
          onFocus={() => {
            console.log('🔵 Instagram 입력 필드 포커스');
            // 포커스 시 즉시 키보드 감지 시도
            setTimeout(() => {
              if ('visualViewport' in window) {
                const windowHeight = window.innerHeight;
                const viewportHeight = window.visualViewport?.height || windowHeight;
                const heightDiff = windowHeight - viewportHeight;
                const threshold = 50;

                console.log('🔵 Instagram focus 후 키보드 체크:', {
                  windowHeight,
                  viewportHeight,
                  heightDiff,
                  threshold,
                });

                if (heightDiff > threshold) {
                  setIsKeyboardVisible(true);
                  setKeyboardHeight(heightDiff);
                  console.log('🔵 Instagram focus 후 키보드 감지됨');
                }
              }
            }, 100);
          }}
          onKeyDown={handleKeyDown}
          pattern="[a-zA-Z0-9._]+"
          title="영어, 숫자, 언더스코어(_), 점(.)만 입력 가능합니다"
          disabled={disabled}
        />
      )}

      {snsType === 'Facebook' && (
        <input
          type="text"
          placeholder="페이스북 아이디를 입력해주세요"
          className={`mt-3 w-full border-b border-gray300 bg-BG-black px-4 py-3 text-body-14-medium text-gray100 placeholder-gray300 safari-input-fix focus:outline-none ${
            disabled ? 'cursor-not-allowed' : ''
          }`}
          value={snsId}
          onChange={(e) => {
            if (!disabled) {
              // 영어, 숫자, 언더스코어, 점만 허용
              const value = e.target.value.replace(/[^a-zA-Z0-9._]/g, '');
              onIdChange(value);
            }
          }}
          onFocus={() => {
            console.log('🔵 Facebook 입력 필드 포커스');
            // 포커스 시 즉시 키보드 감지 시도
            setTimeout(() => {
              if ('visualViewport' in window) {
                const windowHeight = window.innerHeight;
                const viewportHeight = window.visualViewport?.height || windowHeight;
                const heightDiff = windowHeight - viewportHeight;
                const threshold = 50;

                console.log('🔵 Facebook focus 후 키보드 체크:', {
                  windowHeight,
                  viewportHeight,
                  heightDiff,
                  threshold,
                });

                if (heightDiff > threshold) {
                  setIsKeyboardVisible(true);
                  setKeyboardHeight(heightDiff);
                  console.log('🔵 Facebook focus 후 키보드 감지됨');
                }
              }
            }, 100);
          }}
          onKeyDown={handleKeyDown}
          pattern="[a-zA-Z0-9._]+"
          title="영어, 숫자, 언더스코어(_), 점(.)만 입력 가능합니다"
          disabled={disabled}
        />
      )}

      {/* 확인 버튼 - VisualViewport를 사용하여 키보드 위에 정확히 위치 */}
      {isKeyboardVisible && shouldShowConfirmButton && (
        <div
          className="fixed left-0 right-0 z-50 flex justify-center bg-BG-black p-4 shadow-lg"
          style={{
            bottom: `${keyboardHeight}px`,
            transition: 'bottom 0.3s ease-out',
          }}>
          <div className="w-full max-w-[600px]">
            <button
              onClick={handleConfirm}
              disabled={disabled}
              className="w-full rounded-lg bg-main py-4 text-button-16-semibold text-sub2 transition-colors hover:bg-main/90 disabled:cursor-not-allowed disabled:opacity-50">
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
