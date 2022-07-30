import type { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
import Modal from 'react-modal';

import Header from '../components/Header';

import '../styles/globals.css';

Modal.setAppElement('#__next');

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Header />

      <Component {...pageProps} />

      <Toaster />
    </>
  );
};

export default MyApp;
