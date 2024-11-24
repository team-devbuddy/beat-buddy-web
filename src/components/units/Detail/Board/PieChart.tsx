'use client';

import React from 'react';

interface PieChartProps {
  total: number; // 총 조각 수
  filled: number; // 채워진 조각 수
  size?: number; // 원 크기 (기본값: 40)
  strokeWidth?: number; // 원 테두리 두께 (기본값: 8)
}

const PieChart = ({ total = 1, filled = 0, size = 30, strokeWidth = 8 }: PieChartProps) => {
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const anglePerSlice = 360 / total;

  // SVG filter 추가 (그림자 효과)
  const shadowFilter = (
    <filter id="slice-shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.4" />
    </filter>
  );

  // 각 조각의 Path 생성
  const createSlice = (index: number, isFilled: boolean) => {
    const startAngle = -index * anglePerSlice - 90; // 반시계 방향으로 조각 생성
    const endAngle = startAngle - anglePerSlice;

    const largeArcFlag = anglePerSlice > 180 ? 1 : 0;

    const startX = center + radius * Math.cos((startAngle * Math.PI) / 180);
    const startY = center + radius * Math.sin((startAngle * Math.PI) / 180);

    const endX = center + radius * Math.cos((endAngle * Math.PI) / 180);
    const endY = center + radius * Math.sin((endAngle * Math.PI) / 180);

    const pathData = `
      M ${center},${center}
      L ${startX},${startY}
      A ${radius},${radius} 0 ${largeArcFlag} 0 ${endX},${endY}
      Z
    `;

    return (
      <path
        key={index}
        d={pathData}
        fill={isFilled ? '#EE1171' : '#8F0B48'} // 채워진 부분과 배경 부분 색상 구분
        filter={isFilled ? 'url(#slice-shadow)' : undefined} // 채워진 부분에만 그림자 추가
      />
    );
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* 그림자 필터 정의 */}
      <defs>{shadowFilter}</defs>
      {/* 조각 그리기 */}
      {Array.from({ length: total }).map((_, index) => createSlice(index, index < filled))}
    </svg>
  );
};

export default PieChart;
