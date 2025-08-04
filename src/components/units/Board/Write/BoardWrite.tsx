'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { createNewPost } from '@/lib/actions/post-controller/createNewPost';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';
import { useSearchParams, useRouter } from 'next/navigation';
import { getPostDetail, editPost } from '@/lib/actions/detail-controller/board/boardWriteUtils';

const FIXED_HASHTAGS = [
  '압구정로데오',
  '홍대',
  '이태원',
  '강남.신사',
  '뮤직',
  '자유',
  '번개 모임',
  'International',
  '19+',
  'LGBTQ',
  '짤.밈',
];

export default function BoardWrite() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [images, setImages] = useState<(File | string)[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const accessToken = useRecoilValue(accessTokenState) || '';
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [tagLimitMessage, setTagLimitMessage] = useState('');
  const searchParams = useSearchParams();
  const postId = Number(searchParams.get('postId'));

  const orderedTags = [...selectedTags, ...FIXED_HASHTAGS.filter((tag) => !selectedTags.includes(tag))];

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // 이건 기존 textarea 위에 넣으세요
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) return;

    // 높이를 조절하는 함수
    const adjustHeight = () => {
      textarea.style.height = 'auto'; // 높이를 초기화
      textarea.style.height = `${textarea.scrollHeight}px`; // scrollHeight를 바탕으로 높이 재설정
    };

    // 초기 렌더링 시 높이 조절
    adjustHeight();

    // 화면 크기가 변경될 때마다 높이 조절
    window.addEventListener('resize', adjustHeight);

    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거 (메모리 누수 방지)
    return () => {
      window.removeEventListener('resize', adjustHeight);
    };
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      if (postId && !isNaN(postId) && accessToken) {
        try {
          const category = 'free'; // ✅ 필요에 따라 동적으로 처리 가능
          const post = await getPostDetail(category, postId, accessToken);

          setTitle(post.title || '');
          setContent(post.content || '');
          setAnonymous(post.isAnonymous || false);
          setSelectedTags(post.hashtags || []);
          setImages(post.imageUrls || []);
        } catch (err) {
          console.error('수정할 게시글 불러오기 실패:', err);
        }
      }
      // postId가 없으면 새 글쓰기 모드 - 아무것도 하지 않음
    };

    fetchPost();
  }, [postId, accessToken]); // 의존성 배열에 postId와 accessToken 추가

  const handleAnonymous = () => {
    setAnonymous((prev) => !prev);
  };

  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags((prev) => prev.filter((t) => t !== tag));
      setTagLimitMessage(''); // 메시지 제거
    } else {
      if (selectedTags.length >= 3) {
        setTagLimitMessage('해시태그는 최대 3개까지만 선택할 수 있어요.');
        return;
      }
      setSelectedTags((prev) => [...prev, tag]);
      setTagLimitMessage(''); // 메시지 제거
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      if (images.length + newImages.length > 20) {
        alert('이미지는 최대 20장까지 업로드할 수 있어요.');
        return;
      }
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const handleImageRemove = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    // 중복 제출 방지
    if (isLoading) {
      console.log('이미 업로드 중입니다.');
      return;
    }

    // 제출 시작 시 즉시 로딩 상태 설정
    setIsLoading(true);
    console.log('게시글 업로드 시작');

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (!accessToken) {
        alert('로그인 후 이용해주세요.');
        router.push('/login');
        return;
      }

      let deleteImageUrls: string[] = [];
      const newImageFiles = images.filter((img) => typeof img !== 'string') as File[];

      // 수정 모드일 때만 기존 이미지 처리
      if (postId && !isNaN(postId)) {
        const originalImageUrls = (await getPostDetail('free', postId, accessToken)).imageUrls || [];
        const currentImageUrls = images.filter((img: File | string) => typeof img === 'string') as string[];
        deleteImageUrls = originalImageUrls.filter((url: string) => !currentImageUrls.includes(url));
      }

      const dto = {
        title,
        content,
        anonymous,
        hashtags: selectedTags,
        deleteImageUrls,
      };

      if (postId && !isNaN(postId)) {
        // 수정 모드
        await editPost(accessToken, postId, dto, newImageFiles);
        alert('수정 완료');
        router.push(`/board/free/${postId}`);
      } else {
        // 새 글쓰기 모드
        await createNewPost(accessToken, dto, newImageFiles);
        alert('업로드 성공');
        router.push('/board');
      }
    } catch (e) {
      console.error('업로드 실패:', e);
      alert('업로드 실패');
    } finally {
      // 업로드 완료 후 로딩 상태 해제
      setIsLoading(false);
      console.log('업로드 상태 해제');
    }
  };

  return (
    <div className="flex flex-col bg-BG-black pb-[140px] text-white">
      {/* 헤더 */}
      <header className="flex items-center justify-between py-4 pl-[0.62rem] pr-5">
        <Image
          onClick={() => router.back()}
          src="/icons/line-md_chevron-left.svg"
          alt="뒤로가기"
          width={35}
          height={35}
        />
        <h1
          onClick={handleUpload}
          className={`text-[0.875rem] font-bold ${
            isLoading ? 'cursor-not-allowed text-gray500' : 'cursor-pointer text-gray200 hover:text-white'
          }`}
          style={{ pointerEvents: isLoading ? 'none' : 'auto' }}>
          {isLoading ? '글쓰기' : '글쓰기'}
        </h1>
      </header>

      {/* 입력 영역 */}
      <div className="px-[1.25rem] py-[0.88rem]">
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border-none bg-transparent text-[1rem] font-bold text-white safari-input-fix placeholder:text-gray200 focus:outline-none"
            placeholder="(선택) 제목을 입력해주세요"
          />
        </div>

        <hr className="mb-5 mt-2 h-[0.0625rem] border-gray500" />

        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            if (textareaRef.current) {
              textareaRef.current.style.height = 'auto';
              textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
            }
          }}
          className="w-full overflow-hidden whitespace-pre-wrap border-none bg-transparent text-[0.8125rem] text-white placeholder:text-gray300 focus:outline-none"
          style={{ minHeight: '2rem', resize: 'none' }}
          placeholder={`광고, 비난, 도배성 글을 남기면 영구적으로 활동이 제한될 수 있어요.\n건강한 커뮤니티 문화를 함께 만들어가요.`}
        />

        {!content && (
          <div className="mt-[-0.4rem] text-[0.8125rem] text-gray300">
            자세한 내용은{' '}
            <a href="/rules" target="_blank" rel="noopener noreferrer" className="text-gray300 underline">
              커뮤니티 이용 규칙
            </a>
            을 참고해주세요.
          </div>
        )}

        {/* 이미지 미리보기 */}
        {images.length > 0 && (
          <div className="mt-4 overflow-x-auto scrollbar-hide">
            <div className="flex w-max gap-3 pr-4">
              {images.map((img, idx) => {
                const src = typeof img === 'string' ? img : URL.createObjectURL(img);
                return (
                  <div
                    key={idx}
                    className="relative max-w-[13.125rem] flex-shrink-0 overflow-hidden rounded-md border border-gray600">
                    <img src={src} alt={`업로드 이미지 ${idx + 1}`} className="h-full w-full object-cover" />
                    <Image
                      onClick={() => handleImageRemove(idx)}
                      className="absolute right-[0.62rem] top-[0.62rem]"
                      src="/icons/imageout.svg"
                      alt="삭제"
                      width={18.75}
                      height={18.75}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 하단 고정 바 */}
      {/* 하단 고정 바 */}
      <div className="fixed bottom-[3rem] z-50 w-full max-w-[600px] bg-BG-black px-[1.25rem] py-[0.75rem]">
        {/* 해시태그 선택 제한 메시지 */}
        {tagLimitMessage && <p className="mb-1 text-[0.75rem] text-main">{tagLimitMessage}</p>}

        {/* 해시태그 */}
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-2">
            {orderedTags.map((tag) => (
              <span
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`cursor-pointer whitespace-nowrap rounded-[0.5rem] px-[0.63rem] py-[0.25rem] text-[0.75rem] ${
                  selectedTags.includes(tag) ? 'bg-sub2 text-main' : 'bg-gray700 text-gray300'
                }`}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-[600px] -translate-x-1/2 transform bg-gray700 px-[1.25rem]">
          <div className="flex items-center justify-between bg-gray700 py-[0.88rem]">
            {/* 사진 업로드 */}
            <button
              className="flex items-center text-white"
              onClick={() => fileInputRef.current?.click()}
              title="사진 업로드">
              <Image src="/icons/add_a_photo.svg" alt="사진" width={24} height={24} />
            </button>
            <input ref={fileInputRef} type="file" multiple accept="image/*" hidden onChange={handleImageChange} />

            {/* 익명 */}
            <div className="flex cursor-pointer items-center gap-x-[0.12rem]" onClick={handleAnonymous}>
              <Image
                src={anonymous ? '/icons/check_box.svg' : '/icons/check_box_outline_blank.svg'}
                alt="익명"
                width={18}
                height={18}
              />
              <label className={`flex items-center gap-2 text-[0.75rem] ${anonymous ? 'text-main' : 'text-gray200'}`}>
                익명으로 작성
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
