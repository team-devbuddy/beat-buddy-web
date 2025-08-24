'use client';

import React from 'react';

interface WriteFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  isTextArea?: boolean;
}

const WriteField = ({ value, onChange, placeholder, className, isTextArea }: WriteFieldProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const baseStyles =
    'w-full rounded-xs border border-gray300 bg-gray700 px-4 py-3 text-gray100 placeholder-gray300 focus:border-main focus:outline-none';

  if (isTextArea) {
    return (
      <textarea
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={`${baseStyles} min-h-[10rem] resize-none ${className}`}
      />
    );
  }

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      className={`safari-input-fix ${baseStyles} ${className}`}
    />
  );
};

export default WriteField;
