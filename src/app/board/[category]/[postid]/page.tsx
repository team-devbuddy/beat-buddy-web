import BoardDetailPage from '@/components/units/Board/Detail/BoardDetailPage';

export default function Page({
  params,
}: {
  params: { category: string; postid: string };
}) {
  const postId = Number(params.postid);
  const category = params.category;

  if (isNaN(postId)) {
    console.error('Invalid postId:', params.postid);
  }

  return <BoardDetailPage postId={postId} category={category} />;
}
