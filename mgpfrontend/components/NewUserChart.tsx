import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useMediaQuery } from './hooks/useMediaQuery';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});

type LastMonthData = {
    id: number;
    prompt_text: string;
    used: string;
    status: boolean;
    goal: string;
};

type bestprops = {
    dataTables: LastMonthData[];
};

const NewUserChart = ({ dataTables }: bestprops) => {
    const [isMounted, setisMounted] = useState(true);
    const dataused = dataTables.map((prompt) => prompt.used);
    const numberArray = dataused.map((str) => parseInt(str, 10));
    console.log('prom', numberArray);
    const dataGoal = dataTables.map((prompt) => prompt.goal);

    const isDesktop = useMediaQuery('(min-width: 1024px)');

    console.log('promhat', dataGoal);

    const columnChart: any = {
        series: [
            {
                name: 'Used',
                data: numberArray,
            },
        ],
        options: {
            chart: {
                height: 300,
                width: '100%',
                type: 'bar',
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },
            colors: ['#CBD5FF'],
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
                categories: dataGoal,
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
                <div className="lg:panel !mt-0">
                    <ReactApexChart series={columnChart.series} options={columnChart.options} className="rounded-lg bg-white p-0 dark:bg-black" type="bar" height={300} width={'100%'} />
                </div>
            )}
        </>
    );
};

export default NewUserChart;
