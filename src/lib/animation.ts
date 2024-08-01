import { Variants } from 'framer-motion';

export const clubEffect = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

//모달 열기, 닫기 애니메이션
export const modalBackdropVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const modalVariants: Variants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: { duration: 0.3 } },
  exit: { scale: 0.8, opacity: 0, transition: { duration: 0.3 } },
};
//버튼 클릭시 사이즈 줄어듦
export const buttonVariants = {

  initial: { scale: 1 },
  hover: { scale: 1 },
  tap: { scale: 0.9 },
};
//장르 검색 그리드 애니메이션
export const gridItemVariants = {
  hover: {
    scale: 0.97,
    transition: { duration: 0.3 },
  },
  tap: {
    scale: 0.94,
    transition: { duration: 0.3 },
  },
};

//맵뷰랑 리스트뷰 전환 부드럽겝
export const transitionVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20,
    },
  },
};


export const colorPulse: Variants = {
  animate: {
    backgroundColor: ['#28292a', '#38393a', '#28292a'], // 색의 명암을 바꾸기 위해 색상 지정
    transition: {
      duration: 2.5,
      repeat: Infinity,
      repeatType: 'loop',
      ease: 'easeInOut',
    },
  },
};

//하트ㅡ또잉
export const heartAnimation: Variants = {
  initial: { scale: 1 },
  clicked: {
    scale: [1, 1.5, 1],
    transition: { duration: 0.3 },
  },
};
//드롭다운 또잉
export const dropdownVariants = {
  open: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 30,
    },
  },
  closed: {
    opacity: 0,
    y: -20,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 30,
    },
  },
};
