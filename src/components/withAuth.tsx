import type { NextComponentType, NextPageContext } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useQuery } from 'react-query';
import zipy from 'zipyai';
import getProfile from '../utils/api/users/getProfile';
import { auth } from '../utils/firebase';

type Props = {
  [key: string]: any;
};

type WithInitialProps = {
  getInitialProps?: (ctx: NextPageContext) => Promise<any>;
};

const withAuth = (
  Component: NextComponentType<NextPageContext, any, Props> & WithInitialProps
) => {
  const AuthComponent: React.FC<Props> & WithInitialProps = (props) => {
    const router = useRouter();
    const [user, loading] = useAuthState(auth);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    useEffect(() => {
      if (user) {
        user.getIdToken().then((token) => setAccessToken(token));
      }
    }, [user]);

    const { data: profile } = useQuery(
      ['getProfile', accessToken],
      () => getProfile(accessToken),
      {
        enabled: !!accessToken, // only run the query if the accessToken is available
      }
    );

    useEffect(() => {
      if (!loading && !user) {
        router.replace('/login');
      }
      if (profile && profile.statusCode) {
        zipy.identify(profile.id, {
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          phone: profile.phone,
        });
        router.replace('/onboarding');
      }
      if (profile && !profile.statusCode && router.pathname === '/onboarding') {
        router.replace('/dashboard');
      }
    }, [user, loading, router, profile]);

    return <Component {...props} profile={profile} accessToken={accessToken} />;
  };

  if (Component.getInitialProps) {
    AuthComponent.getInitialProps = Component.getInitialProps;
  }

  return AuthComponent;
};

export default withAuth;
