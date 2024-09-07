import React, { useState } from 'react';
import dynamic from 'next/dynamic';

import { useMediaQuery } from './hooks/useMediaQuery';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});

type BestPromptData = {
    id: number;
    prompt_prompt_text: string;
    prompt_used: string;
    category_name: string;
    prompt_goal: string;
};

type bestprops = {
    dataTables: BestPromptData[];
};

const BestUsersChart = ({ dataTables }: bestprops) => {
    const [isMounted, setisMounted] = useState(true);
    const dataused = dataTables.map((prompt) => prompt.prompt_used);
    const numberArray = dataused.map((str) => parseInt(str, 10));
    console.log('love', numberArray);
    const dataGoal = dataTables.map((prompt) => prompt.prompt_goal);

    console.log('hate', dataGoal);

    const isDesktop = useMediaQuery('(min-width: 1024px)');

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
                <>
                    <h1 className="text-lg font-semibold md:text-xl lg:text-2xl">Best Used Prompts</h1>
                    <div className="lg:panel !mt-2   p-0">
                        <ReactApexChart
                            series={columnChart.series}
                            options={columnChart.options}
                            className="overflow-x-scroll rounded-lg bg-white dark:bg-black"
                            type="bar"
                            height={isDesktop ? 300 : 200}
                            width={'100%'}
                        />
                    </div>
                </>
            )}
        </>
    );
};

export default BestUsersChart;
