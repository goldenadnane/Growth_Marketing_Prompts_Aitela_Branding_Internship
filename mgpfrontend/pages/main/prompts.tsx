import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { useMediaQuery } from '@/components/hooks/useMediaQuery';
import Dropdown from '@/components/Dropdown';
import themeConfig from '@/theme.config';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper';
import AnimateHeight from 'react-animate-height';
import api from '@/api';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/scrollbar';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Prompt from '@/components/slider';
import { faC } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import SavedPrompts from '@/components/Chat/AddPromptsSaved';
import { DataTable } from 'mantine-datatable';

interface ItemType {
    prompt_goal: string;
}

export default function Prompts() {
    const addSavedprompt = useSelector((state: IRootState) => state?.auth.addSavedprompt);
    const [mounted, setMounted] = useState(false);
    const [items, setcategories] = useState<any>([]);
    const [subitem, setsubcategories] = useState<any>([]);
    const [prompts, setPrompts] = useState<any>([]);
    const [search, setSearch] = useState<string>('');
    const [categoriesActive, setCategoriesActive] = useState<string>('1');
    const [subCategoriesActive, setSubCategoriesActive] = useState<string>('1');
    const [user, setUser] = useState<any>({});
    const isDesktop = useMediaQuery('(min-width: 1024px)');
    const ApiUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [20, 30, 50, 100, 200];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const filteredItems = prompts?.filter((item: ItemType) => (search === '' ? item : item.prompt_goal.toLowerCase().includes(search.toLowerCase())));
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    const records = filteredItems.slice(from, to);
    const authSelector: any = useSelector((state: IRootState) => state?.auth);

    const toggleCategories = (value: string) => {
        setCategoriesActive((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };

    const toggleSubCategories = (value: string) => {
        setSubCategoriesActive((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };

    // Fetch user By id
    const fetchUserById = async () => {
        try {
            const response = await api.get(`${ApiUrl}/users/${authSelector?.value?.user?.id}`);
            if (response.status === 200) {
                setUser(response.data);
                console.log('user: ', response.data.plan);
            }
        } catch (error) {
            console.error('Failed to fetch Users', error);
        }
    };

    const getAll = async () => {
        setcategories([]);
        setsubcategories([]);
        setPrompts([]);
        console.log('prompt page : ', user.plan);
        try {
            if (user.plan) {
                await api.get(`${process.env.NEXT_PUBLIC_BASE_URL}/categories/all`).then((res) => {
                    if (res.status === 200) {
                        setcategories(res.data);
                        // console.log(res.data);
                    }
                });
                await api.get(`${process.env.NEXT_PUBLIC_BASE_URL}/subcategories/all`).then((res) => {
                    if (res.status === 200) {
                        setsubcategories(res.data);
                    }
                });
                await api.get(`${process.env.NEXT_PUBLIC_BASE_URL}/prompts/all`).then((res) => {
                    if (res.status === 200) setPrompts(res.data);
                    // console.log(res.data);
                });
            } else {
                await api.get(`${process.env.NEXT_PUBLIC_BASE_URL}/categories/categories/free`).then((res) => {
                    if (res.status === 200) {
                        setcategories(res.data);
                        // console.log(res.data);
                    }
                });

                await api.get(`${process.env.NEXT_PUBLIC_BASE_URL}/prompts/prompts/free`).then((res) => {
                    if (res.status === 200) {
                        const newSubCategories = res.data.map((subcat: any) => ({ id: subcat.prompt_id_subcategory, name: subcat.subcategory_name }));
                        // Filter unique subcategories based on both id and name
                        const uniqueSubCategories = newSubCategories.filter((subcat: any, index: any, self: any) => self.findIndex((s: any) => s.id === subcat.id && s.name === subcat.name) === index);
                        const newPrompts = res.data.map((free: any) => ({ prompt_id: free.prompt_id, prompt_goal: free.prompt_goal }));
                        setsubcategories((prev: any) => [...uniqueSubCategories]);
                        setPrompts((prevPrompts: any) => [...newPrompts]);
                        // console.log(res.data);
                    }
                });
            }
        } catch (err) {
            console.log(err);
        }
    };

    const getFavourite = async () => {
        setcategories([]);
        setsubcategories([]);
        try {
            await api.get(`${process.env.NEXT_PUBLIC_BASE_URL}/prompts/prompts/savedprompts`).then((res) => {
                if (res.status === 200) {
                    console.log('old', res.data);
                    const newPrompts = res.data.map((fav: any) => ({
                        prompt_id: fav.id,
                        prompt_goal: fav.content || fav.prompt.goal,
                        prompt_prompt_text: fav?.prompt?.prompt_text,
                        promptId: fav?.prompt?.id,
                    }));
                    console.log('new', newPrompts);

                    setPrompts((prevPrompts: any) => [...newPrompts]);

                    // console.log(prompts);
                }
            });
        } catch (err) {
            // console.log(err);
        }
    };

    const getsubcategoriesbycategoriesId = async (id: number) => {
        setsubcategories([]);
        try {
            await api.get(`${process.env.NEXT_PUBLIC_BASE_URL}/subcategories/bycategory/${id}`).then((res) => {
                if (res.status === 200) {
                    res.data.length > 0 && setsubcategories([...res.data]);
                    console.log(res.data);
                }
            });
        } catch (err) {
            // console.log(err);
        }
    };
    const getpromptbysubcategoriesId = async (id: number) => {
        try {
            await api.get(`${process.env.NEXT_PUBLIC_BASE_URL}/prompts/promptsBySubcategory/${id}`).then((res) => {
                if (res.status === 200) {
                    setPrompts([...res.data]);
                    console.log('prompts', res.data);
                }
            });
        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        fetchUserById();
    }, []);
    useEffect(() => {
        getAll();
        setMounted(true);
    }, [user]);

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    const breakpoints = {
        1024: {
            slidesPerView: 3,
            spaceBetween: 15,
        },
        768: {
            slidesPerView: 2,
            spaceBetween: 40,
        },
        320: {
            slidesPerView: 2,
            spaceBetween: 5,
        },
    };

    useEffect(() => {
        if (addSavedprompt) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
    }, [addSavedprompt]);

    if (!mounted) return <></>;
    return (
        <>
            {addSavedprompt && <SavedPrompts />}
            <div className="prompt mt-4 px-3 py-3 lg:px-10 ">
                <div className="prompt_div space-y-9">
                    <div className="relative flex h-12 w-full justify-center rounded-md border-none border-white-dark/20 dark:border-[#e5e7eb] lg:w-9/12">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="26" height="29" strokeWidth="1.5" stroke="currentColor" className=" absolute left-1 top-2">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>

                        <input
                            id="dropdownLeft"
                            type="text"
                            className="peer form-input h-full bg-white placeholder:tracking-wider ltr:pl-10 rtl:pr-12 dark:text-white"
                            placeholder="Search for a prompte"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        {!isDesktop && (
                            <div className="dropdown">
                                <Dropdown
                                    offset={[0, 5]}
                                    placement={`bottom-end`}
                                    btnClassName=" flex justify-center items-center  px-3 font-semibold border-none cursor-pointer py-2"
                                    button={
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-7 w-7">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                                            />
                                        </svg>
                                    }
                                >
                                    <ul className="!min-w-[170px]">
                                        <li>
                                            <button className="dark:text-white" type="button" onClick={() => (getAll(), setSearch(''))}>
                                                All
                                            </button>
                                        </li>
                                        <li>
                                            <button className="dark:text-white" type="button" onClick={() => getFavourite()}>
                                                Your Favourites
                                            </button>
                                        </li>
                                    </ul>
                                </Dropdown>
                            </div>
                        )}
                    </div>
                    {isDesktop && (
                        <div className="fillter_prompt">
                            <button className="btn_prompt" onClick={() => (getAll(), setSearch(''))}>
                                All
                            </button>
                            <button className="btn_prompt" onClick={() => getFavourite()}>
                                your favorit
                            </button>
                        </div>
                    )}
                </div>

                {!isDesktop ? (
                    <>
                        {items.length > 0 && (
                            <div className="mb-5 w-full">
                                <div className="space-y-2 font-semibold">
                                    <div className=" rounded border-none text-[#01212e]">
                                        <button
                                            type="button"
                                            className={`flex w-full items-center rounded-lg !bg-[#01212e] px-3 py-2 !text-white  dark:!bg-[#2a264e] `}
                                            onClick={() => toggleCategories('2')}
                                        >
                                            Categories
                                        </button>
                                        <div>
                                            <AnimateHeight duration={300} height={categoriesActive === '2' ? 'auto' : 0}>
                                                <div className="h-[25vh] overflow-scroll p-4 text-[13px] dark:border-[#1b2e4b]">
                                                    <ul className="space-y-1">
                                                        {items.map((item: any, index: any) => (
                                                            <li key={index}>
                                                                <button
                                                                    className=" w-full rounded-lg border border-[#01212e] px-3 py-2 text-left font-semibold dark:border-[#fff] dark:text-white"
                                                                    type="button"
                                                                    onClick={() => getsubcategoriesbycategoriesId(item.id)}
                                                                >
                                                                    {item.name}
                                                                </button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </AnimateHeight>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {subitem.length > 0 && (
                            <div className="mb-5 w-full">
                                <div className="space-y-2 font-semibold">
                                    <div className=" rounded border-none text-[#FBBC04]">
                                        <button type="button" className={`flex w-full items-center rounded-lg !bg-[#FBBC04] px-3 py-2  !text-white `} onClick={() => toggleSubCategories('2')}>
                                            Sub-categories
                                        </button>
                                        <div>
                                            <AnimateHeight duration={300} height={subCategoriesActive === '2' ? 'auto' : 0}>
                                                <div className=" h-[25vh] overflow-scroll p-4 text-[13px] dark:border-[#1b2e4b]">
                                                    <ul className="space-y-1">
                                                        {subitem.map((item: any, index: any) => (
                                                            <li key={index}>
                                                                <button
                                                                    className=" w-full rounded-lg border border-[#FBBC04] px-3 py-2 text-left font-semibold"
                                                                    type="button"
                                                                    onClick={() => getpromptbysubcategoriesId(item.id)}
                                                                >
                                                                    {item.name}
                                                                </button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </AnimateHeight>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        {items.length > 0 && (
                            <div className="swiper !mx-14 !mt-8 mb-7 !px-16" id="slider5">
                                <div className="swiper-wrapper">
                                    <Swiper
                                        className="flex items-center justify-center"
                                        modules={[Navigation, Pagination]}
                                        loop={true}
                                        navigation={{
                                            nextEl: '.swiper-button-next-ex4',
                                            prevEl: '.swiper-button-prev-ex4',
                                        }}
                                        breakpoints={breakpoints}
                                        dir={themeConfig.rtlClass}
                                    >
                                        {items?.map((item: any) => {
                                            return (
                                                <SwiperSlide className="" key={item.id}>
                                                    <button
                                                        className="btn_prompt_slider w-full dark:bg-[#2a264e] dark:text-white"
                                                        key={item.id}
                                                        onClick={() => getsubcategoriesbycategoriesId(item.id)}
                                                    >
                                                        {item.name}
                                                    </button>
                                                </SwiperSlide>
                                            );
                                        })}
                                    </Swiper>
                                </div>
                                <button className="swiper-button-prev-ex4 absolute top-1/2 z-[999] grid -translate-y-1/2 place-content-center rounded-full border border-primary p-1  text-primary transition hover:border-primary hover:bg-primary hover:text-white ltr:left-2 rtl:right-2">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M14.9998 19.92L8.47984 13.4C7.70984 12.63 7.70984 11.37 8.47984 10.6L14.9998 4.07996"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeMiterlimit="10"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </button>
                                <button className="swiper-button-next-ex4 absolute top-1/2 z-[999] grid -translate-y-1/2 place-content-center rounded-full border border-primary p-1  text-primary transition hover:border-primary hover:bg-primary hover:text-white ltr:right-2 rtl:left-2">
                                    <svg className="relative h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g id="Iconsax/Linear/arrowright2">
                                            <path
                                                id="Vector"
                                                d="M8.91016 19.92L15.4302 13.4C16.2002 12.63 16.2002 11.37 15.4302 10.6L8.91016 4.07996"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                strokeMiterlimit="10"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </g>
                                    </svg>
                                </button>
                            </div>
                        )}
                        {subitem.length !== 1 ? (
                            <div className="swiper !mx-4 !px-16" id="slider5">
                                <div className="swiper-wrapper ">
                                    <Swiper
                                        className="flex items-center justify-center"
                                        modules={[Navigation, Pagination]}
                                        slidesPerView={3}
                                        spaceBetween={15}
                                        loop={true}
                                        navigation={{
                                            nextEl: '.subswiper-button-next-ex4',
                                            prevEl: '.subswiper-button-prev-ex4',
                                        }}
                                        breakpoints={breakpoints}
                                        dir={themeConfig.rtlClass}
                                    >
                                        {subitem?.map((item: any) => {
                                            return (
                                                <SwiperSlide key={item.id}>
                                                    <button className="btn_SubCate_slider w-full dark:text-white" key={item.id} onClick={() => getpromptbysubcategoriesId(item.id)}>
                                                        {item.name}{' '}
                                                    </button>
                                                </SwiperSlide>
                                            );
                                        })}
                                    </Swiper>
                                </div>
                                <button className="subswiper-button-prev-ex4 absolute top-1/2 z-[999] grid -translate-y-1/2 place-content-center rounded-full border border-primary p-1  text-primary transition hover:border-primary hover:bg-primary hover:text-white ltr:left-2 rtl:right-2">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M14.9998 19.92L8.47984 13.4C7.70984 12.63 7.70984 11.37 8.47984 10.6L14.9998 4.07996"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeMiterlimit="10"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </button>
                                <button className="subswiper-button-next-ex4 absolute top-1/2 z-[999] grid -translate-y-1/2 place-content-center rounded-full border border-primary p-1  text-primary transition hover:border-primary hover:bg-primary hover:text-white ltr:right-2 rtl:left-2">
                                    <svg className="relative h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g id="Iconsax/Linear/arrowright2">
                                            <path
                                                id="Vector"
                                                d="M8.91016 19.92L15.4302 13.4C16.2002 12.63 16.2002 11.37 15.4302 10.6L8.91016 4.07996"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                strokeMiterlimit="10"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </g>
                                    </svg>
                                </button>
                            </div>
                        ) : (
                            subitem?.map((item: any) => {
                                return (
                                    <div key={item.id} className="swiper !mx-4 w-full !px-16" id="slider5">
                                        <button className="btn_SubCate_slider w-full dark:text-white" key={item.id} onClick={() => getpromptbysubcategoriesId(item.id)}>
                                            {item.name}
                                        </button>
                                        <button className="subswiper-button-prev-ex4 absolute top-1/2 z-[999] grid -translate-y-1/2 place-content-center rounded-full border border-primary p-1  text-primary transition hover:border-primary hover:bg-primary hover:text-white ltr:left-2 rtl:right-2">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M14.9998 19.92L8.47984 13.4C7.70984 12.63 7.70984 11.37 8.47984 10.6L14.9998 4.07996"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                    strokeMiterlimit="10"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </button>
                                        <button className="subswiper-button-next-ex4 absolute top-1/2 z-[999] grid -translate-y-1/2 place-content-center rounded-full border border-primary p-1  text-primary transition hover:border-primary hover:bg-primary hover:text-white ltr:right-2 rtl:left-2">
                                            <svg className="relative h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <g id="Iconsax/Linear/arrowright2">
                                                    <path
                                                        id="Vector"
                                                        d="M8.91016 19.92L15.4302 13.4C16.2002 12.63 16.2002 11.37 15.4302 10.6L8.91016 4.07996"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                        strokeMiterlimit="10"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </g>
                                            </svg>
                                        </button>
                                    </div>
                                );
                            })
                        )}
                    </>
                )}
                <Prompt prompt={records} />
                <div className="datatables pagination-padding">
                    <DataTable
                        minHeight={100}
                        columns={[]}
                        className="w-full"
                        records={records}
                        noRecordsText="No prompts found"
                        totalRecords={filteredItems?.length}
                        recordsPerPage={pageSize}
                        page={page}
                        onPageChange={(p) => setPage(p)}
                        recordsPerPageOptions={PAGE_SIZES}
                        onRecordsPerPageChange={setPageSize}
                        paginationText={({ from, to, totalRecords }) => `${isDesktop ? `Showing  ${from} to ${to} of ${totalRecords} entries` : `${from} - ${to} / ${totalRecords}`} `}
                    />
                </div>
            </div>
        </>
    );
}
