'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import EventCalendar from '@/components/units/Event/Write/EventCalendar';
import { AnimatePresence, motion } from 'framer-motion';
import EventTimePicker from '@/components/units/Event/Write/EventTimePicker';
import classNames from 'classnames';
import { useRecoilState } from 'recoil';
import { eventFormState } from '@/context/recoil-context';

export default function EventDateInput() {
  const [eventForm, setEventForm] = useRecoilState(eventFormState);
  const [isAllDay, setIsAllDay] = useState(false);
  const [activePopup, setActivePopup] = useState<'startCalendar' | 'endCalendar' | 'startTime' | 'endTime' | null>(
    null,
  );

  const popupWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAllDay && eventForm.startDate) {
      setEventForm({
        ...eventForm,
        endDate: eventForm.startDate,
        startTime: '00:00',
        endTime: '23:59',
      });
    } else if (!isAllDay) {
      // 하루종일을 해제하면 시간 값 초기화
      setEventForm({
        ...eventForm,
        startTime: '',
        endTime: '',
      });
    }
  }, [isAllDay, eventForm.startDate]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupWrapperRef.current && !popupWrapperRef.current.contains(event.target as Node)) {
        setActivePopup(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={popupWrapperRef} className="bg-BG-black px-5 text-white">
      <label className="mb-[0.62rem] flex items-center justify-between">
        <span className="text-[1rem] font-bold">일자</span>
        <div
          onClick={() => {
            setIsAllDay(!isAllDay);
            setActivePopup(null);
          }}
          className={`flex cursor-pointer items-center justify-center gap-[0.12rem] text-[0.75rem] text-gray300 ${
            isAllDay ? 'text-main' : ''
          }`}>
          <Image
            src={isAllDay ? '/icons/check_box.svg' : '/icons/check_box_outline_blank.svg'}
            alt="checkbox"
            width={18}
            height={18}
          />
          <span>하루종일</span>
        </div>
      </label>

      {/* 시작일자 섹션 */}
      <div className="relative mb-4 flex flex-col gap-2 text-[0.875rem]">
        <div className="flex justify-between">
          <div className="flex items-center gap-4">
            <label className="whitespace-nowrap text-gray100">시작 일자</label>
            <div
              className={`w-full cursor-pointer whitespace-nowrap border-b border-gray300 bg-transparent px-4 py-3 text-[0.8125rem] text-gray300 ${
                eventForm.startDate ? 'border-main text-white' : ''
              }`}
              onClick={() => setActivePopup(activePopup === 'startCalendar' ? null : 'startCalendar')}>
              {eventForm.startDate || 'YYYY. MM. DD.'}
            </div>
          </div>

          {!isAllDay && (
            <div className="flex items-center justify-end gap-4">
              <label className="whitespace-nowrap text-gray100">시간</label>
              <div
                className={`cursor-pointer whitespace-nowrap border-b border-gray300 bg-transparent px-4 py-3 text-[0.8125rem] text-gray300 ${
                  eventForm.startTime ? 'border-main text-white' : ''
                }`}
                onClick={() => setActivePopup(activePopup === 'startTime' ? null : 'startTime')}>
                {eventForm.startTime || '00:00'}
              </div>
            </div>
          )}
        </div>

        <AnimatePresence>
          {(activePopup === 'startCalendar' || activePopup === 'startTime') && (
            <motion.div
              key="start-popup"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className={classNames({ 'overflow-hidden': activePopup === 'startCalendar' })}>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}>
                {activePopup === 'startCalendar' && (
                  <EventCalendar
                    selectedDate={eventForm.startDate}
                    onSelectDate={(date) => {
                      const newStartDate = date === eventForm.startDate ? '' : date;
                      setEventForm({
                        ...eventForm,
                        startDate: newStartDate,
                        endDate: isAllDay ? newStartDate : eventForm.endDate,
                      });
                      setActivePopup(null);
                    }}
                    onClose={() => setActivePopup(null)}
                    maxDate={eventForm.endDate}
                  />
                )}
                {/* 🔥 수정된 시작 시간 피커 래퍼 */}
                {activePopup === 'startTime' && !isAllDay && (
                  <div className="flex justify-end py-2">
                    <EventTimePicker
                      selectedHour={eventForm.startTime ? Number(eventForm.startTime.split(':')[0]) : 0}
                      selectedMinute={eventForm.startTime ? Number(eventForm.startTime.split(':')[1]) : 0}
                      onChange={(hour, minute) => {
                        const newStartTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
                        console.log('🕐 시작 시간 변경:', {
                          hour,
                          minute,
                          newStartTime,
                          currentStartTime: eventForm.startTime,
                        });
                        setEventForm({
                          ...eventForm,
                          startTime: newStartTime,
                        });
                      }}
                    />
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* 종료일자 섹션 */}
      <div className="relative flex flex-col gap-2 text-[0.875rem]">
        <div className="flex justify-between">
          <div className="flex items-center gap-4">
            <label className="whitespace-nowrap text-gray100">종료 일자</label>
            <div
              className={`w-full cursor-pointer whitespace-nowrap border-b border-gray300 bg-transparent px-4 py-3 text-[0.8125rem] text-gray300 ${
                eventForm.endDate ? 'border-main text-white' : ''
              }`}
              onClick={() => setActivePopup(activePopup === 'endCalendar' ? null : 'endCalendar')}>
              {eventForm.endDate || 'YYYY. MM. DD.'}
            </div>
          </div>
          {!isAllDay && (
            <div className="flex items-center justify-end gap-4">
              <label className="whitespace-nowrap text-gray100">시간</label>
              <div
                className={`cursor-pointer whitespace-nowrap border-b border-gray300 bg-transparent px-4 py-3 text-[0.8125rem] text-gray300 ${
                  eventForm.endTime ? 'border-main text-white' : ''
                }`}
                onClick={() => setActivePopup(activePopup === 'endTime' ? null : 'endTime')}>
                {eventForm.endTime || '00:00'}
              </div>
            </div>
          )}
        </div>

        <AnimatePresence>
          {(activePopup === 'endCalendar' || activePopup === 'endTime') && (
            <motion.div
              key="end-popup"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className={classNames({ 'overflow-hidden': activePopup === 'endCalendar' })}>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}>
                {activePopup === 'endCalendar' && (
                  <EventCalendar
                    selectedDate={eventForm.endDate}
                    onSelectDate={(date) => {
                      setEventForm({
                        ...eventForm,
                        endDate: date === eventForm.endDate ? '' : date,
                      });
                      setActivePopup(null);
                    }}
                    onClose={() => setActivePopup(null)}
                    minDate={eventForm.startDate}
                  />
                )}
                {/* 🔥 수정된 종료 시간 피커 래퍼 */}
                {activePopup === 'endTime' && !isAllDay && (
                  <div className="flex justify-end py-2">
                    <EventTimePicker
                      selectedHour={eventForm.endTime ? Number(eventForm.endTime.split(':')[0]) : 0}
                      selectedMinute={eventForm.endTime ? Number(eventForm.endTime.split(':')[1]) : 0}
                      onChange={(hour, minute) => {
                        const newEndTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
                        console.log('🕐 종료 시간 변경:', {
                          hour,
                          minute,
                          newEndTime,
                          currentEndTime: eventForm.endTime,
                        });
                        setEventForm({
                          ...eventForm,
                          endTime: newEndTime,
                        });
                      }}
                    />
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
