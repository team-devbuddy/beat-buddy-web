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
import Link from 'next/link';
import Image from 'next/image';

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
      <div className="flex items-center px-[0.63rem] py-[0.53rem]">
        <Link href="/">
          <Image src="/icons/line-md_chevron-left.svg" alt="back" width={35} height={35} />
        </Link>
        <p className="ml-[0.12rem] text-[1.125rem] font-bold text-white">전체보기</p>
      </div>
      <main className="bg-BG-black px-[1.25rem] pb-[1rem] pt-[0.44rem]">
        {loading ? (
          <BBPListSkeleton />
        ) : magazines.length === 0 ? (
          <NoResults text="아직 매거진이 없어요.\n첫 매거진을 작성해보세요." />
        ) : (
          <div className="grid grid-cols-1 gap-[0.88rem] md:grid-cols-2">
            {magazines.map((magazine, index) => (
              <MagazineCard
                key={magazine.magazineId}
                magazineId={magazine.magazineId}
                thumbImageUrl={magazine.thumbImageUrl}
                title={magazine.title}
                content={magazine.content}
                isLiked={magazine.isLiked}
                currentIndex={magazine.currentIndex}
                totalCount={magazine.totalCount}
                orderInHome={magazine.orderInHome}
                picked={magazine.picked}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
