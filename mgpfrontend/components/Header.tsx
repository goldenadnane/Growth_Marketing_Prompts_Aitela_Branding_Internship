import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { IRootState } from '../store';
import { toggleLocale, toggleSidebar, toggleTheme, toggleRTL, toggleSidebarContent } from '../store/themeConfigSlice';
import { useTranslation } from 'react-i18next';
import Dropdown from '../components/Dropdown';
import Image from 'next/image';
import { logout } from '@/store/authSlice';

const Header = () => {
    const router = useRouter();
    const isAdminSection = router.pathname.startsWith('/admin');
    const authSelector: any = useSelector((state: IRootState) => (state ? state?.auth : ''));
    const [userInformation, setUserInformation] = useState<userInfo>({
        firstname: '',
        lastname: '',
        email: '',
        username: '',
        dob: '',
        profileLogo: 'profile-unknown.jpeg',
        role: '',
        password: '',
    });
    useEffect(() => {
        const selector = document.querySelector('ul.horizontal-menu a[href="' + window.location.pathname + '"]');
        if (selector) {
            const all: any = document.querySelectorAll('ul.horizontal-menu .nav-link.active');
            for (let i = 0; i < all.length; i++) {
                all[0]?.classList.remove('active');
            }

            let allLinks = document.querySelectorAll('ul.horizontal-menu a.active');
            for (let i = 0; i < allLinks.length; i++) {
                const element = allLinks[i];
                element?.classList.remove('active');
            }
            selector?.classList.add('active');

            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link');
                if (ele) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele?.classList.add('active');
                    });
                }
            }
        }
    }, [router.pathname]);

    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const setLocale = (flag: string) => {
        setFlag(flag);
        if (flag.toLowerCase() === 'ae') {
            dispatch(toggleRTL('rtl'));
        } else {
            dispatch(toggleRTL('ltr'));
        }
    };
    const [flag, setFlag] = useState('');
    useEffect(() => {
        setLocale(localStorage.getItem('i18nextLng') || themeConfig.locale);
    });
    const dispatch = useDispatch();

    function createMarkup(messages: any) {
        return { __html: messages };
    }
    const [messages, setMessages] = useState([
        {
            id: 1,
            image: '<span class="grid place-content-center w-9 h-9 rounded-full bg-success-light dark:bg-success text-success dark:text-success-light"><svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg></span>',
            title: 'Congratulations!',
            message: 'Your OS has been updated.',
            time: '1hr',
        },
        {
            id: 2,
            image: '<span class="grid place-content-center w-9 h-9 rounded-full bg-info-light dark:bg-info text-info dark:text-info-light"><svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg></span>',
            title: 'Did you know?',
            message: 'You can switch between artboards.',
            time: '2hr',
        },
        {
            id: 3,
            image: '<span class="grid place-content-center w-9 h-9 rounded-full bg-danger-light dark:bg-danger text-danger dark:text-danger-light"> <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></span>',
            title: 'Something went wrong!',
            message: 'Send Reposrt',
            time: '2days',
        },
        {
            id: 4,
            image: '<span class="grid place-content-center w-9 h-9 rounded-full bg-warning-light dark:bg-warning text-warning dark:text-warning-light"><svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">    <circle cx="12" cy="12" r="10"></circle>    <line x1="12" y1="8" x2="12" y2="12"></line>    <line x1="12" y1="16" x2="12.01" y2="16"></line></svg></span>',
            title: 'Warning',
            message: 'Your password strength is low.',
            time: '5days',
        },
    ]);

    const removeMessage = (value: number) => {
        setMessages(messages.filter((user) => user.id !== value));
    };

    const [notifications, setNotifications] = useState([
        {
            id: 1,
            profile: 'user-profile.jpeg',
            message: '<strong class="text-sm mr-1">John Doe</strong>invite you to <strong>Prototyping</strong>',
            time: '45 min ago',
        },
        {
            id: 2,
            profile: 'profile-34.jpeg',
            message: '<strong class="text-sm mr-1">Adam Nolan</strong>mentioned you to <strong>UX Basics</strong>',
            time: '9h Ago',
        },
        {
            id: 3,
            profile: 'profile-16.jpeg',
            message: '<strong class="text-sm mr-1">Anna Morgan</strong>Upload a file',
            time: '9h Ago',
        },
    ]);

    const removeNotification = (value: number) => {
        setNotifications(notifications.filter((user) => user.id !== value));
    };
    const logoutHandler = () => {
        dispatch(logout());
        if (typeof window !== 'undefined') {
            window.location.replace('/auth/login');
        }
    };
    const [search, setSearch] = useState(false);

    const { t, i18n } = useTranslation();

    useEffect(() => {
        if (authSelector) {
            setUserInformation({
                firstname: authSelector?.value?.user?.firstname,
                lastname: authSelector?.value?.user?.lastname,
                email: authSelector?.value?.user?.email,
                username: authSelector?.value?.user?.username,
                dob: authSelector?.value?.user?.dob,
                profileLogo: authSelector?.value?.user?.profileLogo,
                role: authSelector?.value?.user?.role,
                password: authSelector?.value?.user?.password,
            });
            console.log(authSelector?.value?.user?.profileLogo);
        }
    }, [authSelector]);
    return (
        <header className={`w-[calc(100% - 270px)] ml-auto w-full bg-white ${themeConfig.semidark && themeConfig.menu === 'horizontal' ? 'dark' : 'light'}`}>
            <div className="shadow-md">
                <div className="bg-white-100 relative flex w-full items-center px-5 py-2.5 dark:bg-black">
                    <div className="horizontal-logo flex items-center justify-between ltr:mr-2 rtl:ml-2 lg:hidden">
                        <button
                            type="button"
                            onClick={() => {
                                dispatch(toggleSidebar());
                                dispatch(toggleSidebarContent(true));
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
                            </svg>
                        </button>
                    </div>

                    <div className="hidden ltr:mr-2 rtl:ml-2 sm:block">
                        <ul className="flex items-center space-x-2 rtl:space-x-reverse dark:text-[#d0d2d6]">
                            <li></li>
                            <li></li>
                            <li></li>
                        </ul>
                    </div>
                    <div className=" flex w-full items-center justify-end space-x-1.5 ltr:ml-auto rtl:mr-auto rtl:space-x-reverse dark:text-[#d0d2d6] sm:flex-1 ltr:sm:ml-0 sm:rtl:mr-0 md:justify-end lg:space-x-2">
                        {isAdminSection ? (
                            ''
                        ) : (
                            <ul className=" hidden w-full items-center justify-center gap-4 md:gap-10 lg:flex">
                                <li>
                                    <Link
                                        href={`/main/subscription`}
                                        className={`${router?.pathname.includes('subscription') ? 'border-b-2 border-[#26A8F4] text-[#26A8F4]' : ''} py-4 text-xs md:text-base`}
                                    >
                                        Subscription
                                    </Link>
                                </li>
                                <li>
                                    <Link href={`/main/chatbot`} className={`${router?.pathname.includes('chatbot') ? 'border-b-2 border-[#26A8F4] text-[#26A8F4]' : ''} py-4 text-xs md:text-base`}>
                                        Chatbot
                                    </Link>
                                </li>
                                <li>
                                    <Link href={`/main/prompts`} className={`${router?.pathname.includes('prompts') ? 'border-b-2 border-[#26A8F4] text-[#26A8F4]' : ''} py-4 text-xs md:text-base`}>
                                        Prompts
                                    </Link>
                                </li>
                            </ul>
                        )}
                        {/* <div className="sm:ltr:mr-auto sm:rtl:ml-auto">
                            <form
                                className={`${search && '!block'} absolute inset-x-0 top-1/2 z-10 mx-4 hidden -translate-y-1/2 sm:relative sm:top-0 sm:mx-0 sm:block sm:translate-y-0`}
                                onSubmit={() => setSearch(false)}
                            >
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="peer form-input bg-gray-100 placeholder:tracking-widest ltr:pl-9 ltr:pr-9 rtl:pr-9 rtl:pl-9 sm:bg-transparent ltr:sm:pr-4 rtl:sm:pl-4"
                                        placeholder="Search..."
                                    />
                                    <button type="button" className="absolute inset-0 h-9 w-9 appearance-none peer-focus:text-primary ltr:right-auto rtl:left-auto">
                                        <svg className="mx-auto" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="11.5" cy="11.5" r="9.5" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
                                            <path d="M18.5 18.5L22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                    </button>
                                    <button type="button" className="absolute top-1/2 block -translate-y-1/2 hover:opacity-80 ltr:right-2 rtl:left-2 sm:hidden" onClick={() => setSearch(false)}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle opacity="0.5" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                                            <path d="M14.5 9.50002L9.5 14.5M9.49998 9.5L14.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                    </button>
                                </div>
                            </form>
                            <button
                                type="button"
                                onClick={() => setSearch(!search)}
                                className="search_btn rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 dark:bg-dark/40 dark:hover:bg-dark/60 sm:hidden"
                            >
                                <svg className="mx-auto h-4.5 w-4.5 dark:text-[#d0d2d6]" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="11.5" cy="11.5" r="9.5" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
                                    <path d="M18.5 18.5L22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            </button>
                        </div> */}
                        <div>
                            {themeConfig.theme === 'light' ? (
                                <button
                                    className={`${
                                        themeConfig.theme === 'light' &&
                                        'flex items-center rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60'
                                    }`}
                                    onClick={() => dispatch(toggleTheme('dark'))}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" />
                                        <path d="M12 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        <path d="M12 20V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        <path d="M4 12L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        <path d="M22 12L20 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        <path opacity="0.5" d="M19.7778 4.22266L17.5558 6.25424" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        <path opacity="0.5" d="M4.22217 4.22266L6.44418 6.25424" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        <path opacity="0.5" d="M6.44434 17.5557L4.22211 19.7779" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        <path opacity="0.5" d="M19.7778 19.7773L17.5558 17.5551" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                </button>
                            ) : (
                                ''
                            )}
                            {themeConfig.theme === 'dark' && (
                                <button
                                    className={`${
                                        themeConfig.theme === 'dark' &&
                                        'flex items-center rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60'
                                    }`}
                                    onClick={() => dispatch(toggleTheme('system'))}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M21.0672 11.8568L20.4253 11.469L21.0672 11.8568ZM12.1432 2.93276L11.7553 2.29085V2.29085L12.1432 2.93276ZM21.25 12C21.25 17.1086 17.1086 21.25 12 21.25V22.75C17.9371 22.75 22.75 17.9371 22.75 12H21.25ZM12 21.25C6.89137 21.25 2.75 17.1086 2.75 12H1.25C1.25 17.9371 6.06294 22.75 12 22.75V21.25ZM2.75 12C2.75 6.89137 6.89137 2.75 12 2.75V1.25C6.06294 1.25 1.25 6.06294 1.25 12H2.75ZM15.5 14.25C12.3244 14.25 9.75 11.6756 9.75 8.5H8.25C8.25 12.5041 11.4959 15.75 15.5 15.75V14.25ZM20.4253 11.469C19.4172 13.1373 17.5882 14.25 15.5 14.25V15.75C18.1349 15.75 20.4407 14.3439 21.7092 12.2447L20.4253 11.469ZM9.75 8.5C9.75 6.41182 10.8627 4.5828 12.531 3.57467L11.7553 2.29085C9.65609 3.5593 8.25 5.86509 8.25 8.5H9.75ZM12 2.75C11.9115 2.75 11.8077 2.71008 11.7324 2.63168C11.6686 2.56527 11.6538 2.50244 11.6503 2.47703C11.6461 2.44587 11.6482 2.35557 11.7553 2.29085L12.531 3.57467C13.0342 3.27065 13.196 2.71398 13.1368 2.27627C13.0754 1.82126 12.7166 1.25 12 1.25V2.75ZM21.7092 12.2447C21.6444 12.3518 21.5541 12.3539 21.523 12.3497C21.4976 12.3462 21.4347 12.3314 21.3683 12.2676C21.2899 12.1923 21.25 12.0885 21.25 12H22.75C22.75 11.2834 22.1787 10.9246 21.7237 10.8632C21.286 10.804 20.7293 10.9658 20.4253 11.469L21.7092 12.2447Z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                </button>
                            )}
                            {themeConfig.theme === 'system' && (
                                <button
                                    className={`${
                                        themeConfig.theme === 'system' &&
                                        'flex items-center rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60'
                                    }`}
                                    onClick={() => dispatch(toggleTheme('light'))}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M3 9C3 6.17157 3 4.75736 3.87868 3.87868C4.75736 3 6.17157 3 9 3H15C17.8284 3 19.2426 3 20.1213 3.87868C21 4.75736 21 6.17157 21 9V14C21 15.8856 21 16.8284 20.4142 17.4142C19.8284 18 18.8856 18 17 18H7C5.11438 18 4.17157 18 3.58579 17.4142C3 16.8284 3 15.8856 3 14V9Z"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                        />
                                        <path opacity="0.5" d="M22 21H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        <path opacity="0.5" d="M15 15H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        <div className="dropdown flex shrink-0">
                            <Dropdown
                                offset={[0, 8]}
                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                btnClassName="relative group block"
                                button={
                                    <Image
                                        width={36}
                                        height={36}
                                        className="h-9 w-9 rounded-full object-cover saturate-50 group-hover:saturate-100"
                                        src={`/assets/uploads/${userInformation?.profileLogo}`}
                                        alt="userProfile"
                                    />
                                }
                            >
                                <ul className="w-[230px] !py-0 font-semibold text-dark dark:text-white-dark dark:text-white-light/90">
                                    <li>
                                        <div className="flex items-center px-4 py-4">
                                            <Image
                                                width={40}
                                                height={40}
                                                className="h-10 w-10 rounded-md object-cover"
                                                src={`/assets/uploads/${userInformation?.profileLogo || 'profile-unknown.jpeg'}`}
                                                alt="userProfile"
                                            />
                                            <div className="truncate ltr:pl-4 rtl:pr-4">
                                                <h4 className="text-base dark:text-white">{`${userInformation.firstname} ${userInformation.lastname}`}</h4>
                                                <button type="button" className="text-black/60 hover:text-primary dark:text-dark-light/60 dark:hover:text-white">
                                                    {userInformation.email}
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <Link href="/users/profile" className="dark:hover:text-white">
                                            <svg className="shrink-0 ltr:mr-2 rtl:ml-2" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="12" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" />
                                                <path
                                                    opacity="0.5"
                                                    d="M20 17.5C20 19.9853 20 22 12 22C4 22 4 19.9853 4 17.5C4 15.0147 7.58172 13 12 13C16.4183 13 20 15.0147 20 17.5Z"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                />
                                            </svg>
                                            Profile
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/users/custominstruction" className="dark:hover:text-white">
                                            <svg className="shrink-0 ltr:mr-2 rtl:ml-2" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M15.8747 2.37498C15.873 1.79152 15.6442 1.23166 15.2368 0.813949C14.8294 0.396241 14.2755 0.153494 13.6923 0.137116C13.109 0.120739 12.5423 0.332017 12.1122 0.726206C11.682 1.1204 11.4221 1.66654 11.3876 2.24898L4.39184 3.64792C4.22827 3.30796 3.98165 3.01471 3.67476 2.79528C3.36787 2.57586 3.01062 2.43733 2.63602 2.39251C2.26143 2.34769 1.88158 2.39802 1.53158 2.53884C1.18159 2.67967 0.87274 2.90645 0.633583 3.19823C0.394426 3.49001 0.232679 3.83736 0.163289 4.20819C0.0939002 4.57902 0.119109 4.96136 0.236585 5.31986C0.354062 5.67837 0.560016 6.00148 0.835411 6.25933C1.11081 6.51718 1.44676 6.70145 1.81221 6.79511V11.4549C1.42858 11.5533 1.07783 11.7516 0.795565 12.0294C0.5133 12.3073 0.309567 12.6548 0.205046 13.0369C0.100524 13.4189 0.0989348 13.8218 0.200439 14.2046C0.301943 14.5875 0.502928 14.9366 0.782992 15.2167C1.06306 15.4968 1.41223 15.6978 1.79507 15.7993C2.17792 15.9008 2.5808 15.8992 2.96283 15.7946C3.34486 15.6901 3.69244 15.4864 3.97029 15.2041C4.24813 14.9219 4.44636 14.5711 4.54484 14.1875H9.20459C9.29809 14.5532 9.4823 14.8894 9.74017 15.165C9.99805 15.4407 10.3213 15.6469 10.6799 15.7645C11.0386 15.8821 11.4211 15.9074 11.7922 15.838C12.1632 15.7687 12.5107 15.6069 12.8027 15.3676C13.0946 15.1283 13.3215 14.8193 13.4623 14.4691C13.6032 14.1189 13.6535 13.7388 13.6085 13.364C13.5636 12.9893 13.4248 12.6319 13.2052 12.3249C12.9855 12.0179 12.692 11.7713 12.3518 11.6079L13.7507 4.61204C14.3234 4.58074 14.8624 4.3316 15.2573 3.91567C15.6522 3.49974 15.8731 2.94852 15.8747 2.37498ZM13.6247 1.24998C13.8472 1.24998 14.0647 1.31596 14.2497 1.43958C14.4347 1.5632 14.5789 1.7389 14.6641 1.94446C14.7492 2.15003 14.7715 2.37623 14.7281 2.59446C14.6847 2.81269 14.5775 3.01314 14.4202 3.17048C14.2629 3.32781 14.0624 3.43496 13.8442 3.47837C13.626 3.52177 13.3998 3.4995 13.1942 3.41435C12.9886 3.3292 12.8129 3.185 12.6893 3C12.5657 2.81499 12.4997 2.59749 12.4997 2.37498C12.5 2.07671 12.6186 1.79073 12.8295 1.57982C13.0405 1.3689 13.3264 1.25028 13.6247 1.24998ZM1.24971 4.62498C1.24971 4.40248 1.31569 4.18497 1.43931 3.99997C1.56293 3.81496 1.73863 3.67077 1.94419 3.58562C2.14976 3.50047 2.37596 3.47819 2.59419 3.5216C2.81242 3.56501 3.01287 3.67215 3.17021 3.82949C3.32754 3.98682 3.43469 4.18728 3.4781 4.40551C3.5215 4.62373 3.49923 4.84993 3.41408 5.0555C3.32893 5.26107 3.18473 5.43677 2.99973 5.56039C2.81472 5.684 2.59722 5.74998 2.37471 5.74998C2.07644 5.74968 1.79046 5.63106 1.57955 5.42015C1.36863 5.20923 1.25001 4.92326 1.24971 4.62498ZM2.37471 14.75C2.15221 14.75 1.9347 14.684 1.7497 14.5604C1.56469 14.4368 1.4205 14.2611 1.33535 14.0555C1.2502 13.8499 1.22792 13.6237 1.27133 13.4055C1.31474 13.1873 1.42188 12.9868 1.57922 12.8295C1.73655 12.6722 1.93701 12.565 2.15524 12.5216C2.37346 12.4782 2.59966 12.5005 2.80523 12.5856C3.0108 12.6708 3.1865 12.815 3.31012 13C3.43373 13.185 3.49971 13.4025 3.49971 13.625C3.49941 13.9233 3.38079 14.2092 3.16988 14.4201C2.95897 14.6311 2.67299 14.7497 2.37471 14.75ZM9.20459 13.0625H4.54484C4.44408 12.6757 4.24198 12.3229 3.95939 12.0403C3.6768 11.7577 3.32395 11.5556 2.93721 11.4549V6.79511C3.3968 6.67556 3.80658 6.41322 4.10752 6.04586C4.40846 5.67851 4.58502 5.22511 4.61178 4.75098L11.6076 3.35204C11.828 3.80554 12.1943 4.17197 12.6476 4.39267L11.2487 11.3879C10.7746 11.4147 10.3212 11.5912 9.95383 11.8922C9.58648 12.1931 9.32413 12.6029 9.20459 13.0625ZM11.3747 14.75C11.1522 14.75 10.9347 14.684 10.7497 14.5604C10.5647 14.4368 10.4205 14.2611 10.3353 14.0555C10.2502 13.8499 10.2279 13.6237 10.2713 13.4055C10.3147 13.1873 10.4219 12.9868 10.5792 12.8295C10.7366 12.6722 10.937 12.565 11.1552 12.5216C11.3735 12.4782 11.5997 12.5005 11.8052 12.5856C12.0108 12.6708 12.1865 12.815 12.3101 13C12.4337 13.185 12.4997 13.4025 12.4997 13.625C12.4994 13.9233 12.3808 14.2092 12.1699 14.4201C11.959 14.6311 11.673 14.7497 11.3747 14.75Z"
                                                    fill="#3B3F5C"
                                                />
                                            </svg>
                                            Custom Instructions
                                        </Link>
                                    </li>

                                    <li className="border-t border-white-light dark:border-white-light/10" onClick={logoutHandler}>
                                        <button type="button" className="!py-3 text-danger">
                                            <svg className="shrink-0 rotate-90 ltr:mr-2 rtl:ml-2" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    opacity="0.5"
                                                    d="M17 9.00195C19.175 9.01406 20.3529 9.11051 21.1213 9.8789C22 10.7576 22 12.1718 22 15.0002V16.0002C22 18.8286 22 20.2429 21.1213 21.1215C20.2426 22.0002 18.8284 22.0002 16 22.0002H8C5.17157 22.0002 3.75736 22.0002 2.87868 21.1215C2 20.2429 2 18.8286 2 16.0002L2 15.0002C2 12.1718 2 10.7576 2.87868 9.87889C3.64706 9.11051 4.82497 9.01406 7 9.00195"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                />
                                                <path d="M12 15L12 2M12 2L15 5.5M12 2L9 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            Sign Out
                                        </button>
                                    </li>
                                </ul>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
