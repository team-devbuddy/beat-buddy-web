'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRecoilValue, useRecoilState } from 'recoil';
import { accessTokenState, heartbeatsState, likedClubsState, heartbeatNumsState } from '@/context/recoil-context';
import { getMyHearts } from '@/lib/actions/hearbeat-controller/getMyHearts';
import { motion, AnimatePresence } from 'framer-motion';
import { modalBackdropVariants, modalVariants, buttonVariants } from '@/lib/animation';

function Heartbeat() {
  const [heartbeats, setHeartbeats] = useRecoilState(heartbeatsState);
  const accessToken = useRecoilValue(accessTokenState);
  const likedClubs = useRecoilValue(likedClubsState);
  const heartbeatNums = useRecoilValue(heartbeatNumsState);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchHeartbeats = async () => {
      try {
        if (accessToken) {
          const data = await getMyHearts(accessToken);
          setHeartbeats(data);
        }
      } catch (error) {
        console.error('Error fetching heartbeats:', error);
      }
    };

    fetchHeartbeats();
  }, [accessToken, setHeartbeats, likedClubs, heartbeatNums]);

  const handlePlusClick = () => {
    if (heartbeats.length === 0) {
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="my-[1.75rem] flex flex-col px-[1rem]">
      <Link href="/myheartbeat">
        <div className="flex items-center justify-between rounded-md px-2 py-[0.5rem] hover:bg-gray700">
          <div className="flex flex-col">
            <span className="font-queensides text-main-queen text-main2">My Heart Beat</span>
            <div className="mt-[0.25rem] cursor-pointer text-body2-15-medium text-gray200">
              내가 관심있는 베뉴들의 정보를 확인하세요.
            </div>
          </div>
          <Image src="/icons/ArrowHeadRight.svg" alt="Arrow head right icon" width={24} height={24} />
        </div>
      </Link>
      <div className="flex space-x-[0.75rem] overflow-x-auto pt-[1.5rem] hide-scrollbar">
        {heartbeats.length === 0 ? (
          <motion.div
            className="relative h-16 w-16 cursor-pointer"
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            onClick={handlePlusClick}>
            <div className="flex h-full w-full items-center justify-center rounded-full border border-gray100 bg-gray400">
              <Image src="/icons/plus.svg" alt="plus icon" width={32} height={32} />
            </div>
          </motion.div>
        ) : (
          heartbeats.map((heartbeat) => (
            <Link key={heartbeat.venueId} href={`/detail/${heartbeat.venueId}`}>
              <motion.div
                className="relative h-16 w-16 cursor-pointer"
                variants={buttonVariants}
                whileHover={{ y: -5, boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.3)' }}>
                <Image
                  src={heartbeat.logoUrl || '/images/DefaultImage.png'}
                  alt={`${heartbeat.koreanName} image`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              </motion.div>
            </Link>
          ))
        )}
      </div>
      <AnimatePresence>
        {showModal && (
          <motion.div
            variants={modalBackdropVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <motion.div
              variants={modalVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-[18.9rem] bg-BG-black">
              <div className="px-[1.25rem] pb-[2.5rem] pt-4">
                <div className="flex justify-end">
                  <div onClick={closeModal} className="mb-[1.25rem] text-gray-600 hover:text-gray-800">
                    <Image src="/icons/Xmark.svg" alt="close" width={28} height={28} />
                  </div>
                </div>
                <div className="text-center">
                  <h2 className="mb-[0.75rem] text-subtitle-20-bold text-white">아직 하트비트가 없어요</h2>
                  <p className="mb-[1.25rem] text-body2-15-medium text-gray300">
                    하트비트를 눌러서
                    <br />
                    관심있는 베뉴를 저장해보세요
                  </p>
                  <div className="flex flex-row justify-center gap-[3rem]">
                    <Image src="/icons/PinkHeart.svg" alt="pink heart" width={48} height={48} />
                    <Image src="/icons/fullArrow.svg" alt="full arrow" width={24} height={24} />
                    <Image src="/icons/FilledHeart.svg" alt="filled heart" width={48} height={48} />
                  </div>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="w-full bg-main px-[0.5rem] py-[0.99rem] text-body1-16-bold text-BG-black">
                확인
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Heartbeat;
