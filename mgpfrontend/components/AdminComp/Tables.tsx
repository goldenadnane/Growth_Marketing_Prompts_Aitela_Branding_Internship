type BestPromptData = {
    id: number;
    prompt_prompt_text: string;
    prompt_used: string;
    category_name: string;
};

type LessPromptData = {
    id: number;
    prompt_text: string;
    used: string;
    status: boolean;
};

type LastMonthData = {
    id: number;
    prompt_text: string;
    used: string;
    status: boolean;
    subcategory: {
        name: string;
        category: {
            name: string;
        };
    };
};

type TopSpentData = {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    spent: number;
};

type TablesProps = {
    title: string;
    dataTables: (BestPromptData | LessPromptData | LastMonthData | TopSpentData)[];
    headerTh: {
        Th1: string;
        Th2: string;
        Th3: string;
        Th4: string;
    };
    isDesktop: boolean;
};

const Tables = ({ title, dataTables, headerTh, isDesktop }: TablesProps) => {
    let numero = 1;
    return (
        <>
            <div>
                <div className="mb-5 text-sm font-bold md:text-base lg:text-lg">{title}</div>
                <div className="table-responsive overflow-x-hidden rounded-lg border border-[#a8dcfb] lg:border-[#E0E6ED]">
                    <table className="">
                        <thead className="rounded-lg bg-[#a8dcfb] lg:bg-[#E0E6ED]">
                            <tr>
                                <th className="hidden md:block">{headerTh.Th1}</th>
                                <th>{headerTh.Th2}</th>
                                <th>{headerTh.Th3}</th>
                                <th className="hidden md:block">{headerTh.Th4}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataTables.map((item, index) => (
                                <tr key={index}>
                                    <td className="hidden font-semibold md:block">{numero++}</td>
                                    {'prompt_prompt_text' in item ? (
                                        <td className="whitespace-nowrap">
                                            {item.prompt_prompt_text.length > 19 ? item.prompt_prompt_text.substring(0, 20).concat('...') : item.prompt_prompt_text.length}
                                        </td>
                                    ) : 'prompt_text' in item ? (
                                        <td className="whitespace-nowrap">{item.prompt_text.length > 19 ? item.prompt_text.substring(0, 20).concat('...') : item.prompt_text.length}</td>
                                    ) : (
                                        <td className="whitespace-nowrap">{`${item.firstname} ${item.lastname}`}</td>
                                    )}

                                    {'prompt_used' in item ? (
                                        <td className="whitespace-nowrap">{item.prompt_used}</td>
                                    ) : 'used' in item ? (
                                        <td className="whitespace-nowrap">{item.used}</td>
                                    ) : isDesktop ? (
                                        <td className="whitespace-nowrap">{`${item.email}`}</td>
                                    ) : 'spent' in item ? (
                                        <td className="whitespace-nowrap">{`${item.spent}$`}</td>
                                    ) : (
                                        ''
                                    )}

                                    {'category_name' in item ? (
                                        <td className="hidden whitespace-nowrap md:block">{item.category_name}</td>
                                    ) : 'subcategory' in item ? (
                                        <td className="hidden whitespace-nowrap md:block">{item.subcategory.category.name}</td>
                                    ) : !isDesktop ? (
                                        'email' in item && <td className="hidden whitespace-nowrap md:block">{`${item.email}`}</td>
                                    ) : 'spent' in item ? (
                                        <td className="hidden whitespace-nowrap md:block">{`${item.spent}$`}</td>
                                    ) : (
                                        ''
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default Tables;
