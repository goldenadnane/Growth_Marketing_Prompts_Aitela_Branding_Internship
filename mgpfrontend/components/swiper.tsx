'use client';
import themeConfig from '@/theme.config';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/scrollbar';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function PromptSwiper({ ...props }) {
    const breakpoints = {
        1024: {
            slidesPerView: 3,
            spaceBetween: 30,
        },
        768: {
            slidesPerView: 2,
            spaceBetween: 40,
        },
        320: {
            slidesPerView: 1,
            spaceBetween: 20,
        },
    };
    const items = props.data;
    return (
        <>
            <div className="swiper" id="slider5">
                <div className="swiper-wrapper">
                    <Swiper
                        modules={[Navigation, Pagination]}
                        slidesPerView={1}
                        spaceBetween={30}
                        loop={true}
                        pagination={{
                            clickable: true,
                            type: 'fraction',
                        }}
                        navigation={{
                            nextEl: '.swiper-button-next-ex4',
                            prevEl: '.swiper-button-prev-ex4',
                        }}
                        breakpoints={breakpoints}
                        dir={themeConfig.rtlClass}
                        key={themeConfig.rtlClass === 'rtl' ? 'true' : 'false'}
                    >
                        {items?.map((item: any) => {
                            return (
                                <SwiperSlide key={item.id}>
                                    <button className={`${props.class}`} key={item.id}>
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
                            stroke="black"
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
                                stroke="black"
                                strokeWidth="1.5"
                                strokeMiterlimit="10"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </g>
                    </svg>
                </button>
            </div>
        </>
    );
}
