import MyEventMain from '@/components/units/MyEvent/MyEventMain';

export default function MyEventHostPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <MyEventMain type="my-event" />
    </div>
  );
}
