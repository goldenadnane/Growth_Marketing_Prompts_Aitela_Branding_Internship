import React, { useEffect, useState } from 'react';
import { AllCategorys, AllSubCategorys } from '@/type';
import { DataTable } from 'mantine-datatable';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import AddSubCategory from '@/components/AdminComp/AddSubCategory';
import EditSubCategory from '@/components/AdminComp/EditSubCategory';
import api from '@/api';
import Image from 'next/image';
import { useMediaQuery } from '@/components/hooks/useMediaQuery';

type AllInformationPromptsProps = {
    FetchAllCategorys: AllCategorys[];
    FetchAllSubCategorys: AllSubCategorys[];
};

const ListSubCategoryById = () => {
    const router = useRouter();
    const { categoryId } = router.query;

    let categoryIdAsNumber: number | undefined;

    if (typeof categoryId === 'string') {
        categoryIdAsNumber = parseInt(categoryId, 10);
    }

    const [ToggleBtnSubCategory, setToggleBtnSubCategory] = useState(false);
    const [ToggleBtnEditSubCategory, setToggleEditBtnSubCategory] = useState(false);
    const [itemsSub, setItemsSub] = useState<AllSubCategorys[]>();
    const [CategoryName, setCategoryName] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecordsSub, setInitialRecordsSub] = useState<AllSubCategorys[] | undefined>([]);
    const [recordsSub, setRecordsSub] = useState<AllSubCategorys[] | undefined>(initialRecordsSub);
    const [selectedRecords, setSelectedRecords] = useState<any>([]);
    const ApiUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const [page, setPage] = useState(1);
    const [selectedSubcateogy, setSelectedSubcateogy] = useState<AllSubCategorys | undefined>();
    const [PopupDeleteValue, setPopupDeleteValue] = useState(false);
    const [PromptToDelete, setPromptToDelete] = useState<AllSubCategorys | undefined>();
    const [CategoriesOptions, setCategoriesOptions] = useState<AllCategorys[]>();
    const [RelaunchData, setRelaunchData] = useState(false);
    const isDesktop = useMediaQuery('(min-width: 1024px)');
    // Fetch SubCategories by id category
    const fetchSubCategories = async () => {
        try {
            const response = await api.get(`/subcategories/bycategory/${categoryId}`);
            const categoryID = await api.get(`/categories/${categoryId}`);
            setItemsSub(response.data);
            setInitialRecordsSub(response.data);
            setRecordsSub(response.data);
            setCategoryName(categoryID.data.name);
            console.log(recordsSub);
        } catch (error) {
            console.error('Failed to fetch SubCategories', error);
        }
    };
    useEffect(() => {
        fetchSubCategories();
        setIsLoading(false);
        setRelaunchData(false);
        console.log('executer');
    }, [RelaunchData]);

    const fetchAllCategorys = async () => {
        try {
            const response = await api.get(`/categories/all`);
            setItemsSub(response.data);
            setInitialRecordsSub(response.data);
            setRecordsSub(response.data);
            setCategoriesOptions(response.data);
        } catch (error) {
            console.error('Failed to fetch Prompts', error);
        }
    };

    useEffect(() => {
        fetchAllCategorys();
    }, []);

    // Start All Page's Functions
    const toggleOpenCloseSubCategoryEdit = () => {
        setToggleEditBtnSubCategory((prev) => !prev);
    };
    const toggleOpenCloseSubCategory = () => {
        setToggleBtnSubCategory((prev) => !prev);
    };

    const selectSubcategoryEdit = (subcategory: AllSubCategorys) => {
        const { id, name } = subcategory;
        const selectedcategorysData = { id, name };
        setSelectedSubcateogy(selectedcategorysData);
    };
    const TogglePopUpDeletePrompt = (Prompt: AllSubCategorys) => {
        setPopupDeleteValue((prev) => !prev);
        setPromptToDelete(Prompt);
    };
    // End All Page's Functions

    // Func Search bar
    useEffect(() => {
        setInitialRecordsSub(() => {
            return itemsSub?.filter((item) => {
                return item.name.toLowerCase().includes(search.toLowerCase());
            });
        });
    }, [search]);

    // Delete Prompt
    const DeleteSubCategoryshowAlert = async (type: string, SubCategoy: AllSubCategorys) => {
        const { id } = SubCategoy;
        console.log(SubCategoy.id);

        if (type === 'delete subcategory') {
            const result = await Swal.fire({
                icon: 'warning',
                text: `You want to delete this SubCategory`,
                showCancelButton: true,
                confirmButtonText: 'Delete',
                padding: '2em',
                customClass: 'sweet-alerts',
            });

            if (result.value && SubCategoy) {
                try {
                    await api.delete(`/subcategories/delete/${SubCategoy.id}`);
                    // Update Table after Delete prompt
                    setItemsSub((prevItems) => prevItems?.filter((u) => u.id !== id));
                    setInitialRecordsSub((prevInitialRecordsSub) => prevInitialRecordsSub?.filter((u) => u.id !== id));
                    setRecordsSub((prevRecords) => prevRecords?.filter((u) => u.id !== id));
                    setSelectedRecords([]);
                    setSearch('');
                    TogglePopUpDeletePrompt(SubCategoy);
                    Swal.fire({ text: `The SubCategory has been deleted.`, icon: 'success', customClass: 'sweet-alerts' });
                } catch (error) {
                    console.error('Error deleting user:', error);
                    Swal.fire({ text: `The SubCategory has not been deleted.`, icon: 'warning', customClass: 'sweet-alerts' });
                }
            } else {
                let selectedRows = selectedRecords || [];
                const ids = selectedRows.map((d: any) => {
                    return d.id;
                });
                const result = itemsSub?.filter((d) => !ids.includes(d.id as never));
                setRecordsSub(result);
                setInitialRecordsSub(result);
                setItemsSub(result);
                setSelectedRecords([]);
                setSearch('');
                setPage(1);
            }
        }
    };

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecordsSub([...(initialRecordsSub || []).slice(from, to)]);
    }, [page, pageSize, initialRecordsSub]);

    console.log('id', categoryIdAsNumber);

    return (
        <div className="mx-4">
            <>
                {ToggleBtnSubCategory ? <AddSubCategory setRelaunchData={setRelaunchData} toggleOpenCloseSubCategory={toggleOpenCloseSubCategory} CategoriesOptions={CategoriesOptions} /> : ''}
                {ToggleBtnEditSubCategory ? (
                    <EditSubCategory
                        setRelaunchData={setRelaunchData}
                        categoryIdAsNumber={categoryIdAsNumber}
                        selectedSubcateogy={selectedSubcateogy}
                        toggleOpenCloseSubCategoryEdit={toggleOpenCloseSubCategoryEdit}
                        CategoriesOptions={CategoriesOptions}
                    />
                ) : (
                    ''
                )}
                {/* {PopupDeleteValue ? <PopUpDelete message={`Do you really want to Delete this Prompt ?`} TogglePopUpDeletePrompt={TogglePopUpDeletePrompt} /> : ''} */}

                {/* {ToggleBtnShowPrompts ? <ShowPrompts toggleOpenCloseShow={toggleOpenCloseShow} selectedPrompts={selectedPrompts} /> : ''} */}
                <div className="relative mb-6 mt-8 space-y-4">
                    <h1 className="text-lg font-bold md:text-xl lg:text-2xl">List Of SubCategory</h1>
                    <div className="lf:items-center mb-4.5 flex flex-col-reverse gap-5 lg:flex-row lg:justify-between">
                        <div className="relative rounded-md rtl:mr-auto">
                            <Image src="/search.svg" width="20" className="absolute left-1 top-2" height="20" alt="search" />
                            <input type="text" className="form-input w-full ltr:pl-9 lg:w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>
                        <div className="flex items-center justify-end gap-2">
                            <button onClick={toggleOpenCloseSubCategory} type="button" className="btn btn-primary gap-2 border-[#26A8F4] bg-[#26A8F4]">
                                <svg className="hidden h-5 w-5 lg:block" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                Add SubCategory
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
                                    records={recordsSub}
                                    columns={[
                                        {
                                            accessor: 'Name',
                                            render: ({ name }) => <div className="font-semibol ">{name}</div>,
                                        },

                                        {
                                            accessor: 'action',
                                            title: 'Actions',
                                            sortable: false,
                                            textAlignment: 'center',
                                            render: (subcategories) => (
                                                <div className="mx-auto flex w-max items-center gap-4">
                                                    <button
                                                        className="flex hover:text-info"
                                                        onClick={() => {
                                                            toggleOpenCloseSubCategoryEdit();
                                                            selectSubcategoryEdit(subcategories);
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
                                                            DeleteSubCategoryshowAlert('delete subcategory', subcategories);
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
                                    totalRecords={initialRecordsSub?.length}
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

export default ListSubCategoryById;
