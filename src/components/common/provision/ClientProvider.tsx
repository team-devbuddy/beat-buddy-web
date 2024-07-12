'use client';

import { RecoilRoot } from 'recoil';

const ClientProvider = ({ children }: { children: React.ReactNode }) => {
  return <RecoilRoot>{children}</RecoilRoot>;
};

export default ClientProvider;
