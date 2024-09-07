import React, { useEffect, useState } from 'react';
import { AllPrompts, SelectedPromptsDataEdit, AllCategorys, AllSubCategorys } from '@/type';
import { DataTable } from 'mantine-datatable';
import AddPrompts from '@/components/AdminComp/AddPrompts';
import EditPrompts from '@/components/AdminComp/EditPrompts';
import ShowPrompts from '@/components/AdminComp/ShowPrompts';
import Swal from 'sweetalert2';
import Image from 'next/image';
import api from '@/api';
import { useMediaQuery } from '@/components/hooks/useMediaQuery';
import { keys } from 'lodash';

type AllInformationPromptsProps = {
    FetchAllCategorys: AllCategorys[];
    FetchAllSubCategorys: AllSubCategorys[];
};

const Prompts = () => {
    const [items, setItems] = useState<AllPrompts[]>();
    const [AllInformationPrompts, setAllInformationPrompts] = useState<AllInformationPromptsProps>({
        FetchAllCategorys: [],
        FetchAllSubCategorys: [],
    });
    const [RelaunchDataPrompt, setRelaunchDataPrompt] = useState(false);

    const [isLoading, setIsLoading] = useState(true);
    const [ToggleBtnPrompts, setToggleBtnPrompts] = useState(false);
    const [ToggleBtnEditPrompts, setToggleBtnEditPrompts] = useState(false);
    const [ToggleBtnShowPrompts, setToggleBtnShowPrompts] = useState(false);
    const [Success, setSuccess] = useState(false);
    const [search, setSearch] = useState('');
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState<AllPrompts[] | undefined>([]);
    const [records, setRecords] = useState<AllPrompts[] | undefined>(initialRecords);
    const [selectedRecords, setSelectedRecords] = useState<any>([]);
    const ApiUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const [page, setPage] = useState(1);
    const [selectedPrompts, setSelectedPrompts] = useState<SelectedPromptsDataEdit | undefined>();
    const [AlertDelete, setAlertDelete] = useState(false);
    const [PopupDeleteValue, setPopupDeleteValue] = useState(false);
    const [PromptToDelete, setPromptToDelete] = useState<AllPrompts | undefined>();
    const isDesktop = useMediaQuery('(min-width: 1024px)');
    // format Date
    const formatDateToString = (date: any) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear());

        return `${day}-${month}-${year}`;
    };

    // Fetch All Prompts
    const fetchAllPrompts = async () => {
        try {
            const response = await api.get(`/prompts/all`);
            setItems(response.data);
            setInitialRecords(response.data);
            setRecords(response.data);
        } catch (error) {
            console.error('Failed to fetch Prompts', error);
        }
    };

    // Fetch All Categorys & All SubCategorys
    const fetchAllDataPrompts = async (urlKey: string, targetStateKey: keyof typeof AllInformationPrompts) => {
        try {
            const response = await api.get(`/${urlKey}`);
            setAllInformationPrompts((prev) => ({ ...prev, [targetStateKey]: response.data || 0 }));
        } catch (error) {
            console.error(`Failed to fetch ${urlKey}:`, error);
        }
    };

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                await fetchAllPrompts();
                await fetchAllDataPrompts('categories/all', 'FetchAllCategorys');
                await fetchAllDataPrompts('subcategories/all', 'FetchAllSubCategorys');
                setIsLoading(false);
                setRelaunchDataPrompt(false);
            } catch (error) {
                console.error('Error :', error);
            }
        };

        fetchAllData();
    }, [RelaunchDataPrompt]);

    // Start All Page's Functions
    const toggleOpenClose = () => {
        setToggleBtnPrompts((prev) => !prev);
    };
    const toggleOpenCloseEdit = () => {
        setToggleBtnEditPrompts((prev) => !prev);
    };
    const toggleOpenCloseShow = () => {
        setToggleBtnShowPrompts((prev) => !prev);
    };
    const selectUserEdit = (Prompt: AllPrompts) => {
        const { prompt_prompt_text, prompt_status, prompt_id, subcategory_name, category_name, prompt_goal } = Prompt;
        const selectedPromptsData = { prompt_prompt_text, prompt_status, prompt_id, subcategory_name, category_name, prompt_goal };
        setSelectedPrompts(selectedPromptsData);
    };
    const ToggleAlertDelete = () => {
        setAlertDelete((prev) => !prev);
    };
    const TogglePopUpDeletePrompt = (Prompt: AllPrompts) => {
        setPopupDeleteValue((prev) => !prev);
        setPromptToDelete(Prompt);
    };
    const ToggleSuccess = () => {
        setSuccess((prev) => !prev);
    };
    // End All Page's Functions

    // Func Search bar
    useEffect(() => {
        setInitialRecords(() => {
            return items?.filter((item) => {
                return (
                    item.prompt_prompt_text.toLowerCase().includes(search.toLowerCase()) ||
                    item.category_name.toLowerCase().includes(search.toLowerCase()) ||
                    item.subcategory_name.toLowerCase().includes(search.toLowerCase())
                );
            });
        });
    }, [search]);

    // Delete Prompt
    const DeletePromptshowAlert = async (type: string, Prompt: AllPrompts) => {
        const { prompt_id } = Prompt;
        console.log(prompt_id);

        if (type === 'delete prompt') {
            const result = await Swal.fire({
                icon: 'warning',
                text: `You want to delete this prompt`,
                showCancelButton: true,
                confirmButtonText: 'Delete',
                padding: '2em',
                customClass: 'sweet-alerts',
            });

            if (result.value && prompt_id) {
                try {
                    await api.delete(`/prompts/delete/${prompt_id}`);
                    // Update Table after Delete prompt
                    setItems((prevItems) => prevItems?.filter((u) => u.prompt_id !== prompt_id));
                    setInitialRecords((prevInitialRecords) => prevInitialRecords?.filter((u) => u.prompt_id !== prompt_id));
                    setRecords((prevRecords) => prevRecords?.filter((u) => u.prompt_id !== prompt_id));
                    setSelectedRecords([]);
                    setSearch('');
                    ToggleAlertDelete();
                    TogglePopUpDeletePrompt(Prompt);
                    Swal.fire({ text: `The Prompt has been deleted.`, icon: 'success', customClass: 'sweet-alerts' });
                } catch (error) {
                    console.error('Error deleting user:', error);
                    Swal.fire({ text: `The Prompt has not been deleted.`, icon: 'warning', customClass: 'sweet-alerts' });
                }
            } else {
                let selectedRows = selectedRecords || [];
                const ids = selectedRows.map((d: any) => {
                    return d.id;
                });
                const result = items?.filter((d) => !ids.includes(d.prompt_id as never));
                setRecords(result);
                setInitialRecords(result);
                setItems(result);
                setSelectedRecords([]);
                setSearch('');
                setPage(1);
            }
        }
    };

    useEffect(() => {
        setPage(1);
    }, [pageSize]);
    // Remove Scroll PopUp
    useEffect(() => {
        if (ToggleBtnPrompts || ToggleBtnEditPrompts || ToggleBtnShowPrompts) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
    }, [ToggleBtnPrompts, ToggleBtnEditPrompts, ToggleBtnShowPrompts]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecords([...(initialRecords || []).slice(from, to)]);
    }, [page, pageSize, initialRecords]);

    console.log(records);

    return (
        <div className="mx-4 mt-4">
            <>
                {ToggleBtnPrompts ? (
                    <AddPrompts
                        AllCategorys={AllInformationPrompts.FetchAllCategorys}
                        AllSubCategorys={AllInformationPrompts.FetchAllSubCategorys}
                        toggleOpenClose={toggleOpenClose}
                        ToggleSuccess={ToggleSuccess}
                        records={records}
                        setRecords={setRecords}
                        setRelaunchDataPrompt={setRelaunchDataPrompt}
                    />
                ) : (
                    ''
                )}
                {ToggleBtnEditPrompts ? (
                    <EditPrompts
                        AllCategorys={AllInformationPrompts.FetchAllCategorys}
                        AllSubCategorys={AllInformationPrompts.FetchAllSubCategorys}
                        toggleOpenCloseEdit={toggleOpenCloseEdit}
                        selectedPrompts={selectedPrompts}
                        setSelectedPrompts={setSelectedPrompts}
                        ToggleSuccess={ToggleSuccess}
                        setRelaunchDataPrompt={setRelaunchDataPrompt}
                    />
                ) : (
                    ''
                )}
                {/* {PopupDeleteValue ? <PopUpDelete message={`Do you really want to Delete this Prompt ?`} TogglePopUpDeletePrompt={TogglePopUpDeletePrompt} /> : ''} */}

                {ToggleBtnShowPrompts ? <ShowPrompts toggleOpenCloseShow={toggleOpenCloseShow} selectedPrompts={selectedPrompts} /> : ''}
                <div className="relative mb-6 mt-4 space-y-1 lg:mt-8 lg:space-y-4">
                    <h1 className="text-lg font-bold md:text-xl lg:text-2xl">Prompts</h1>
                    <div className="lf:items-center mb-4.5 flex flex-col-reverse gap-5 lg:flex-row lg:justify-between">
                        <div className="relative rounded-md rtl:mr-auto">
                            <Image src="/search.svg" width="20" className="absolute left-1 top-2" height="20" alt="search" />
                            <input type="text" className="form-input w-full ltr:pl-9 lg:w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>
                        <div className="flex items-center justify-end gap-2">
                            <button onClick={toggleOpenClose} type="button" className="btn btn-primary gap-2 border-[#26A8F4] bg-[#26A8F4]">
                                <svg className="hidden h-5 w-5 lg:block" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                Add Prompt
                            </button>
                        </div>
                    </div>
                </div>
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
                    <div className="panel border-white-light px-0 pt-0 dark:border-[#1b2e4b]">
                        <div className="users-table">
                            <div className="datatables pagination-padding">
                                <DataTable
                                    className="table-hover whitespace-nowrap"
                                    records={records}
                                    columns={[
                                        {
                                            accessor: 'Prompts',
                                            render: ({ prompt_prompt_text, prompt_id }) => (
                                                <div className="font-semibol underline hover:no-underline" key={prompt_id}>
                                                    {prompt_prompt_text.length > 19 ? prompt_prompt_text.substring(0, 20).concat('...') : prompt_prompt_text}
                                                </div>
                                            ),
                                        },
                                        {
                                            accessor: 'Status',
                                            textAlignment: 'center',
                                            render: ({ prompt_status, prompt_id }) => (
                                                <div
                                                    key={prompt_id}
                                                    className={`${
                                                        prompt_status === true ? 'bg-[#00ab563e]' : 'bg-[#ea443538]'
                                                    } m-auto  flex w-[95px] items-center justify-center rounded-3xl px-4 py-2`}
                                                >
                                                    <span className={`${prompt_status === true ? 'text-[#00AB55]' : 'text-[#EA4335]'} font-bold`}>
                                                        {prompt_status === true ? 'Active' : 'Desactive'}
                                                    </span>
                                                </div>
                                            ),
                                        },
                                        {
                                            accessor: 'Category',
                                            textAlignment: 'center',
                                            render: ({ category_name, prompt_id }) => <div key={prompt_id} className="m-auto w-fit text-left font-semibold">{`${category_name}`}</div>,
                                        },
                                        {
                                            accessor: 'SubCategory',
                                            textAlignment: 'center',
                                            render: ({ subcategory_name, prompt_id }) => (
                                                <div key={prompt_id} className="m-auto w-fit text-left font-semibold">
                                                    {subcategory_name}
                                                </div>
                                            ),
                                        },
                                        {
                                            accessor: 'Goal',
                                            textAlignment: 'center',
                                            render: ({ prompt_goal, prompt_id }) => (
                                                <div key={prompt_id} className="m-auto w-fit text-left font-semibold">
                                                    {prompt_goal.length > 19 ? prompt_goal.substring(0, 20).concat('...') : prompt_goal}
                                                </div>
                                            ),
                                        },
                                        {
                                            accessor: 'action',
                                            title: 'Actions',
                                            sortable: false,
                                            textAlignment: 'center',
                                            render: (prompt) => (
                                                <div className="mx-auto flex w-max items-center gap-4">
                                                    <button
                                                        className="flex hover:text-info"
                                                        onClick={() => {
                                                            toggleOpenCloseShow();
                                                            selectUserEdit(prompt);
                                                        }}
                                                    >
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path
                                                                opacity="0.5"
                                                                d="M16 4.00195C18.175 4.01406 19.3529 4.11051 20.1213 4.87889C21 5.75757 21 7.17179 21 10.0002V16.0002C21 18.8286 21 20.2429 20.1213 21.1215C19.2426 22.0002 17.8284 22.0002 15 22.0002H9C6.17157 22.0002 4.75736 22.0002 3.87868 21.1215C3 20.2429 3 18.8286 3 16.0002V10.0002C3 7.17179 3 5.75757 3.87868 4.87889C4.64706 4.11051 5.82497 4.01406 8 4.00195"
                                                                stroke="currentColor"
                                                                strokeWidth="1.5"
                                                            ></path>
                                                            <path d="M8 14H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                                            <path d="M7 10.5H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                                            <path d="M9 17.5H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                                            <path
                                                                d="M8 3.5C8 2.67157 8.67157 2 9.5 2H14.5C15.3284 2 16 2.67157 16 3.5V4.5C16 5.32843 15.3284 6 14.5 6H9.5C8.67157 6 8 5.32843 8 4.5V3.5Z"
                                                                stroke="currentColor"
                                                                strokeWidth="1.5"
                                                            ></path>
                                                        </svg>
                                                    </button>
                                                    <button
                                                        className="flex hover:text-info"
                                                        onClick={() => {
                                                            toggleOpenCloseEdit();
                                                            selectUserEdit(prompt);
                                                        }}
                                                    >
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5">
                                                            <path
                                                                opacity="0.5"
                                                                d="M22 10.5V12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2H13.5"
                                                                stroke="currentColor"
                                                                strokeWidth="1.5"
                                                                strokeLinecap="round"
                                                            ></path>
                                                            <path
                                                                d="M17.3009 2.80624L16.652 3.45506L10.6872 9.41993C10.2832 9.82394 10.0812 10.0259 9.90743 10.2487C9.70249 10.5114 9.52679 10.7957 9.38344 11.0965C9.26191 11.3515 9.17157 11.6225 8.99089 12.1646L8.41242 13.9L8.03811 15.0229C7.9492 15.2897 8.01862 15.5837 8.21744 15.7826C8.41626 15.9814 8.71035 16.0508 8.97709 15.9619L10.1 15.5876L11.8354 15.0091C12.3775 14.8284 12.6485 14.7381 12.9035 14.6166C13.2043 14.4732 13.4886 14.2975 13.7513 14.0926C13.9741 13.9188 14.1761 13.7168 14.5801 13.3128L20.5449 7.34795L21.1938 6.69914C22.2687 5.62415 22.2687 3.88124 21.1938 2.80624C20.1188 1.73125 18.3759 1.73125 17.3009 2.80624Z"
                                                                stroke="currentColor"
                                                                strokeWidth="1.5"
                                                            ></path>
                                                            <path
                                                                opacity="0.5"
                                                                d="M16.6522 3.45508C16.6522 3.45508 16.7333 4.83381 17.9499 6.05034C19.1664 7.26687 20.5451 7.34797 20.5451 7.34797M10.1002 15.5876L8.4126 13.9"
                                                                stroke="currentColor"
                                                                strokeWidth="1.5"
                                                            ></path>
                                                        </svg>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="flex hover:text-danger"
                                                        onClick={() => {
                                                            DeletePromptshowAlert('delete prompt', prompt);
                                                        }}
                                                    >
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
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
                                                    </button>
                                                </div>
                                            ),
                                        },
                                    ]}
                                    highlightOnHover
                                    totalRecords={initialRecords?.length}
                                    recordsPerPage={pageSize}
                                    page={page}
                                    onPageChange={(p) => setPage(p)}
                                    recordsPerPageOptions={PAGE_SIZES}
                                    onRecordsPerPageChange={setPageSize}
                                    paginationText={({ from, to, totalRecords }) => `${isDesktop ? `Showing  ${from} to ${to} of ${totalRecords} entries` : `${from} - ${to} / ${totalRecords}`} `}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </>
        </div>
    );
};

export default Prompts;
