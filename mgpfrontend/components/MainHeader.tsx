import { IRootState } from '@/store';
import { logout } from '@/store/authSlice';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Dropdown from './Dropdown';
import { useRouter } from 'next/router';

function MainHeader() {
    const [user, setUser] = useState<auth | null>(null);
    const router = useRouter();
    const dispatch = useDispatch();
    const authSelector: any = useSelector((state: IRootState) => state.auth);

    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    const logoutHandler = () => {
        dispatch(logout());
        if (typeof window !== 'undefined') {
            window.location.replace('/auth/login');
        }
    };
    useEffect(() => {
        setUser(authSelector?.value?.user);
        console.log('user', authSelector);
    }, [user, authSelector]);
    return (
        <>
            <header className="z-20 flex w-full items-center justify-between  px-5 py-3 shadow-sm">
                <Link href="/" className="main-logo flex  shrink-0 items-center">
                    <Image width={150} height={150} loading="eager" className="max-w-full flex-none" src="/assets/images/MGP_Logo.png" alt="logo" />
                </Link>
                <nav>
                    <ul className="hidden items-center gap-10 lg:visible lg:flex">
                        <li>
                            <Link href="/main/chatbot">Chat</Link>
                        </li>
                        <li>
                            <Link href="#cases">Use cases</Link>
                        </li>
                        <li>
                            <Link href="#Pricing">Pricing</Link>
                        </li>
                    </ul>
                </nav>
                <div className="dropdown  lg:hidden">
                    <Dropdown
                        placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                        btnClassName=" dropdown-toggle horizontal-logo flex items-center justify-between ltr:mr-2 rtl:ml-2 "
                        button={
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
                                </svg>
                            </>
                        }
                    >
                        <ul className=" !mt-5 !min-h-fit !min-w-[60vw] !px-2">
                            <li>
                                <Link href="/main/chatbot">Chat</Link>
                            </li>
                            <li>
                                <Link href="#cases">Use cases</Link>
                            </li>
                            <li>
                                <Link href="#Pricing">Pricing</Link>
                            </li>
                            {authSelector?.isAuth ? (
                                <li className="w-fit">
                                    <button
                                        onClick={logoutHandler}
                                        className="mx-0 hidden w-fit !cursor-pointer gap-3 rounded-full bg-[#f794638f] px-10 py-2 font-bold duration-200 hover:bg-[#cfedff] lg:flex"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M15.8932 12.8384L18.6666 10.065L15.8932 7.29171M7.57324 10.065H18.5907M9.73991 18.6667C4.95158 18.6667 1.07324 15.4167 1.07324 10C1.07324 4.58337 4.95158 1.33337 9.73991 1.33337"
                                                stroke={`#e82b2b`}
                                                strokeWidth="1.5"
                                                strokeMiterlimit="10"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>

                                        <span className="inline !cursor-pointer text-sm text-[#e82b2b] opacity-100 duration-100 group-hover:inline group-hover:opacity-100 ">Log Out</span>
                                    </button>
                                </li>
                            ) : (
                                <li>
                                    <div className="account-sign m-3 flex flex-col  gap-3">
                                        <Link href="/auth/login">
                                            <button className="login w-full rounded-md bg-[#26A8F4] px-8 py-2 text-sm text-white">Login</button>
                                        </Link>

                                        <Link href={'/auth/register'}>
                                            <button className="register w-full rounded-md bg-[#26A8F4] px-6 py-2 text-sm text-white">Register </button>
                                        </Link>
                                    </div>
                                </li>
                            )}
                        </ul>
                    </Dropdown>
                </div>
                {authSelector?.isAuth ? (
                    <button onClick={logoutHandler} className="mx-0 hidden w-fit !cursor-pointer gap-3 rounded-full bg-[#f794638f] px-10 py-2 font-bold duration-200 hover:bg-[#f794635e] lg:flex">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M15.8932 12.8384L18.6666 10.065L15.8932 7.29171M7.57324 10.065H18.5907M9.73991 18.6667C4.95158 18.6667 1.07324 15.4167 1.07324 10C1.07324 4.58337 4.95158 1.33337 9.73991 1.33337"
                                stroke={`#e82b2b`}
                                strokeWidth="1.5"
                                strokeMiterlimit="10"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>

                        <span className="inline !cursor-pointer text-sm text-[#e82b2b] opacity-100 duration-100 group-hover:inline group-hover:opacity-100">Log Out</span>
                    </button>
                ) : (
                    <>
                        <div className="account-sign hidden gap-3 lg:visible lg:flex">
                            <Link href="/auth/login">
                                <button className="login w-full rounded-md bg-[#26A8F4] px-8 py-2 text-sm text-white">Login</button>
                            </Link>
                            <Link href={'/auth/register'}>
                                <button className="register w-full rounded-md bg-[#26A8F4] px-6 py-2 text-sm text-white">Register </button>
                            </Link>
                        </div>
                    </>
                )}
            </header>
        </>
    );
}

export default MainHeader;
