import type { AppProps } from 'next/app';
import { ReactElement, ReactNode, Suspense, useEffect, useState } from 'react';
import DefaultLayout from '../layouts/DefaultLayout';
import { Provider, useSelector } from 'react-redux';
import store, { IRootState } from '../store/index';
import Head from 'next/head';
import '@/style_secondary/globals.css';
import jwt from 'jsonwebtoken';
import { appWithI18Next } from 'ni18n';
import { ni18nConfig } from 'ni18n.config';
// Perfect Scrollbar
import 'react-perfect-scrollbar/dist/css/styles.css';

import '../styles/tailwind.css';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import MainLayout from '@/layouts/mainLayout';
import api from '@/api';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};

interface JwtPayload {
    role: string; // Define the properties you expect in your JWT payload
    // Add other properties as needed
}

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
    const router = useRouter();
    const getLayout = Component.getLayout ?? ((page: any) => <DefaultLayout>{page}</DefaultLayout>);
    const [isClient, setisClient] = useState(false);
    useEffect(() => {
        setisClient(true);
    }, []);
    useEffect(() => {
        const storedData = localStorage.getItem('token');
        console.log('stored data', storedData);

        // console.log('URL', router.back());
        const fetchall = async () => {
            if (storedData) {
                const { token } = JSON.parse(storedData);
                try {
                    console.log('yarbi tkhedem', token);
                    // const jwtString = token ? JSON.parse(token).token : null;
                    const decodedToken: any = jwt.decode(token);
                    console.log('decode', decodedToken);
                    const role = decodedToken?.role;

                    if (role === 'user' && router.pathname.startsWith('/admin')) {
                        router.back();
                    }
                    if (decodedToken.sub) {
                        const response = await api.get(`/users/${decodedToken.sub}`);
                        console.log('yes', response.data.plan);

                        if (
                            role === 'user' &&
                            !response.data.plan &&
                            (router.pathname.startsWith('/main/prompts') || router.pathname.startsWith('/main/chatbot') || router.pathname.startsWith('/users/custominstruction'))
                        ) {
                            router.push('/main/subscription');
                        }
                    }
                } catch (error) {
                    router.push('/auth/login');
                }
            } else {
                if (router.pathname.startsWith('/admin') || router.pathname.startsWith('/main') || router.pathname.startsWith('/users')) router.back();
            }
        };

        fetchall();
    }, [router.pathname]);

    return (
        isClient && (
            <Provider store={store}>
                <Head>
                    <title>Project Name</title>
                    <meta charSet="UTF-8" />
                    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <meta name="description" content="Generated by create next app" />
                    <link rel="icon" href="/favicon.png" />
                </Head>

                {router.pathname === '/' ? (
                    <MainLayout>
                        <Component {...pageProps} />
                    </MainLayout>
                ) : (
                    getLayout(<Component {...pageProps} />)
                )}
            </Provider>
        )
    );
};
export default appWithI18Next(App, ni18nConfig);