import React, { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import { useMediaQuery } from '../hooks/useMediaQuery';
import Swal from 'sweetalert2';
import api from '@/api';
import axios from 'axios';
type PropsAddUser = {
    toggleOpenClose: () => void;
    ToggleSuccess: () => void;
    setRelaunchDataUser: Dispatch<SetStateAction<boolean>>;
};

const AddUser = ({ toggleOpenClose, ToggleSuccess, setRelaunchDataUser }: PropsAddUser) => {
    const ApiUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const [images, setImages] = useState<ImageListType>([]);
    const [MessageAlert, setMessageAlert] = useState<string>();
    const [WhichField, setWhichField] = useState<string>();
    const [ToggleMessageAlert, setToggleMessageAlert] = useState(false);
    const firstnameRef = useRef(null);
    const lastnameRef = useRef(null);
    const usernameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);
    const isDesktop = useMediaQuery('(min-width: 1024px)');
    const [selectedFile, setSelectedFile] = useState<File | null | undefined>(null);

    // Callback to handle file selection
    const handleImageUpload = (imageList: ImageListType | null, addUpdateIndex: number[] | undefined) => {
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
    };

    useEffect(() => {
        console.log(MessageAlert);
    }, [MessageAlert]);

    const [AddUser, setAddUser] = useState({
        firstname: '',
        lastname: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const maxNumber = 69;

    const onChange = (imageList: ImageListType, addUpdateIndex: number[] | undefined) => {
        setImages(imageList as never[]);
    };

    const handleChangeInputs = (e: ChangeEvent<HTMLInputElement>) => {
        setAddUser({
            ...AddUser,
            [e.target.name]: e.target.value,
        });
    };

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

    const CreateUsershowAlert = async (type: string, e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const AddUser = {
            firstname: formData.get('firstname') as string,
            lastname: formData.get('lastname') as string,
            username: formData.get('username') as string,
            email: formData.get('email') as string,
            password: formData.get('password') as string,
            confirmPassword: formData.get('confirmPassword') as string,
        };

        console.log(AddUser);

        // Create a new FormData object
        const formDataToSubmit = new FormData();

        // Append user data to the FormData object
        formDataToSubmit.append('firstname', AddUser.firstname);
        formDataToSubmit.append('lastname', AddUser.lastname);
        formDataToSubmit.append('username', AddUser.username);
        formDataToSubmit.append('email', AddUser.email);
        formDataToSubmit.append('password', AddUser.password);
        formDataToSubmit.append('confirmPassword', AddUser.confirmPassword);

        // Append the selected file to the FormData object with the correct field name
        if (selectedFile) {
            formDataToSubmit.append('profile_logo', selectedFile);
        }
        console.log('formDataToSubmit:', formDataToSubmit);

        if (
            !validateField('firstname', AddUser.firstname, undefined, 2, 50) ||
            !validateField('lastname', AddUser.lastname, undefined, 2, 50) ||
            !validateField('email', AddUser.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, undefined, 255) ||
            !validateField('username', AddUser.username, /^[a-zA-Z0-9_\-]+$/, 4, 50) ||
            !validateField('password', AddUser.password, /[A-Z]/, 8) ||
            !validateField('password', AddUser.password, /[a-z]/) ||
            !validateField('password', AddUser.password, /\d/) ||
            !validateField('password', AddUser.password, /[!@#$%&*=]/)
        ) {
            return;
        }

        if (AddUser.password !== AddUser.confirmPassword) {
            setMessageAlert("Passwords don't match");
            setWhichField('confirmPassword');
            setToggleMessageAlert(true);
            return;
        }

        toggleOpenClose();

        if (type === 'create user') {
            const result = await Swal.fire({
                icon: 'warning',
                text: `You want to Create User`,
                showCancelButton: true,
                confirmButtonText: 'Create',
                padding: '2em',
                background: 'warning',
                customClass: 'sweet-alerts',
            });

            if (result.value) {
                try {
                    const response = await api.post(`/users/register`, formDataToSubmit);
                    console.log(response.data);

                    if (response.status === 201) {
                        const saveImage = new FormData();
                        if (selectedFile) {
                            saveImage.append('Myimage', selectedFile);
                        }

                        if (saveImage) {
                            const imageRes = await axios.post('/api/upload', saveImage);
                            if (imageRes.status === 200) {
                                console.log('File uploaded successfully:');
                            } else {
                                console.error('File upload failed:');
                            }
                        }

                        console.log(formDataToSubmit);

                        setRelaunchDataUser(true);
                        console.log('Created Succ', response.data);
                        Swal.fire({ text: 'User has been created.', icon: 'success', customClass: 'sweet-alerts' });
                    }
                } catch (error) {
                    console.error('Error creating user:', error);
                    Swal.fire({ text: 'User has not been created.', icon: 'warning', customClass: 'sweet-alerts' });
                }
            }
        }
    };

    return (
        <>
            <div className="z-50 h-full w-full bg-black opacity-50 lg:absolute lg:left-0 lg:top-0"></div>
            <div className=" fixed inset-0 z-10 flex items-end justify-center lg:z-50 lg:m-auto lg:h-[100%] lg:w-[50%] lg:items-center">
                <form
                    className="panel relative h-[93%] min-h-[50%] w-[100%]  overflow-auto rounded-lg bg-white lg:h-auto dark:lg:border dark:lg:border-[#e5e7eb] "
                    onSubmit={(e: ChangeEvent<HTMLFormElement>) => {
                        CreateUsershowAlert('create user', e);
                    }}
                >
                    <div className="relative">
                        <div className="z-60 absolute right-4 top-0 ">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="33"
                                height="33"
                                viewBox="0 0 33 33"
                                fill="none"
                                onClick={toggleOpenClose}
                                className="hidden cursor-pointer fill-blue-700 dark:stroke-white-light lg:block"
                            >
                                <path d="M24.75 8.25L8.25 24.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M8.25 8.25L24.75 24.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h1 className="text-lg font-bold md:text-xl lg:text-2xl">Add User</h1>
                    </div>
                    {/* Alert Show */}
                    <div
                        className={`my-2 flex items-center rounded bg-warning-light p-3.5 text-warning ${ToggleMessageAlert ? 'opacity-1' : 'opacity-0 transition-opacity'} dark:bg-warning-dark-light`}
                    >
                        <span className="text-xs font-semibold ltr:pr-2 rtl:pl-2 md:text-sm md:font-bold">
                            <strong className="ltr:mr-1 rtl:ml-1">Warning!</strong> - {MessageAlert}.
                        </span>
                    </div>
                    {/* Upload img */}
                    <div className="custom-file-container relative" data-upload-id="myFirstImage">
                        <ImageUploading value={images} onChange={handleImageUpload} maxNumber={maxNumber}>
                            {({ imageList, onImageUpload }) => (
                                <div className="upload__image-wrapper">
                                    {images.length === 0 ? (
                                        <div className="row-span-full  m-auto w-fit cursor-pointer" onClick={onImageUpload}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width={isDesktop ? '90' : '55'} height={isDesktop ? '90' : '55'} viewBox="0 0 90 90" fill="none">
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
                                                <img src={image?.dataURL} alt="img" className="m-auto h-[90px] w-[90px] overflow-hidden rounded-full object-contain" onClick={onImageUpload} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ImageUploading>
                        <label className="mt-2 flex items-center justify-center dark:text-white">Upload</label>
                    </div>
                    {/* end Upload img */}
                    <div className="mb-5 mt-8">
                        <div className="flex flex-col">
                            <label className="hidden lg:block">Username:</label>
                            <input
                                onChange={handleChangeInputs}
                                ref={emailRef}
                                type="text"
                                placeholder="username"
                                name="username"
                                className={`form-input
                            ${WhichField === 'username' ? 'border-2 border-warning' : ''}  `}
                            />
                        </div>
                    </div>
                    <div className="mb-5">
                        <div className="flex flex-col">
                            <label className="hidden lg:block">Gmail</label>
                            <div className="flex">
                                <div
                                    className="hidden items-center justify-center border border-white-light
                                bg-[#eee] px-3 font-semibold ltr:rounded-l-md
                                ltr:border-r-0 rtl:border-l-0 dark:border-[#17263c] dark:bg-[#1b2e4b] lg:flex"
                                >
                                    @
                                </div>
                                <input
                                    onChange={handleChangeInputs}
                                    type="email"
                                    ref={emailRef}
                                    placeholder="Gmail"
                                    name="email"
                                    className={`form-input rounded-bl-none rounded-tl-none
                            ${WhichField === 'email' ? 'border-2 border-warning ' : ''}  `}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mb-5 flex items-center space-x-3">
                        <div className="flex flex-1 flex-col">
                            <label className="hidden lg:block">First Name:</label>
                            <input
                                ref={firstnameRef}
                                onChange={handleChangeInputs}
                                type="text"
                                placeholder="Your First Name"
                                name="firstname"
                                className={`form-input
                            ${WhichField === 'firstname' ? 'border-2 border-warning' : ''}  `}
                            />
                        </div>

                        <div className="flex flex-1 flex-col">
                            <label className="hidden lg:block">Last Name:</label>
                            <input
                                ref={lastnameRef}
                                onChange={handleChangeInputs}
                                type="text"
                                placeholder="Your Last Name"
                                name="lastname"
                                className={`form-input
                            ${WhichField === 'lastname' ? 'border-2 border-warning' : ''}  `}
                            />
                        </div>
                    </div>
                    <div className=" mb-5 flex flex-col items-center space-x-0 space-y-5 lg:flex-row lg:space-x-3 lg:space-y-0">
                        <div className=" flex w-full flex-1 flex-col ">
                            <label className="hidden lg:block">Password:</label>
                            <input
                                ref={passwordRef}
                                onChange={handleChangeInputs}
                                type="password"
                                placeholder="Your Password"
                                name="password"
                                className={`form-input
                            ${WhichField === 'password' ? 'border-2 border-warning' : ''}  `}
                            />
                        </div>

                        <div className=" flex w-full flex-1 flex-col">
                            <label className="hidden lg:block">Confirme Your Passwork:</label>
                            <input
                                ref={confirmPasswordRef}
                                onChange={handleChangeInputs}
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirme Your Password"
                                className={`form-input
                            ${WhichField === 'confirmPassword' ? 'border-2 border-warning' : ''}  `}
                            />
                        </div>
                    </div>
                    {isDesktop ? (
                        <button type="submit" className="btn btn-primary mt-8 gap-2 border-[#26A8F4] bg-[#26A8F4]">
                            <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Add User
                        </button>
                    ) : (
                        <div className="mt-12 flex justify-center space-x-5">
                            <button onClick={toggleOpenClose} type="button" className="btn btn-outline-warning mt-0 w-full gap-2 whitespace-nowrap">
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary mt-0 w-full  gap-2 whitespace-nowrap border-[#26A8F4] bg-[#26A8F4]">
                                <svg className="hidden h-5 w-5 lg:block" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                Add User
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </>
    );
};

export default AddUser;
