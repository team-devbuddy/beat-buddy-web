import { ToastContainer, toast as originalToast, ToastPosition } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';

const toastSettings = {
  position: 'bottom-center' as ToastPosition,
  autoClose: 2000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

export const CustomToastContainer = () => <StyledToastContainer {...toastSettings} />;

export const toast = (content: React.ReactNode) => {
  originalToast(content, {
    ...toastSettings,
    className: 'custom-toast',
    bodyClassName: 'custom-toast-body',
  });
};

export const CustomToast = styled.div`
  background: #313335;
  color: #fff;
  font-size: 0.9375rem;
  font-style: normal;
  font-weight: 500;
  letter-spacing: -0.01875rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledToastContainer = styled(ToastContainer)`
  .Toastify__toast {
    background: none;
    box-shadow: none;
    padding: 0;
  }
  .Toastify__toast-body {
    margin: 0 1rem 0 1rem;
    background-color: #313335;
    border-radius: 0.25rem;
    color: #fff;
    height: 45px;
  }
  .Toastify__close-button {
    display: none;
  }
`;
