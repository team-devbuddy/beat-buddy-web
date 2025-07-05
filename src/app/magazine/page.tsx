'use client';

import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';
import { getMagazineList } from '@/lib/actions/magazine-controller/getMagazine';
import { MagazineProps } from '@/lib/types';
import MagazineCard from '@/components/units/Main/Magazine/MagazineCard';
import BBPListSkeleton from '@/components/common/skeleton/BBPListSkeleton';
import NoResults from '@/components/units/Search/NoResult';
import MainFooter from '@/components/units/Main/MainFooter';
import HeaderBack from '@/components/common/HeaderBack';

export default function MagazineListPage() {
  const accessToken = useRecoilValue(accessTokenState);
  const [magazines, setMagazines] = useState<MagazineProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMagazines = async () => {
      try {
        if (!accessToken) return;
        const data = await getMagazineList(accessToken);
        setMagazines(data);
      } catch (err) {
        console.error('매거진 불러오기 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMagazines();
  }, [accessToken]);

  return (
      <div className="flex min-h-screen flex-col bg-BG-black text-white">
          <div className="flex items-center ">
      <HeaderBack url="/"  />
        <p className="text-body1-16-bold text-white ml-[-0.2rem]">전체보기</p>
          </div>
      <main className="px-[1.25rem] bg-BG-black pb-[1rem] pt-[0.88rem]">
        {loading ? (
          <BBPListSkeleton />
        ) : magazines.length === 0 ? (
          <NoResults />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[1.5rem]">
  {magazines.map((magazine, index) => (
    <MagazineCard
      key={magazine.magazineId}
      magazineId={magazine.magazineId}
      thumbImageUrl={magazine.thumbImageUrl}
      title={magazine.title}
      content={magazine.content}
      isLiked={magazine.isLiked}
      currentIndex={index + 1}
      totalCount={magazines.length}
    />
  ))}
</div>
        )}
      </main>

    </div>
  );
}
