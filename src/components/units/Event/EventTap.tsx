'use client';

interface EventTabProps {
  activeTab: 'now' | 'upcoming' | 'past';
  setActiveTab: (tab: 'now' | 'upcoming' | 'past') => void;
}

export default function EventTab({ activeTab, setActiveTab }: EventTabProps) {
  const tabs: { label: string; key: 'now' | 'upcoming' | 'past' }[] = [
    { label: 'NOW', key: 'now' },
    { label: 'Upcoming', key: 'upcoming' },
    { label: 'Past', key: 'past' },
  ];

  return (
    <div className="flex w-full mt-4 border-b border-gray700">
      {tabs.map(({ label, key }) => (
        <button
          key={key}
          onClick={() => setActiveTab(key)}
          className={`flex-1 py-[0.66rem] text-center border-b-2 ${
            activeTab === key ? 'border-main text-main font-bold' : 'border-transparent text-gray100'
          }`}
        >
          <span className="text-[0.875rem]">{label}</span>
        </button>
      ))}
    </div>
  );
}
