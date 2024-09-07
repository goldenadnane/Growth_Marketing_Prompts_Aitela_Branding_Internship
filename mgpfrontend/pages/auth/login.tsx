import Link from 'next/link';

import { SyntheticEvent, useEffect, useState } from 'react';
import { toggleTheme } from '@/store/themeConfigSlice';
import { useRouter } from 'next/router';
import BlankLayout from '@/layouts/BlankLayout';
import { url } from 'inspector';
import Head from 'next/head';
import Image from 'next/image';
import { login } from '@/store/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';

const Login = () => {
    const router = useRouter();
    const [auth, setAuth] = useState<auth | null>(null);
    const [error, setError] = useState<string>('');
    const [disable, setDisable] = useState<boolean>(true);
    const dispatch = useDispatch();
    const authSelector: any = useSelector((state: IRootState) => state.auth);

    const [userData, setUserData] = useState({
        email: '',
        password: '',
    });
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData((prevUserData) => ({
            ...prevUserData,
            [name]: value,
        }));
    };
    const signInWithGoogle = async () => {
        //  axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/google/callback`)
        // window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/google/callback`;
        window.open(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/google/callback`, '_blank');
    };
    const submit = async (e: SyntheticEvent) => {
        e.preventDefault();
        setError('');

        try {
            const rep = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify(userData),
            });
            if (rep.ok) {
                const data = await rep.json();
                console.log(data.message);
                // if (content?.token !== '') {
                // localStorage.setItem('user', '1234')

                // document.cookie = `token=${content.token}; path=/`;
                dispatch(login(data));
                if (typeof window !== 'undefined') {
                    window.location.replace('/main/chatbot');
                }
                // router.push('/dashboard');
                // }
                // await router.push("Layoutsadmin/Dachbord")
            }

            // else if(!userData.email.endsWith("@gmail.com")){
            //     const errorEmail=await rep.json()
            //     setError(errorEmail.message)
            // }
            else {
                const errorData = await rep.json();
                setError('Email or password incorrect!');
            }
        } catch (error: any) {
            throw new Error(error.message);
        }
    };
    useEffect(() => {
        setAuth(authSelector);
        dispatch(toggleTheme('light'));
        if (auth?.isAuth) {
            if (typeof window !== 'undefined' && (window.location.pathname === '/auth/login' || window.location.pathname === '/auth/register')) {
                router.push('/');
            }
        }
    }, [authSelector, auth, router]);
    useEffect(() => {
        if (userData.email.includes('@') && userData.password !== '') {
            setDisable(false);
            setError('');
        } else {
            setDisable(true);
        }
    }, [userData.email, userData.password]);
    return (
        <>
            <Head>
                <title>Login</title>
            </Head>
            <div className="flex min-h-screen flex-col lg:flex-row-reverse">
                {auth?.isAuth ? (
                    <div className="fixed left-0 top-0 z-50 h-screen w-full bg-white"></div>
                ) : (
                    <>
                        <div className=" h-[40vh] w-full  flex-col items-center justify-center  lg:min-h-screen lg:w-1/2 ">
                            <div className="relative mx-auto mb-5 h-full w-full">
                                <Image
                                    width={1000}
                                    height={500}
                                    src="/assets/images/auth_image.png"
                                    alt="coming_soon"
                                    className="!h-[75vh] max-h-screen !w-full object-cover brightness-50 lg:!h-screen"
                                />
                                <div className="img-text absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2">
                                    <h3 className="mx-auto mb-4 w-9/12 text-center text-3xl font-bold text-white">Empowering Your Feed with AI-Generated Content!</h3>
                                </div>
                            </div>
                        </div>
                        <div className="relative flex  w-full items-center justify-center lg:w-1/2 ">
                            <div className="h-full w-full">
                                <div className="h-full items-center justify-center lg:flex lg:min-h-screen">
                                    <div className="panel flex h-full w-full flex-col justify-start rounded-t-3xl py-5 xs:px-6 2xs:px-12 lg:h-screen ">
                                        <h2 className="mb-3 text-center text-2xl font-bold xs:text-3xl 2xs:text-4xl">Sign In</h2>
                                        <p className="mb-7 text-center">Enter your email and password to login</p>
                                        <form className="space-y-5" onSubmit={submit}>
                                            {error && (
                                                <div className="rounded bg-red-500 px-4 py-2  text-center text-white">
                                                    <p>{error}</p>
                                                </div>
                                            )}
                                            <div className="space-y-0 lg:space-y-5">
                                                <div>
                                                    <label htmlFor="email" className="invisible lg:visible">
                                                        Email
                                                    </label>
                                                    <input
                                                        id="email"
                                                        type="email"
                                                        name="email"
                                                        className="form-input !text-xs xs:py-2 xs:!text-sm 2xs:py-3 2xs:!text-base"
                                                        placeholder="Enter Email"
                                                        required
                                                        onChange={(e) => handleInputChange(e)}
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="password" className="invisible lg:visible">
                                                        Password
                                                    </label>
                                                    <input
                                                        id="password"
                                                        type="password"
                                                        name="password"
                                                        className="form-input !text-xs xs:py-2 xs:!text-sm 2xs:py-3 2xs:!text-base"
                                                        placeholder="Enter Password"
                                                        required
                                                        onChange={(e) => handleInputChange(e)}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <Link href={`/auth/resetpassword`} className="w-fit text-gray-500 underline">
                                                    Reset your password
                                                </Link>
                                            </div>
                                            <button type="submit" className="btn w-full bg-sky-500 text-white shadow-md disabled:opacity-70" disabled={disable}>
                                                SIGN IN
                                            </button>
                                        </form>
                                        <div className="relative my-7 h-5 text-center before:absolute before:inset-0 before:m-auto before:h-[1px] before:w-full before:bg-[#ebedf2]">
                                            <div className="relative z-[1] inline-block bg-white px-2 font-bold text-white-dark">
                                                <span>OR</span>
                                            </div>
                                        </div>
                                        <div className="mb-5 w-full">
                                            <button
                                                type="button"
                                                onClick={() => signInWithGoogle()}
                                                className="btn flex w-full gap-1 bg-white-dark/60 text-black shadow-none duration-200 hover:bg-white-dark/50  sm:gap-2 "
                                            >
                                                <svg className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" viewBox="0 0 256 193" version="1.1" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
                                                    <g>
                                                        <path
                                                            d="M58.1818182,192.049515 L58.1818182,93.1404244 L27.5066233,65.0770089 L0,49.5040608 L0,174.59497 C0,184.253152 7.82545455,192.049515 17.4545455,192.049515 L58.1818182,192.049515 Z"
                                                            fill="#4285F4"
                                                        ></path>
                                                        <path
                                                            d="M197.818182,192.049515 L238.545455,192.049515 C248.203636,192.049515 256,184.224061 256,174.59497 L256,49.5040608 L224.844415,67.3422767 L197.818182,93.1404244 L197.818182,192.049515 Z"
                                                            fill="#34A853"
                                                        ></path>
                                                        <polygon
                                                            fill="#EA4335"
                                                            points="58.1818182 93.1404244 54.0077618 54.4932827 58.1818182 17.5040608 128 69.8676972 197.818182 17.5040608 202.487488 52.4960089 197.818182 93.1404244 128 145.504061"
                                                        ></polygon>
                                                        <path
                                                            d="M197.818182,17.5040608 L197.818182,93.1404244 L256,49.5040608 L256,26.2313335 C256,4.64587897 231.36,-7.65957557 214.109091,5.28587897 L197.818182,17.5040608 Z"
                                                            fill="#FBBC04"
                                                        ></path>
                                                        <path
                                                            d="M0,49.5040608 L26.7588051,69.5731646 L58.1818182,93.1404244 L58.1818182,17.5040608 L41.8909091,5.28587897 C24.6109091,-7.65957557 0,4.64587897 0,26.2313335 L0,49.5040608 Z"
                                                            fill="#C5221F"
                                                        ></path>
                                                    </g>
                                                </svg>
                                                Google
                                            </button>
                                        </div>
                                        <p className="text-center">
                                            Dont&apos;t have an account ?
                                            <Link href="/auth/register" className="font-bold text-primary hover:underline ltr:ml-1 rtl:mr-1">
                                                Sign Up
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};
Login.getLayout = (page: any) => {
    return <BlankLayout>{page}</BlankLayout>;
};
export default Login;
