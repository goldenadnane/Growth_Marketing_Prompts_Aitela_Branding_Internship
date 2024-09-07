import Card from '@/components/AdminComp/Card';
import Tables from '@/components/AdminComp/Tables';
import { useMediaQuery } from '@/components/hooks/useMediaQuery';
import { useEffect, useState } from 'react';
import { UsermonthlycountType, ConversationmonthlycountType, WordsmonthlycountType, SpentmonthlycountType } from '@/type';
import api from '@/api';
type TInfotmation = {
    TotalUsers: number[];
    TotalConversation: number[];
    TotalWords: number[];
    TotalSpent: number[];
};

type PercentInfotmation = {
    PercentUsers: number;
    PercentConversation: number;
    PercentWords: number;
    PercentSpent: number;
};

type MonthInfotmation = {
    MonthUsers: number[];
    MonthConversation: number[];
    MonthWords: number[];
    MonthSpent: number[];
};
type ChartType = {
    Usermonthlycount: UsermonthlycountType;
    Conversationmonthlycount: ConversationmonthlycountType;
    Wordsmonthlycount: WordsmonthlycountType;
    Spentmonthlycount: SpentmonthlycountType;
};

type TDataTables = {
    BestUsedPrompts: [];
    LessUnusedPrompts: [];
    BestPromptsLastMonth: [];
    TopUsersSpending: [];
};

type TChartInfotmation = {
    TotalChartUsers: number[];
    TotalChartConversation: number[];
    TotalChartWords: number[];
    TotalChartSpent: number[];
};

const Dashboard = () => {
    const isDesktop = useMediaQuery('(min-width: 768px)');
    const [isLoading, setIsLoading] = useState(true);
    const [TotalIformation, setTotalInformation] = useState<TInfotmation>({
        TotalUsers: [],
        TotalConversation: [],
        TotalWords: [],
        TotalSpent: [],
    });
    const [TotalDataChart, setTotalDataChart] = useState<TChartInfotmation>({
        TotalChartUsers: [],
        TotalChartConversation: [],
        TotalChartWords: [],
        TotalChartSpent: [],
    });
    const [PercIformation, setPercInformation] = useState<PercentInfotmation>({
        PercentUsers: 0,
        PercentConversation: 0,
        PercentWords: 0,
        PercentSpent: 0,
    });

    const [MonthInformation, setMonthInformation] = useState<MonthInfotmation>({
        MonthUsers: [],
        MonthConversation: [],
        MonthWords: [],
        MonthSpent: [],
    });

    const [DataCards, setDataCards] = useState<ChartType>({
        Usermonthlycount: {
            totalUsers: 0,
            monthlyCounts: [
                {
                    month: 0,
                    totalusers: 0,
                },
            ],
        },
        Conversationmonthlycount: {
            totalConversations: 0,
            monthlyCounts: [
                {
                    month: 0,
                    totalconversations: 0,
                },
            ],
        },
        Wordsmonthlycount: {
            totalMessages: 0,
            monthlyCounts: [
                {
                    month: 0,
                    totalmessages: 0,
                },
            ],
        },
        Spentmonthlycount: {
            totalSpent: 0,
            monthlyTotals: [
                {
                    month: 0,
                    total: 0,
                },
            ],
        },
    });
    const [TotalRevenus, setTotalRevenus] = useState();
    const [DataTables, setDataTables] = useState<TDataTables>({
        BestUsedPrompts: [],
        LessUnusedPrompts: [],
        BestPromptsLastMonth: [],
        TopUsersSpending: [],
    });

    // Th communs
    const commonHeaders = {
        Th1: '#',
        Th2: 'Prompts',
        Th4: 'Category',
    };
    // header th
    const HeaderTH = {
        ThBestUsedPrompts: {
            ...commonHeaders,
            Th3: 'Used',
        },
        ThLessUnusedPrompts: {
            ...commonHeaders,
            Th3: 'Number of Using',
        },
        ThBestPromptsLastMonth: {
            ...commonHeaders,
            Th3: 'Used',
        },
        ThTopUsersSpending: {
            Th1: '#',
            Th2: 'FullName',
            Th3: isDesktop ? 'Email' : 'Spent',
            Th4: isDesktop ? 'Spent' : 'Email',
        },
    };
    const headerArray = Object.values(HeaderTH);

    // Fetch Total
    const fetchData = async (urlKey: string, targetStateKey: keyof typeof DataCards) => {
        try {
            const response = await api.get(`/${urlKey}`);

            setDataCards((prev) => ({
                ...prev,
                [targetStateKey]: {
                    ...prev[targetStateKey],
                    ...response.data,
                },
            }));
        } catch (error) {
            console.error(`Failed to fetch ${urlKey}:`, error);
        }
    };

    // Fetch Data for Tables
    const fetchDataTables = async (urlKey: string, targetStateKey: keyof typeof DataTables) => {
        try {
            const response = await api.get(`/${urlKey}`);
            setDataTables((prev) => ({ ...prev, [targetStateKey]: response.data }));
        } catch (error) {
            console.error(`Failed to fetch ${urlKey}:`, error);
        }
    };

    const CalculPercent = (numbers: number[]) => {
        if (numbers.length >= 2) {
            const dernierNombre = numbers[numbers.length - 1];
            const numeroAvantDernier = numbers[numbers.length - 2];
            const resultat = (dernierNombre * 100) / numeroAvantDernier;
            return resultat;
        }
    };

    const SwitchFromNumberToMonth = async (objects: { month: number; total: number }[]) => {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'Septembre', 'October', 'November', 'December'];
        const number = objects.map((item) => item.month);
        const TableMonths = number?.map((number) => months[number - 1]);
        return TableMonths;
    };

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const fetchPromise = [
                    // Data for Cards
                    await fetchData('Users/users/count', 'Usermonthlycount'),
                    await fetchData('Conversations/conversations/count', 'Conversationmonthlycount'),
                    await fetchData('messages/messages/count', 'Wordsmonthlycount'),
                    await fetchData('users/users/total-spent', 'Spentmonthlycount'),

                    // Data for Tables
                    await fetchDataTables('Prompts/prompts/best-used/4', 'BestUsedPrompts'),
                    await fetchDataTables('Prompts/prompts/less-used', 'LessUnusedPrompts'),
                    await fetchDataTables('Prompts/prompts/best-used-last-month', 'BestPromptsLastMonth'),
                    await fetchDataTables('Users/users/top-spent', 'TopUsersSpending'),
                ];

                await Promise.all(fetchPromise);

                await FillOutput();
                await FillChart();

                setIsLoading(false);
            } catch (error) {
                console.error('Error :', error);
            }
        };

        fetchAllData();
    }, []);

    // Fill Data Chart
    const FillOutput = async () => {
        // Total user On month
        const UsersChart = DataCards.Usermonthlycount.monthlyCounts.map((item) => item.totalusers);
        const ConversationChart = DataCards.Conversationmonthlycount.monthlyCounts.map((item) => item.totalconversations);
        const WordsChart = DataCards.Wordsmonthlycount.monthlyCounts.map((item) => item.totalmessages);
        const RevenuChart = DataCards.Spentmonthlycount.monthlyTotals.map((item) => item.total);

        setTotalInformation({
            TotalUsers: UsersChart,
            TotalConversation: ConversationChart,
            TotalWords: WordsChart,
            TotalSpent: RevenuChart,
        });
        console.log('Before %', PercIformation);

        // Percent % of Each Cards
        const PercentUser = CalculPercent(UsersChart);
        const PercentConversation = CalculPercent(ConversationChart);
        const PercentWords = CalculPercent(WordsChart);
        const PercentSpent = CalculPercent(RevenuChart);
        console.log('After %', PercentSpent);

        if (PercentUser && PercentConversation && PercentWords && PercentSpent) {
            setPercInformation({
                PercentUsers: PercentUser | 0,
                PercentConversation: PercentConversation | 0,
                PercentWords: PercentWords | 0,
                PercentSpent: PercentSpent | 0,
            });
            console.log('%', PercIformation);
        }
    };

    const FillChart = async () => {
        // Display each month
        const MonthUsersChart = DataCards.Usermonthlycount.monthlyCounts.map((item) => item.totalusers);
        const MonthConversationChart = DataCards.Conversationmonthlycount.monthlyCounts.map((item) => item.totalconversations);
        const MonthWordsChart = DataCards.Wordsmonthlycount.monthlyCounts.map((item) => item.totalmessages);
        const MonthRevenuChart = DataCards.Spentmonthlycount.monthlyTotals.map((item) => item.total);

        setTotalDataChart({
            TotalChartUsers: MonthUsersChart,
            TotalChartConversation: MonthConversationChart,
            TotalChartSpent: MonthRevenuChart,
            TotalChartWords: MonthWordsChart,
        });
    };
    return (
        <div className="mx-4">
            {isLoading ? (
                <div className="screen_loader animate__animated !fixed inset-0 !left-0 !top-0 !z-[9999] grid h-screen min-h-screen w-full place-content-center !bg-white dark:bg-[#060818]">
                    <svg width="64" height="64" viewBox="0 0 135 135" xmlns="http://www.w3.org/2000/svg" fill="#4361ee">
                        <path d="M67.447 58c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10zm9.448 9.447c0 5.523 4.477 10 10 10 5.522 0 10-4.477 10-10s-4.478-10-10-10c-5.523 0-10 4.477-10 10zm-9.448 9.448c-5.523 0-10 4.477-10 10 0 5.522 4.477 10 10 10s10-4.478 10-10c0-5.523-4.477-10-10-10zM58 67.447c0-5.523-4.477-10-10-10s-10 4.477-10 10 4.477 10 10 10 10-4.477 10-10z">
                            <animateTransform attributeName="transform" type="rotate" from="0 67 67" to="-360 67 67" dur="2.5s" repeatCount="indefinite" />
                        </path>
                        <path d="M28.19 40.31c6.627 0 12-5.374 12-12 0-6.628-5.373-12-12-12-6.628 0-12 5.372-12 12 0 6.626 5.372 12 12 12zm30.72-19.825c4.686 4.687 12.284 4.687 16.97 0 4.686-4.686 4.686-12.284 0-16.97-4.686-4.687-12.284-4.687-16.97 0-4.687 4.686-4.687 12.284 0 16.97zm35.74 7.705c0 6.627 5.37 12 12 12 6.626 0 12-5.373 12-12 0-6.628-5.374-12-12-12-6.63 0-12 5.372-12 12zm19.822 30.72c-4.686 4.686-4.686 12.284 0 16.97 4.687 4.686 12.285 4.686 16.97 0 4.687-4.686 4.687-12.284 0-16.97-4.685-4.687-12.283-4.687-16.97 0zm-7.704 35.74c-6.627 0-12 5.37-12 12 0 6.626 5.373 12 12 12s12-5.374 12-12c0-6.63-5.373-12-12-12zm-30.72 19.822c-4.686-4.686-12.284-4.686-16.97 0-4.686 4.687-4.686 12.285 0 16.97 4.686 4.687 12.284 4.687 16.97 0 4.687-4.685 4.687-12.283 0-16.97zm-35.74-7.704c0-6.627-5.372-12-12-12-6.626 0-12 5.373-12 12s5.374 12 12 12c6.628 0 12-5.373 12-12zm-19.823-30.72c4.687-4.686 4.687-12.284 0-16.97-4.686-4.686-12.284-4.686-16.97 0-4.687 4.686-4.687 12.284 0 16.97 4.686 4.687 12.284 4.687 16.97 0z">
                            <animateTransform attributeName="transform" type="rotate" from="0 67 67" to="360 67 67" dur="8s" repeatCount="indefinite" />
                        </path>
                    </svg>
                </div>
            ) : (
                <>
                    <div className=" mb-6 mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2  xl:grid-cols-4">
                        <Card
                            title={'Total Users'}
                            total={DataCards.Usermonthlycount.totalUsers}
                            percent={PercIformation.PercentUsers}
                            data={DataCards.Usermonthlycount.monthlyCounts.map((item) => item.totalusers)}
                            numberOfMonth={DataCards.Usermonthlycount.monthlyCounts}
                        />
                        <Card
                            title={'Total Conversation'}
                            total={DataCards.Conversationmonthlycount.totalConversations}
                            percent={PercIformation.PercentConversation}
                            data={DataCards.Conversationmonthlycount.monthlyCounts.map((item) => item.totalconversations)}
                            numberOfMonth={DataCards.Conversationmonthlycount.monthlyCounts}
                        />
                        <Card
                            title={'Total Generated mesages'}
                            total={DataCards.Wordsmonthlycount.totalMessages}
                            percent={PercIformation.PercentWords}
                            data={DataCards.Wordsmonthlycount.monthlyCounts.map((item) => item.totalmessages)}
                            numberOfMonth={DataCards.Wordsmonthlycount.monthlyCounts}
                        />
                        <Card
                            title={'Total Revenus'}
                            total={DataCards.Spentmonthlycount.totalSpent}
                            percent={PercIformation.PercentSpent}
                            data={DataCards.Spentmonthlycount.monthlyTotals.map((item) => item.total)}
                            numberOfMonth={DataCards.Spentmonthlycount.monthlyTotals}
                        />
                    </div>
                    <div className="space-y-14">
                        <Tables title={'Best Used Prompts'} dataTables={DataTables.BestUsedPrompts} headerTh={headerArray[0]} isDesktop={isDesktop} />
                        <Tables title={'Less Unused Prompts'} dataTables={DataTables.LessUnusedPrompts} headerTh={headerArray[1]} isDesktop={isDesktop} />
                        <Tables title={'best used  prompts for last 1 moth'} dataTables={DataTables.BestPromptsLastMonth} headerTh={headerArray[2]} isDesktop={isDesktop} />
                        <Tables title={'Top Users Spending'} dataTables={DataTables.TopUsersSpending} headerTh={headerArray[3]} isDesktop={isDesktop} />
                    </div>
                </>
            )}
        </div>
    );
};

export default Dashboard;
