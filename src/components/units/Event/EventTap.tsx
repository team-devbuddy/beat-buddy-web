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
    <div className="mt-4 flex w-full border-b border-gray700">
      {tabs.map(({ label, key }) => (
        <button
          key={key}
          onClick={() => setActiveTab(key)}
          className={`flex-1 border-b-2 py-[0.66rem] text-center ${
            activeTab === key ? 'border-main font-bold text-main' : 'border-transparent text-gray100'
          }`}>
          <span className="text-[0.875rem]">{label}</span>
        </button>
      ))}
    </div>
  );
}
