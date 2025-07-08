'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { deletePost } from '@/lib/actions/post-controller/deletePost';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';
import { getPostDetail } from '@/lib/actions/detail-controller/board/boardWriteUtils';

interface PostProps {
  nickname: string;
}

interface DropdownItem {
  label: string;
  icon: string;
  onClick?: () => void;
  modalType?: 'block' | 'report';
}

interface DropdownProps {
  isAuthor: boolean;
  onClose: () => void;
  position: { top: number; left: number };
  postId: number;
  eventId?: number;
}

const BoardDropdown = ({ isAuthor, onClose, position, postId, eventId }: DropdownProps) => {
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const accessToken = useRecoilValue(accessTokenState) || '';
    const [modalType, setModalType] = useState<'block' | 'report' | null>(null);
    const [reportReason, setReportReason] = useState('');
    const [post, setPost] = useState<PostProps>({ nickname: '' });

    const items: DropdownItem[] = isAuthor
        ? [
            {
                label: '공유',
                icon: '/icons/material-symbols_share-outline.svg',
                onClick: () => navigator.share({ title: '게시글', url: window.location.href }),
            },
            {
                label: '수정',
                icon: '/icons/edit.svg',
                onClick: () => router.push(`/board/write?postId=${postId}`),
            },
            {
                label: '삭제',
                icon: '/icons/trashcan.svg',
                onClick: async () => {
                    await deletePost(accessToken, postId);
                    router.push('/board');
                },
            },
        ]
        : [
            {
                label: '공유',
                icon: '/icons/material-symbols_share-outline.svg',
                onClick: () => navigator.share({ title: '게시글', url: window.location.href }),
            },
            { label: '차단', icon: '/icons/block.svg', modalType: 'block' },
            { label: '신고', icon: '/icons/material-symbols_siren-outline.svg', modalType: 'report' },
        ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    useEffect(() => {
        // 모달을 열 때만 닉네임 정보를 가져오도록 최적화
        if (modalType === 'block') {
            const fetchPost = async () => {
                try {
                    const postDetail = await getPostDetail('free', postId, accessToken);
                    setPost(postDetail);
                } catch (error) {
                    console.error("게시물 정보 가져오기 실패:", error);
                }
            };
            fetchPost();
        }
    }, [modalType, postId, accessToken]);


    return createPortal(
        <>
            {/* ✅ 배경 */}
            <div 
                className="fixed inset-0  bg-black/50 z-40" 
                // 모달이 열려있으면 모달을 닫고, 그렇지 않으면 전체 드롭다운을 닫습니다.
                onClick={() => (modalType ? setModalType(null) : onClose())} 
            />
  
            {/* ✅ 드롭다운 메뉴 */}
            <AnimatePresence>
                {!modalType && (
                    <motion.div
                        ref={dropdownRef}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="fixed z-50 bg-gray700 min-w-[100px] rounded-[0.75rem] shadow-lg py-3 px-4 space-y-2"
                        style={{ top: position.top, left: position.left }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {items.map((item) => (
                            <button
                                key={item.label}
                                className="flex items-center justify-between text-body3-12-medium text-white w-full rounded-md"
                                // 🔥 수정된 클릭 핸들러
                                onClick={() => {
                                    if (item.onClick) {
                                        item.onClick();
                                        onClose(); // 즉시 실행되는 액션은 드롭다운을 닫음
                                    } else if (item.modalType) {
                                        // 모달을 띄울 때는 onClose를 호출하지 않고 내부 상태만 변경
                                        setModalType(item.modalType);
                                    }
                                }}
                            >
                                <span>{item.label}</span>
                                <Image src={item.icon} alt={item.label} width={16} height={16} />
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
  
            {/* ✅ 차단 모달 */}
            <AnimatePresence>
                {modalType === 'block' && (
                     <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="fixed  inset-0 z-50 flex items-center justify-center"
                    >
                        <div
                            className="bg-BG-black pt-6 pb-6 px-5 rounded-lg text-center "
                            onClick={(e) => e.stopPropagation()}
                        >
                            <p className="text-white w-[18rem] text-[1.25rem] font-bold mb-2">
                                {post.nickname}님을 차단하시겠어요?
                            </p>
                            <p className="text-gray300 text-[0.875rem] mb-4 text-center">
                                해당 작성자의 게시글과 댓글이<br />
                                더 이상 표시되지 않습니다.<br />
                                차단은 해제할 수 없으며, 되돌릴 수 없습니다.<br />
                                신중히 결정해주세요.
                            </p>
                            <div className="flex justify-between gap-3">
                                <button
                                    onClick={() => setModalType(null)}
                                    className=" py-[0.62rem] px-[0.5rem] rounded-[0.5rem] bg-gray700 text-gray200 w-full"
                                >
                                    취소
                                </button>
                                <button
                                    onClick={() => {
                                        // 차단 처리 로직
                                        console.log(`${post.nickname}님 차단`);
                                        setModalType(null);
                                    }}
                                    className=" py-[0.62rem] px-[0.5rem] rounded-[0.5rem] bg-gray700 text-main w-full"
                                >
                                    차단하기
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
  
            {/* ✅ 신고 모달 */}
            <AnimatePresence>
                {modalType === 'report' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 flex items-center justify-center"
                    >
                        <div
                            className="bg-BG-black pt-6 pb-6 px-5 rounded-lg text-center "
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-white text-[1.25rem] font-bold mb-4">게시물 신고</h3>
                            <textarea
                                value={reportReason}
                                onChange={(e) => setReportReason(e.target.value)}
                                placeholder="신고 사유를 작성해 주세요 (예: 부적절한 콘텐츠, 스팸, 욕설 등)"
                                className="w-full min-w-[18rem] min-h-[7.5rem] p-2  rounded-[0.5rem] bg-gray700 text-gray200 text-sm mb-4 resize-none focus:outline-none placeholder:text-gray300"
                            />
                            <div className="flex justify-between gap-2">
                                <button
                                    onClick={() => setModalType(null)}
                                    className=" w-full py-[0.62rem] px-[0.5rem] font-bold rounded-[0.5rem] bg-gray700 text-gray200"
                                >
                                    취소
                                </button>
                                <button
                                    onClick={() => {
                                        // 신고 처리 로직
                                        console.log('신고 내용:', reportReason);
                                        setModalType(null);
                                    }}
                                    className=" w-full py-[0.62rem] px-[0.5rem] font-bold rounded-[0.5rem] bg-gray700 text-main"
                                >
                                    신고하기
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>,
        document.body
    );
}  
export default BoardDropdown;