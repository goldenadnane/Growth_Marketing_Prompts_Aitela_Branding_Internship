import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Error404 = () => {
    const router = useRouter();
    const goBack = () => {
        router.back();
    };
    return (
        <div className="fixed left-0 top-0 z-50 flex h-screen w-screen items-center justify-center bg-white">
            <div className="h-screen justify-center ">
                <center className="m-auto mt-24">
                    <Image src="/../public/assets/images/notfound.jpg" width={300} height={300} alt="not found" />
                    <div className=" mt-4 tracking-widest">
                        <span className="block text-6xl text-sky-500">
                            <span>4 0 4</span>
                        </span>
                        <span className="text-xl text-sky-500">Sorry, We couldn't find what you are looking for!</span>
                    </div>
                </center>
                <center className="mt-6">
                    <span onClick={goBack} className="cursor-pointer rounded-md bg-sky-500 p-3 font-mono text-xl text-white hover:shadow-md">
                        Go Back
                    </span>
                </center>
            </div>
        </div>
    );
};

export default Error404;
