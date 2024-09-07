import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { type } from 'os';
import { UsermonthlycountType, ConversationmonthlycountType, WordsmonthlycountType, SpentmonthlycountType } from '@/type';
import { replace } from 'lodash';
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});

type usersTotal = {
    month: number;
    totalusers: number;
};

type ConvoTotal = {
    month: number;
    totalconversations: number;
};

type MessageTotal = {
    month: number;
    totalmessages: number;
};

type RevenuTotal = {
    month: number;
    total: number;
};

type TCard = {
    title: string;
    total: number;
    percent: number;
    data: number[];
    numberOfMonth: (MessageTotal | ConvoTotal | usersTotal | RevenuTotal)[];
};

const Card = ({ title, total, data, percent, numberOfMonth }: TCard) => {
    const [isMounted, setIsMounted] = useState(false);
    const [chartData, setChartData] = useState<(number | undefined)[]>([]);

    const MonthChart = numberOfMonth.map((item) => item.month);

    //Get Month
    const today = new Date();
    const currentMonth = today.getMonth() - 1;
    const currentYear = today.getFullYear();

    function getLastDayOfMonth(year: number, month: number) {
        return new Date(year, month + 1, 0).getDate();
    }

    const monthNames = new Intl.DateTimeFormat('en-US', { month: 'short' });

    const datesOfMonth = [];
    for (let day = 1; day <= getLastDayOfMonth(currentYear, currentMonth); day++) {
        const formattedDate = `${day.toString().padStart(2, '0')} ${monthNames.format(new Date(currentYear, currentMonth, day))}`;
        datesOfMonth.push(formattedDate);
    }

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // totalVisitOptions
    const totalVisit: any = {
        series: [{ data: data }],
        options: {
            chart: {
                height: 58,
                type: 'line' as 'line',
                fontFamily: 'Nunito, sans-serif',
                sparkline: {
                    enabled: true,
                },
                dropShadow: {
                    enabled: true,
                    blur: 2,
                    color: '#676a6b',
                    opacity: 0.8,
                },
            },
            stroke: {
                curve: 'smooth',
                width: 1,
            },
            grid: {
                padding: {
                    top: 5,
                    bottom: 5,
                    left: 5,
                    right: 5,
                },
            },
            tooltip: {
                x: {
                    show: true,
                },
                y: {
                    title: {
                        formatter: () => {
                            return '';
                        },
                    },
                },
            },
            xaxis: {
                categories: MonthChart,
            },
            colors: ['#26A8F4'],
            fill: {
                type: 'gradient',
                gradient: {
                    shade: 'light',
                    type: 'vertical',
                    shadeIntensity: 0.5,
                    gradientToColors: ['#26A8F4'],
                    inverseColors: true,
                    opacityFrom: 1,
                    opacityTo: 0.8,
                    stops: [0, 100],
                },
            },
        },
    };

    return (
        <>
            <div className="panel flex h-full flex-col justify-between space-y-2">
                {/* Total Users */}
                <div className="flex justify-start space-x-0 dark:text-white-light lg:space-x-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="44" height="38" viewBox="0 0 44 38" fill="none" className="hidden lg:block">
                        <g opacity="0.3">
                            <ellipse cx="21.0867" cy="16.9598" rx="16.087" ry="16.0908" fill="#436CFF" />
                            <ellipse cx="2.41304" cy="3.28263" rx="2.41304" ry="2.41361" fill="#436CFF" />
                        </g>
                    </svg>
                    <h5 className="text-base font-semibold text-[#888ea8] dark:text-[#888ea8] md:text-lg lg:text-xl lg:text-[#000]">{title}</h5>
                </div>
                <div className="grid sm:grid-cols-2">
                    <div className="flex items-end self-center text-xl font-bold text-[#1A202C] dark:text-white-light md:text-2xl ">{total}</div>
                    <div className="flex items-center">{isMounted && <ReactApexChart series={totalVisit.series} options={totalVisit.options} type="line" height={58} width={'100%'} />}</div>
                </div>
                <div className="flex items-center text-[#1A202C]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                        <path
                            d="M15.4316 3.52283L14.4444 3.52283L10.5555 3.52283L9.56835 3.52283C8.28203 3.52283 7.48058 4.91818 8.12871 6.02928L11.0603 11.0549C11.7035 12.1574 13.2965 12.1574 13.9396 11.0549L16.8712 6.02928C17.5193 4.91818 16.7179 3.52283 15.4316 3.52283Z"
                            fill="#26A8F4"
                        />
                        <path
                            opacity="0.4"
                            d="M4.16927 16.0485L5.15643 16.0485L9.04532 16.0485L10.0325 16.0485C11.3188 16.0485 12.1203 14.6531 11.4721 13.542L8.54051 8.5164C7.89738 7.41389 6.30438 7.41389 5.66125 8.5164L2.72964 13.542C2.0815 14.6531 2.88295 16.0485 4.16927 16.0485Z"
                            fill="#26A8F4"
                        />
                    </svg>

                    <p className="font-bold dark:text-white-light ">
                        <span className=" text-[#26A8F4]">+{percent}% </span> from last month
                    </p>
                </div>
            </div>
        </>
    );
};

export default Card;
