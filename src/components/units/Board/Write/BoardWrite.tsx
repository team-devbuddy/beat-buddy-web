'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { createNewPost } from '@/lib/actions/post-controller/createNewPost';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';
import { useRouter } from 'next/navigation';

const FIXED_HASHTAGS = [
  '압구정로데오', '홍대', '이태원', '강남.신사',
  '뮤직', '자유', '번개 모임', 'International',
  '19+', 'LGBTQ', '짤.밈'
];

export default function BoardWrite() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const accessToken = useRecoilValue(accessTokenState) || '';
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const orderedTags = [
    ...selectedTags,
    ...FIXED_HASHTAGS.filter(tag => !selectedTags.includes(tag))
  ];

  const handleAnonymous = () => {
    setAnonymous(prev => !prev);
  };

  const handleTagClick = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleImageRemove = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (!accessToken) {
        alert('로그인 후 이용해주세요.');
        router.push('/login');
        return;
      }
      const dto = {
        title,
        content,
        anonymous,
        hashtags: selectedTags,
      };
      await createNewPost(accessToken, dto, images);
      alert('업로드 성공');
    } catch (e) {
      alert('업로드 실패');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-BG-black text-white pb-[140px]">
      {/* 헤더 */}
      <header className="flex items-center justify-between pl-[0.62rem] pr-4 py-4">
        <Image  onClick={() => router.back()} src="/icons/line-md_chevron-left.svg" alt="뒤로가기" width={35} height={35} />
        <h1 onClick={handleUpload} className="text-[0.875rem] font-bold text-gray300">글쓰기</h1>
      </header>

      {/* 입력 영역 */}
      <div className="px-[1.25rem]">
        <div>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full bg-transparent border-none text-[1rem] font-bold text-white placeholder:text-gray200 focus:outline-none"
            placeholder="(선택) 제목을 입력해주세요"
          />
        </div>

        <hr className="border-gray500 h-[0.0625rem] my-4" />

        <textarea
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            e.target.style.height = 'auto';
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          className="w-full bg-transparent border-none text-[0.75rem] text-gray200 placeholder:text-gray200 focus:outline-none whitespace-pre-wrap overflow-hidden"
          style={{ minHeight: '2rem', resize: 'none' }}
          placeholder={`광고, 비난, 도배성 글을 남기면 영구적으로 활동이 제한될 수 있어요.\n건강한 커뮤니티 문화를 함께 만들어가요.`}
        />

        {!content && (
          <div className="text-[0.75rem] text-gray200 mt-[-0.4rem]">
            자세한 내용은{' '}
            <a
              href="/rules"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-gray200"
            >
              커뮤니티 이용 규칙
            </a>
            을 참고해주세요.
          </div>
        )}

        {/* 이미지 미리보기 */}
        {images.length > 0 && (
  <div className="mt-4 overflow-x-auto scrollbar-hide">
    <div className="flex gap-3 w-max pr-4">
      {images.map((img, idx) => (
        <div key={idx} className="relative max-w-[13.125rem] max-h-[9.8125rem] flex-shrink-0 rounded-md overflow-hidden border border-gray600">
          <img
            src={URL.createObjectURL(img)}
            alt={`업로드 이미지 ${idx + 1}`}
            className="w-full h-full object-cover"
          />
          <Image
            onClick={() => handleImageRemove(idx)}
            className="absolute top-[0.62rem] right-[0.62rem]  text-white "
            src="/icons/imageout.svg"
            alt="삭제"
            width={18.75}
            height={18.75}
          />
        </div>
      ))}
    </div>
  </div>
)}

      </div>

      {/* 하단 고정 바 */}
      <div className="fixed inset-x-0 bottom-[3rem] z-50 bg-BG-black  px-[1.25rem] py-[0.75rem]">
        {/* 해시태그 */}
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-2">
            {orderedTags.map(tag => (
              <span
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`whitespace-nowrap px-[0.63rem] py-[0.25rem] rounded-[0.5rem] text-[0.75rem] cursor-pointer ${
                  selectedTags.includes(tag)
                    ? 'bg-sub2 text-main'
                    : 'bg-gray700 text-gray300'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="fixed inset-x-0 bottom-0 z-50 bg-gray700 px-[1.25rem]">
          <div className="flex bg-gray700 justify-between items-center py-[0.88rem]">
            {/* 사진 업로드 */}
            <button
              className="flex items-center text-white"
              onClick={() => fileInputRef.current?.click()}
            >
              <Image src="/icons/add_a_photo.svg" alt="사진" width={24} height={24} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />

            {/* 익명 */}
            <div
              className="flex items-center gap-x-[0.12rem] cursor-pointer"
              onClick={handleAnonymous}
            >
              <Image
                src={
                  anonymous
                    ? '/icons/check_box.svg'
                    : '/icons/check_box_outline_blank.svg'
                }
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
