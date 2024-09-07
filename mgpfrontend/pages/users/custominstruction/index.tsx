import { IRootState } from '@/store';
import React, { useEffect, useState, useRef } from 'react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import Head from 'next/head';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import 'tippy.js/dist/tippy.css';
import { useMediaQuery } from '@/components/hooks/useMediaQuery';
import EditCustomInstructions from './EditCustomInstructions';
import api from '@/api';

function Custom_instruction() {
    const ApiUrl = process.env.NEXT_PUBLIC_BASE_URL;

    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [RelaunchDataCustomInstr, setRelaunchDataCustomInstr] = useState(false);
    const [ToggleBtnEditCustomIntsr, setToggleBtnEditCustomInstr] = useState(false);
    const [selectedCustomInstr, setSelectedCustomInstr] = useState<ManagSettingInstruction>();
    const [user, setUser] = useState<any>({});
    const isDesktop = useMediaQuery('(min-width: 1024px)');

    //Datatable settings
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [page, setPage] = useState(1);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'brand',
        direction: 'asc',
    });

    // Fetch user By id
    const fetchUserById = async () => {
        try {
            const response = await api.get(`${ApiUrl}/users/${authSelector?.value?.user?.id}`);
            if (response.status === 200) {
                setUser(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch Users', error);
        }
    };

    const [authMgSt, setAuth] = useState<authMgSt>({
        isAuth: false,
        ManegInstrct: {
            user: {
                brand: '',
                product_service: '',
                target_audience: '',
                feature1: '',
                feature2: '',
                feature3: '',
            },
        },
    });

    const [customInstr, setCustomInstr] = useState<ManagSettingInstruction[]>([]);

    const authSelector: any = useSelector((state: IRootState) => state?.auth);

    // Fetch user by id
    const fetchCustomInstructions = async () => {
        try {
            const response = await api.get(`${ApiUrl}/prompts/prompts/custom_instructions_of_user/${authSelector?.value?.user?.id}`);
            setCustomInstr(response.data);
        } catch (error) {
            console.error('Failed to fetch Users', error);
        }
    };

    useEffect(() => {
        fetchUserById();
        fetchCustomInstructions();
    }, [authSelector, RelaunchDataCustomInstr]);

    useEffect(() => {
        setManegInstrct({
            brand: authMgSt?.ManegInstrct?.user?.brand,
            target_audience: authMgSt?.ManegInstrct?.user?.target_audience,
            product_service: authMgSt?.ManegInstrct?.user?.product_service,
            feature1: authMgSt?.ManegInstrct?.user?.feature1,
            feature2: authMgSt?.ManegInstrct?.user?.feature2,
            feature3: authMgSt?.ManegInstrct?.user?.feature3,
        });
    }, [authMgSt?.ManegInstrct]);

    //const [edited, setEdited] = useState<boolean>(true);

    const [ManegInstrct, setManegInstrct] = useState<ManagSettingInstruction>({
        brand: authMgSt?.ManegInstrct?.user?.brand,
        target_audience: authMgSt?.ManegInstrct?.user?.target_audience,
        product_service: authMgSt?.ManegInstrct?.user?.product_service,
        feature1: authMgSt?.ManegInstrct?.user?.feature1,
        feature2: authMgSt?.ManegInstrct?.user?.feature2,
        feature3: authMgSt?.ManegInstrct?.user?.feature3,
    });

    {
        /*const editButton = () => {
        setEdited((prev) => !prev);
    };*/
    }

    const createManegInstrct = (e: any) => {
        setManegInstrct((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleChangeStatus = async (e: any) => {
        setIsButtonDisabled(true);

        const userStatus = {
            custom_instuctions_status: e.target.checked,
        };
        setUser((prevUser: any) => ({ ...prevUser, ...userStatus }));

        try {
            const response = await api.put(`${ApiUrl}/prompts/prompts/custom_instruction`, userStatus);
            if (response.status === 200) {
                Swal.fire({ text: 'Status has been Changed.', icon: 'success', customClass: 'sweet-alerts' });
                setRelaunchDataCustomInstr(true);
            }
        } catch (error) {
            console.error('Error creating user:', error);
            Swal.fire({ text: 'Status has not been created.', icon: 'warning', customClass: 'sweet-alerts' });
        }

        // Enable the button after 2 seconds
        setTimeout(() => {
            setIsButtonDisabled(false);
        }, 2000); // 2000 milliseconds = 2 seconds
    };

    const handleSubmitCustomInstructionsForm = async (e: any) => {
        e.preventDefault();

        const result = await Swal.fire({
            icon: 'info',
            text: `You want to Create a Brand`,
            showCancelButton: true,
            confirmButtonText: 'Create',
            padding: '2em',
            customClass: 'sweet-alerts',
        });

        if (result.value) {
            try {
                const response = await api.post(`${ApiUrl}/prompts/prompts/custom_instructions`, ManegInstrct);
                console.log('Created Succ', response.data);
                Swal.fire({ text: 'Brand has been Created.', icon: 'success', customClass: 'sweet-alerts' });
                console.log(ManegInstrct);
                setManegInstrct({
                    brand: '',
                    target_audience: '',
                    product_service: '',
                    feature1: '',
                    feature2: '',
                    feature3: '',
                });
                setRelaunchDataCustomInstr(true);
                console.log(ManegInstrct);
            } catch (error: any) {
                console.error('Error creating user:', error);
                Swal.fire({ text: error.response.data.message, icon: 'warning', customClass: 'sweet-alerts' });
            }
        }
    };

    // Edit Custom instruction
    const toggleOpenCloseEdit = () => {
        setToggleBtnEditCustomInstr((prev) => !prev);
    };
    const selectCustomInstrEdit = (brand_: ManagSettingInstruction) => {
        const { brand, product_service, target_audience, feature1, feature2, feature3, id } = brand_;
        const selectedCustomInstr = { brand, product_service, target_audience, feature1, feature2, feature3, id };
        setSelectedCustomInstr(selectedCustomInstr);
    };

    // Delete Brand
    {
        /*const DeleteBrandhowAlert = async (id: any) => {
        const result = await Swal.fire({
            icon: 'warning',
            text: `You want to delete this Brand`,
            showCancelButton: true,
            confirmButtonText: 'Delete',
            padding: '2em',
            customClass: 'sweet-alerts',
        });

        if (result.value && id) {
            try {
                const res = await api.delete(`${ApiUrl}/prompts/prompts/custom_instruction/${id}`);
                if (res.status === 200) {
                    setCustomInstr((prevCustom) => prevCustom?.filter((u: any) => u.id !== id));
                }
                Swal.fire({ text: `The Brand has been deleted.`, icon: 'success', customClass: 'sweet-alerts' });
            } catch (error) {
                console.error('Error deleting user:', error);
                Swal.fire({ text: `The Brand has not been deleted.`, icon: 'warning', customClass: 'sweet-alerts' });
            }
        }
    };*/
    }

    return (
        <>
            <Head>
                <title>Custom Instructions</title>
            </Head>
            {ToggleBtnEditCustomIntsr ? (
                <EditCustomInstructions
                    setRelaunchDataCustomInstr={setRelaunchDataCustomInstr}
                    toggleOpenCloseEdit={toggleOpenCloseEdit}
                    selectedCustomInstr={selectedCustomInstr}
                    setSelectedCustomInstr={setSelectedCustomInstr}
                />
            ) : (
                ''
            )}
            <div className="rounded-md  px-3 py-10 shadow">
                <h2 className="py-3 text-xl font-bold text-gray-900 dark:text-white lg:text-2xl">Manage Custom Interactions</h2>
                <div className="basic-info mx-auto flex w-full flex-col justify-center gap-4 py-10 md:flex-row lg:w-11/12 lg:items-center">
                    <form onSubmit={handleSubmitCustomInstructionsForm} className="user-informations grid w-full grid-cols-1 gap-3 lg:grid-cols-2">
                        <div className="">
                            <label htmlFor="firstName">Brand</label>
                            <input
                                type="text"
                                id="firstName"
                                required
                                name="brand"
                                placeholder="Your Brand"
                                value={ManegInstrct?.brand}
                                className="w-full rounded-md border-2 px-3 py-2 duration-200 read-only:bg-slate-100 dark:bg-transparent dark:text-white"
                                onChange={createManegInstrct}
                            />
                        </div>
                        <div className="">
                            <label htmlFor="lastName">Product/Service</label>
                            <input
                                type="text"
                                id="lastName"
                                required
                                name="product_service"
                                placeholder="Your Product Service"
                                value={ManegInstrct?.product_service}
                                className="w-full rounded-md border-2 px-3 py-2 duration-200 read-only:bg-slate-100 dark:bg-transparent dark:text-white"
                                onChange={createManegInstrct}
                            />
                        </div>
                        <div className="">
                            <label htmlFor="audience">Target Audience</label>
                            <input
                                type="text"
                                id="audience"
                                required
                                name="target_audience"
                                placeholder="Your Target Audience"
                                value={ManegInstrct?.target_audience}
                                className="w-full rounded-md border-2 px-3 py-2 duration-200 read-only:bg-slate-100 dark:bg-transparent dark:text-white"
                                onChange={createManegInstrct}
                            />
                        </div>
                        <div className="">
                            <label htmlFor="feature1">Feature 1</label>
                            <input
                                type="text"
                                id="feature1"
                                required
                                name="feature1"
                                placeholder="Your Feature"
                                value={ManegInstrct?.feature1}
                                className="w-full rounded-md border-2 px-3 py-2 duration-200 read-only:bg-slate-100 dark:bg-transparent dark:text-white"
                                onChange={createManegInstrct}
                            />
                        </div>
                        <div className="">
                            <label htmlFor="feature2">Feature 2</label>
                            <input
                                type="text"
                                id="feature2"
                                required
                                name="feature2"
                                placeholder="Your Feature"
                                value={ManegInstrct?.feature2}
                                className="w-full rounded-md border-2 px-3 py-2 duration-200 read-only:bg-slate-100 dark:bg-transparent dark:text-white"
                                onChange={createManegInstrct}
                            />
                        </div>
                        <div className="">
                            <label htmlFor="feature3">Feature 3</label>
                            <input
                                type="text"
                                id="feature3"
                                required
                                name="feature3"
                                placeholder="Your Feature"
                                value={ManegInstrct?.feature3}
                                className="w-full rounded-md border-2 px-3 py-2 duration-200 read-only:bg-slate-100 dark:bg-transparent dark:text-white"
                                onChange={createManegInstrct}
                            />
                        </div>

                        <div className="flex items-center justify-evenly lg:w-9/12">
                            <button type="submit" className="h-9 w-full rounded-md bg-sky-500 text-sm font-semibold text-white ">
                                Save
                            </button>
                        </div>
                    </form>
                </div>
                <div className="flex">
                    <div>
                        <label className="text-lg font-semibold text-slate-400">Custom Instructions: </label>
                    </div>
                    <label className="relative ms-4 h-6 w-12">
                        <input
                            type="checkbox"
                            disabled={isButtonDisabled}
                            checked={user.custom_instuctions_status}
                            onChange={handleChangeStatus}
                            className="custom_switch peer absolute z-10 h-full w-full cursor-pointer opacity-0"
                            id="custom_switch_checkbox1"
                            style={{ cursor: isButtonDisabled ? 'not-allowed' : 'pointer' }}
                        />
                        <span className="block h-full rounded-full bg-[#ebedf2] before:absolute before:bottom-1 before:left-1 before:h-4 before:w-4 before:rounded-full before:bg-white before:transition-all before:duration-300 peer-checked:bg-primary  peer-checked:before:left-7 dark:bg-dark dark:before:bg-white-dark dark:peer-checked:before:bg-white "></span>
                    </label>
                </div>{' '}
            </div>
            <div className="panel border-white-light px-4 pt-0 dark:border-[#1b2e4b]">
                <div className="users-table">
                    <div className="datatables pagination-padding">
                        <DataTable
                            className="table-hover whitespace-nowrap"
                            records={customInstr}
                            columns={[
                                {
                                    accessor: 'Brand',
                                    render: ({ brand }) => (
                                        <div className="flex font-semibold">
                                            <div>{`${brand}`}</div>
                                        </div>
                                    ),
                                },
                                {
                                    accessor: 'Product/Service',
                                    render: ({ product_service }) => <div className="font-semibol">{product_service}</div>,
                                },
                                {
                                    accessor: 'Target Audience',
                                    render: ({ target_audience }) => <div className="font-semibold">{`${target_audience}`}</div>,
                                },
                                {
                                    accessor: 'Feature 1',
                                    render: ({ feature1 }) => <div className="font-semibold">{`${feature1}`}</div>,
                                },
                                {
                                    accessor: 'Feature 2',
                                    render: ({ feature2 }) => <div className="font-semibold">{`${feature2}`}</div>,
                                },
                                {
                                    accessor: 'Feature 3',
                                    render: ({ feature3 }) => <div className="font-semibold">{`${feature3}`}</div>,
                                },
                                {
                                    accessor: 'action',
                                    title: 'Actions',
                                    sortable: false,
                                    render: (customInstr) => (
                                        <div className="mx-auto flex gap-4">
                                            <button
                                                className="flex hover:text-info"
                                                onClick={() => {
                                                    toggleOpenCloseEdit();
                                                    selectCustomInstrEdit(customInstr);
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
                                        </div>
                                    ),
                                },
                            ]}
                            highlightOnHover
                            totalRecords={customInstr?.length}
                            recordsPerPage={pageSize}
                            page={page}
                            onPageChange={(p) => setPage(p)}
                            recordsPerPageOptions={PAGE_SIZES}
                            onRecordsPerPageChange={setPageSize}
                            sortStatus={sortStatus}
                            onSortStatusChange={setSortStatus}
                            paginationText={({ from, to, totalRecords }) => `${isDesktop ? `Showing  ${from} to ${to} of ${totalRecords} entries` : `${from} - ${to} / ${totalRecords}`} `}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Custom_instruction;
