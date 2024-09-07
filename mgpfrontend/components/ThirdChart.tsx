import React, { useState } from 'react';
import dynamic from 'next/dynamic';

import { useMediaQuery } from './hooks/useMediaQuery';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});

type TopSpentData = {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    spent: number;
};

type bestprops = {
    dataTables: TopSpentData[];
};

const ThirdChart = ({ dataTables }: bestprops) => {
    const [isMounted, setisMounted] = useState(true);
    const dataspent = dataTables.map((topspent) => topspent.spent);
    console.log('spent', dataspent);
    const dataLastname = dataTables.map((topspent) => topspent.lastname);

    console.log('last name', dataLastname);

    const isDesktop = useMediaQuery('(min-width: 1024px)');

    const columnChart: any = {
        series: [
            {
                name: 'Spent',
                data: dataspent,
            },
        ],
        options: {
            chart: {
                height: 300,
                type: 'bar',
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },
            colors: ['#00AB55'],
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent'],
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '44%',
                    endingShape: 'rounded',
                },
            },
            grid: {
                // borderColor: isDark ? '#191e3a' : '#e0e6ed',
            },
            xaxis: {
                categories: dataLastname,
                axisBorder: {
                    // color: isDark ? '#191e3a' : '#e0e6ed',
                },
            },
            yaxis: {
                // opposite: isRtl ? true : false,
                labels: {
                    // offsetX: isRtl ? -10 : 0,
                },
            },
            tooltip: {
                // theme: isDark ? 'dark' : 'light',
                y: {
                    formatter: function (val: any) {
                        return val;
                    },
                },
            },
        },
    };
    return (
        <>
            {isMounted && (
                <div className="lg:panel !mt-0 ">
                    <ReactApexChart
                        className=" overflow-auto rounded-lg bg-white dark:bg-black"
                        series={columnChart.series}
                        options={columnChart.options}
                        type="bar"
                        height={isDesktop ? 300 : 200}
                        width={'100%'}
                    />
                </div>
            )}
        </>
    );
};

export default ThirdChart;
