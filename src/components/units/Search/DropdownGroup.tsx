'use client';
import Dropdown from './SortDropdown';

interface DropdownGroupProps {
  genres: string[];
  locations: string[];
  criteria: string[];
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
  criteria,
  selectedGenre,
  setSelectedGenre,
  selectedLocation,
  setSelectedLocation,
  selectedOrder,
  setSelectedOrder,
}: DropdownGroupProps) => {
  return (
    <div className="flex w-full items-center justify-between space-x-[0.5rem] px-5">
      <div className="flex space-x-[0.75rem]">
        <Dropdown options={genres} selectedOption={selectedGenre} setSelectedOption={setSelectedGenre} label="장르" />
        <Dropdown
          options={locations}
          selectedOption={selectedLocation}
          setSelectedOption={setSelectedLocation}
          label="지역"
        />
      </div>
      <Dropdown
        options={criteria}
        selectedOption={selectedOrder}
        setSelectedOption={setSelectedOrder}
        label="가까운 순"
        isThirdDropdown
      />
    </div>
  );
};

export default DropdownGroup;
