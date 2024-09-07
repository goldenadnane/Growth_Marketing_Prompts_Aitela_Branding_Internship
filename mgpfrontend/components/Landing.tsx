import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import React, { useEffect, useState, Fragment } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import themeConfig from '@/theme.config';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper';
import image1 from '../public/id1.png';
import image2 from '../public/id2.png';
import image3 from '../public/id3.png';
import image4 from '../public/id4.png';
import image5 from '../public/id5.png';
import image6 from '../public/id6.png';
import imageLanding from '../public/assets/images/landing.jpg';
import Subscription from '@/pages/main/subscription';
import { url } from 'inspector';
import { Tab } from '@headlessui/react';
import api from '@/api';
import Plan from './Plan';

const Landing = () => {
    const [plans, setPlans] = useState<plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [uniquePaymentCycles, setUniquePaymentCycles] = useState<any[]>([]);
    const [billPlan, setBillPlan] = useState<string>('month');
    const [home, setHome] = useState<any>({
        id: 1,
        title: '',
        title_background: '',
        slide_1_text: '',
        slide_1_img: '',
        slide_1_description: '',
        slide_2_text: '',
        slide_2_img: '',
        slide_2_description: '',
        slide_3_text: '',
        slide_3_img: '',
        slide_3_description: '',
    });

    const toggleBillPlan = () => {
        // Utilisez simplement une string pour billPlan
        setBillPlan(billPlan === 'month' ? 'year' : 'month');
    };

    // const plans = [
    //     {
    //         name: 'Easy',
    //         description: 'All the basics for businesses that are just getting started.',
    //         price: {
    //             monthly: 29,
    //             annually: 29 * 12 - 199,
    //         },
    //         features: ['One project', 'Your dashboard'],
    //     },
    //     {
    //         name: 'Basic',
    //         description: 'Better for growing businesses that want more customers.',
    //         price: {
    //             monthly: 59,
    //             annually: 59 * 12 - 100,
    //         },
    //         features: ['Two projects', 'Your dashboard', 'Components included', 'Advanced charts'],
    //     },
    //     {
    //         name: 'Custom',
    //         description: 'Advanced features for pros who need more customization.',
    //         price: {
    //             monthly: 139,
    //             annually: 139 * 12 - 100,
    //         },
    //         features: ['Unlimited projects', 'Your dashboard', '+300 Components', 'Chat support'],
    //     },
    // ];

    // const uniquePaymentCycles = [...new Set(plans.map((plan) => plan.payment_cycle))];

    const fetchPlans = async () => {
        await api
            .get(`${process.env.NEXT_PUBLIC_BASE_URL}/plans/all`)
            .then((res) => {
                if (res.status === 200) {
                    setPlans(res.data);
                    setUniquePaymentCycles([...new Set(res.data.map((plan: any) => plan.payment_cycle))]);
                    setLoading(false);
                }
            })
            .catch((err) => new Error(err));
    };

    useEffect(() => {
        fetchPlans();
    }, []);
    // Read This : This component is full reponsive (You can Virify)

    const CardList = [
        {
            id: 1,
            image: image1,
            Title: 'Blog Content',
            Description:
                'In the digital age, blogs have become a powerful medium for individuals and businesses to share their thoughts, expertise, and stories with the world. The success of a blog hinges on its content, which must be compelling',
        },
        {
            id: 1,
            image: image2,
            Title: 'Digital Ad Mgp',
            Description:
                "In today's hyper-connected world, digital advertising has emerged as a driving force behind marketing strategies for businesses and brands of all sizes. With the vast array of online platforms and tools available",
        },
        {
            id: 1,
            image: image3,
            Title: 'E commerce Mgp',
            Description:
                'In the fast-paced digital era, e-commerce has emerged as a game-changer, reshaping the way businesses interact with consumers. To stay competitive and relevant in this dynamic landscape,',
        },
        {
            id: 1,
            image: image4,
            Title: 'Sales Mgp',
            Description: 'Salesmanship, the age-old practice of persuading and convincing customers to make a purchase, remains an essential cornerstone of business success.',
        },
        {
            id: 1,
            image: image5,
            Title: 'Social Media Mgp',
            Description: 'In the digital age, social media has become an indispensable part of modern life, reshaping the way individuals connect and businesses interact with their audiences.',
        },
        { id: 1, image: image6, Title: 'Website Mgp', Description: "In the digital era, a business's website serves as its virtual storefront, the first point of contact with potential customers." },
    ];

    const signUpWithGoogle = async () => {
        //  axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/google/callback`)
        // window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/google/callback`;
        window.open(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/google/callback`, '_blank');
    };

    useEffect(() => {
        api.get('/home/1')
            .then((res) => setHome(res.data))
            .catch((err) => console.log(err));
    });

    return (
        <>
            <div className="grid grid-cols-1 gap-4">
                <div className="h-[95vh] w-full">
                    <div
                        style={{
                            backgroundImage: `url(/assets/uploads/${home.title_background})`,
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: '100% 100%',
                            position: 'relative',
                            backgroundPositionX: 'center',
                            backgroundPositionY: 'center',
                        }}
                        className="grid h-full grid-cols-1 gap-0 px-8 py-12  sm:p-11 lg:gap-8 lg:p-16 xl:p-24 2xl:p-28"
                    >
                        <div className="image-overlay"></div>
                        <div className="grid-rows-auto z-10  grid items-center justify-center px-0 xl:px-24 2xl:px-52">
                            <div className=" flex flex-wrap items-center justify-center">
                                <div className=" my-2 w-full ">
                                    <p className="text-center text-xl font-bold text-white xs:text-3xl sm:text-4xl md:text-5xl  2xl:text-6xl">
                                        {home.title}
                                        {/* <span className="text-xl font-bold text-yellow-500 xs:text-3xl sm:text-4xl md:text-5xl lg:text-[#26A8F4] 2xl:text-6xl">
                                            {' '}
                                            AI content generator that delivers premium results in seconds.
                                        </span> */}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className=" grid-rows-auto z-10  mt-2 grid items-center justify-center">
                            <p className="text-center  text-base font-bold text-white 2xs:text-xl sm:text-2xl lg:text-2xl 2xl:text-4xl ">
                                Get your <span className=" text-base font-bold text-yellow-500 2xs:text-xl sm:text-2xl lg:text-2xl 2xl:text-4xl"> free account today</span>
                            </p>
                        </div>
                        <div className=" z-10 mt-5">
                            <div className="flex flex-col items-center space-x-0 space-y-5 lg:flex-row lg:flex-wrap lg:justify-center lg:space-x-10  lg:space-y-0">
                                <button className="w-5/6 rounded-3xl bg-sky-500 py-2 text-xs  font-semibold text-white xs:text-base 2xs:w-3/6 sm:h-[60px]  sm:w-3/6 sm:text-xl md:w-3/6 lg:h-14 lg:w-72 lg:justify-around lg:text-xl xl:w-72 xl:text-xl 2xl:h-16">
                                    <Link href={'/auth/register'} className="flex  flex-wrap items-center justify-evenly ">
                                        Sign up with email{' '}
                                        <svg width="30" height="30" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M18.6384 7.65967L26.4788 15.5001L18.6384 23.3405M4.52051 15.5001H26.2593"
                                                stroke="white"
                                                strokeWidth="1.5"
                                                strokeMiterlimit="10"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </Link>
                                </button>{' '}
                                <div className="hidden text-center text-3xl font-semibold text-white lg:block">
                                    <p>or</p>{' '}
                                </div>
                                <button
                                    onClick={() => signUpWithGoogle()}
                                    className="flex w-5/6 items-center justify-evenly rounded-3xl border border-white py-2  text-xs font-semibold text-white xs:text-base 2xs:w-3/6 sm:h-[60px]  sm:w-3/6 sm:text-xl md:w-3/6 lg:h-14 lg:w-72 lg:justify-around lg:text-xl xl:w-72 xl:text-xl 2xl:h-16"
                                >
                                    <Image src="/google.svg" width={30} height={30} alt="" /> Sign up with Google
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="my-1 h-full bg-[#f9f9f9]  lg:px-10 lg:py-5">
                    <div className="swiper relative bg-[#f2f2f2]   lg:rounded-lg " id="slider4">
                        <div className="swiper-wrapper">
                            <Swiper
                                className="flex flex-col items-center justify-between"
                                modules={[Navigation, Pagination]}
                                slidesPerView={1}
                                spaceBetween={30}
                                loop={true}
                                navigation={{
                                    nextEl: '.swiper-button-next-ex4',
                                    prevEl: '.swiper-button-prev-ex4',
                                }}
                                dir={themeConfig.rtlClass}
                            >
                                <SwiperSlide>
                                    <img src={`/assets/uploads/${home.slide_1_img}`} className="h-full w-full bg-cover bg-center" alt="slide1" />
                                    <div className="image-overlay"></div>
                                    <div className="absolute left-1/2 top-1/2 z-[999] w-full -translate-x-1/2 -translate-y-1/2 px-14 text-white sm:px-24 md:px-32 lg:px-44">
                                        <div className=" my-3 text-sm font-bold xs:text-base 2xs:text-xl sm:mb-8 sm:text-3xl lg:text-4xl xl:text-5xl">{home.slide_1_text}</div>
                                        <div className="mb-4 text-xs font-medium 2xs:text-base md:text-lg lg:text-xl xl:pr-14 2xl:pr-[45rem]">{home.slide_1_description}</div>
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <img src={`/assets/uploads/${home.slide_2_img}`} className="h-full w-full bg-cover bg-center" alt="slide2" />
                                    <div className="image-overlay"></div>
                                    <div className="absolute left-1/2 top-1/2 z-[999] w-full -translate-x-1/2 -translate-y-1/2 px-14 text-white sm:px-24 md:px-32 lg:px-44">
                                        <div className=" my-3 text-sm font-bold xs:text-base 2xs:text-xl sm:mb-8 sm:text-3xl lg:text-4xl xl:text-5xl">{home.slide_2_text}</div>
                                        <div className="mb-4 text-xs font-medium 2xs:text-base md:text-lg lg:text-xl xl:pr-14 2xl:pr-[45rem]">{home.slide_2_description}</div>
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <img src={`/assets/uploads/${home.slide_3_img}`} className="h-full w-full bg-cover bg-center" alt="slide3" />
                                    <div className="image-overlay"></div>
                                    <div className="absolute left-1/2 top-1/2 z-[999] w-full -translate-x-1/2 -translate-y-1/2 px-14 text-white sm:px-24 md:px-32 lg:px-44">
                                        <div className=" my-3 text-sm font-bold xs:text-base 2xs:text-xl sm:mb-8 sm:text-3xl lg:text-4xl xl:text-5xl">{home.slide_3_text}</div>
                                        <div className="mb-4 text-xs font-medium 2xs:text-base md:text-lg lg:text-xl xl:pr-14 2xl:pr-[45rem]">{home.slide_3_description}</div>
                                    </div>
                                </SwiperSlide>
                            </Swiper>
                        </div>
                        <button className="swiper-button-prev-ex4 absolute left-2 top-1/2 z-[999] grid -translate-y-1/2 place-content-center rounded-full border border-white p-1 text-white transition hover:border-white hover:bg-black hover:text-white lg:left-8">
                            <svg className="relative h-4 w-4 md:h-8 md:w-8 lg:h-10 lg:w-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M14.9998 19.92L8.47984 13.4C7.70984 12.63 7.70984 11.37 8.47984 10.6L14.9998 4.07996"
                                    stroke="white"
                                    strokeWidth="1.5"
                                    strokeMiterlimit="10"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>

                        <button className="swiper-button-next-ex4 absolute right-2 top-1/2 z-[999] grid -translate-y-1/2 place-content-center rounded-full border border-white p-1 text-white transition hover:border-white hover:bg-black hover:text-white lg:right-8">
                            <svg className="relative h-4 w-4 md:h-8 md:w-8 lg:h-10 lg:w-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    id="Vector"
                                    d="M8.91016 19.92L15.4302 13.4C16.2002 12.63 16.2002 11.37 15.4302 10.6L8.91016 4.07996"
                                    stroke="white"
                                    strokeWidth="1.5"
                                    strokeMiterlimit="10"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="mt-10 w-full  bg-stone-50  py-3">
                    <div className="flex items-center justify-center" id="cases">
                        <h1 className="mb-1 text-center text-sm font-bold text-gray-900 xs:text-base 2xs:text-xl sm:text-3xl lg:mb-16 lg:text-4xl xl:text-5xl">MGP.AI helps</h1>
                    </div>
                    <div className="grid  grid-cols-1 gap-4  px-5 sm:grid-cols-2 sm:px-[10%] lg:grid-cols-3 lg:px-[15%]">
                        {CardList.map((item, i) => {
                            return (
                                <div className=" my-9 w-full rounded border border-white-light bg-white shadow-[4px_6px_10px_-3px_#bfc9d4]" key={i}>
                                    <div className="px-6 py-7">
                                        <div className="-mx-6 -mt-7 mb-7 h-[215px] overflow-hidden rounded-tl rounded-tr">
                                            <Image src={item.image} loading="eager" alt="cover" className="h-full w-full object-cover" />
                                        </div>
                                        <h5 className="mb-4 text-xl font-semibold  text-sky-500">{item.Title}</h5>
                                        <p className="text-justify text-white-dark">{item.Description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className=" mb-8 h-full bg-stone-50 py-2">
                    <div className="text-center">
                        <h1 className="mb-4 text-2xl font-normal md:text-3xl lg:text-4xl" id="Pricing">
                            Our <span className="font-semibold">plans</span> for your <span className="font-semibold">strategies</span>
                        </h1>
                        <p className="text-sm font-normal text-gray-400">See below our main three plans for your business, for your startup and agency.</p>
                        <p className="text-sm font-normal text-gray-400">It starts from here! You can teach yourself what you really like.</p>
                    </div>

                    {/* Plan switch */}
                    <div className="mt-10 flex items-center justify-center space-x-4">
                        <span className="text-base font-medium">Bill Monthly</span>
                        <button className="relative rounded-full " onClick={toggleBillPlan}>
                            <div className="h-8 w-16 rounded-full bg-indigo-500 shadow-md outline-none transition"></div>
                            <div
                                className={`absolute left-1 top-1 inline-flex h-6 w-6 transform items-center justify-center rounded-full bg-white shadow-sm transition-all duration-200 ease-in-out ${
                                    billPlan === 'month' ? 'translate-x-0' : 'translate-x-8'
                                }`}
                            ></div>
                        </button>
                        <span className="text-base font-medium">Bill Annually</span>
                    </div>
                    {!loading && (
                        <div className="min-h-[72vh]">
                            <div className="mx-auto mt-8 grid min-h-[72vh] w-[85%] grid-cols-1 gap-x-11 gap-y-6 sm:w-[65%] lg:w-[95%] lg:grid-cols-3  xl:w-[85%]">
                                {plans
                                    ?.filter((tabPlan) => tabPlan.payment_cycle === billPlan)
                                    ?.map((plan, i) => (
                                        <Plan key={i} plan={plan} />
                                    ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Landing;
