'use client';
import React from 'react';
interface VenueHoursProps {
  hours: { [key: string]: string };
}

const daysOfWeek = ['월', '화', '수', '목', '금', '토', '일'];

const fullDaysOfWeek: { [key: string]: string } = {
  일: '일요일',
  월: '월요일',
  화: '화요일',
  수: '수요일',
  목: '목요일',
  금: '금요일',
  토: '토요일',
};

const parseHours = (hours: string) => {
  return hours.replace('~', ' - ');
};

const VenueHours = ({ hours }: VenueHoursProps) => {

  
  return (
    <div className="bg-BG-black">
      <div className="px-[1rem] py-[1.25rem]">
        <h2 className="text-body1-16-bold">운영 시간</h2>
        <div className="mt-[0.75rem] flex flex-col space-y-[0.25rem]">
          {daysOfWeek.map((day) => (
            <div key={day} className="flex items-center space-x-[0.75rem]">
              <p className="text-body2-15-medium text-gray200">
                {fullDaysOfWeek[day]} &nbsp;
                {hours[fullDaysOfWeek[day]] ? parseHours(hours[fullDaysOfWeek[day]]) : '휴무'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VenueHours;
