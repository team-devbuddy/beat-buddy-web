'use client';
import { accessTokenState, authState } from '@/context/recoil-context';
import { useRecoilValue } from 'recoil';
import Main from '../Main/Main';
import CustomerMain from './CustomerMain';
import LoginMain from '../Login/LoginMain';

export default function HomeSelect() {
  const access = useRecoilValue(accessTokenState);
  const isAuth = useRecoilValue(authState);
  // return <div>{isAuth ? <Main /> : <CustomerMain />}</div>;
  return <div>{isAuth ? <Main /> : <LoginMain />}</div>;
}
