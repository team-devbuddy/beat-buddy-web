'use client';

import React from 'react';

interface WriteFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const WriteField: React.FC<WriteFieldProps> = ({ value, onChange, placeholder, className = '' }) => {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full rounded-xs border border-gray300 bg-gray700 px-4 py-3 text-gray100 placeholder-gray300 focus:border-main focus:outline-none ${className}`}></input>
  );
};

export default WriteField;
