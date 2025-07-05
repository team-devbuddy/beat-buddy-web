'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getMagazineDetail } from '@/lib/actions/magazine-controller/getMagazineDetail';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';

interface MagazineDetailData {
  magazineId: number;
  title: string;
  content: string;
  memberId: number;
  imageUrls: string[];
  views: number;
  likes: number;
}

export default function MagazineDetail() {
  const params = useParams();
  const magazineId = Number(params.id);
  const [magazine, setMagazine] = useState<MagazineDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const accessToken = useRecoilValue(accessTokenState);

  useEffect(() => {
    if (!magazineId || isNaN(magazineId)) return;

    const fetchMagazine = async () => {
      try {
        const res = await getMagazineDetail(accessToken ?? '', magazineId);

        // 🔧 writerId → memberId로 매핑
        const data = res.data;
        setMagazine({
          magazineId: data.magazineId,
          title: data.title,
          content: data.content,
          memberId: data.writerId,
          imageUrls: data.imageUrls,
          views: data.views,
          likes: data.likes,
        });
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMagazine();
  }, [magazineId, accessToken]);

  if (loading) return <div className="text-center mt-10">로딩 중...</div>;
  if (!magazine) return <div className="text-center mt-10">데이터를 불러올 수 없습니다.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 text-white">{magazine.title}</h1>

      {/* 이미지 */}
      {magazine.imageUrls?.[0] && (
        <Image
          src={magazine.imageUrls[0]}
          alt={magazine.title}
          width={800}
          height={500}
          className="w-full h-auto rounded-md mb-6 object-cover"
        />
      )}

      {/* 콘텐츠 */}
      <p className="text-white text-lg mb-6 whitespace-pre-line">{magazine.content}</p>

      {/* 통계 정보 */}
      <div className="flex items-center gap-6 text-sm text-white">
        <span>조회수: {magazine.views}</span>
        <span>좋아요: {magazine.likes}</span>
        <span>작성자 ID: {magazine.memberId}</span>
      </div>
    </div>
  );
}
