import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { useEffect, useState } from 'react';
import { setPageTitle } from '../../store/themeConfigSlice';
import BlankLayout from '@/layouts/BlankLayout';
import Head from 'next/head';
import Image from 'next/image';

const RecoverIdBox = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Recover Id Box'));
    });
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string>('');

    const submitForm = (e: any) => {
        e.preventDefault();
        router.push('/');
    };

    useEffect(() => {
        if (email.includes('@')) {
            setError('');
        }
    }, [email]);
    return (
        <>
            <Head>
                <title>Login</title>
            </Head>
            <div className="flex min-h-screen flex-col lg:flex-row-reverse">
                {/* hidden bg-gradient-to-t from-[#F5F5F5] to-[#EEEDED] p-4 text-white dark:text-black lg:flex */}
                <div className=" h-[40vh] w-full  flex-col items-center justify-center  lg:min-h-screen lg:w-1/2 ">
                    <div className="relative mx-auto mb-5 h-full w-full">
                        <Image width={1000} height={500} src="/assets/images/auth_image.png" alt="coming_soon" className="!h-[100vh] max-h-screen !w-full object-cover brightness-50 lg:!h-screen" />
                        <div className="img-text absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2">
                            <h3 className="mx-auto mb-4 w-9/12 text-center text-3xl font-bold text-white">Empowering Your Feed with AI-Generated Content!</h3>
                        </div>
                    </div>
                </div>
                <div className="relative flex w-full items-center justify-center lg:w-1/2 ">
                    <div className="h-[60vh] w-full">
                        <div className="h-full items-center justify-center lg:flex ">
                            <div className="panel flex h-full w-full flex-col justify-start rounded-t-3xl py-4 xs:px-6 2xs:px-12 lg:h-screen">
                                <h2 className="mb-5 text-center text-2xl font-bold xs:text-3xl 2xs:text-4xl">Password Reset</h2>
                                <p className="mb-7 text-center">Enter your email to recover your ID</p>
                                <form className="space-y-5" onSubmit={submitForm}>
                                    <div>
                                        <label htmlFor="email" className="invisible lg:visible">
                                            Email
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            className="form-input my-2 !text-xs xs:py-2 xs:!text-sm 2xs:py-3 2xs:!text-base"
                                            placeholder="Enter Email"
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <button type="submit" className="btn w-full bg-sky-500 text-white shadow-md disabled:opacity-70" disabled={email == ''}>
                                        RECOVER
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
RecoverIdBox.getLayout = (page: any) => {
    return <BlankLayout>{page}</BlankLayout>;
};
export default RecoverIdBox;
