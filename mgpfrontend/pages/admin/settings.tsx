import React, { ChangeEvent, useEffect, useState } from 'react';
import { Tab } from '@headlessui/react';
import { Fragment } from 'react';
import { DataTable } from 'mantine-datatable';
import Swal from 'sweetalert2';
import { AllPayment } from '@/type';
import api from '@/api';
import { useMediaQuery } from '@/components/hooks/useMediaQuery';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import { IRootState } from '@/store';
import { useSelector } from 'react-redux';
import axios from 'axios';
import UpdateHomeForm from '@/components/Forms/UpdateHomeForm';

interface FormState {
    title: string;
    title_background: string | null;
    slide_1_text: string;
    slide_1_img: string | null;
    slide_1_description: string;
    slide_2_text: string;
    slide_2_img: string | null;
    slide_2_description: string;
    slide_3_text: string;
    slide_3_img: string | null;
    slide_3_description: string;
}

type FormStateKey = keyof FormState;

interface ImageType {
    file: File; // Define the properties of your image object
    dataURL: string;
    // Add other properties as needed
}

interface Images {
    [key: string]: Array<ImageType>; // Replace ImageType with the actual type of your images
}

export const Settings = () => {
    const userId = useSelector((state: IRootState) => (state.auth.value?.user?.id ? state.auth.value.user.id : null));
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const isDesktop = useMediaQuery('(min-width: 1024px)');
    const [RelaunchDataPayment, setRelaunchDataPayment] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [items, setItems] = useState();
    const [initialRecords, setInitialRecords] = useState<AllPayment[] | undefined>([]);
    const [records, setRecords] = useState<AllPayment[] | undefined>(initialRecords);
    const [selectedRecords, setSelectedRecords] = useState<any>([]);
    const ApiUrl = process.env.NEXT_PUBLIC_API_FRONT_URI;
    const [WhichField, setWhichField] = useState<string>();
    const [ToggleMessageAlert, setToggleMessageAlert] = useState<boolean>();
    const [MessageAlert, setMessageAlert] = useState<string>();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [images, setImages] = useState<any>([]);
    const [user, setUser] = useState<any>({});
    const authSelector: any = useSelector((state: IRootState) => state?.auth);
    const [settingData, setsettingData] = useState({
        firstname: '',
        lastname: '',
        username: '',
        email: '',
        password: '',
        confirmpassword: '',
        status: '',
        role: '',
    });
    const [page, setPage] = useState(1);
    const [olderImage, setOlderImage] = useState<string | Blob>('');

    const handleImageUpload = (imageList: ImageListType) => {
        const uploadedFile = imageList[0]?.file || null;
        if (uploadedFile) {
            // Get the current timestamp
            const timestamp = Date.now();

            // Create a new File object with the updated name
            const renamedFile = new File([uploadedFile], timestamp + '-' + uploadedFile.name, {
                type: uploadedFile.type,
                lastModified: uploadedFile.lastModified,
            });

            setSelectedFile(renamedFile);
        }
        setImages(imageList);
        setOlderImage(user?.profile_logo as string);
    };

    // Fetch user By id
    const fetchUserById = async () => {
        try {
            const response = await api.get(`${process.env.NEXT_PUBLIC_BASE_URL}/users/${authSelector?.value?.user?.id}`);
            if (response.status === 200) {
                setUser(response.data);
                setsettingData({
                    ...settingData,
                    firstname: response.data?.firstname,
                    lastname: response.data?.lastname,
                    username: response.data?.username,
                    email: response.data?.email,
                    status: response.data?.status,
                    role: response.data?.role,
                });
                console.log(response.data);
                if (response.data?.profile_logo) {
                    const imageFromUrl = urlToImage(user.profile_logo);
                    setImages([imageFromUrl]);
                } else {
                    setImages([]); // Effacez les images si profile_logo est vide
                }
            }
        } catch (error) {
            console.error('Failed to fetch Users', error);
        }
    };

    const urlToImage = (url: string) => {
        return {
            dataURL: url,
        };
    };

    useEffect(() => {
        fetchUserById();
    }, []);

    useEffect(() => {
        console.log(settingData);
        setIsLoading(false);
    }, [settingData]);

    useEffect(() => {
        setTimeout(() => {
            setToggleMessageAlert(false);
        }, 5500);
    }, [ToggleMessageAlert]);

    const validateField = (field: string, value: string, regex?: RegExp, minLength?: number, maxLength?: number) => {
        setWhichField(field);
        if (minLength && value.length < minLength) {
            setMessageAlert(`Please check ${field}. It must contain at least ${minLength} characters.`);
            setToggleMessageAlert(true);
            return false;
        }
        if (maxLength && value.length > maxLength) {
            setMessageAlert(`Please check ${field}. It must not exceed ${maxLength} characters.`);
            setToggleMessageAlert(true);
            return false;
        }
        if (regex && !regex.test(value)) {
            setMessageAlert(`Please check ${field}.`);
            setToggleMessageAlert(true);
            return false;
        }
        return true;
    };

    const EditUsershowAlert = async (type: string, e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const settingDataForm = {
            firstname: formData.get('firstname') as string,
            lastname: formData.get('lastname') as string,
            username: formData.get('username') as string,
            email: formData.get('email') as string,
            password: formData.get('password') as string,
            confirmPassword: (formData.get('confirmPassword') as string) || settingData.confirmpassword,
            status: formData.get('status') as string,
            role: formData.get('role') as string,
        };
        console.log('inside', settingDataForm);

        const formDataToSubmit = new FormData();

        formDataToSubmit.append('firstname', settingDataForm.firstname);
        formDataToSubmit.append('lastname', settingDataForm.lastname);
        formDataToSubmit.append('username', settingDataForm.username);
        formDataToSubmit.append('email', settingDataForm.email);
        formDataToSubmit.append('password', settingDataForm.password);
        formDataToSubmit.append('confirmPassword', settingDataForm.confirmPassword);
        formDataToSubmit.append('status', settingDataForm.status);
        formDataToSubmit.append('role', settingDataForm.role);
        if (selectedFile) {
            formDataToSubmit.append('profile_logo', selectedFile);
        }

        if (
            !validateField('firstname', settingDataForm.firstname, undefined, 2, 50) ||
            !validateField('lastname', settingDataForm.lastname, undefined, 2, 50) ||
            !validateField('username', settingDataForm.username, undefined, 2, 50) ||
            !validateField('email', settingDataForm.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, undefined, 255) ||
            (settingDataForm.password && !validateField('password', settingDataForm.password, /[A-Z]/, 8)) ||
            (settingDataForm.password && !validateField('password', settingDataForm.password, /[a-z]/)) ||
            (settingDataForm.password && !validateField('password', settingDataForm.password, /\d/)) ||
            (settingDataForm.password && !validateField('password', settingDataForm.password, /[!@#$%&*=]/))
        ) {
            return;
        }

        if (settingDataForm.password && settingDataForm.password !== settingDataForm.confirmPassword) {
            setMessageAlert("Passwords don't match");
            setWhichField('confirmPassword');
            setToggleMessageAlert(true);
            console.log('gg');
            return;
        }

        if (type === 'updateuser') {
            console.log('yes im here');

            const result = await Swal.fire({
                icon: 'info',
                text: `You want to Edit User`,
                showCancelButton: true,
                confirmButtonText: 'Update',
                padding: '2em',
                customClass: 'sweet-alerts',
            });

            if (result.value) {
                try {
                    const response = await api.put(`/users/update/${userId}`, formDataToSubmit);

                    if (response.status === 200) {
                        /* Image update locally */
                        const saveImage = new FormData();
                        if (selectedFile) {
                            saveImage.append('Myimage', selectedFile);
                            olderImage && saveImage.append('oldImage', olderImage);
                        }

                        if (saveImage) {
                            const imageRes = await axios.post(`${ApiUrl}/api/upload`, saveImage);
                            if (imageRes.status === 200) {
                                console.log('File uploaded successfully:');
                            } else {
                                console.error('File upload failed:');
                            }
                        }
                        /* Image update locally */
                        console.log('Created Succ', response.data);
                        console.log(settingDataForm);
                        Swal.fire({ text: 'Modifications has been done.', icon: 'success', customClass: 'sweet-alerts' });
                        setImages([]);
                        document.querySelectorAll('.form-input').forEach((input) => {
                            if (input instanceof HTMLInputElement) {
                                input.value = '';
                            }
                        });
                    }
                } catch (error) {
                    console.error('Error creating user:', error);
                    Swal.fire({ text: 'Modifiactions has not been done.', icon: 'warning', customClass: 'sweet-alerts' });
                    setImages([]);
                    document.querySelectorAll('.form-input').forEach((input) => {
                        if (input instanceof HTMLInputElement) {
                            input.value = '';
                        }
                    });
                }
            }
        }
    };

    // Fetch All Payment
    const fetchAllPayment = async () => {
        try {
            const response = await api.get(`/payment/all`);
            setItems(response.data);
            setInitialRecords(response.data);
            setRecords(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Failed to fetch Payments Details', error);
        }
    };

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                await fetchAllPayment();
                setIsLoading(false);
                setRelaunchDataPayment(false);
            } catch (error) {
                console.error('Error :', error);
            }
        };

        fetchAllData();
    }, [RelaunchDataPayment]);

    const handleSettingDate = (e: ChangeEvent<HTMLInputElement>) => {
        setsettingData({
            ...settingData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <>
            <div className="panel">
                <Tab.Group>
                    <Tab.List className="mt-3 flex flex-wrap">
                        <Tab as={Fragment}>
                            {({ selected }) => (
                                <button
                                    className={`${
                                        selected ? 'stroke-info text-info !outline-none before:!w-full' : 'stroke-[#0E1726]'
                                    } md:px5 relative -mb-[1px] flex items-center gap-2 px-2 py-3 before:absolute
                                before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0
                                 before:bg-info before:transition-all before:duration-700 hover:text-info hover:before:w-full`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 26 26" fill="none">
                                        <path
                                            d="M3.25 9.75008L13 2.16675L22.75 9.75008V21.6667C22.75 22.2414 22.5217 22.7925 22.1154 23.1988C21.7091 23.6051 21.158 23.8334 20.5833 23.8334H5.41667C4.84203 23.8334 4.29093 23.6051 3.8846 23.1988C3.47827 22.7925 3.25 22.2414 3.25 21.6667V9.75008Z"
                                            stroke=""
                                            stroke-opacity="0.42"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path d="M9.75 23.8333V13H16.25V23.8333" stroke="" stroke-opacity="0.42" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Home
                                </button>
                            )}
                        </Tab>
                        <Tab as={Fragment}>
                            {({ selected }) => (
                                <button
                                    className={`${
                                        selected ? 'stroke-info text-info !outline-none before:!w-full' : 'stroke-[#0E1726]'
                                    } md:px5 relative -mb-[1px] flex items-center gap-2 px-2 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-info before:transition-all before:duration-700 hover:text-info hover:before:w-full`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 20" fill="none">
                                        <path d="M10 0.833252V19.1666" stroke="" strokeLinecap="round" strokeLinejoin="round" />
                                        <path
                                            d="M14.1667 4.16675H7.91667C7.14312 4.16675 6.40125 4.47404 5.85427 5.02102C5.30729 5.568 5 6.30987 5 7.08341C5 7.85696 5.30729 8.59883 5.85427 9.14581C6.40125 9.69279 7.14312 10.0001 7.91667 10.0001H12.0833C12.8569 10.0001 13.5987 10.3074 14.1457 10.8544C14.6927 11.4013 15 12.1432 15 12.9167C15 13.6903 14.6927 14.4322 14.1457 14.9791C13.5987 15.5261 12.8569 15.8334 12.0833 15.8334H5"
                                            stroke=""
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    Payment Details
                                </button>
                            )}
                        </Tab>
                        <Tab as={Fragment}>
                            {({ selected }) => (
                                <button
                                    className={`${
                                        selected ? 'stroke-info text-info !outline-none before:!w-full' : 'stroke-[#0E1726]'
                                    } md:px5 relative -mb-[1px] flex items-center gap-2 px-2 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-info before:transition-all before:duration-700 hover:text-info hover:before:w-full`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                                        />
                                    </svg>
                                    Home images
                                </button>
                            )}
                        </Tab>
                    </Tab.List>
                    <Tab.Panels>
                        <Tab.Panel>
                            <form onSubmit={(e: ChangeEvent<HTMLFormElement>) => EditUsershowAlert('updateuser', e)}>
                                <div className="pt-5">
                                    <h1 className="text-base font-semibold md:text-lg lg:text-xl ">General Information</h1>
                                    <div className=" flex items-start ">
                                        <div className="mt-4 flex w-full flex-col items-center lg:flex-row">
                                            <div className=" h-full w-full ltr:mr-4 rtl:ml-4 md:h-32 md:w-32 lg:h-40 lg:w-40">
                                                <ImageUploading value={images} onChange={handleImageUpload}>
                                                    {({ imageList, onImageUpload }) => (
                                                        <div className="upload__image-wrapper">
                                                            {images.length === 0 ? (
                                                                <div className="row-span-full  m-auto w-fit cursor-pointer" onClick={onImageUpload}>
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        width={isDesktop ? '90%' : '55'}
                                                                        height={isDesktop ? '90%' : '55'}
                                                                        viewBox="0 0 90 90"
                                                                        fill="none"
                                                                    >
                                                                        <circle cx="45" cy="45" r="45" fill="black" fillOpacity="0.27" />
                                                                        <path d="M27 46H63M45 64V28" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                                                    </svg>
                                                                </div>
                                                            ) : (
                                                                ''
                                                            )}
                                                            {imageList.map((image, index) => (
                                                                <div key={index} className="custom-file-container__image-preview flex h-[100%] w-[100%] items-center justify-center overflow-hidden">
                                                                    <div className="relative m-auto h-[90%] w-[90%]">
                                                                        <div className="label-container absolute -right-1 -top-1 z-50">
                                                                            <button
                                                                                type="button"
                                                                                className="custom-file-container__image-clear"
                                                                                title="Clear Image"
                                                                                onClick={() => {
                                                                                    setImages([]);
                                                                                }}
                                                                            >
                                                                                <svg
                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                    width="23"
                                                                                    height="23"
                                                                                    viewBox="0 0 33 33"
                                                                                    fill="none"
                                                                                    className="cursor-pointer"
                                                                                >
                                                                                    <path d="M24.75 8.25L8.25 24.75" stroke="#0E1726" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                                    <path d="M8.25 8.25L24.75 24.75" stroke="#0E1726" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                                </svg>
                                                                            </button>
                                                                        </div>
                                                                        <img
                                                                            src={selectedFile ? image?.dataURL : `/assets/uploads/${user?.profile_logo}`}
                                                                            alt="img"
                                                                            className="m-auto h-[110px] w-[110px] overflow-hidden rounded-full object-contain"
                                                                            onClick={onImageUpload}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </ImageUploading>
                                            </div>
                                            <div className="grid w-full flex-auto grid-cols-1 gap-3 lg:grid-cols-2">
                                                <div>
                                                    <label>Username</label>
                                                    <input
                                                        onChange={handleSettingDate}
                                                        defaultValue={user?.username}
                                                        id="gridUsername"
                                                        type="text"
                                                        name="username"
                                                        placeholder="Enter Username"
                                                        className="form-input"
                                                    />
                                                </div>
                                                <div>
                                                    <label>Email</label>
                                                    <input
                                                        onChange={handleSettingDate}
                                                        defaultValue={user?.email}
                                                        id="gridEmail"
                                                        type="email"
                                                        name="email"
                                                        placeholder="Enter Email"
                                                        className="form-input"
                                                    />
                                                </div>
                                                <div>
                                                    <label>First Name</label>
                                                    <input
                                                        onChange={handleSettingDate}
                                                        defaultValue={user?.firstname}
                                                        id="gridFirstname"
                                                        type="text"
                                                        name="firstname"
                                                        placeholder="Enter First Name"
                                                        className="form-input"
                                                    />
                                                </div>

                                                <div>
                                                    <label>Last Name</label>
                                                    <input
                                                        onChange={handleSettingDate}
                                                        defaultValue={user?.lastname}
                                                        id="gridLastname"
                                                        type="text"
                                                        name="lastname"
                                                        placeholder="Enter Last Name"
                                                        className="form-input"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-10">
                                    <h1 className="text-base font-semibold md:text-lg lg:text-xl">Personal Information</h1>
                                    <div className=" flex items-start ">
                                        <div className="mt-4 flex w-full items-center">
                                            <div className="grid w-full flex-auto grid-cols-1 gap-3 lg:grid-cols-4">
                                                <div className="col-span-2">
                                                    <label>New Password</label>
                                                    <input onChange={handleSettingDate} id="gridPassword" type="password" name="password" placeholder="Enter New Password" className="form-input" />
                                                </div>
                                                <div className="col-span-2">
                                                    <label>Confirm Password</label>
                                                    <input
                                                        onChange={handleSettingDate}
                                                        id="gridConfirmPassword"
                                                        type="password"
                                                        name="confirmpassword"
                                                        placeholder="Confirm Your Password"
                                                        className="form-input"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-info m-auto !mt-6 ml-auto w-[100%]">
                                    Save
                                </button>
                            </form>
                        </Tab.Panel>
                        <Tab.Panel>
                            <div className="active pt-5">
                                <div className="panel border-white-light px-0 pt-0 dark:border-[#1b2e4b]">
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
                                                                              div: {
                                                                                  width: '65px',
                                                                              },
                                                                          },
                                                                      },
                                                                  },

                                                                  tbody: {
                                                                      display: 'flex',
                                                                      marginLeft: '96px',
                                                                      tr: {
                                                                          display: 'flex',
                                                                          alignItems: 'center',
                                                                          flexDirection: 'column',
                                                                          backgroundColor: '#26A8F4',
                                                                          height: '100%',
                                                                          td: {
                                                                              display: 'block',
                                                                              textAlign: 'center',
                                                                              height: '100%',
                                                                              width: '100%',
                                                                          },
                                                                      },
                                                                  },
                                                              },
                                                          }
                                                        : {}
                                                }
                                                columns={[
                                                    {
                                                        accessor: `${isDesktop ? 'Full Name' : 'Name'}`,
                                                        render: ({ user: { firstname, lastname } }) => <div className="font-semibol  hover:no-underline">{`${firstname} ${lastname}`}</div>,
                                                    },
                                                    {
                                                        accessor: 'Email',
                                                        render: ({ user: { email } }) => <div className="font-semibol w-28 whitespace-break-spaces break-words  hover:no-underline">{email}</div>,
                                                    },
                                                    {
                                                        accessor: 'Plan',
                                                        render: ({ plan: { name } }) => <div className="font-semibol  hover:no-underline">{`Plan ${name}`}</div>,
                                                    },
                                                    {
                                                        accessor: 'Price',
                                                        render: ({ plan: { price } }) => <div className="font-semibol  hover:no-underline">{`${price} $`}</div>,
                                                    },
                                                    {
                                                        accessor: 'Date',
                                                        render: ({ payment_date }) => <div className="font-semibol  hover:no-underline">{new Date(payment_date).toDateString()}</div>,
                                                    },
                                                ]}
                                                highlightOnHover
                                                totalRecords={initialRecords?.length}
                                                recordsPerPage={pageSize}
                                                page={page}
                                                onPageChange={(p) => setPage(p)}
                                                recordsPerPageOptions={PAGE_SIZES}
                                                onRecordsPerPageChange={setPageSize}
                                                paginationText={({ from, to, totalRecords }) =>
                                                    `${isDesktop ? `Showing  ${from} to ${to} of ${totalRecords} entries` : `${from} - ${to} / ${totalRecords}`} `
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Tab.Panel>
                        <Tab.Panel>
                            <div className="pt-5">
                                <UpdateHomeForm />
                            </div>
                        </Tab.Panel>
                    </Tab.Panels>
                </Tab.Group>
            </div>
        </>
    );
};

export default Settings;
