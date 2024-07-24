import Landing1 from './Landing1';
import Landing2 from './Landing2';
import Landing3 from './Landing3';
import Landing4 from './Landing4';
import Landing5 from './Landing5';

export default function CustomerMain() {
  return (
    <div className="flex h-screen w-full snap-y snap-mandatory flex-col overflow-y-scroll">
      <Landing1 />
      <Landing2 />
      <Landing3 />
      <Landing4 />
      <Landing5 />
    </div>
  );
}
