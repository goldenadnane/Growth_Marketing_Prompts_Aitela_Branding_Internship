import Link from 'next/link';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useState, useEffect } from 'react';
import sortBy from 'lodash/sortBy';
import { useDispatch, useSelector } from 'react-redux';
import AddUser from '@/components/AdminComp/AddUser';

import EditUser from '@/components/AdminComp/EditUser';
import PopUpDelete from '@/components/AdminComp/PopUpDelete';
import { SelectedUserDataEdit, AllMails } from '@/type';
import ShowCompaignEmail from '@/components/AdminComp/ShowCompaignEmail';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useMediaQuery } from '@/components/hooks/useMediaQuery';
import Dropdown from '@/components/Dropdown';
import api from '@/api';

const Emailing = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [items, setItems] = useState<AllMails[]>();
    const [Success, setSuccess] = useState(false);
    const [AlertDelete, setAlertDelete] = useState(false);
    const [PopupDeleteValue, setPopupDeleteValue] = useState(false);
    const [ConfiDeleteUser, setConfiDeleteUser] = useState(false);
    const [userToDelete, setUserToDelete] = useState<AllMails | undefined>();
    const [selectedUser, setSelectedUser] = useState<AllMails | undefined>();
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [ToggleBtnAddUser, setToggleBtnAddUser] = useState(false);
    const [ToggleBtnEditUser, setToggleBtnEditUser] = useState(false);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState<AllMails[] | undefined>([]);
    const [records, setRecords] = useState<AllMails[] | undefined>(initialRecords);
    const [selectedRecords, setSelectedRecords] = useState<any>([]);
    const ApiUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'firstName',
        direction: 'asc',
    });
    const isDesktop = useMediaQuery('(min-width: 1024px)');

    // Fetch AllUser
    const fetchAllMails = async () => {
        try {
            const response = await api.get(`/mails/all`);
            setItems(response.data);
            setInitialRecords(response.data);
            setRecords(response.data);
        } catch (error) {
            console.error('Failed to fetch Mails', error);
        }
    };
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                await fetchAllMails();
                setIsLoading(false);
            } catch (error) {
                console.error('Error :', error);
            }
        };

        fetchAllData();
    }, []);

    // format Date
    const formatDateToString = (date: any) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear());

        return `${day}-${month}-${year}`;
    };

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecords([...(initialRecords || []).slice(from, to)]);
    }, [page, pageSize, initialRecords]);

    // Func Search bar
    useEffect(() => {
        setInitialRecords(() => {
            return items?.filter((item) => {
                return item.title.toLowerCase().includes(search.toLowerCase()) || item.text.toLowerCase().includes(search.toLowerCase());
            });
        });
    }, [search]);

    const deleteRow = async (user: AllMails) => {
        const { id, title, text } = user;
        if (window.confirm('Are you sure to Delete the user ?')) {
            if (id) {
                await api.delete(`/users/delete/${id}`);
                // Update Table after Delete user
                setItems((prevItems) => prevItems?.filter((u) => u.id !== id));
                setInitialRecords((prevInitialRecords) => prevInitialRecords?.filter((u) => u.id !== id));
                setRecords((prevRecords) => prevRecords?.filter((u) => u.id !== id));
                setSelectedRecords([]);
                setSearch('');
                ToggleAlertDelete();
                TogglePopUpDelete(user);
            } else {
                let selectedRows = selectedRecords || [];
                const ids = selectedRows.map((d: any) => {
                    return d.id;
                });
                const result = items?.filter((d) => !ids.includes(d.id as never));
                setRecords(result);
                setInitialRecords(result);
                setItems(result);
                setSelectedRecords([]);
                setSearch('');
                setPage(1);
            }
        }
    };

    const toggleOpenClose = () => {
        setToggleBtnAddUser((prev) => !prev);
    };
    const toggleOpenCloseEdit = () => {
        setToggleBtnEditUser((prev) => !prev);
    };
    const ToggleSuccess = () => {
        setSuccess((prev) => !prev);
    };
    const ToggleAlertDelete = () => {
        setAlertDelete((prev) => !prev);
    };
    const TogglePopUpDelete = (user: AllMails) => {
        setPopupDeleteValue((prev) => !prev);
        setUserToDelete(user);
    };
    const selectUserEdit = (user: AllMails) => {
        const { id, title, text, sentdAt } = user;
        const selectedUserData = { id, title, text, sentdAt };
        setSelectedUser(selectedUserData);
    };

    useEffect(() => {
        if (ToggleBtnEditUser) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
    }, [, ToggleBtnEditUser]);

    return (
        <div className="mx-4">
            {ToggleBtnEditUser ? <ShowCompaignEmail selectedUser={selectedUser} toggleOpenCloseEdit={toggleOpenCloseEdit} /> : ''}
            <div className="relative mb-6 mt-8 space-y-4">
                <h1 className="text-xl font-bold  lg:text-2xl ">Compaign List</h1>

                <div className="lf:items-center mb-4.5 flex flex-col-reverse gap-5 lg:flex-row lg:justify-between">
                    <div className="relative rounded-md rtl:mr-auto">
                        <Image src="/search.svg" width="20" className="absolute left-1 top-2" height="20" alt="search" />
                        <input type="text" className="form-input w-full ltr:pl-9 lg:w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                    <div className="flex items-center justify-end gap-2">
                        <button
                            onClick={() => {
                                router.push('/admin/emailling/sendemail');
                            }}
                            type="button"
                            className="btn btn-primary gap-2 border-[#26A8F4] bg-[#26A8F4]"
                        >
                            <svg className="hidden h-5 w-5 lg:block" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            New Compaign
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
                                className={`table-hover whitespace-nowrap`}
                                sx={
                                    !isDesktop
                                        ? {
                                              table: {
                                                  borderCollapse: 'collapse',
                                                  display: 'flex',
                                                  overflowX: 'scroll',
                                                  border: '1px solid #53535366',
                                                  borderRadius: '5px',

                                                  thead: {
                                                      display: 'flex',
                                                      flexShrink: 0,
                                                      minWidth: 'min-content',
                                                      position: 'absolute',
                                                      top: 0,
                                                      left: 0,
                                                      height: '100%',

                                                      tr: {
                                                          display: 'flex',
                                                          alignItems: 'center',
                                                          flexDirection: 'column',
                                                          minWidth: 'min-content',
                                                          flexShrink: 0,
                                                          backgroundColor: '#26A8F4',
                                                          height: '100%',

                                                          th: {
                                                              display: 'block',
                                                              width: '100%',
                                                              height: '100%',
                                                          },
                                                      },
                                                  },

                                                  tbody: {
                                                      display: 'flex',
                                                      marginLeft: '80px',
                                                      tr: {
                                                          display: 'flex',
                                                          flexDirection: 'column',
                                                          minWidth: 'min-content',
                                                          flexShrink: 0,
                                                          alignItems: 'center',
                                                          td: {
                                                              display: 'block',
                                                              textAlign: 'center',
                                                          },
                                                      },
                                                  },
                                              },
                                          }
                                        : {}
                                }
                                records={records}
                                columns={[
                                    {
                                        accessor: 'Title',
                                        render: ({ title }) => (
                                            <div className="flex items-center font-semibold">
                                                <div>{title.length > 19 ? title.substring(0, 20).concat('...') : title}</div>
                                            </div>
                                        ),
                                    },
                                    {
                                        accessor: 'Date',
                                        titleClassName: 'text-right',
                                        render: ({ sentdAt }) => <div className=" font-semibold">{`${formatDateToString(new Date(sentdAt))}`}</div>,
                                    },
                                    {
                                        accessor: 'Status',
                                        render: (row: AllMails) => {
                                            const status = row.Sent === 'Yes' ? 'Delivered' : 'Undelivered';
                                            const bgColor = status === 'Delivered' ? 'bg-[#00ab563e]' : 'bg-[#ea443538]';
                                            const textColor = status === 'Delivered' ? 'text-[#00AB55]' : 'text-[#EA4335]';

                                            return (
                                                <div className={`${bgColor} flex w-[100px] items-center justify-center rounded-3xl px-4 py-1`}>
                                                    <span className={`font-semibold ${textColor} `}>{status}</span>
                                                </div>
                                            );
                                        },
                                    },
                                    {
                                        accessor: 'Sent',
                                        render: (row) => <div className="font-bold text-gray-500">{(row.Sent = 'Yes')}</div>,
                                    },

                                    // {
                                    //     accessor: 'Viewed',
                                    //     titleClassName: 'text-right',
                                    //     render: (row) => <div className=" font-bold text-gray-500">{(row.Viewed = 'Yes')}</div>,
                                    // },
                                    // {
                                    //     accessor: 'Clicked',
                                    //     titleClassName: 'text-right',
                                    //     render: () => <div className=" font-bold text-gray-500">Yes</div>,
                                    // },

                                    {
                                        accessor: 'action',
                                        title: 'Actions',
                                        sortable: false,
                                        textAlignment: 'center',
                                        render: (user) => (
                                            <>
                                                {isDesktop ? (
                                                    <div className="mx-auto flex w-max items-center gap-4">
                                                        <button
                                                            className="flex hover:text-info"
                                                            onClick={() => {
                                                                toggleOpenCloseEdit();
                                                                selectUserEdit(user);
                                                            }}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                                <path
                                                                    d="M21.93 6.75996L18.56 20.29C18.443 20.7792 18.1639 21.2145 17.7681 21.525C17.3723 21.8355 16.883 22.0029 16.38 22H3.23999C1.72999 22 0.649992 20.52 1.09999 19.07L5.30999 5.54996C5.45067 5.09146 5.73417 4.6899 6.11914 4.40388C6.50411 4.11785 6.9704 3.96231 7.44999 3.95996H19.75C20.7 3.95996 21.49 4.53996 21.82 5.33996C22.01 5.76996 22.05 6.25996 21.93 6.75996Z"
                                                                    stroke="currentColor"
                                                                    strokeWidth="1.5"
                                                                    strokeMiterlimit="10"
                                                                />
                                                                <path
                                                                    d="M16 22H20.78C22.07 22 23.08 20.9101 22.99 19.6201L22 6.00005M9.68001 6.38005L10.72 2.06005M16.38 6.39005L17.32 2.05005M7.70001 12H15.7M6.70001 16H14.7"
                                                                    stroke="currentColor"
                                                                    strokeWidth="1.5"
                                                                    strokeMiterlimit="10"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                />
                                                            </svg>
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="flex hover:text-info"
                                                            onClick={() => {
                                                                const userJson = JSON.stringify(user);
                                                                router.push({
                                                                    pathname: '/admin/emailling/mailinglist',
                                                                    query: { selectedUser: userJson },
                                                                });
                                                            }}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                                <path
                                                                    d="M17.7776 4.33334C19.8793 4.33334 21.5693 6.03418 21.5693 8.12501C21.5693 10.1725 19.9443 11.8408 17.9184 11.9167C17.8249 11.9058 17.7304 11.9058 17.6368 11.9167M19.8684 21.6667C20.6484 21.5042 21.3851 21.19 21.9918 20.7242C23.6818 19.4567 23.6818 17.3658 21.9918 16.0983C21.3959 15.6433 20.6701 15.34 19.9009 15.1667M9.92344 11.7758C9.81511 11.765 9.68511 11.765 9.56594 11.7758C8.3225 11.7336 7.14431 11.2091 6.28088 10.3133C5.41745 9.41752 4.93658 8.22083 4.94011 6.97668C4.94011 4.32251 7.08511 2.16668 9.75011 2.16668C11.0244 2.14369 12.2556 2.62784 13.1728 3.51262C14.0901 4.3974 14.6184 5.61034 14.6414 6.88459C14.6643 8.15885 14.1802 9.39004 13.2954 10.3073C12.4106 11.2246 11.1977 11.7529 9.92344 11.7758ZM4.50678 15.7733C1.88511 17.5283 1.88511 20.3883 4.50678 22.1325C7.48594 24.1258 12.3718 24.1258 15.3509 22.1325C17.9726 20.3775 17.9726 17.5175 15.3509 15.7733C12.3826 13.7908 7.49678 13.7908 4.50678 15.7733Z"
                                                                    stroke="currentColor"
                                                                    strokeWidth="1.5"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="dropdown">
                                                        <Dropdown
                                                            offset={[0, 5]}
                                                            placement={'top-start'}
                                                            button={
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6">
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                                                                    />
                                                                </svg>
                                                            }
                                                        >
                                                            <ul>
                                                                <li>
                                                                    <button
                                                                        className="flex font-semibold hover:text-info"
                                                                        onClick={() => {
                                                                            toggleOpenCloseEdit();
                                                                            selectUserEdit(user);
                                                                        }}
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" className="mr-2">
                                                                            <path
                                                                                d="M21.93 6.75996L18.56 20.29C18.443 20.7792 18.1639 21.2145 17.7681 21.525C17.3723 21.8355 16.883 22.0029 16.38 22H3.23999C1.72999 22 0.649992 20.52 1.09999 19.07L5.30999 5.54996C5.45067 5.09146 5.73417 4.6899 6.11914 4.40388C6.50411 4.11785 6.9704 3.96231 7.44999 3.95996H19.75C20.7 3.95996 21.49 4.53996 21.82 5.33996C22.01 5.76996 22.05 6.25996 21.93 6.75996Z"
                                                                                stroke="currentColor"
                                                                                strokeWidth="1.5"
                                                                                strokeMiterlimit="10"
                                                                            />
                                                                            <path
                                                                                d="M16 22H20.78C22.07 22 23.08 20.9101 22.99 19.6201L22 6.00005M9.68001 6.38005L10.72 2.06005M16.38 6.39005L17.32 2.05005M7.70001 12H15.7M6.70001 16H14.7"
                                                                                stroke="currentColor"
                                                                                strokeWidth="1.5"
                                                                                strokeMiterlimit="10"
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                            />
                                                                        </svg>
                                                                        Show
                                                                    </button>
                                                                </li>
                                                                <li>
                                                                    <button
                                                                        type="button"
                                                                        className="flex font-semibold hover:text-info"
                                                                        onClick={() => {
                                                                            const userJson = JSON.stringify(user);
                                                                            router.push({
                                                                                pathname: '/admin/emailling/mailinglist',
                                                                                query: { selectedUser: userJson },
                                                                            });
                                                                        }}
                                                                    >
                                                                        <svg className="mr-2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                                            <path
                                                                                d="M17.7776 4.33334C19.8793 4.33334 21.5693 6.03418 21.5693 8.12501C21.5693 10.1725 19.9443 11.8408 17.9184 11.9167C17.8249 11.9058 17.7304 11.9058 17.6368 11.9167M19.8684 21.6667C20.6484 21.5042 21.3851 21.19 21.9918 20.7242C23.6818 19.4567 23.6818 17.3658 21.9918 16.0983C21.3959 15.6433 20.6701 15.34 19.9009 15.1667M9.92344 11.7758C9.81511 11.765 9.68511 11.765 9.56594 11.7758C8.3225 11.7336 7.14431 11.2091 6.28088 10.3133C5.41745 9.41752 4.93658 8.22083 4.94011 6.97668C4.94011 4.32251 7.08511 2.16668 9.75011 2.16668C11.0244 2.14369 12.2556 2.62784 13.1728 3.51262C14.0901 4.3974 14.6184 5.61034 14.6414 6.88459C14.6643 8.15885 14.1802 9.39004 13.2954 10.3073C12.4106 11.2246 11.1977 11.7529 9.92344 11.7758ZM4.50678 15.7733C1.88511 17.5283 1.88511 20.3883 4.50678 22.1325C7.48594 24.1258 12.3718 24.1258 15.3509 22.1325C17.9726 20.3775 17.9726 17.5175 15.3509 15.7733C12.3826 13.7908 7.49678 13.7908 4.50678 15.7733Z"
                                                                                stroke="currentColor"
                                                                                strokeWidth="1.5"
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                            />
                                                                        </svg>
                                                                        Mailing List
                                                                    </button>
                                                                </li>
                                                            </ul>
                                                        </Dropdown>
                                                    </div>
                                                )}
                                            </>
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
                                sortStatus={sortStatus}
                                onSortStatusChange={setSortStatus}
                                paginationText={({ from, to, totalRecords }) => `${isDesktop ? `Showing  ${from} to ${to} of ${totalRecords} entries` : `${from} - ${to} / ${totalRecords}`} `}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Emailing;
