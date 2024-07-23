import MHBHeader from '@/components/units/MyHeartbeat/MHBHeader';
import MyHeartbeat from '@/components/units/MyHeartbeat/MHBVenues';
import MainFooter from '@/components/units/Main/MainFooter';

export default function MyheartbeatPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <MHBHeader />
      <div className="flex flex-grow">
        <MyHeartbeat />
      </div>
      <MainFooter />
    </div>
  );
}
