import { useEffect, useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';
import Image from 'next/image';
import api from '@/api';
import Swal from 'sweetalert2';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { NEXT_REQUEST_META } from 'next/dist/server/request-meta';
import { setProfil } from '@/store/authSlice';
const ApiUrl = process.env.NEXT_PUBLIC_API_FRONT_URI;

const UpdateProfileLogo = ({ id }: any) => {
    const dispatch = useDispatch();
    const [auth, setAuth] = useState<auth>({
        isAuth: false,
        value: {
            user: {
                firstname: '',
                lastname: '',
                email: '',
                username: '',
                dob: '',
                profileLogo: '',
                role: '',
                password: '',
            },
        },
    });
    const [selectedImage, setSelectedImage] = useState<string>('');
    const [edited, setEdited] = useState<boolean>(true);
    const [changePassword, setChangePassword] = useState<boolean>(true);
    const [user, setUser] = useState<any>({});
    const authSelector: any = useSelector((state: IRootState) => state?.auth);
    {
        /*const [userInformation, setUserInformation] = useState<userInfo>({
        firstname: auth?.value?.user?.firstname,
        lastname: auth?.value?.user?.lastname,
        email: auth?.value?.user?.email,
        username: auth?.value?.user?.username,
        dob: auth?.value?.user?.dob,
        profileLogo: auth?.value?.user?.profileLogo || 'profile-unknown.jpeg',
        role: auth?.value?.user?.role,
        password: auth?.value?.user?.password,
    });*/
    }

    const [savedImage, setSavedImage] = useState<File | null | undefined>();
    const [olderImage, setOlderImage] = useState('');

    const [userInput, setUserInput] = useState({
        username: '',
        email: '',
        firstname: '',
        lastname: '',
        profileLogo: 'profile-unknown.jpeg',
        status: '',
        role: '',
    });

    const [password, setPassword] = useState<password>({
        password: '',
        new_password: '',
        confirm_password: '',
    });
    const [isSamePass, setIsSamePass] = useState<boolean>(true);

    // Fetch user By id
    const fetchUserById = async () => {
        try {
            const response = await api.get(`${process.env.NEXT_PUBLIC_BASE_URL}/users/${authSelector?.value?.user?.id}`);
            if (response.status === 200) {
                setUser(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch Users', error);
        }
    };

    const changeUserInfo = (e: any) => {
        setUserInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };
    useEffect(() => {
        setAuth(authSelector);
        fetchUserById();
    }, [authSelector]);
    {
        /*useEffect(() => {
        setUserInformation({
            firstname: auth?.value?.user?.firstname,
            lastname: auth?.value?.user?.lastname,
            email: auth?.value?.user?.email,
            username: auth?.value?.user?.username,
            dob: auth?.value?.user?.dob,
            profileLogo: auth?.value?.user?.profileLogo || 'profile-unknown.jpeg',
            role: auth?.value?.user?.role,
            password: auth?.value?.user?.password,
        });
    }, [auth?.value]);*/
    }

    const handleImageChange = async (e: any) => {
        const file = e.target.files[0];
        setSelectedImage(URL.createObjectURL(file));
        setOlderImage(userInput.profileLogo);

        if (file) {
            // Get the current timestamp
            const timestamp = Date.now();

            // Create a new File object with the updated name
            const renamedFile = new File([file], timestamp + '-' + file.name, {
                type: file.type,
                lastModified: file.lastModified,
            });

            setSavedImage(renamedFile);
        }

        setUserInput((prev) => ({ ...prev, profileLogo: file }));
    };

    const handleSubmitBasicForm = async (e: any) => {
        e.preventDefault();

        const result = await Swal.fire({
            icon: 'info',
            text: `You want to Edit Profile`,
            showCancelButton: true,
            confirmButtonText: 'Edit',
            padding: '2em',
            customClass: 'sweet-alerts',
        });

        const formDataToSubmit = new FormData();
        formDataToSubmit.append('firstname', userInput.firstname);
        formDataToSubmit.append('lastname', userInput.lastname);
        formDataToSubmit.append('username', userInput.username);
        formDataToSubmit.append('email', userInput.email);
        formDataToSubmit.append('role', userInput.role);
        formDataToSubmit.append('status', userInput.status);

        if (password.new_password !== '') {
            formDataToSubmit.append('password', password.new_password);
            formDataToSubmit.append('confirmPassword', password.confirm_password);
        }
        if (savedImage) {
            formDataToSubmit.append('profile_logo', savedImage);
        }

        if (result.value) {
            try {
                const formData = new FormData();
                if (savedImage) {
                    formData.append('Myimage', savedImage);
                    formData.append('oldImage', olderImage);
                }

                const imageRes = await axios.post('/api/upload', formData);
                if (imageRes.status === 200) {
                    console.log('File uploaded successfully:');
                } else {
                    console.error('File upload failed:');
                }
                const response = await api.put(`/users/update/${authSelector?.value?.user?.id}`, formDataToSubmit);
                if (response.status === 200) {
                    localStorage.setItem('token', JSON.stringify(response.data));
                    let newUser: any = userInput;
                    newUser.profileLogo = savedImage?.name || auth.value?.user?.profileLogo;
                    dispatch(setProfil(newUser));
                    Swal.fire({ text: 'Profile has been Edited.', icon: 'success', customClass: 'sweet-alerts' });
                }
            } catch (error) {
                console.log(error);
                Swal.fire({ text: 'Profile has not been Edited.', icon: 'warning', customClass: 'sweet-alerts' });
            }
        }
    };
    const editButton = () => {
        if (!edited) {
            setUserInput({
                username: '',
                email: '',
                firstname: '',
                lastname: '',
                profileLogo: user.profile_logo || 'profile-unknown.jpeg',
                status: '',
                role: '',
            });
        } else {
            setUserInput({
                username: user.username,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                profileLogo: user.profile_logo,
                status: user.status,
                role: user.role,
            });
        }

        setEdited((prev) => !prev);
    };

    useEffect(() => {
        console.log(password.new_password);

        if (password.new_password?.length >= 8 && password.new_password === password.confirm_password) {
            setIsSamePass(true);
            setUserInput((prev) => ({ ...prev, password: password.new_password, confirmPassword: password.confirm_password }));
        } else {
            setIsSamePass(false);
        }
    }, [password.password, password.confirm_password, password.new_password]);

    return (
        <div className="px-3">
            <Head>
                <title>Profile</title>
            </Head>
            <div className="min-h-[90vh] py-10">
                <h1 className="mb-10 text-lg font-bold md:text-xl lg:text-2xl">Profile</h1>
                {/* ProfileID {auth?.value?.user?.firstName} */}
                <form action="" onSubmit={handleSubmitBasicForm} className="bg-white dark:bg-[#0e1726] md:px-3 md:py-5 md:shadow-md lg:rounded-md">
                    <h1 className="mb-5 text-base font-bold  lg:text-lg">General Information</h1>
                    <div className="edit-permission mb-3 ml-auto w-full lg:w-fit">
                        <button type="button" className={`${edited ? 'bg-primary' : 'bg-danger'} w-full rounded-md px-5 py-2 text-white lg:w-auto`} onClick={editButton}>
                            {edited ? 'Edit' : 'Cancel'}
                        </button>
                    </div>
                    <div className="basic-info mx-auto mb-4 flex w-full flex-col justify-center gap-4 md:flex-row lg:items-center">
                        <div className="user-image flex flex-col items-center">
                            <label htmlFor="picture" className="relative">
                                <input type="file" name="Myimage" id="picture" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e)} />
                                <Image
                                    src={`/assets/uploads/${userInput.profileLogo || 'profile-unknown.jpeg'}`}
                                    alt=""
                                    width={180}
                                    height={160}
                                    className="h-36 w-36 max-w-full rounded-full object-cover md:w-48 xl:w-44"
                                />
                                {/* <FontAwesomeIcon icon={faPen} className='p-2 bg-primary text-white absolute rounded-full cursor-pointer bottom-1 right-0 w-10 '/> */}
                            </label>
                            {/* <p className='text-2xl font-bold'>@{auth?.value?.user?.username}</p> */}
                        </div>
                        <div className="user-informations grid w-full grid-cols-1 gap-3 lg:grid-cols-2">
                            <div className="userName">
                                <label htmlFor="userName">User name</label>
                                <input
                                    type="text"
                                    id="userName"
                                    readOnly={edited}
                                    required
                                    name="username"
                                    placeholder="Your User name"
                                    defaultValue={userInput?.username}
                                    className="w-full rounded-md border-2 px-3 py-2 duration-200 read-only:bg-slate-100 dark:bg-transparent dark:text-white"
                                    onChange={changeUserInfo}
                                />
                            </div>
                            <div className="email">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    readOnly={edited}
                                    required
                                    name="email"
                                    placeholder="Your Email"
                                    defaultValue={userInput?.email}
                                    className="w-full rounded-md border-2 px-3 py-2 duration-200 read-only:bg-slate-100 dark:bg-transparent dark:text-white"
                                    onChange={changeUserInfo}
                                />
                            </div>
                            <div className="firstName">
                                <label htmlFor="firstName">First name</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    readOnly={edited}
                                    required
                                    name="firstname"
                                    placeholder="Your First name"
                                    defaultValue={userInput?.firstname}
                                    className="w-full rounded-md border-2 px-3 py-2 duration-200 read-only:bg-slate-100 dark:bg-transparent dark:text-white"
                                    onChange={changeUserInfo}
                                />
                            </div>
                            <div className="lastName">
                                <label htmlFor="lastName">Last name</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    readOnly={edited}
                                    required
                                    name="lastname"
                                    placeholder="Your Last name"
                                    defaultValue={userInput?.lastname}
                                    className="w-full rounded-md border-2 px-3 py-2 duration-200 read-only:bg-slate-100 dark:bg-transparent dark:text-white"
                                    onChange={changeUserInfo}
                                />
                            </div>
                        </div>
                    </div>
                    <h1 className="mb-4 text-base font-bold  lg:text-lg">Change your password</h1>
                    <div className="password grid w-full grid-cols-1 gap-3 md:grid-cols-2">
                        {/* <div className="password">
                            <label htmlFor="password">Current password</label>
                            <input
                                type="password"
                                id="password"
                                readOnly={edited}
                                required
                                name="password"
                                placeholder="Your password"
                                className="w-full rounded-md border-2 px-3 py-2 duration-200 read-only:bg-slate-100 dark:bg-transparent dark:text-white"
                                onChange={(e) => setPassword((prev) => ({ ...prev, password: e.target.value }))}
                            />
                        </div> */}
                        <div className="new_password">
                            <label htmlFor="new_password">New Password</label>
                            <input
                                type="password"
                                id="new_password"
                                readOnly={edited}
                                required
                                name="new_password"
                                placeholder="Your password"
                                className="w-full rounded-md border-2 px-3 py-2 duration-200 read-only:bg-slate-100 dark:bg-transparent dark:text-white"
                                onChange={(e) => setPassword((prev) => ({ ...prev, new_password: e.target.value }))}
                            />
                        </div>
                        <div className="password_confirmation">
                            <label htmlFor="password_confirmation">Confirm password</label>
                            <input
                                type="password"
                                id="password_confirmation"
                                readOnly={edited}
                                required
                                name="confirm_password"
                                placeholder="Confirm password"
                                className="w-full rounded-md border-2 px-3 py-2 duration-200 read-only:bg-slate-100 dark:bg-transparent dark:text-white"
                                onChange={(e) => setPassword((prev) => ({ ...prev, confirm_password: e.target.value }))}
                            />
                        </div>
                    </div>
                    <div className="submit mx-auto mt-5 w-full lg:w-5/12">
                        <button
                            type="submit"
                            disabled={isSamePass && edited}
                            onClick={(e) => handleSubmitBasicForm(e)}
                            className="w-full rounded-md bg-[#26A8F4] px-5 py-2 text-white duration-200 disabled:opacity-70 "
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateProfileLogo;
