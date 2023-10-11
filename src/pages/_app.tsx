import { NotificationProvider } from '@/context/notificationContext';
import '../styles/global.css';
import '../styles/stepper.css';

import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from 'react-query';
import zipy from 'zipyai';

const queryClient = new QueryClient();
zipy.init('50b5f2e6');

const MyApp = ({ Component, pageProps }: AppProps) => (
  <QueryClientProvider client={queryClient}>
    <NotificationProvider>
      <Component {...pageProps} />
    </NotificationProvider>
  </QueryClientProvider>
);

export default MyApp;
