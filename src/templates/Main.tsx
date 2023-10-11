import type { ReactNode } from 'react';

import FacebookLogo from '@/components/facebookLogo';
import InstagramLogo from '@/components/instagramLogo';
import { AppConfig } from '@/utils/AppConfig';

import WhatsappLogo from '../components/whatsappFloat';

type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
};

const Main = (props: IMainProps) => (
  <div className="w-full px-1 text-gray-700 antialiased">
    {props.meta}

    <div className="w-screen">
      <header className="border-b border-gray-300"></header>

      <main className="content pb-5 text-xl">{props.children}</main>

      <footer className="flex flex-col items-center border-t border-gray-300 py-8">
        <div className="text-center text-sm">
          © Copyright {new Date().getFullYear()} {AppConfig.title}.
        </div>
        <div className="mt-2 flex space-x-4">
          {' '}
          {/* Added flex and space-x-4 for horizontal alignment and spacing */}
          <InstagramLogo />
          <FacebookLogo />
        </div>
      </footer>

      <WhatsappLogo />
    </div>
  </div>
);

export { Main };
