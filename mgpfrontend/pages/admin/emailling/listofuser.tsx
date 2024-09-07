import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useState, useEffect } from 'react';
import { Allusers } from '@/type';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import Image from 'next/image';
import api from '@/api';
import { useMediaQuery } from '@/components/hooks/useMediaQuery';

const ListofUser = () => {
    const router = useRouter();
    const ContentofEmail = router.query.ContentofEmail ? JSON.parse(router.query.ContentofEmail as string) : null;

    const [items, setItems] = useState<Allusers[]>();
    const [EmailSelected, setEmailSelected] = useState<string | string[]>();
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState<Allusers[] | undefined>([]);
    const [records, setRecords] = useState<Allusers[] | undefined>(initialRecords);
    const [selectedRecords, setSelectedRecords] = useState<any>([]);
    const ApiUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'firstName',
        direction: 'asc',
    });
    const isDesktop = useMediaQuery('(min-width: 1024px)');

    // Fetch AllUser
    const fetchAllUsers = async () => {
        try {
            const response = await api.get(`/users/all`);
            setItems(response.data);
            setInitialRecords(response.data);
            setRecords(response.data);
        } catch (error) {
            console.error('Failed to fetch Users', error);
        }
    };
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                await fetchAllUsers();
                setIsLoading(false);
            } catch (error) {
                console.error('Error :', error);
            }
        };

        fetchAllData();
    }, []);

    // PaginationText
    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecords([...(initialRecords || []).slice(from, to)]);
    }, [page, pageSize, initialRecords]);

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    // Func Search bar
    useEffect(() => {
        setInitialRecords(() => {
            return items?.filter((item) => {
                return (
                    item.firstname.toLowerCase().includes(search.toLowerCase()) ||
                    item.lastname.toLowerCase().includes(search.toLowerCase()) ||
                    item.email.toLowerCase().includes(search.toLowerCase()) ||
                    item.createdAt.toLowerCase().includes(search.toLowerCase())
                );
            });
        });
    }, [search]);

    // Choose Email Selected
    useEffect(() => {
        const emails = selectedRecords.map((record: any) => record.email);
        setEmailSelected(emails);
        console.log(EmailSelected);
    }, [selectedRecords]);

    // Send Email
    const handleSendEmail = async (type: string) => {
        console.log('content:', ContentofEmail);
        console.log('emailsl:', EmailSelected);

        const sendEmail = {
            subject: ContentofEmail.title as string,
            body: ContentofEmail.text as string,
            to: EmailSelected as string | string[],
        };

        // const ContentofEmailCreate = {
        //     mail: ContentofEmail as string,
        // };
        console.log('ALL:', sendEmail);

        if (type === 'send email') {
            const result = await Swal.fire({
                icon: 'warning',
                text: ' You want to send this mail !! ',
                showCancelButton: true,
                confirmButtonText: 'Send',
                padding: '2em',
                customClass: 'sweet-alerts ',
            });

            if (result.value) {
                try {
                    const response = await api.post(`/mails/send`, sendEmail);
                    // const responseContentEmail = await api.post(`/mails/save`, ContentofEmailCreate);

                    console.log('Created Succ', response.data);
                    Swal.fire({ text: 'Email has been Sended.', icon: 'success', customClass: 'sweet-alerts' });
                    router.push('/admin/emailling');
                } catch (error) {
                    console.error('Error creating user:', error);
                    Swal.fire({ text: 'Email has not been Sended.', icon: 'warning', customClass: 'sweet-alerts' });
                }
            }
        }
    };

    return (
        <div className="mx-4 mt-4">
            <div className="relative  mb-6 mt-1 space-y-4 lg:mt-8">
                <h1 className="text-xl font-bold   lg:text-2xl ">List of user</h1>

                <div className="lf:items-center mb-4.5 flex flex-col-reverse gap-5 lg:flex-row lg:justify-between">
                    <div className="relative rounded-md rtl:mr-auto">
                        <Image src="/search.svg" width="20" className="absolute left-1 top-2" height="20" alt="search" />
                        <input type="text" className="form-input w-full ltr:pl-9 lg:w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
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
                <>
                    <div className="lg:panel border-white-light px-0 pt-0 dark:border-[#1b2e4b]">
                        <div className="users-table">
                            <div className="datatables pagination-padding">
                                <DataTable
                                    className="table-hover whitespace-nowrap"
                                    records={records}
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
                                                              backgroundColor: '#26A8F4',
                                                              height: '100%',
                                                              th: {
                                                                  display: 'block',
                                                                  width: '100%',
                                                                  height: '100%',
                                                                  paddingLeft: '5px !important',
                                                                  paddingRight: '5px !important',
                                                                  div: {
                                                                      textAlign: 'center',
                                                                      fontSize: '12px',
                                                                  },
                                                              },
                                                          },
                                                      },

                                                      tbody: {
                                                          display: 'flex',
                                                          marginLeft: '71px',
                                                          tr: {
                                                              display: 'flex',
                                                              alignItems: 'center',
                                                              flexDirection: 'column',
                                                              backgroundColor: '#26A8F4',
                                                              height: '100%',
                                                              td: {
                                                                  display: 'block',
                                                                  textAlign: 'center',
                                                                  width: '100%',
                                                                  div: {
                                                                      fontSize: '12px',
                                                                  },
                                                              },
                                                          },
                                                      },
                                                  },
                                              }
                                            : {}
                                    }
                                    columns={[
                                        {
                                            accessor: 'Full Name',
                                            textAlignment: 'center',
                                            render: ({ firstname, lastname }) => (
                                                <div className=" !text-center font-semibold">
                                                    <div>{`${firstname} ${lastname}`}</div>
                                                </div>
                                            ),
                                        },
                                        {
                                            accessor: 'Email',
                                            textAlignment: 'center',
                                            render: ({ email }) => <div className="!text-center font-semibold">{email}</div>,
                                        },
                                        {
                                            accessor: 'Subscribed',
                                            textAlignment: 'center',
                                            render: ({ subscribed }) => <div className="!text-center font-semibold">{subscribed === true ? 'Yes' : 'No'}</div>,
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
                                    selectedRecords={selectedRecords}
                                    onSelectedRecordsChange={setSelectedRecords}
                                    paginationText={({ from, to, totalRecords }) => `${isDesktop ? `Showing  ${from} to ${to} of ${totalRecords} entries` : `${from} - ${to} / ${totalRecords}`} `}
                                />
                            </div>
                        </div>
                    </div>
                    <button
                        type="button"
                        className="btn btn-info ml-auto mt-8 gap-2 px-12"
                        onClick={() => {
                            handleSendEmail('send email');
                        }}
                    >
                        Send
                    </button>
                </>
            )}
        </div>
    );
};

export default ListofUser;
