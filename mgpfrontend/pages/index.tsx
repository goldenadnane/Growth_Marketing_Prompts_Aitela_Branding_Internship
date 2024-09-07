import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { setPageTitle } from '../store/themeConfigSlice';
import BlankLayout from '@/layouts/BlankLayout';
import PrimaryButton from '@/components/PrimaryButton';
import Landing from '@/components/Landing';


const UnlockCover = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Unlock Cover'));
    });
    const router = useRouter();

    const submitForm = (e: any) => {
        e.preventDefault();
        router.push('/');
    };

    return (
        // First verify the comment placed under this component function
        <div>
        <Landing/>
        </div>
    );
};
UnlockCover.getLayout = (page: any) => {
    return <BlankLayout>{page}</BlankLayout>;
};
export default UnlockCover;

            {/* <div className="hidden min-h-screen w-1/2 flex-col  items-center justify-center bg-gradient-to-t from-[#F5F5F5] to-[#EEEDED] p-4 text-white dark:text-black lg:flex">
                <div className="mx-auto mb-5 w-full">
                    <img src="/assets/images/imgindex.png" alt="coming_soon" className="mx-auto lg:max-w-[370px] xl:max-w-[500px]" />
                </div>
                <h3 className="mb-4 text-center text-3xl font-bold text-slate-950">Join the community of expert developers</h3>
                <p className="text-slate-950">It is easy to setup with great customer experience. Start your 7-day free trial</p>
            </div>
            <div className="relative flex w-full items-center justify-center lg:w-1/2 ">
                <div className="w-full max-w-[480px] p-5 md:p-10">
                    <div className="mb-10 flex items-center">
                        <div className="ltr:mr-4 rtl:ml-4">
                            <img src="/assets/images/profile-1.png" className="h-16 w-16 rounded-full object-cover" alt="images" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-3xl">Project name</h4>
                            <p>Login Or Register</p>
                        </div>
                       
                    </div>
                    <div className="space-y-5" >
                    
                        <PrimaryButton onClick={()=>router.push("auth/login")}>
                            Login
                        </PrimaryButton>
                        <PrimaryButton onClick={()=>router.push("auth/register")} >
                            Register
                        </PrimaryButton>
                    </div>
                </div>
            </div> */}