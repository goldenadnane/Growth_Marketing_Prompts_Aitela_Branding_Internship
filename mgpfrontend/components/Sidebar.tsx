import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from './hooks/useMediaQuery';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { toggleSidebar } from '../store/themeConfigSlice';
import { IRootState } from '../store';
import { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { AllConveration, AllPromptsSaved } from '@/type';
import api from '@/api';
import { setAdditionalVariable, setAdditionalVariablePrompts, setAddSavedprompt, setAddToFavorite, setTxtSavedPrompts } from '@/store/authSlice';
import Swal from 'sweetalert2';
import { logout } from '@/store/authSlice';
import SavedPrompts from './Chat/AddPromptsSaved';
import axios from 'axios';
const ApiUrl = process.env.NEXT_PUBLIC_BASE_URL;

const Sidebar = () => {
    const userId = useSelector((state: IRootState) => (state.auth.value?.user?.id ? state.auth.value.user.id : null));
    const additionalVariable = useSelector((state: IRootState) => state.auth.additionalVariable);
    const additionalVariablePrompts = useSelector((state: IRootState) => state.auth.additionalVariablePrompts);
    console.log('addition', additionalVariablePrompts);

    const authSelector: any = useSelector((state: IRootState) => (state?.auth?.value?.user ? state?.auth?.value?.user : null));

    const router = useRouter();
    const [currentMenu, setCurrentMenu] = useState<string>('');
    const [errorSubMenu, setErrorSubMenu] = useState(false);
    const [activeLink, setActiveLink] = useState('');
    const isDesktop = useMediaQuery('(min-width: 1024px)');
    const sidebarRef = useRef<any>(null);
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const semidark = useSelector((state: IRootState) => state.themeConfig.semidark);
    const isAdminSection = router.pathname.startsWith('/admin');
    const isEmailingSection = router.pathname.startsWith('/admin/emailling');
    const ApiUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const [isLoading, setIsLoading] = useState(true);
    const [nameConversation, setnameConversation] = useState<AllConveration[]>();
    const [namePrompts, setnamePrompts] = useState<any[]>();
    // const [contentSaved, setcontentSaved] = useState<string>();
    const [lastconvo, setlastconvo] = useState();
    const addToFavorite = useSelector((state: IRootState) => state.auth.addToFavorite);
    const sidebarContent = useSelector((state: IRootState) => state.themeConfig.sidebarContent);

    useEffect(() => {
        if (addToFavorite) {
            fetchAllPrompts();
            dispatch(setAddToFavorite(false));
        }
    }, [addToFavorite]);

    const toggleMenu = (value: string) => {
        setCurrentMenu((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };

    const dispatch = useDispatch();
    const { t } = useTranslation();

    const fetchAllConversations = async () => {
        try {
            if (userId) {
                const response = await api.get(`/conversations/userconversations/${userId}`);
                setnameConversation(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch conversations', error);
        }
    };

    const fetchLastConversation = async () => {
        try {
            if (userId) {
                const response = await api.get(`/conversations/lastconversation_of_user/${userId}`);
                if (response.data) {
                    setnameConversation((prev) => prev?.concat(response.data));
                    setlastconvo(response.data);
                }
            }
        } catch (error) {
            console.error('Failed to fetch last conversation', error);
        }
    };
    const fetchAllPrompts = async () => {
        try {
            const response = await api.get(`/prompts/prompts/savedprompts`);
            setnamePrompts(response.data);

            // Handle other success cases here
        } catch (error: any) {
            console.error('Failed to fetch Prompts', error);
        }
    };

    const logoutHandler = () => {
        dispatch(logout());
        if (typeof window !== 'undefined') {
            window.location.replace('/auth/login');
        }
    };

    // useEffect(() => {
    //     console.log('saved prompt', contentSaved);
    //     if (contentSaved !== '') {
    //         dispatch(setTxtSavedPrompts(contentSaved));
    //         setcontentSaved(''); // Empty contentSaved after dispatching
    //     }
    // }, [contentSaved, dispatch]);

    const navigateToChatBot = (content: string) => {
        dispatch(setTxtSavedPrompts(content));
        if (!router.pathname.startsWith('/main/chatbot')) router.push('/main/chatbot');
    };

    useEffect(() => {
        console.log('boolean', additionalVariable);
        const fetchconvo = async () => {
            if (additionalVariable) {
                await fetchLastConversation();
                dispatch(setAdditionalVariable(false));
            }
        };
        fetchconvo();
    }, [additionalVariable]);

    useEffect(() => {
        console.log('boolean prompt', additionalVariablePrompts);
        const fetchconvo = async () => {
            if (additionalVariablePrompts) {
                await fetchAllPrompts();
                dispatch(setAdditionalVariablePrompts(false));
            }
        };
        fetchconvo();
    }, [additionalVariablePrompts]);

    useEffect(() => {
        const filloutput = async () => {
            await fetchAllConversations();
            await fetchAllPrompts();
            const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
            if (selector) {
                selector.classList.add('active');
                const ul: any = selector.closest('ul.sub-menu');
                if (ul) {
                    let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link') || [];
                    if (ele.length) {
                        ele = ele[0];
                        setTimeout(() => {
                            ele.click();
                        });
                    }
                }
            }
            setIsLoading(false);
        };
        filloutput();
    }, []);

    useEffect(() => {
        console.log('convo', nameConversation);
    }, [nameConversation]);

    // {
    //     useEffect(() => {
    //     const handleClickOutside = (event: any) => {
    //         if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
    //             dispatch(closeSidebar());
    //         }
    //     };

    //     document.addEventListener('mousedown', handleClickOutside);
    //     return () => {
    //         document.removeEventListener('mousedown', handleClickOutside);
    //     };
    // }, []);
    // }

    useEffect(() => {
        setActiveRoute();
        if (window.innerWidth < 1024 && themeConfig.sidebar) {
            dispatch(toggleSidebar());
        }
    }, [router.pathname]);

    const setActiveRoute = () => {
        let allLinks = document.querySelectorAll('.sidebar ul a.active');
        for (let i = 0; i < allLinks.length; i++) {
            const element = allLinks[i];
            element?.classList.remove('active');
        }
        const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
        selector?.classList.add('active');
    };

    const handleLinkClick = (name: string) => {
        setActiveLink(name);
        console.log(activeLink);
        goToAdminPages(name);
    };

    const goToAdminPages = (name: string) => {
        router.push(`/admin/${name}`);
    };
    const handlePopSavedPrompt = () => {
        dispatch(setAddSavedprompt(true));
    };

    const DeleteConversationshowAlert = async (type: string, conversation: AllConveration) => {
        const { id } = conversation;

        if (type === 'delete conversation') {
            const result = await Swal.fire({
                icon: 'warning',
                text: `You want to delete this conversation`,
                showCancelButton: true,
                confirmButtonText: 'Delete',
                padding: '2em',
                customClass: 'sweet-alerts',
            });

            if (result.value && id) {
                try {
                    await api.delete(`/conversations/delete/${id}`);
                    // Update Table after Delete prompt
                    setnameConversation((prevItems) => prevItems?.filter((u) => u.id !== id));
                    Swal.fire({ text: `The Conversation has been deleted.`, icon: 'success', customClass: 'sweet-alerts' });
                } catch (error) {
                    console.error('Error deleting user:', error);
                    Swal.fire({ text: `The Conversation has not been deleted.`, icon: 'warning', customClass: 'sweet-alerts' });
                }
            }
        }
    };

    return (
        <div className={semidark ? 'dark' : ''}>
            {!isLoading && isAdminSection ? (
                <>
                    {/* { shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] } */}

                    <nav
                        className={`sidebar group  fixed !left-0 bottom-0 top-0 z-50 flex h-full min-h-screen w-[270px] flex-col justify-between shadow-lg transition-all  duration-300 sm:w-[270px] lg:w-[270px]  ${
                            semidark ? 'text-white-dark' : ''
                        } ${themeConfig.sidebar ? 'translate-x-0 lg:-translate-x-full' : '-translate-x-full lg:translate-x-0'}`}
                    >
                        <div className="flex h-[100%] flex-col bg-white dark:bg-black  dark:shadow-xl ">
                            <div className="flex items-center justify-center px-2 py-1 lg:justify-between lg:px-4 lg:py-3 ">
                                <Link href="/" className="main-logo flex w-4/6 shrink-0 items-center lg:w-full">
                                    <Image width={1000} height={500} className="max-w-full flex-none" src="/assets/images/MGP_Logo.png" alt="logo" />
                                </Link>
                            </div>
                            {!isDesktop && (
                                <div className=" max-w-[30rem] bg-[#d6effd] dark:bg-[#3b6777] ">
                                    <div className="flex flex-row items-center px-3 py-3">
                                        <div className=" h-[2.5rem] w-[2.5rem] overflow-hidden rounded-full border border-[#3cb1f5]">
                                            {/* <img src="/assets/images/profile-34.jpeg" alt="profile" className="h-full w-full object-cover" /> */}
                                            <Image width={36} height={36} className="h-full w-full object-cover" src={`/assets/uploads/${authSelector?.profileLogo}`} alt="userProfile" />
                                        </div>
                                        <div className="flex flex-col pl-2 pt-1 text-left ">
                                            <h5 className="  text-[16px] font-bold text-[#000] dark:text-white-light">{authSelector ? `${authSelector?.firstname} ${authSelector?.lastname}` : ''}</h5>
                                            <p className=" text-[12px] text-white-dark dark:text-white-light">{authSelector.email}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <ul className={` relative mt-2 space-y-0 text-[15px] font-semibold text-[#0E17268A] dark:text-white-light lg:space-y-4 lg:text-[20px]`}>
                                <li className="group/dash  p-4 py-0">
                                    <button
                                        type="button"
                                        name="admin"
                                        className={`flex w-full items-center justify-start space-x-4 rounded-lg bg-[#0e17261f] stroke-[#0E17268A] p-2 transition duration-300 group-hover/dash:bg-[#26a9f419]
                                        group-hover/dash:stroke-[#26A8F4] group-hover/dash:text-[#26A8F4] lg:p-3
                                        ${activeLink === '' ? 'bg-[#26a9f419] stroke-[#26A8F4] text-[#26A8F4]' : ''}
                                        dark:stroke-white-light
                                        `}
                                        onClick={(e) => handleLinkClick('')}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 26 26" fill="none">
                                            <path
                                                d="M3.25 9.75002L13 2.16669L22.75 9.75002V21.6667C22.75 22.2413 22.5217 22.7924 22.1154 23.1987C21.7091 23.6051 21.158 23.8334 20.5833 23.8334H5.41667C4.84203 23.8334 4.29093 23.6051 3.8846 23.1987C3.47827 22.7924 3.25 22.2413 3.25 21.6667V9.75002Z"
                                                stroke=""
                                                strokeOpacity="1"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path d="M9.75 23.8333V13H16.25V23.8333" stroke="" strokeOpacity="1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>

                                        <span className="">{t('Dashboard')}</span>
                                    </button>
                                </li>
                                <li className=" group/use relative overflow-y-hidden p-4 py-0">
                                    <div
                                        className={`absolute left-0 top-0 h-full w-[5px] -translate-y-[-100%] transform bg-[#26A8F4] transition-transform group-hover/use:translate-y-0
                                    ${activeLink === 'users' ? 'translate-y-0' : ''}
                                    `}
                                    ></div>
                                    <button
                                        type="button"
                                        name="users"
                                        className={`flex w-full items-center justify-start space-x-4 rounded-lg stroke-[#0E17268A] p-2 transition duration-300
                                        group-hover/use:bg-[#26a9f419] group-hover/use:stroke-[#26A8F4] group-hover/use:text-[#26A8F4] lg:p-3
                                        ${activeLink === 'users' ? ' bg-[#26a9f419] stroke-[#26A8F4] text-[#26A8F4]' : ''}
                                         dark:stroke-white-light`}
                                        onClick={(e) => handleLinkClick('users')}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 26 26" fill="none">
                                            <path
                                                d="M17.7776 4.33334C19.8793 4.33334 21.5693 6.03418 21.5693 8.12501C21.5693 10.1725 19.9443 11.8408 17.9184 11.9167C17.8249 11.9058 17.7304 11.9058 17.6368 11.9167M19.8684 21.6667C20.6484 21.5042 21.3851 21.19 21.9918 20.7242C23.6818 19.4567 23.6818 17.3658 21.9918 16.0983C21.3959 15.6433 20.6701 15.34 19.9009 15.1667M9.92344 11.7758C9.81511 11.765 9.68511 11.765 9.56594 11.7758C8.3225 11.7336 7.14431 11.2091 6.28088 10.3133C5.41745 9.41752 4.93658 8.22083 4.94011 6.97668C4.94011 4.32251 7.08511 2.16668 9.75011 2.16668C11.0244 2.14369 12.2556 2.62784 13.1728 3.51262C14.0901 4.3974 14.6184 5.61034 14.6414 6.88459C14.6643 8.15885 14.1802 9.39004 13.2954 10.3073C12.4106 11.2246 11.1977 11.7529 9.92344 11.7758ZM4.50678 15.7733C1.88511 17.5283 1.88511 20.3883 4.50678 22.1325C7.48594 24.1258 12.3718 24.1258 15.3509 22.1325C17.9726 20.3775 17.9726 17.5175 15.3509 15.7733C12.3826 13.7908 7.49678 13.7908 4.50678 15.7733Z"
                                                stroke=""
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        <span>{t('Users')}</span>
                                    </button>
                                </li>
                                <li className=" group/promp relative overflow-y-hidden p-4 py-0">
                                    <div
                                        className={`absolute left-0 top-0 h-full w-[5px] -translate-y-[-100%] transform bg-[#26A8F4] transition-transform
                                        group-hover/promp:translate-y-0
                                    ${activeLink === 'prompts' ? 'translate-y-0' : ''}`}
                                    ></div>
                                    <button
                                        type="button"
                                        name="Prompts"
                                        className={`flex w-full items-center justify-start space-x-4 rounded-lg stroke-[#0E17268A] p-2 transition duration-300
                                        group-hover/promp:bg-[#26a9f419] group-hover/promp:stroke-[#26A8F4] group-hover/promp:text-[#26A8F4] lg:p-3
                                        ${activeLink === 'prompts' ? ' bg-[#26a9f419] stroke-[#26A8F4] text-[#26A8F4]' : ''}
                                         dark:stroke-white-light`}
                                        onClick={(e) => handleLinkClick('prompts')}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 26 26" fill="none">
                                            <path
                                                d="M9.67419 2.16669L9.70669 3.82419C9.72836 4.70169 10.4542 5.41669 11.3317 5.41669H14.6034C15.5025 5.41669 16.2284 4.68002 16.2284 3.79169V2.16669"
                                                stroke=""
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M18.4167 18.4167L16.25 20.5834L18.4167 22.75M21.6667 18.4167L23.8333 20.5834L21.6667 22.75"
                                                stroke=""
                                                strokeWidth="1.5"
                                                strokeMiterlimit="10"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M14.0833 23.8334H8.66667C4.875 23.8334 3.25 21.6667 3.25 18.4167V7.58335C3.25 4.33335 4.875 2.16669 8.66667 2.16669H17.3333C21.125 2.16669 22.75 4.33335 22.75 7.58335V15.1667"
                                                stroke=""
                                                strokeWidth="1.5"
                                                strokeMiterlimit="10"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        <span>{t('Prompts')}</span>
                                    </button>
                                </li>
                                <li className=" group/plan relative overflow-y-hidden p-4 py-0">
                                    <div
                                        className={`absolute left-0 top-0 h-full w-[5px] -translate-y-[-100%] transform bg-[#26A8F4] transition-transform
                                        group-hover/plan:translate-y-0
                                    ${activeLink === 'plans' ? 'translate-y-0' : ''}`}
                                    ></div>
                                    <button
                                        type="button"
                                        name="Plans"
                                        className={`flex w-full items-center justify-start space-x-4 rounded-lg stroke-[#0E17268A] p-2 transition duration-300
                                        group-hover/plan:bg-[#26a9f419] group-hover/plan:stroke-[#26A8F4] group-hover/plan:text-[#26A8F4] lg:p-3
                                        ${activeLink === 'plans' ? ' bg-[#26a9f419] stroke-[#26A8F4] text-[#26A8F4]' : ''}
                                         dark:stroke-white-light`}
                                        onClick={(e) => handleLinkClick('plans')}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 26 26" fill="none">
                                            <path
                                                d="M9.39465 15.5242C9.39465 16.9217 10.4672 18.0483 11.7997 18.0483H14.5188C15.678 18.0483 16.6205 17.0625 16.6205 15.8492C16.6205 14.5275 16.0463 14.0617 15.1905 13.7583L10.8247 12.2417C9.96882 11.9383 9.39465 11.4725 9.39465 10.1508C9.39465 8.9375 10.3372 7.95167 11.4963 7.95167H14.2155C15.548 7.95167 16.6205 9.07833 16.6205 10.4758M13 6.5V19.5"
                                                stroke=""
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M16.25 23.8334H9.74996C4.33329 23.8334 2.16663 21.6667 2.16663 16.25V9.75002C2.16663 4.33335 4.33329 2.16669 9.74996 2.16669H16.25C21.6666 2.16669 23.8333 4.33335 23.8333 9.75002V16.25C23.8333 21.6667 21.6666 23.8334 16.25 23.8334Z"
                                                stroke=""
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        <span>{t('Plans')}</span>
                                    </button>
                                </li>
                                <li className=" group/email relative overflow-y-hidden p-4 py-0">
                                    <div
                                        className={`absolute left-0 top-0 h-full w-[5px] -translate-y-[-100%] transform bg-[#26A8F4] transition-transform
                                        group-hover/email:translate-y-0
                                    ${isEmailingSection ? 'translate-y-0' : ''}`}
                                    ></div>
                                    <button
                                        type="button"
                                        name="Emailling"
                                        className={`flex w-full items-center justify-start space-x-4 rounded-lg fill-[#0E17268A] p-2 transition duration-300
                                        group-hover/email:bg-[#26a9f419] group-hover/email:fill-[#26A8F4] group-hover/email:text-[#26A8F4] lg:p-3
                                        ${isEmailingSection ? ' bg-[#26a9f419] stroke-[#26A8F4] text-[#26A8F4]' : ''}
                                        ${themeConfig.isDarkMode ? 'fill-white' : ''}`}
                                        onClick={(e) => handleLinkClick('emailling')}
                                    >
                                        <svg className="shrink-0 group-hover:!text-primary" width="24" height="24" viewBox="0 0 24 24" fill="" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M24 5C24 6.65685 22.6569 8 21 8C19.3431 8 18 6.65685 18 5C18 3.34315 19.3431 2 21 2C22.6569 2 24 3.34315 24 5Z" fill=""></path>
                                            <path
                                                d="M17.2339 7.46394L15.6973 8.74444C14.671 9.59966 13.9585 10.1915 13.357 10.5784C12.7747 10.9529 12.3798 11.0786 12.0002 11.0786C11.6206 11.0786 11.2258 10.9529 10.6435 10.5784C10.0419 10.1915 9.32941 9.59966 8.30315 8.74444L5.92837 6.76546C5.57834 6.47377 5.05812 6.52106 4.76643 6.87109C4.47474 7.22112 4.52204 7.74133 4.87206 8.03302L7.28821 10.0465C8.2632 10.859 9.05344 11.5176 9.75091 11.9661C10.4775 12.4334 11.185 12.7286 12.0002 12.7286C12.8154 12.7286 13.523 12.4334 14.2495 11.9661C14.947 11.5176 15.7372 10.859 16.7122 10.0465L18.3785 8.65795C17.9274 8.33414 17.5388 7.92898 17.2339 7.46394Z"
                                                fill=""
                                            ></path>
                                            <path
                                                d="M18.4538 6.58719C18.7362 6.53653 19.0372 6.63487 19.234 6.87109C19.3965 7.06614 19.4538 7.31403 19.4121 7.54579C19.0244 7.30344 18.696 6.97499 18.4538 6.58719Z"
                                                fill=""
                                            ></path>
                                            <path
                                                opacity="0.5"
                                                d="M16.9576 3.02099C16.156 3 15.2437 3 14.2 3H9.8C5.65164 3 3.57746 3 2.28873 4.31802C1 5.63604 1 7.75736 1 12C1 16.2426 1 18.364 2.28873 19.682C3.57746 21 5.65164 21 9.8 21H14.2C18.3484 21 20.4225 21 21.7113 19.682C23 18.364 23 16.2426 23 12C23 10.9326 23 9.99953 22.9795 9.1797C22.3821 9.47943 21.7103 9.64773 21 9.64773C18.5147 9.64773 16.5 7.58722 16.5 5.04545C16.5 4.31904 16.6646 3.63193 16.9576 3.02099Z"
                                                fill=""
                                            ></path>
                                        </svg>
                                        <span>{t('Emailling')}</span>
                                    </button>
                                </li>
                                <li className=" group/catego relative overflow-y-hidden p-4 py-0">
                                    <div
                                        className={`absolute left-0 top-0 h-full w-[5px] -translate-y-[-100%] transform bg-[#26A8F4] transition-transform
                                        group-hover/catego:translate-y-0
                                    ${activeLink === 'category' ? 'translate-y-0' : ''}`}
                                    ></div>
                                    <button
                                        type="button"
                                        name="Category"
                                        className={`flex w-full items-center justify-start space-x-4 rounded-lg stroke-[#0E17268A] p-2 transition duration-300
                                        group-hover/catego:bg-[#26a9f419] group-hover/catego:stroke-[#26A8F4] group-hover/catego:text-[#26A8F4] lg:p-3
                                        ${activeLink === 'category' ? ' bg-[#26a9f419] stroke-[#26A8F4] text-[#26A8F4]' : ''}
                                         dark:stroke-white-light`}
                                        onClick={(e) => handleLinkClick('category')}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path
                                                d="M5 10H7C9 10 10 9 10 7V5C10 3 9 2 7 2H5C3 2 2 3 2 5V7C2 9 3 10 5 10ZM17 10H19C21 10 22 9 22 7V5C22 3 21 2 19 2H17C15 2 14 3 14 5V7C14 9 15 10 17 10ZM17 22H19C21 22 22 21 22 19V17C22 15 21 14 19 14H17C15 14 14 15 14 17V19C14 21 15 22 17 22ZM5 22H7C9 22 10 21 10 19V17C10 15 9 14 7 14H5C3 14 2 15 2 17V19C2 21 3 22 5 22Z"
                                                stroke=""
                                                strokeWidth="1.5"
                                                strokeMiterlimit="10"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        <span>{t('Category')}</span>
                                    </button>
                                </li>
                                <li className=" group/statis relative overflow-y-hidden p-4 py-0">
                                    <div
                                        className={`absolute left-0 top-0 h-full w-[5px] -translate-y-[-100%] transform bg-[#26A8F4] transition-transform
                                        group-hover/statis:translate-y-0
                                    ${activeLink === 'statistics' ? 'translate-y-0' : ''}
`}
                                    ></div>
                                    <button
                                        type="button"
                                        name="statistics"
                                        className={`flex w-full items-center justify-start space-x-4 rounded-lg stroke-[#0E17268A] p-2 transition duration-300
                                        group-hover/statis:bg-[#26a9f419] group-hover/statis:stroke-[#26A8F4] group-hover/statis:text-[#26A8F4] lg:p-3
                                        ${activeLink === 'statistics' ? ' bg-[#26a9f419] stroke-[#26A8F4] text-[#26A8F4]' : ''}
                                        ${themeConfig.isDarkMode ? 'stroke-white' : ''}`}
                                        onClick={(e) => handleLinkClick('statistics')}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 26 26" fill="none">
                                            <path d="M2.16675 23.8334H23.8334" stroke="" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                            <path
                                                d="M10.5625 4.33329V23.8333H15.4375V4.33329C15.4375 3.14163 14.95 2.16663 13.4875 2.16663H12.5125C11.05 2.16663 10.5625 3.14163 10.5625 4.33329ZM3.25 10.8333V23.8333H7.58333V10.8333C7.58333 9.64163 7.15 8.66663 5.85 8.66663H4.98333C3.68333 8.66663 3.25 9.64163 3.25 10.8333ZM18.4167 16.25V23.8333H22.75V16.25C22.75 15.0583 22.3167 14.0833 21.0167 14.0833H20.15C18.85 14.0833 18.4167 15.0583 18.4167 16.25Z"
                                                stroke=""
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        <span>{t('statistics')}</span>
                                    </button>
                                </li>
                                <li className=" group/integra relative overflow-y-hidden p-4 py-0">
                                    <div
                                        className={`absolute left-0 top-0 h-full w-[5px] -translate-y-[-100%] transform bg-[#26A8F4] transition-transform
                                        group-hover/integra:translate-y-0
                                    ${activeLink === 'integrations' ? 'translate-y-0' : ''}
`}
                                    ></div>
                                    <button
                                        type="button"
                                        name="integrations"
                                        className={`flex w-full items-center justify-start space-x-4 rounded-lg stroke-[#0E17268A] p-2 transition duration-300
                                        group-hover/integra:bg-[#26a9f419] group-hover/integra:stroke-[#26A8F4] group-hover/integra:text-[#26A8F4] lg:p-3
                                        ${activeLink === 'integrations' ? ' bg-[#26a9f419] stroke-[#26A8F4] text-[#26A8F4]' : ''}
                                        ${themeConfig.isDarkMode ? 'stroke-white' : ''}`}
                                        onClick={(e) => handleLinkClick('integrations')}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 26 26" fill="none">
                                            <path
                                                d="M14.1484 11.8517C14.7279 12.4294 15.1876 13.1157 15.5013 13.8714C15.815 14.6271 15.9765 15.4372 15.9765 16.2554C15.9765 17.0736 15.815 17.8838 15.5013 18.6395C15.1876 19.3952 14.7279 20.0815 14.1484 20.6592C11.7109 23.0859 7.76758 23.0967 5.34091 20.6592C2.91424 18.2217 2.90341 14.2784 5.34091 11.8517"
                                                stroke=""
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M11.4725 14.5275C8.93754 11.9925 8.93754 7.87583 11.4725 5.33C14.0075 2.78416 18.1242 2.795 20.67 5.33C23.2159 7.865 23.205 11.9817 20.67 14.5275"
                                                stroke=""
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        <span>{t('Integrations')}</span>
                                    </button>
                                </li>
                                <li className=" group/setting relative overflow-y-hidden p-4 py-0">
                                    <div
                                        className={`absolute left-0 top-0 h-full w-[5px] -translate-y-[-100%] transform bg-[#26A8F4] transition-transform
                                        group-hover/setting:translate-y-0
                                    ${activeLink === 'settings' ? 'translate-y-0' : ''}`}
                                    ></div>
                                    <button
                                        type="button"
                                        name="Settings"
                                        className={`flex w-full items-center justify-start space-x-4 rounded-lg stroke-[#0E17268A] p-2 transition duration-300
                                        group-hover/setting:bg-[#26a9f419] group-hover/setting:stroke-[#26A8F4] group-hover/setting:text-[#26A8F4] lg:p-3
                                        ${activeLink === 'settings' ? ' bg-[#26a9f419] stroke-[#26A8F4] text-[#26A8F4]' : ''}
                                        ${themeConfig.isDarkMode ? 'stroke-white' : ''}`}
                                        onClick={(e) => handleLinkClick('settings')}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 26 26" fill="none">
                                            <path
                                                d="M13 16.25C13.862 16.25 14.6886 15.9076 15.2981 15.2981C15.9076 14.6886 16.25 13.862 16.25 13C16.25 12.138 15.9076 11.3114 15.2981 10.7019C14.6886 10.0924 13.862 9.75 13 9.75C12.138 9.75 11.3114 10.0924 10.7019 10.7019C10.0924 11.3114 9.75 12.138 9.75 13C9.75 13.862 10.0924 14.6886 10.7019 15.2981C11.3114 15.9076 12.138 16.25 13 16.25Z"
                                                stroke=""
                                                strokeWidth="1.5"
                                                strokeMiterlimit="10"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M2.16675 13.9533V12.0467C2.16675 10.92 3.08758 9.98835 4.22508 9.98835C6.18591 9.98835 6.98758 8.60168 6.00175 6.90085C5.43841 5.92585 5.77425 4.65835 6.76008 4.09501L8.63425 3.02251C9.49008 2.51335 10.5951 2.81668 11.1042 3.67251L11.2234 3.87835C12.1984 5.57918 13.8017 5.57918 14.7876 3.87835L14.9067 3.67251C15.4159 2.81668 16.5209 2.51335 17.3767 3.02251L19.2509 4.09501C20.2367 4.65835 20.5726 5.92585 20.0092 6.90085C19.0234 8.60168 19.8251 9.98835 21.7859 9.98835C22.9126 9.98835 23.8442 10.9092 23.8442 12.0467V13.9533C23.8442 15.08 22.9234 16.0117 21.7859 16.0117C19.8251 16.0117 19.0234 17.3983 20.0092 19.0992C20.5726 20.085 20.2367 21.3417 19.2509 21.905L17.3767 22.9775C16.5209 23.4867 15.4159 23.1833 14.9067 22.3275L14.7876 22.1217C13.8126 20.4208 12.2092 20.4208 11.2234 22.1217L11.1042 22.3275C10.5951 23.1833 9.49008 23.4867 8.63425 22.9775L6.76008 21.905C6.28786 21.6331 5.94279 21.185 5.80062 20.6589C5.65845 20.1329 5.73078 19.5719 6.00175 19.0992C6.98758 17.3983 6.18591 16.0117 4.22508 16.0117C3.08758 16.0117 2.16675 15.08 2.16675 13.9533Z"
                                                stroke=""
                                                strokeWidth="1.5"
                                                strokeMiterlimit="10"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        <span>{t('Settings')}</span>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </>
            ) : (
                <>
                    {/* shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] */}

                    <nav
                        className={`sidebar group  fixed !left-0 bottom-0 top-0 z-50 flex h-full min-h-screen w-[270px] flex-col justify-between shadow-lg transition-all  duration-300 sm:w-[270px] lg:w-[270px]  ${
                            semidark ? 'text-white-dark' : ''
                        } ${themeConfig.sidebar ? 'translate-x-0 lg:-translate-x-full' : '-translate-x-full lg:translate-x-0'}`}
                    >
                        <div className="h-[100%] bg-white dark:bg-black dark:shadow-xl">
                            <div className="flex items-center justify-center px-2 py-1 lg:justify-between lg:px-4 lg:py-3">
                                <Link href="/" className="main-logo flex w-4/6 shrink-0 items-center lg:w-full">
                                    <Image width={1000} height={500} className="max-w-full flex-none" src="/assets/images/MGP_Logo.png" alt="logo" />
                                </Link>
                            </div>
                            {/********* Modify this sidebar ******************************/}
                            <div className="relative min-h-full">
                                {!isDesktop ? (
                                    sidebarContent ? (
                                        <>
                                            <div className=" max-w-[30rem] bg-[#d6effd] dark:bg-[#3b6777] ">
                                                <div className="flex flex-row items-center px-3 py-3">
                                                    <div className=" h-[2.5rem] w-[2.5rem] overflow-hidden rounded-full border border-[#3cb1f5]">
                                                        {/* <img src="/assets/images/profile-34.jpeg" alt="profile" className="h-full w-full object-cover" /> */}
                                                        <Image width={36} height={36} className="h-full w-full object-cover" src={`/assets/uploads/${authSelector?.profileLogo}`} alt="userProfile" />
                                                    </div>
                                                    <div className="flex flex-col pl-2 pt-1 text-left ">
                                                        <h5 className="  text-[16px] font-bold text-[#000] dark:text-white-light">{`${authSelector?.firstname} ${authSelector?.lastname}`}</h5>
                                                        <p className=" text-[12px] text-white-dark dark:text-white-light">{authSelector?.email}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <ul className=" relative mt-2 space-y-0 text-[15px] font-semibold text-[#0E17268A] dark:text-white-light lg:space-y-4 lg:text-[20px] ">
                                                <li className="nav-item">
                                                    <Link href="/main/subscription" className="group">
                                                        <div className="flex items-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-7 w-7">
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                                />
                                                            </svg>

                                                            <span className="text-white-dark ltr:pl-3 rtl:pr-3 dark:text-[#fff] dark:group-hover:text-white-dark">{t('Subscription')}</span>
                                                        </div>
                                                    </Link>
                                                </li>
                                                <li className="nav-item">
                                                    <Link href="/main/chatbot" className="group">
                                                        <div className="flex items-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-7 w-7">
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                                                                />
                                                            </svg>

                                                            <span className="text-white-dark ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('GMP Chatbot')}</span>
                                                        </div>
                                                    </Link>
                                                </li>
                                                <li className="nav-item">
                                                    <Link href="/main/prompts" className="group">
                                                        <div className="flex items-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-7 w-7">
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                                                                />
                                                            </svg>

                                                            <span className="text-white-dark ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('Prompts')}</span>
                                                        </div>
                                                    </Link>
                                                </li>
                                            </ul>
                                        </>
                                    ) : (
                                        <>
                                            <ul className="relative mb-3 space-y-3 p-4 py-0 font-semibold">
                                                <li className="menu nav-item overflow-auto">
                                                    <button
                                                        type="button"
                                                        className={` ${currentMenu === 'dashboard' ? 'active' : ''} group w-full rounded-md bg-slate-200 px-4 py-2`}
                                                        onClick={() => {
                                                            toggleMenu('dashboard');
                                                            router.push('/main/chatbot');
                                                        }}
                                                    >
                                                        <div className="flex items-center">
                                                            <span className="text-primary duration-300 group-hover:opacity-100 ltr:pl-3 rtl:pr-3 dark:text-[#506690]  dark:group-hover:text-white-dark">
                                                                {t('Add Conversation')}
                                                            </span>
                                                        </div>
                                                    </button>
                                                </li>
                                                <li className="menu nav-item h-[29vh] overflow-auto">
                                                    <div className="">
                                                        <ul className="sub-menu ml-1 mr-1  text-black duration-300 group-hover:opacity-100">
                                                            {nameConversation?.length === 0 ? (
                                                                <p className="flex justify-center text-gray-600 dark:text-white">No Conversation</p>
                                                            ) : (
                                                                nameConversation?.map((convo) => (
                                                                    <li key={convo.id} className="flex items-center justify-between">
                                                                        <button
                                                                            className="flex w-full p-0 dark:text-white"
                                                                            onClick={() => {
                                                                                router.push({
                                                                                    pathname: `/main/chatbot/${convo.id}`,
                                                                                    query: { conversation: convo.id },
                                                                                });
                                                                            }}
                                                                        >
                                                                            {convo && convo.title.length > 19 ? convo.title.substring(0, 20).concat('...') : convo.title}
                                                                        </button>
                                                                        <svg
                                                                            width="24"
                                                                            height="24"
                                                                            viewBox="0 0 24 24"
                                                                            fill="none"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            className="h-5 w-5 cursor-pointer text-[#000] hover:rounded-full hover:text-red-400 dark:text-white dark:hover:text-red-700"
                                                                            onClick={() => {
                                                                                DeleteConversationshowAlert('delete conversation', convo);
                                                                            }}
                                                                        >
                                                                            <path d="M20.5001 6H3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                                                            <path
                                                                                d="M18.8334 8.5L18.3735 15.3991C18.1965 18.054 18.108 19.3815 17.243 20.1907C16.378 21 15.0476 21 12.3868 21H11.6134C8.9526 21 7.6222 21 6.75719 20.1907C5.89218 19.3815 5.80368 18.054 5.62669 15.3991L5.16675 8.5"
                                                                                stroke="currentColor"
                                                                                strokeWidth="1.5"
                                                                                strokeLinecap="round"
                                                                            ></path>
                                                                            <path opacity="0.5" d="M9.5 11L10 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                                                            <path opacity="0.5" d="M14.5 11L14 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                                                            <path
                                                                                opacity="0.5"
                                                                                d="M6.5 6C6.55588 6 6.58382 6 6.60915 5.99936C7.43259 5.97849 8.15902 5.45491 8.43922 4.68032C8.44784 4.65649 8.45667 4.62999 8.47434 4.57697L8.57143 4.28571C8.65431 4.03708 8.69575 3.91276 8.75071 3.8072C8.97001 3.38607 9.37574 3.09364 9.84461 3.01877C9.96213 3 10.0932 3 10.3553 3H13.6447C13.9068 3 14.0379 3 14.1554 3.01877C14.6243 3.09364 15.03 3.38607 15.2493 3.8072C15.3043 3.91276 15.3457 4.03708 15.4286 4.28571L15.5257 4.57697C15.5433 4.62992 15.5522 4.65651 15.5608 4.68032C15.841 5.45491 16.5674 5.97849 17.3909 5.99936C17.4162 6 17.4441 6 17.5 6"
                                                                                stroke="currentColor"
                                                                                strokeWidth="1.5"
                                                                            ></path>
                                                                        </svg>
                                                                    </li>
                                                                ))
                                                            )}
                                                        </ul>
                                                    </div>
                                                </li>

                                                <li className="menu nav-item h-[320px] overflow-hidden pt-2 ">
                                                    <button
                                                        type="button"
                                                        className={`${currentMenu === 'component' ? 'active' : ''} nav-link group  w-full bg-slate-200 `}
                                                        onClick={() => toggleMenu('component')}
                                                    >
                                                        <div className="flex w-full items-center justify-between">
                                                            <div className="flex items-center">
                                                                <svg
                                                                    className=" shrink-0 group-hover:!text-primary"
                                                                    width="20"
                                                                    height="20"
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                    <path
                                                                        d="M8.42229 20.6181C10.1779 21.5395 11.0557 22.0001 12 22.0001V12.0001L2.63802 7.07275C2.62423 7.09491 2.6107 7.11727 2.5974 7.13986C2 8.15436 2 9.41678 2 11.9416V12.0586C2 14.5834 2 15.8459 2.5974 16.8604C3.19479 17.8749 4.27063 18.4395 6.42229 19.5686L8.42229 20.6181Z"
                                                                        fill="rgb(67,97,238)"
                                                                    />
                                                                    <path
                                                                        opacity="0.7"
                                                                        d="M17.5774 4.43152L15.5774 3.38197C13.8218 2.46066 12.944 2 11.9997 2C11.0554 2 10.1776 2.46066 8.42197 3.38197L6.42197 4.43152C4.31821 5.53552 3.24291 6.09982 2.6377 7.07264L11.9997 12L21.3617 7.07264C20.7564 6.09982 19.6811 5.53552 17.5774 4.43152Z"
                                                                        fill="rgb(67,97,238)"
                                                                    />
                                                                    <path
                                                                        opacity="0.5"
                                                                        d="M21.4026 7.13986C21.3893 7.11727 21.3758 7.09491 21.362 7.07275L12 12.0001V22.0001C12.9443 22.0001 13.8221 21.5395 15.5777 20.6181L17.5777 19.5686C19.7294 18.4395 20.8052 17.8749 21.4026 16.8604C22 15.8459 22 14.5834 22 12.0586V11.9416C22 9.41678 22 8.15436 21.4026 7.13986Z"
                                                                        fill="rgb(67,97,238)"
                                                                    />
                                                                </svg>
                                                                <span className=" text-primary duration-300 group-hover:opacity-100 ltr:pl-3 rtl:pr-3 dark:text-[#506690]  dark:group-hover:text-white-dark">
                                                                    {t('List of Prompts')}
                                                                </span>
                                                            </div>
                                                            <div onClick={handlePopSavedPrompt}>
                                                                <svg className="shrink-0 hover:!text-primary" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                                    <path
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        fillRule="evenodd"
                                                                        clipRule="evenodd"
                                                                        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12.75 9C12.75 8.58579 12.4142 8.25 12 8.25C11.5858 8.25 11.25 8.58579 11.25 9L11.25 11.25H9C8.58579 11.25 8.25 11.5858 8.25 12C8.25 12.4142 8.58579 12.75 9 12.75H11.25V15C11.25 15.4142 11.5858 15.75 12 15.75C12.4142 15.75 12.75 15.4142 12.75 15L12.75 12.75H15C15.4142 12.75 15.75 12.4142 15.75 12C15.75 11.5858 15.4142 11.25 15 11.25H12.75V9Z"
                                                                        fill="currentColor"
                                                                    />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    </button>
                                                    <div className={`max-h-60 ${namePrompts && namePrompts?.length > 6 ? 'overflow-y-scroll' : ''} `}>
                                                        <ul className="sub-menu  text-black  duration-300 group-hover:opacity-100 ">
                                                            {namePrompts?.length === 0 ? (
                                                                <p className="mt-4 flex justify-center text-gray-600 dark:text-white">No Prompt</p>
                                                            ) : (
                                                                namePrompts?.map((savedprompt) => (
                                                                    <li key={savedprompt.id}>
                                                                        <button
                                                                            className="w-full text-[#000] dark:text-white"
                                                                            onClick={() => {
                                                                                if (savedprompt.prompt) {
                                                                                    api.post(`${ApiUrl}/prompts/prompts/get_prompt_to_increase_used_field/${savedprompt.prompt.id}`)
                                                                                        .then((res) => {
                                                                                            navigateToChatBot(savedprompt.prompt.prompt_text);
                                                                                        })
                                                                                        .catch((err) => console.log(err));
                                                                                } else navigateToChatBot(savedprompt.content);
                                                                            }}
                                                                        >
                                                                            {!savedprompt.content
                                                                                ? savedprompt.prompt.goal
                                                                                : savedprompt.content?.length > 10
                                                                                ? savedprompt.content.substring(0, 11).concat('...')
                                                                                : savedprompt.content}
                                                                        </button>
                                                                    </li>
                                                                ))
                                                            )}
                                                        </ul>
                                                    </div>
                                                </li>
                                            </ul>
                                        </>
                                    )
                                ) : (
                                    <>
                                        <ul className="relative mb-1 min-h-fit font-semibold">
                                            <li className="menu nav-item overflow-auto">
                                                <button
                                                    type="button"
                                                    className={` ${currentMenu === 'dashboard' ? 'active' : ''} group w-full rounded-md bg-slate-200 px-4 py-2`}
                                                    onClick={() => {
                                                        toggleMenu('dashboard');
                                                        router.push('/main/chatbot');
                                                    }}
                                                >
                                                    <div className="flex items-center">
                                                        <span className="text-primary duration-300 group-hover:opacity-100 ltr:pl-3 rtl:pr-3 dark:text-[#506690]  dark:group-hover:text-white-dark">
                                                            {t('Add Conversation')}
                                                        </span>
                                                    </div>
                                                </button>
                                            </li>
                                            <li className="menu nav-item h-[38vh] overflow-auto">
                                                <div className="">
                                                    <ul className="sub-menu ml-1 mr-1  text-black duration-300 group-hover:opacity-100">
                                                        {nameConversation?.length === 0 ? (
                                                            <p className="flex justify-center text-gray-600 dark:text-white">No Conversation</p>
                                                        ) : (
                                                            nameConversation?.map((convo) => (
                                                                <li key={convo.id} className="flex w-full min-w-max items-center justify-between">
                                                                    <button
                                                                        className="m-0 flex w-full p-0 dark:text-white"
                                                                        onClick={() => {
                                                                            router.push({
                                                                                pathname: `/main/chatbot/${convo.id}`,
                                                                                query: { conversation: convo.id },
                                                                            });
                                                                        }}
                                                                    >
                                                                        {convo && convo.title.length > 27 ? convo.title.substring(0, 27).concat('...') : convo.title}
                                                                    </button>
                                                                    <svg
                                                                        width="24"
                                                                        height="24"
                                                                        viewBox="0 0 24 24"
                                                                        fill="none"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className="h-5 w-5 cursor-pointer text-[#000] hover:rounded-full hover:text-red-400 dark:text-white dark:hover:text-red-700"
                                                                        onClick={() => {
                                                                            DeleteConversationshowAlert('delete conversation', convo);
                                                                        }}
                                                                    >
                                                                        <path d="M20.5001 6H3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                                                        <path
                                                                            d="M18.8334 8.5L18.3735 15.3991C18.1965 18.054 18.108 19.3815 17.243 20.1907C16.378 21 15.0476 21 12.3868 21H11.6134C8.9526 21 7.6222 21 6.75719 20.1907C5.89218 19.3815 5.80368 18.054 5.62669 15.3991L5.16675 8.5"
                                                                            stroke="currentColor"
                                                                            strokeWidth="1.5"
                                                                            strokeLinecap="round"
                                                                        ></path>
                                                                        <path opacity="0.5" d="M9.5 11L10 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                                                        <path opacity="0.5" d="M14.5 11L14 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                                                        <path
                                                                            opacity="0.5"
                                                                            d="M6.5 6C6.55588 6 6.58382 6 6.60915 5.99936C7.43259 5.97849 8.15902 5.45491 8.43922 4.68032C8.44784 4.65649 8.45667 4.62999 8.47434 4.57697L8.57143 4.28571C8.65431 4.03708 8.69575 3.91276 8.75071 3.8072C8.97001 3.38607 9.37574 3.09364 9.84461 3.01877C9.96213 3 10.0932 3 10.3553 3H13.6447C13.9068 3 14.0379 3 14.1554 3.01877C14.6243 3.09364 15.03 3.38607 15.2493 3.8072C15.3043 3.91276 15.3457 4.03708 15.4286 4.28571L15.5257 4.57697C15.5433 4.62992 15.5522 4.65651 15.5608 4.68032C15.841 5.45491 16.5674 5.97849 17.3909 5.99936C17.4162 6 17.4441 6 17.5 6"
                                                                            stroke="currentColor"
                                                                            strokeWidth="1.5"
                                                                        ></path>
                                                                    </svg>
                                                                </li>
                                                            ))
                                                        )}
                                                    </ul>
                                                </div>
                                            </li>

                                            <li className="menu nav-item h-fit overflow-hidden pt-2 ">
                                                <button
                                                    type="button"
                                                    className={`${currentMenu === 'component' ? 'active' : ''} nav-link group  w-full bg-slate-200 `}
                                                    onClick={() => toggleMenu('component')}
                                                >
                                                    <div className="flex w-full items-center justify-between">
                                                        <div className="flex items-center">
                                                            <svg
                                                                className=" shrink-0 group-hover:!text-primary"
                                                                width="20"
                                                                height="20"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path
                                                                    d="M8.42229 20.6181C10.1779 21.5395 11.0557 22.0001 12 22.0001V12.0001L2.63802 7.07275C2.62423 7.09491 2.6107 7.11727 2.5974 7.13986C2 8.15436 2 9.41678 2 11.9416V12.0586C2 14.5834 2 15.8459 2.5974 16.8604C3.19479 17.8749 4.27063 18.4395 6.42229 19.5686L8.42229 20.6181Z"
                                                                    fill="rgb(67,97,238)"
                                                                />
                                                                <path
                                                                    opacity="0.7"
                                                                    d="M17.5774 4.43152L15.5774 3.38197C13.8218 2.46066 12.944 2 11.9997 2C11.0554 2 10.1776 2.46066 8.42197 3.38197L6.42197 4.43152C4.31821 5.53552 3.24291 6.09982 2.6377 7.07264L11.9997 12L21.3617 7.07264C20.7564 6.09982 19.6811 5.53552 17.5774 4.43152Z"
                                                                    fill="rgb(67,97,238)"
                                                                />
                                                                <path
                                                                    opacity="0.5"
                                                                    d="M21.4026 7.13986C21.3893 7.11727 21.3758 7.09491 21.362 7.07275L12 12.0001V22.0001C12.9443 22.0001 13.8221 21.5395 15.5777 20.6181L17.5777 19.5686C19.7294 18.4395 20.8052 17.8749 21.4026 16.8604C22 15.8459 22 14.5834 22 12.0586V11.9416C22 9.41678 22 8.15436 21.4026 7.13986Z"
                                                                    fill="rgb(67,97,238)"
                                                                />
                                                            </svg>
                                                            <span className=" text-primary duration-300 group-hover:opacity-100 ltr:pl-3 rtl:pr-3 dark:text-[#506690]  dark:group-hover:text-white-dark">
                                                                {t('List of Prompts')}
                                                            </span>
                                                        </div>
                                                        <div onClick={handlePopSavedPrompt}>
                                                            <svg className="shrink-0 hover:!text-primary" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                                <path
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    fillRule="evenodd"
                                                                    clipRule="evenodd"
                                                                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12.75 9C12.75 8.58579 12.4142 8.25 12 8.25C11.5858 8.25 11.25 8.58579 11.25 9L11.25 11.25H9C8.58579 11.25 8.25 11.5858 8.25 12C8.25 12.4142 8.58579 12.75 9 12.75H11.25V15C11.25 15.4142 11.5858 15.75 12 15.75C12.4142 15.75 12.75 15.4142 12.75 15L12.75 12.75H15C15.4142 12.75 15.75 12.4142 15.75 12C15.75 11.5858 15.4142 11.25 15 11.25H12.75V9Z"
                                                                    fill="currentColor"
                                                                />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </button>
                                                <div className={`max-h-[37.5vh] ${namePrompts && namePrompts?.length > 6 ? 'overflow-y-scroll' : ''} `}>
                                                    <ul className="sub-menu  text-black  duration-300 group-hover:opacity-100 ">
                                                        {namePrompts?.length === 0 ? (
                                                            <p className="mt-4 flex justify-center text-gray-600 dark:text-white">No Prompt</p>
                                                        ) : (
                                                            namePrompts?.map((savedprompt) => (
                                                                <li key={savedprompt.id}>
                                                                    <button
                                                                        className="w-full text-[#000] dark:text-white"
                                                                        onClick={() => {
                                                                            if (savedprompt.prompt) {
                                                                                api.post(`${ApiUrl}/prompts/prompts/get_prompt_to_increase_used_field/${savedprompt.prompt.id}`)
                                                                                    .then((res) => {
                                                                                        navigateToChatBot(savedprompt.prompt.prompt_text);
                                                                                    })
                                                                                    .catch((err) => console.log(err));
                                                                            } else navigateToChatBot(savedprompt.content);
                                                                        }}
                                                                    >
                                                                        {!savedprompt.content
                                                                            ? savedprompt.prompt.goal.length > 25
                                                                                ? savedprompt.prompt.goal.substring(0, 25).concat('...')
                                                                                : savedprompt.prompt.goal
                                                                            : savedprompt.content.length > 25
                                                                            ? savedprompt.content.substring(0, 25).concat('...')
                                                                            : savedprompt.content}
                                                                    </button>
                                                                </li>
                                                            ))
                                                        )}
                                                    </ul>
                                                </div>
                                            </li>

                                            {/*<li className="logout  bg-white dark:bg-black">
                                                <button
                                                    onClick={logoutHandler}
                                                    className="mx-0 flex !cursor-pointer gap-3 rounded-full bg-[#fff] px-3 py-2 font-bold duration-200 hover:bg-[#cfedff] dark:bg-transparent lg:mx-auto lg:bg-[#dcf2ff] lg:px-12"
                                                >
                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path
                                                            d="M15.8932 12.8384L18.6666 10.065L15.8932 7.29171M7.57324 10.065H18.5907M9.73991 18.6667C4.95158 18.6667 1.07324 15.4167 1.07324 10C1.07324 4.58337 4.95158 1.33337 9.73991 1.33337"
                                                            stroke={`${isDesktop ? '#26A8F4' : '#000'}`}
                                                            strokeWidth="1.5"
                                                            strokeMiterlimit="10"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>

                                                    <span className="inline !cursor-pointer text-black opacity-100 duration-100 group-hover:inline group-hover:opacity-100 dark:text-white-light lg:text-[#2D70E1]">
                                                        Log Out
                                                    </span>
                                                </button>
                                                                </li>*/}
                                        </ul>
                                    </>
                                )}
                            </div>
                        </div>
                        {/********* Modify this sidebar ******************************/}

                        {/*<div className="logout h-[100%] bg-white dark:bg-black lg:h-[10%]">

                                                                </div>*/}
                    </nav>
                </>
            )}
        </div>
    );
};

export default Sidebar;
// {
/* <PerfectScrollbar className="relative h-[calc(100vh-270px)]">
<ul className="relative space-y-3 p-4 py-0 font-semibold">
    <li className="menu nav-item">
        <button type="button" className={`${currentMenu === 'dashboard' ? 'active' : ''} nav-link active group w-full`} onClick={() => toggleMenu('dashboard')}>
            <div className="flex items-center">
                <svg className="shrink-0 group-hover:!text-primary" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        opacity="0.5"
                        d="M2 12.2039C2 9.91549 2 8.77128 2.5192 7.82274C3.0384 6.87421 3.98695 6.28551 5.88403 5.10813L7.88403 3.86687C9.88939 2.62229 10.8921 2 12 2C13.1079 2 14.1106 2.62229 16.116 3.86687L18.116 5.10812C20.0131 6.28551 20.9616 6.87421 21.4808 7.82274C22 8.77128 22 9.91549 22 12.2039V13.725C22 17.6258 22 19.5763 20.8284 20.7881C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.7881C2 19.5763 2 17.6258 2 13.725V12.2039Z"
                        fill="currentColor"
                    />
                    <path
                        d="M9 17.25C8.58579 17.25 8.25 17.5858 8.25 18C8.25 18.4142 8.58579 18.75 9 18.75H15C15.4142 18.75 15.75 18.4142 15.75 18C15.75 17.5858 15.4142 17.25 15 17.25H9Z"
                        fill="currentColor"
                    />
                </svg>
                <span className="text-black opacity-0 duration-300 group-hover:opacity-100 ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark md:opacity-100">
                    {t('Add Conversation')}
                </span>
            </div>

            <div className={currentMenu === 'dashboard' ? 'rotate-90' : 'rtl:rotate-180'}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        </button>

        <AnimateHeight duration={300} height={currentMenu === 'dashboard' ? 'auto' : 0}>
            <ul className="sub-menu text-black opacity-0 duration-300 group-hover:opacity-100 md:opacity-100">
                <li>
                    <button type="button" className="w-full" onClick={(e) => goToConversation(1)}>
                        {'Conversation 1 fffffffffffff'.length > 19 ? 'Conversation 1 fffffffffffff'.substring(0, 20).concat('...') : 'Conversation 1'}
                    </button>
                </li>
                <li>
                    <button type="button" className="w-full" onClick={(e) => goToConversation(2)}>
                        {'Conversation 2 qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq'.length > 17
                            ? 'Conversation 2 qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq'.substring(0, 18).concat('...')
                            : 'Conversation 2'}
                    </button>
                </li>
            </ul>
        </AnimateHeight>
    </li>

    <li className="menu nav-item ">
        <button type="button" className={`${currentMenu === 'component' ? 'active' : ''} nav-link active group w-full `} onClick={() => toggleMenu('component')}>
            <div className="flex items-center">
                <svg className="shrink-0 group-hover:!text-primary" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M8.42229 20.6181C10.1779 21.5395 11.0557 22.0001 12 22.0001V12.0001L2.63802 7.07275C2.62423 7.09491 2.6107 7.11727 2.5974 7.13986C2 8.15436 2 9.41678 2 11.9416V12.0586C2 14.5834 2 15.8459 2.5974 16.8604C3.19479 17.8749 4.27063 18.4395 6.42229 19.5686L8.42229 20.6181Z"
                        fill="currentColor"
                    />
                    <path
                        opacity="0.7"
                        d="M17.5774 4.43152L15.5774 3.38197C13.8218 2.46066 12.944 2 11.9997 2C11.0554 2 10.1776 2.46066 8.42197 3.38197L6.42197 4.43152C4.31821 5.53552 3.24291 6.09982 2.6377 7.07264L11.9997 12L21.3617 7.07264C20.7564 6.09982 19.6811 5.53552 17.5774 4.43152Z"
                        fill="currentColor"
                    />
                    <path
                        opacity="0.5"
                        d="M21.4026 7.13986C21.3893 7.11727 21.3758 7.09491 21.362 7.07275L12 12.0001V22.0001C12.9443 22.0001 13.8221 21.5395 15.5777 20.6181L17.5777 19.5686C19.7294 18.4395 20.8052 17.8749 21.4026 16.8604C22 15.8459 22 14.5834 22 12.0586V11.9416C22 9.41678 22 8.15436 21.4026 7.13986Z"
                        fill="currentColor"
                    />
                </svg>
                <span className="text-black opacity-0 duration-300 group-hover:opacity-100 ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark md:opacity-100">
                    {t('Add Prompte')}
                </span>
            </div>

            <div className={`${currentMenu === 'component' ? 'rotate-90' : 'rtl:rotate-180'} `}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        </button>

        <AnimateHeight duration={300} height={currentMenu === 'component' ? 'auto' : 0}>
            <ul className="sub-menu  text-black opacity-0 duration-300 group-hover:opacity-100 md:opacity-100">
                <li>
                    <Link href="/components/tabs">{t('Oussama')}</Link>
                </li>
                <li>
                    <Link href="/components/accordions">{t('Ahmed')}</Link>
                </li>
                <li>
                    <Link href="/components/modals">{t('Younsse')}</Link>
                </li>
            </ul>
        </AnimateHeight>
    </li>
</ul>
</PerfectScrollbar> */
// }
