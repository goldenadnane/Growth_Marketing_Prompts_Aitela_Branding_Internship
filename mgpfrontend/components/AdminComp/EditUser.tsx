import React, { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { SelectedUserDataEdit } from '@/type';
import Swal from 'sweetalert2';
import Image from 'next/image';
import api from '@/api';
import { useMediaQuery } from '../hooks/useMediaQuery';
import Select from 'react-select';
import axios from 'axios';

type EditUserProp = {
    toggleOpenCloseEdit: () => void;
    selectedUser: SelectedUserDataEdit | undefined;
    setSelectedUser: Dispatch<SetStateAction<SelectedUserDataEdit | undefined>>;
    setRelaunchDataUser: Dispatch<SetStateAction<boolean>>;
};

const EditUser = ({ toggleOpenCloseEdit, selectedUser, setSelectedUser, setRelaunchDataUser }: EditUserProp) => {
    const [images, setImages] = useState<ImageListType>([]);
    const isDesktop = useMediaQuery('(min-width: 1024px)');
    const [editUserData, setEditUserData] = useState<SelectedUserDataEdit | undefined>(selectedUser);
    const [MessageAlert, setMessageAlert] = useState<string>();
    const [ToggleMessageAlert, setToggleMessageAlert] = useState(false);
    const [RoleUser, setRoleUser] = useState<string>('');
    const [EditUser, setEditUser] = useState({
        firstname: selectedUser?.firstname,
        lastname: selectedUser?.lastname,
        username: selectedUser?.username,
        email: selectedUser?.email,
        password: selectedUser?.password,
        confirmPassword: selectedUser?.password,
        status: selectedUser?.status,
        role: selectedUser?.role,
        profile_logo: selectedUser?.profile_logo,
    });
    const [activeTab, setActiveTab] = useState<string>('inactive');
    const [selectedFile, setSelectedFile] = useState<File | null | undefined>(null);
    const [olderImage, setOlderImage] = useState<string | Blob>('');

    const optionRole = [
        { value: 'user', label: 'user' },
        { value: 'admin', label: 'admin' },
    ];

    // Callback to handle file selection
    // const handleImageUpload = (imageList: ImageListType | null) => {
    //     const uploadedFile = imageList ? imageList[0]?.file : selectedUser?.profile_logo;
    //     setSelectedFile(uploadedFile);
    //     setImages(imageList as never[]);
    // };

    const onChange = (imageList: ImageListType | null, addUpdateIndex: number[] | undefined) => {
        setImages(imageList as never[]);
        const uploadedFile = imageList ? imageList[0]?.file : null;
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
        setOlderImage(selectedUser?.profile_logo as string);
    };

    const urlToImage = (url: string) => {
        return {
            dataURL: url,
        };
    };

    useEffect(() => {
        if (selectedUser?.profile_logo) {
            const imageFromUrl = urlToImage(selectedUser.profile_logo);
            setImages([imageFromUrl]);
        } else {
            setImages([]); // Effacez les images si profile_logo est vide
        }
        if (selectedUser?.status === 'active') {
            setActiveTab('active');
        } else {
            setActiveTab('inactive');
        }
        console.log('EditUser', selectedUser?.profile_logo);
        console.log('file', selectedFile);
    }, []);

    const handleChangeInputs = (e: ChangeEvent<HTMLInputElement>) => {
        if (selectedUser) {
            setSelectedUser({
                ...selectedUser,
                [e.target.name]: e.target.value,
            });

            setEditUser({
                ...EditUser,
                [e.target.name]: e.target.value,
            });
        }
    };

    const SaveUpdateUser = (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const EditUser = {
            firstname: formData.get('firstname') || (selectedUser?.firstname as string),
            lastname: formData.get('lastname') || (selectedUser?.lastname as string),
            username: formData.get('username') || (selectedUser?.username as string),
            email: formData.get('email') as string,
            password: formData.get('password') as string,
            // confirmPassword: formData.get('confirmPassword') as string,
        };
        if (window.confirm('Are You sure to Edit this user ?')) {
            api.put(`/users/update/${selectedUser?.id}`, EditUser)
                .then((response) => {
                    console.log('Created Succ', response.data);
                    console.log(EditUser);
                    toggleOpenCloseEdit();
                })
                .catch((err) => {
                    console.error('Failed', err);
                });
        }
    };

    useEffect(() => {
        setTimeout(() => {
            setToggleMessageAlert(false);
        }, 5500);
    }, [ToggleMessageAlert]);

    const validateField = (field: string, value: string, regex?: RegExp, minLength?: number, maxLength?: number) => {
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

        const EditUser = {
            firstname: (formData.get('firstname') as string) || (selectedUser?.firstname as string),
            lastname: (formData.get('lastname') as string) || (selectedUser?.lastname as string),
            username: (formData.get('username') as string) || (selectedUser?.username as string),
            email: (formData.get('email') as string) || (selectedUser?.email as string),
            password: (formData.get('password') as string) || (selectedUser?.password as string),
            confirmPassword: (formData.get('confirmPassword') as string) || (selectedUser?.password as string),
            role: RoleUser,
            status: activeTab,
        };
        console.log(EditUser);

        const formDataToSubmit = new FormData();

        formDataToSubmit.append('firstname', EditUser.firstname);
        formDataToSubmit.append('lastname', EditUser.lastname);
        formDataToSubmit.append('username', EditUser.username);
        formDataToSubmit.append('email', EditUser.email);
        formDataToSubmit.append('password', EditUser.password);
        formDataToSubmit.append('confirmPassword', EditUser.confirmPassword);
        formDataToSubmit.append('status', EditUser.status);
        formDataToSubmit.append('role', EditUser.role);
        if (selectedFile) {
            console.log('Impossibale');
            formDataToSubmit.append('profile_logo', selectedFile);
            console.log(selectedFile);
        }

        if (
            !validateField('firstname', EditUser.firstname, undefined, 2, 50) ||
            !validateField('lastname', EditUser.lastname, undefined, 2, 50) ||
            !validateField('email', EditUser.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, undefined, 255) ||
            !validateField('username', EditUser.username, /^[a-zA-Z0-9_\-]+$/, 4, 50) ||
            !validateField('password', EditUser.password, /[A-Z]/, 8) ||
            !validateField('password', EditUser.password, /[a-z]/) ||
            !validateField('password', EditUser.password, /\d/) ||
            !validateField('password', EditUser.password, /[!@#$%&*=]/)
        ) {
            return;
        }

        if (EditUser.password !== EditUser.confirmPassword) {
            setMessageAlert("Passwords don't match");
            setToggleMessageAlert(true);
            return;
        }

        toggleOpenCloseEdit();

        if (type === 'update user') {
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
                    const response = await api.put(`/users/update/${selectedUser?.id}`, formDataToSubmit);

                    if (response.status === 200) {
                        const saveImage = new FormData();
                        if (selectedFile) {
                            saveImage.append('Myimage', selectedFile);
                            olderImage && saveImage.append('oldImage', olderImage);
                        }

                        if (saveImage) {
                            const imageRes = await axios.post('/api/upload', saveImage);
                            if (imageRes.status === 200) {
                                console.log('File uploaded successfully:');
                            } else {
                                console.error('File upload failed:');
                            }
                        }

                        console.log('Created Succ', response.data);
                        console.log(formDataToSubmit);
                        setRelaunchDataUser(true);
                        Swal.fire({ text: 'User has been Edited.', icon: 'success', customClass: 'sweet-alerts' });
                    }
                } catch (error) {
                    console.error('Error creating user:', error);
                    Swal.fire({ text: 'User has not been Edited.', icon: 'warning', customClass: 'sweet-alerts' });
                }
            }
        }
    };

    const handleChangeRoleUser = (selectedOption: { value: string; label: string } | null) => {
        if (selectedOption) {
            const selectedValue = selectedOption.value;
            setRoleUser(selectedValue);
            setEditUser({
                ...EditUser,
                role: selectedValue,
            });
        }
    };

    return (
        <>
            <div className="z-50 h-full w-full bg-black opacity-50 lg:absolute lg:left-0 lg:top-0"></div>
            <div className="fixed inset-0 z-10 flex items-end justify-center lg:z-50 lg:m-auto lg:h-[100%] lg:w-[50%] lg:items-center">
                <form
                    className="panel relative h-[93%] min-h-[50%] w-[100%]  overflow-auto rounded-lg bg-white lg:h-auto dark:lg:border dark:lg:border-[#e5e7eb]"
                    onSubmit={(e: ChangeEvent<HTMLFormElement>) => {
                        EditUsershowAlert('update user', e);
                    }}
                >
                    <div className="relative">
                        <div className="z-60 absolute right-4 top-4 ">
                            <svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" viewBox="0 0 33 33" fill="none" onClick={toggleOpenCloseEdit} className="hidden cursor-pointer lg:block">
                                <path d="M24.75 8.25L8.25 24.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M8.25 8.25L24.75 24.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h1 className="p-3 text-2xl font-bold">Edit User</h1>
                    </div>
                    {/* Alert Show */}
                    <div
                        className={`my-1 flex items-center rounded bg-warning-light p-3.5 text-warning ${ToggleMessageAlert ? 'opacity-1' : 'opacity-0 transition-opacity'} dark:bg-warning-dark-light`}
                    >
                        <span className="text-xs font-semibold ltr:pr-2 rtl:pl-2 md:text-sm md:font-bold">
                            <strong className="ltr:mr-1 rtl:ml-1">Warning!</strong> - {MessageAlert}.
                        </span>
                    </div>
                    {/* Upload img */}
                    <div className="custom-file-container relative " data-upload-id="myFirstImage">
                        <ImageUploading value={images} onChange={onChange}>
                            {({ imageList, onImageUpload }) => (
                                <div className="upload__image-wrapper">
                                    {images.length === 0 ? (
                                        <div className="row-span-full  m-auto w-fit cursor-pointer" onClick={onImageUpload}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width={isDesktop ? '90' : '55'} viewBox="0 0 90 90" fill="none">
                                                <circle cx="45" cy="45" r="45" fill="black" fillOpacity="0.27" />
                                                <path d="M27 46H63M45 64V28" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    ) : (
                                        ''
                                    )}
                                    {imageList.map((image, index) => (
                                        <div key={index} className="custom-file-container__image-preview">
                                            <div className="relative m-auto w-fit">
                                                <div className="label-container absolute -right-6 -top-2 z-50">
                                                    <button
                                                        type="button"
                                                        className="custom-file-container__image-clear"
                                                        title="Clear Image"
                                                        onClick={() => {
                                                            setImages([]);
                                                        }}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 33 33" fill="none" className="cursor-pointer">
                                                            <path d="M24.75 8.25L8.25 24.75" stroke="#0E1726" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M8.25 8.25L24.75 24.75" stroke="#0E1726" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </button>
                                                </div>
                                                <img
                                                    src={selectedFile ? image?.dataURL : `/assets/uploads/${image?.dataURL}`}
                                                    alt="img"
                                                    className="m-auto h-[90px] w-[90px] overflow-hidden rounded-full object-contain"
                                                    onClick={onImageUpload}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ImageUploading>
                        <label className="mt-2 flex items-center justify-center">Upload</label>
                    </div>
                    {/* end Upload img */}
                    <div className="mt-8">
                        <div className="mb-3">
                            <div className="flex flex-col">
                                <label className="hidden lg:block">Username:</label>
                                <input
                                    onChange={handleChangeInputs}
                                    type="text"
                                    value={selectedUser?.username}
                                    placeholder="username"
                                    name="username"
                                    className="form-input ltr:rounded-r-none rtl:rounded-l-none"
                                />
                            </div>
                        </div>
                        <div className="mb-3 mt-3 lg:mb-5 lg:mt-5">
                            <div className="flex flex-col">
                                <label className="hidden lg:block">Role:</label>
                                <Select
                                    defaultValue={optionRole.find((option) => option.value === EditUser.role)}
                                    onChange={handleChangeRoleUser}
                                    placeholder="Choose Your Category..."
                                    options={optionRole}
                                    isSearchable={false}
                                />
                            </div>
                        </div>
                        <div className="mb-3 ">
                            <div className="flex flex-col">
                                <label className="hidden lg:block">Gmail</label>
                                <div className="flex">
                                    <div className="hidden items-center justify-center border border-white-light bg-[#eee] px-3 font-semibold ltr:rounded-l-md ltr:border-r-0 rtl:rounded-r-md rtl:border-l-0 dark:border-[#17263c] dark:bg-[#1b2e4b] lg:flex">
                                        @
                                    </div>
                                    <input
                                        onChange={handleChangeInputs}
                                        value={selectedUser?.email}
                                        type="email"
                                        placeholder="Gmail"
                                        name="email"
                                        className="form-input ltr:rounded-l-none rtl:rounded-r-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mb-3 flex items-center space-x-3">
                            <div className="flex flex-1 flex-col">
                                <label className="hidden lg:block">First Name:</label>
                                <input
                                    onChange={handleChangeInputs}
                                    value={selectedUser?.firstname}
                                    type="text"
                                    placeholder="Your First Name"
                                    name="firstname"
                                    className="form-input ltr:rounded-r-none rtl:rounded-l-none"
                                />
                            </div>

                            <div className="flex flex-1 flex-col">
                                <label className="hidden lg:block">Last Name:</label>
                                <input
                                    onChange={handleChangeInputs}
                                    value={selectedUser?.lastname}
                                    type="text"
                                    placeholder="Your Last Name"
                                    name="lastname"
                                    className="form-input ltr:rounded-r-none rtl:rounded-l-none"
                                />
                            </div>
                        </div>
                        <div className="mb-3 flex flex-col items-center space-x-0 space-y-3 lg:flex-row lg:space-x-3  lg:space-y-0">
                            <div className="flex w-full flex-1 flex-col">
                                <label className="hidden lg:block">Password:</label>
                                <input
                                    onChange={handleChangeInputs}
                                    type="password"
                                    placeholder="Your Password"
                                    name="password"
                                    className="form-input ltr:rounded-r-none rtl:rounded-l-none"
                                    value={selectedUser?.password}
                                />
                            </div>

                            <div className="flex w-full flex-1 flex-col">
                                <label className="hidden lg:block">Confirme Your Passwork:</label>
                                <input
                                    onChange={handleChangeInputs}
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirme Your Password"
                                    className="form-input ltr:rounded-r-none rtl:rounded-l-none"
                                    value={EditUser?.confirmPassword}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="font-bold">Status:</label>
                            <div className="inline-block w-[65%] md:w-[45%] lg:w-[40%]">
                                <ul className="mb-3 flex items-center space-x-3  text-center">
                                    <li className=" flex-1 cursor-pointer">
                                        <div
                                            className={`${activeTab === 'active' ? '!bg-[#90ee907a] ' : ''}
                                            block rounded-lg border-2  border-[#90ee907a] p-1 font-bold text-green-800 dark:bg-[#1b2e4b] lg:p-2.5`}
                                            onClick={() => setActiveTab('active')}
                                        >
                                            Active
                                        </div>
                                    </li>

                                    <li className="  flex-1 cursor-pointer">
                                        <div
                                            className={`${activeTab === 'inactive' ? '!bg-red-400 ' : ''} ${EditUser} block rounded-lg  border-2
                                            border-red-400 p-1 font-bold text-red-600 dark:bg-[#1b2e4b] lg:p-2.5`}
                                            onClick={() => setActiveTab('inactive')}
                                        >
                                            Inactive
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {isDesktop ? (
                            <button type="submit" className="btn btn-primary mt-2 w-full gap-2 border-[#26A8F4] bg-[#26A8F4] px-16 font-bold lg:w-[20%]">
                                Save
                            </button>
                        ) : (
                            <div className="mt-12 flex justify-center space-x-5">
                                <button onClick={toggleOpenCloseEdit} type="button" className="btn btn-outline-warning mt-0 w-full gap-2 whitespace-nowrap">
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary  w-full gap-2 border-[#26A8F4] bg-[#26A8F4] font-bold lg:w-[20%]">
                                    Save
                                </button>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </>
    );
};

export default EditUser;
