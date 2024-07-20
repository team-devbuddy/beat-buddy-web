'use client';
import React from 'react';
import Dropdown from './SortDropdown';

interface DropdownGroupProps {
  genres: string[];
  locations: string[];
  orders: string[];
  selectedGenre: string;
  setSelectedGenre: React.Dispatch<React.SetStateAction<string>>;
  selectedLocation: string;
  setSelectedLocation: React.Dispatch<React.SetStateAction<string>>;
  selectedOrder: string;
  setSelectedOrder: React.Dispatch<React.SetStateAction<string>>;
}

const DropdownGroup = ({
  genres,
  locations,
  orders,
  selectedGenre,
  setSelectedGenre,
  selectedLocation,
  setSelectedLocation,
  selectedOrder,
  setSelectedOrder
}: DropdownGroupProps) => {
  return (
    <div className="flex items-center justify-between mb-[0.75rem] px-[1rem] py-[0.25rem] w-full space-x-[0.75rem]">
      <div className="flex space-x-[0.75rem]">
        <Dropdown options={genres} selectedOption={selectedGenre} setSelectedOption={setSelectedGenre} label="장르" />
        <Dropdown options={locations} selectedOption={selectedLocation} setSelectedOption={setSelectedLocation} label="위치" />
      </div>
      <Dropdown options={orders} selectedOption={selectedOrder} setSelectedOption={setSelectedOrder} label="가까운 순" isThirdDropdown />
    </div>
  );
};

export default DropdownGroup;
