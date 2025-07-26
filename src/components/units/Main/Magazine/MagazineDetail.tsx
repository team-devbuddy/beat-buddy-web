'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getMagazineDetail } from '@/lib/actions/magazine-controller/getMagazineDetail';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';
import Prev from '@/components/common/Prev';
import Link from 'next/link';
interface MagazineDetailData {
  magazineId: number;
  title: string;
  content: string;
  memberId: number;
  imageUrls: string[];
  views: number;
  likes: number;
  orderInHome: number;
  totalCount: number;
  thumbImage: string;
  picked: boolean;
}

export default function MagazineDetail() {
  const params = useParams();
  const magazineId = Number(params.id);
  const [magazine, setMagazine] = useState<MagazineDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const accessToken = useRecoilValue(accessTokenState);
  const router = useRouter();
  useEffect(() => {
    if (!magazineId || isNaN(magazineId)) return;

    const fetchMagazine = async () => {
      try {
        const res = await getMagazineDetail(accessToken ?? '', magazineId);

        // 🔧 writerId → memberId로 매핑
        const data = res.data;
        console.log('키 개수:', Object.keys(data).length);
        const dataLength = Object.keys(data).length;
        setMagazine({
          magazineId: data.magazineId,
          title: data.title,
          content: data.content,
          memberId: data.writerId,
          imageUrls: data.imageUrls,
          views: data.views,
          likes: data.likes,
          orderInHome: data.orderInHome,
          totalCount: dataLength,
          thumbImage: data.thumbImage,
          picked: data.picked,
        });
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMagazine();
  }, [magazineId, accessToken]);

  if (loading) return <div className="mt-10 text-center">로딩 중...</div>;
  if (!magazine) return <div className="mt-10 text-center">데이터를 불러올 수 없습니다.</div>;

  return (
    <div className="mx-auto">
      {/* 이미지와 텍스트 오버레이 */}
      {magazine.thumbImage && (
        <div className="relative w-full">
          <Image
            src={magazine.thumbImage}
            alt={magazine.title}
            width={800}
            height={800}
            className="h-auto min-h-[31.25rem] w-full rounded-md object-cover"
          />

          {/* 그라디언트 오버레이 */}
          <div className="absolute inset-0 rounded-md bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Prev 컴포넌트 - 맨 위 */}
          <div className="z-100 absolute left-0 top-0 px-[0.63rem] py-[0.53rem]">
            <button onClick={() => router.back()} title="뒤로가기">
              <Image src="/icons/line-md_chevron-left.svg" alt="back" width={35} height={35} />
            </button>
          </div>

          {/* 하단 콘텐츠 */}
          <div className="absolute bottom-0 left-0 right-0 z-10 p-[1.5rem] text-white">
            {magazine.picked ? (
              <span className="inline-block rounded-[0.5rem] bg-[#F93A7B] px-[0.5rem] py-[0.19rem] text-[0.6875rem] text-white">
                BeatBuddy Pick!
              </span>
            ) : (
              <span className="inline-block rounded-[0.5rem] bg-[#F93A7B] px-[0.5rem] py-[0.19rem] text-[0.6875rem] text-white">
                Magazine
              </span>
            )}

            <h2 className="line-height-[140%] py-2 text-[1.375rem] font-bold tracking-[-0.0275rem] drop-shadow-md">
              {magazine.title.split('\n').map((line, index, array) => (
                <span key={index}>
                  {line}
                  {index < array.length - 1 && <br />}
                </span>
              ))}
            </h2>
          </div>
        </div>
      )}
      <div className="p-[1.25rem]">
        <p
          className="line-height-[150%] text-[0.875rem] tracking-[-0.0175rem] text-[#C3C5C9] drop-shadow-md"
          style={{ color: 'rgba(255, 255, 255, 0.60)' }}>
          {magazine.content}
        </p>
      </div>
    </div>
  );
}
