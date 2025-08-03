import MyEventMain from '@/components/units/MyEvent/MyEventMain';

export default function MyEventPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <MyEventMain type="upcoming" />
    </div>
  );
}
