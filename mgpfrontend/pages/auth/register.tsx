import Link from 'next/link';
import { SyntheticEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import BlankLayout from '@/layouts/BlankLayout';
import Head from 'next/head';
import Swal from 'sweetalert2';
import Image from 'next/image';
import { toggleTheme } from '@/store/themeConfigSlice';
import { IRootState } from '@/store';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '@/store/authSlice';

const Register = () => {
    const router = useRouter();
    const [auth, setAuth] = useState<auth | null>(null);
    const authSelector: any = useSelector((state: IRootState) => state.auth);

    const dispatch = useDispatch();

    const [errors, setErrors] = useState({
        firstname: '',
        lastname: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
    });

    const [userData, setUserData] = useState({
        firstname: '',
        lastname: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        subscribed: false,
    });
    const [disable, setDisable] = useState<boolean>(true);
    const [agree, setAgree] = useState<boolean>(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData((prevUserData) => ({
            ...prevUserData,
            [name]: value,
        }));
    };

    const signUpWithGoogle = async () => {
        //  axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/google/callback`)
        // window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/google/callback`;
        window.open(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/google/callback`, '_blank');
    };

    const submit = async (e: SyntheticEvent) => {
        e.preventDefault();
        setErrors({
            firstname: '',
            lastname: '',
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: '',
        });
        try {
            console.log(process.env.NEXT_PUBLIC_BASE_URL);

            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify(userData),
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data.message);
                dispatch(login(data));
                if (typeof window !== 'undefined') {
                    window.location.replace('/main/chatbot');
                }
            } else {
                const errorData = await response.json();
                if (errorData.message && Array.isArray(errorData.message)) {
                    const errorObj: any = {};
                    errorData.message.forEach((errorMsg: any) => {
                        const fieldName = errorMsg.split(' ')[0];
                        const errorMessage = errorMsg.substring(fieldName); // Get the complete error message by removing the field name
                        errorObj[fieldName] = errorMessage;
                    });
                    setErrors(errorObj);
                }
            }
        } catch (error: any) {
            throw new Error(error.message);
        }
    };

    useEffect(() => {
        setAuth(authSelector);
        dispatch(toggleTheme('light'));
        if (auth?.isAuth) {
            if (typeof window !== 'undefined' && (window.location.pathname === '/auth/login' || window.location.pathname === '/auth/register')) {
                router.push('/main/subscription');
            }
        }
    }, [authSelector, auth, router]);

    const showAlert = async (type: number) => {
        if (type === 1) {
            Swal.fire({
                title: 'You agree to use our website for legitimate purposes and not for any illegal or unauthorized purpose, including without limitation, in violation of any intellectual property or privacy law. By agreeing to the Terms, you represent and warrant that you are at least the age of majority in your state or province of residence and are legally capable of entering into a binding contract. By agreeing to the Terms, you represent and warrant that you are at least the age of majority in your state or province of residence and are legally capable of entering into a binding contract. thout limitation, in violation of any intellectual property or privacy law. By agreeing to the Terms, you represent and warrant that you are at least the age of majority in your state or province of residence and are legally capable of entering into a binding contract. By agreeing to the Terms, you represent and warrant that you are at least the age of majority in your state or province of residence and are legally capable of entering into a binding contract.',
                // padding: '1.2em',
                customClass: 'sweet-alerts',
                confirmButtonText: 'I understand',
            });
        }
    };

    useEffect(() => {
        if (
            userData.firstname !== '' &&
            userData.lastname !== '' &&
            userData.email.includes('@') &&
            userData.password !== '' &&
            userData.confirmPassword === userData.password &&
            userData.username !== '' &&
            agree
        ) {
            setDisable(false);
        } else {
            setDisable(true);
        }
    }, [userData.firstname, userData.lastname, userData.email, userData.password, userData.confirmPassword, userData.username, agree]);

    //await router.push('/Layoutsadmin/DefaultLayout')

    return (
        <>
            <Head>
                <title>Register</title>
            </Head>
            <div className="flex min-h-screen flex-col lg:flex-row-reverse">
                {/* hidden bg-gradient-to-t from-[#F5F5F5] to-[#EEEDED] p-4 text-white dark:text-black flex-col  items-center justify-center lg:flex */}
                <div className="relative  w-full flex-col items-center justify-center lg:min-h-screen lg:w-1/2">
                    <div className=" relative mx-auto h-full w-full">
                        <Image width={1000} height={500} src="/assets/images/auth_image.png" alt="coming_soon" className=" h-[40vh] !w-full  object-cover brightness-50 lg:h-full " />
                        <div className="img-text absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2">
                            <h3 className="mx-auto mb-4 w-9/12 text-center text-3xl font-bold text-white">Empowering Your Feed with AI-Generated Content!</h3>
                        </div>
                    </div>
                </div>
                <div className="  relative top-[-20px] flex  w-full items-center justify-center rounded-t-3xl border bg-[#fff] py-5 lg:w-1/2">
                    <div className="h-full w-full lg:mt-24 ">
                        <div className="h-full items-center justify-center lg:flex lg:min-h-screen ">
                            <div className=" flex h-full w-full flex-col justify-start  xs:px-6 2xs:px-12 ">
                                <h2 className="mb-3 text-center text-2xl font-bold xs:text-3xl 2xs:text-4xl">Sign Up</h2>
                                <p className="mb-7 text-center">Enter your email and password to register</p>
                                <form className="space-y-5" onSubmit={submit}>
                                    <div className="space-y-0 lg:space-y-5">
                                        <div className="flex w-full gap-3">
                                            <div className="w-1/2">
                                                <label htmlFor="fistname" className="invisible lg:visible">
                                                    Firstname
                                                </label>
                                                <input
                                                    id="firstname"
                                                    type="text"
                                                    name="firstname"
                                                    className="form-input !text-xs xs:py-2 xs:!text-sm 2xs:py-3 2xs:!text-base"
                                                    placeholder="Enter your firstname"
                                                    required
                                                    onChange={(e) => handleInputChange(e)}
                                                />
                                                {errors.firstname && <p className="text-red-500">{errors.firstname}</p>}
                                            </div>
                                            <div className="w-1/2">
                                                <label htmlFor="lastname" className="invisible lg:visible">
                                                    Lastname
                                                </label>
                                                <input
                                                    id="lastname"
                                                    type="text"
                                                    name="lastname"
                                                    className="form-input !text-xs xs:py-2 xs:!text-sm 2xs:py-3 2xs:!text-base"
                                                    placeholder="Enter your lastname"
                                                    required
                                                    onChange={(e) => handleInputChange(e)}
                                                />
                                                {errors.lastname && <p className="text-red-500">{errors.lastname}</p>}
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="username" className="invisible lg:visible">
                                                Username
                                            </label>
                                            <input
                                                id="username"
                                                type="text"
                                                name="username"
                                                className="form-input !text-xs xs:py-2 xs:!text-sm 2xs:py-3 2xs:!text-base"
                                                placeholder="Enter your username"
                                                required
                                                onChange={(e) => handleInputChange(e)}
                                            />
                                            {errors.username && <p className="text-red-500">{errors.username}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="invisible lg:visible">
                                                Email
                                            </label>
                                            <input
                                                id="email"
                                                type="email"
                                                name="email"
                                                className="form-input !text-xs xs:py-2 xs:!text-sm 2xs:py-3 2xs:!text-base"
                                                placeholder="Enter your email"
                                                required
                                                onChange={(e) => handleInputChange(e)}
                                            />
                                            {errors.email && <p className="text-red-500">{errors.email}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="password" className="invisible lg:visible">
                                                Password
                                            </label>
                                            <input
                                                id="password"
                                                type="password"
                                                name="password"
                                                className="form-input !text-xs xs:py-2 xs:!text-sm 2xs:py-3 2xs:!text-base"
                                                placeholder="Enter your password"
                                                required
                                                onChange={(e) => handleInputChange(e)}
                                            />
                                            {errors.password && <p className="text-red-500">{errors.password}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="password" className="invisible lg:visible">
                                                Confirm Password
                                            </label>
                                            <input
                                                id="confirmPassword"
                                                type="password"
                                                name="confirmPassword"
                                                className="form-input !text-xs xs:py-2 xs:!text-sm 2xs:py-3 2xs:!text-base"
                                                placeholder="Confirm your password"
                                                required
                                                onChange={(e) => handleInputChange(e)}
                                            />
                                            {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword}</p>}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="cursor-pointer">
                                            <input type="checkbox" className="form-checkbox" checked={agree} onChange={() => setAgree((prev) => !prev)} />
                                            <span className="text-white-dark">
                                                I agree the{' '}
                                                <button type="button" onClick={() => showAlert(1)} className="text-primary hover:underline">
                                                    Terms and Conditions
                                                </button>
                                            </span>
                                        </label>
                                    </div>
                                    <button type="submit" className="btn w-full bg-sky-500 text-white shadow-md disabled:opacity-70" disabled={disable}>
                                        SIGN UP
                                    </button>
                                </form>
                                <div className="relative my-7 h-5 text-center before:absolute before:inset-0 before:m-auto before:h-[1px] before:w-full before:bg-[#ebedf2]">
                                    <div className="relative z-[1] inline-block bg-white px-2 font-bold text-white-dark">
                                        <span>OR</span>
                                    </div>
                                </div>
                                <div className="mb-5 w-full">
                                    <button
                                        type="button"
                                        onClick={() => signUpWithGoogle()}
                                        className="btn flex w-full gap-1 bg-white-dark/60 text-black shadow-none duration-200 hover:bg-white-dark/50 sm:gap-2 "
                                    >
                                        <svg className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" viewBox="0 0 256 193" version="1.1" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
                                            <g>
                                                <path
                                                    d="M58.1818182,192.049515 L58.1818182,93.1404244 L27.5066233,65.0770089 L0,49.5040608 L0,174.59497 C0,184.253152 7.82545455,192.049515 17.4545455,192.049515 L58.1818182,192.049515 Z"
                                                    fill="#4285F4"
                                                ></path>
                                                <path
                                                    d="M197.818182,192.049515 L238.545455,192.049515 C248.203636,192.049515 256,184.224061 256,174.59497 L256,49.5040608 L224.844415,67.3422767 L197.818182,93.1404244 L197.818182,192.049515 Z"
                                                    fill="#34A853"
                                                ></path>
                                                <polygon
                                                    fill="#EA4335"
                                                    points="58.1818182 93.1404244 54.0077618 54.4932827 58.1818182 17.5040608 128 69.8676972 197.818182 17.5040608 202.487488 52.4960089 197.818182 93.1404244 128 145.504061"
                                                ></polygon>
                                                <path
                                                    d="M197.818182,17.5040608 L197.818182,93.1404244 L256,49.5040608 L256,26.2313335 C256,4.64587897 231.36,-7.65957557 214.109091,5.28587897 L197.818182,17.5040608 Z"
                                                    fill="#FBBC04"
                                                ></path>
                                                <path
                                                    d="M0,49.5040608 L26.7588051,69.5731646 L58.1818182,93.1404244 L58.1818182,17.5040608 L41.8909091,5.28587897 C24.6109091,-7.65957557 0,4.64587897 0,26.2313335 L0,49.5040608 Z"
                                                    fill="#C5221F"
                                                ></path>
                                            </g>
                                        </svg>
                                        Google
                                    </button>
                                </div>
                                <p className="text-center">
                                    Already have an account ?
                                    <Link href="/auth/login" className="font-bold text-primary hover:underline ltr:ml-1 rtl:mr-1">
                                        Sign In
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
Register.getLayout = (page: any) => {
    return <BlankLayout>{page}</BlankLayout>;
};
export default Register;

/*<div>
            <div className="flex min-h-screen items-center justify-center bg-[url('/assets/images/map.svg')] bg-cover bg-center dark:bg-[url('/assets/images/map-dark.svg')]">
                <div className="panel w-full max-w-lg sm:w-[500px]">
                    <h2 className="mb-3 text-2xl font-bold " style={{display:'flex',textAlign:'center',justifyContent:'center',color:'#0693e3'}}>Sign Up</h2>
                     <form className="space-y-5" onSubmit={submit}>
                        <div>
                            <label htmlFor="fistname">Firstname</label>
                            <input id="firstname" type="text" name="firstname" className="form-input" placeholder="Enter your firstname" required
                                onChange={(e)=>handleInputChange(e)}  />
                            {errors.firstname && <p className="text-red-500">{errors.firstname}</p>}

                        </div>
                        <div>
                            <label htmlFor="lastname">Lastname</label>
                            <input id="lastname" type="text" name="lastname" className="form-input" placeholder="Enter your lastname" required
                                 onChange={(e)=>handleInputChange(e)}  />
                            {errors.lastname && <p className="text-red-500">{errors.lastname}</p>}

                        </div>

                        <div>
                            <label htmlFor="username">Username</label>
                            <input id="username" type="text" name="username" className="form-input" placeholder="Enter your username"  required

                             onChange={(e)=>handleInputChange(e)}/>
                           {errors.username && <p className="text-red-500">{errors.username}</p>}

                        </div>
                        <div>
                            <label htmlFor="email">Email</label>
                            <input id="email" type="email" name="email" className="form-input" placeholder="Enter your email"  required

                             onChange={(e)=>handleInputChange(e)}/>
                            {errors.email && <p className="text-red-500">{errors.email}</p>}

                        </div>
                        <div>
                            <label htmlFor="password">Password</label>
                            <input id="password" type="password" name="password" className="form-input" placeholder="Enter your password"  required
                             onChange={(e)=>handleInputChange(e)}/>
                            {errors.password && <p className="text-red-500">{errors.password}</p>}

                        </div>

                        <div>
                            <label htmlFor="password">ConfirmPassword</label>
                            <input id="confirmPassword" type="password" name="confirmPassword" className="form-input" placeholder="Confirm your password"  required
                             onChange={(e)=>handleInputChange(e)}/>
                            {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword}</p>}

                        </div>
                        <div>
                            <label className="cursor-pointer">
                                <input type="checkbox" className="form-checkbox" />
                                <span className="text-white-dark">
                                    I agree the{' '}
                                    <button type="button" className="text-primary hover:underline">
                                        Terms and Conditions
                                    </button>
                                </span>
                            </label>
                        </div>
                        <button type="submit" className="btn btn-primary w-full">
                            SIGN UP
                        </button>


                    </form>
                    <div className="relative my-7 h-5 text-center before:absolute before:inset-0 before:m-auto before:h-[1px] before:w-full before:bg-[#ebedf2] dark:before:bg-[#253b5c]">
                        <div className="relative z-[1] inline-block bg-white px-2 font-bold text-white-dark dark:bg-black">
                            <span>OR</span>
                        </div>
                    </div>
                    <ul className="mb-5 flex justify-center gap-2 sm:gap-5">
                        <li>
                            <button
                                type="button"
                                className="btn flex gap-1 bg-white-dark/30 text-black shadow-none hover:bg-white dark:border-[#253b5c] dark:bg-transparent dark:text-white dark:hover:bg-[#1b2e4b] sm:gap-2 "
                            >
                                <svg className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" viewBox="0 0 256 193" version="1.1" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
                                    <g>
                                        <path
                                            d="M58.1818182,192.049515 L58.1818182,93.1404244 L27.5066233,65.0770089 L0,49.5040608 L0,174.59497 C0,184.253152 7.82545455,192.049515 17.4545455,192.049515 L58.1818182,192.049515 Z"
                                            fill="#4285F4"
                                        ></path>
                                        <path
                                            d="M197.818182,192.049515 L238.545455,192.049515 C248.203636,192.049515 256,184.224061 256,174.59497 L256,49.5040608 L224.844415,67.3422767 L197.818182,93.1404244 L197.818182,192.049515 Z"
                                            fill="#34A853"
                                        ></path>
                                        <polygon
                                            fill="#EA4335"
                                            points="58.1818182 93.1404244 54.0077618 54.4932827 58.1818182 17.5040608 128 69.8676972 197.818182 17.5040608 202.487488 52.4960089 197.818182 93.1404244 128 145.504061"
                                        ></polygon>
                                        <path
                                            d="M197.818182,17.5040608 L197.818182,93.1404244 L256,49.5040608 L256,26.2313335 C256,4.64587897 231.36,-7.65957557 214.109091,5.28587897 L197.818182,17.5040608 Z"
                                            fill="#FBBC04"
                                        ></path>
                                        <path
                                            d="M0,49.5040608 L26.7588051,69.5731646 L58.1818182,93.1404244 L58.1818182,17.5040608 L41.8909091,5.28587897 C24.6109091,-7.65957557 0,4.64587897 0,26.2313335 L0,49.5040608 Z"
                                            fill="#C5221F"
                                        ></path>
                                    </g>
                                </svg>
                                Google
                            </button>
                        </li>


                    </ul>
                    <p className="text-center">
                        Already have an account ?
                        <Link href="/auth/login" className="font-bold text-primary hover:underline ltr:ml-1 rtl:mr-1">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>*/
