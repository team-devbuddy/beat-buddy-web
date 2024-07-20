import { accessTokenState, authState } from '@/context/recoil-context';
import { useRecoilValue } from 'recoil';
import Main from '../Main/Main';
import CustomerMain from './CustomerMain';

export default function HomeSelect() {
  const access = useRecoilValue(accessTokenState);
  const isAuth = useRecoilValue(authState);
  return <div>{isAuth ? <Main /> : <CustomerMain />}</div>;
}
