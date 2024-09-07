import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import api from '@/api';
import { IRootState } from '@/store';
import { useSelector } from 'react-redux';
import SavedPrompts from '@/components/Chat/AddPromptsSaved';

function Options() {
    const router = useRouter();
    const { id } = router.query;
    const addSavedprompt = useSelector((state: IRootState) => state.auth.addSavedprompt);
    type options = {
        type_of_content: string;
    };

    const [optionActive, setOptionActive] = useState<options>();

    console.log(id);

    const goToPayment = async () => {
        console.log('id and options', optionActive);
        try {
            const res = await api.post(`/payment/type_of_content/${id}`, optionActive);
            window.location.href = res.data;
        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        if (addSavedprompt) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
    }, [addSavedprompt]);

    return (
        <>
            {addSavedprompt && <SavedPrompts />}
            <Head>
                <title>Subscription</title>
            </Head>
            <div className="px-10 py-10">
                <div className="title mb-7">
                    <h1 className="mb-3 text-xl font-bold">Let&lsquo;s get started!</h1>
                    <p className="text-sm text-gray-400">Help us customize your experience by telling us a bit about yourself and your goals.</p>
                </div>
                <div className="options">
                    <h1 className="mb-10 text-base font-bold sm:text-lg">What types of content do you want help creating?</h1>
                </div>
                <div className="content-options ">
                    <form className=" ">
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <label
                                htmlFor="ads"
                                className={`w-full cursor-pointer rounded-sm ${
                                    optionActive?.type_of_content === 'Paid Ads' ? 'bg-[#bde3fa]' : 'bg-[#dbf0fc]'
                                } flex items-center px-3 py-4 text-sky-600 duration-200`}
                            >
                                <input
                                    type="radio"
                                    value={'Paid Ads'}
                                    id="ads"
                                    name="option"
                                    className="w-[10%] scale-125 text-lg accent-sky-600"
                                    onChange={(e) => setOptionActive({ ...optionActive, type_of_content: e.target.value })}
                                />
                                <span className=" w-full text-center">Paid Ads</span>
                            </label>
                            <label
                                htmlFor="social"
                                className={`w-full cursor-pointer rounded-sm ${
                                    optionActive?.type_of_content === 'Social media content' ? 'bg-[#bde3fa]' : 'bg-[#dbf0fc]'
                                } flex items-center px-3 py-4 text-sky-600`}
                            >
                                <input
                                    type="radio"
                                    value={'Social media content'}
                                    id="social"
                                    name="option"
                                    className="w-[10%] scale-125 text-lg accent-sky-600"
                                    onChange={(e) => setOptionActive({ ...optionActive, type_of_content: e.target.value })}
                                />
                                <span className=" w-full text-center">Social media content</span>
                            </label>
                            <label
                                htmlFor="website"
                                className={`w-full cursor-pointer rounded-sm ${optionActive?.type_of_content === 'website' ? 'bg-[#bde3fa]' : 'bg-[#dbf0fc]'} flex items-center px-3 py-4 text-sky-600`}
                            >
                                <input
                                    type="radio"
                                    value={'Website copy'}
                                    id="website"
                                    name="option"
                                    className="w-[10%] scale-125 text-lg accent-sky-600"
                                    onChange={(e) => setOptionActive({ ...optionActive, type_of_content: e.target.value })}
                                />
                                <span className=" w-full text-center">Website copy</span>
                            </label>
                            <label
                                htmlFor="email"
                                className={`w-full cursor-pointer rounded-sm ${optionActive?.type_of_content === 'Email' ? 'bg-[#bde3fa]' : 'bg-[#dbf0fc]'} flex items-center px-3 py-4 text-sky-600`}
                            >
                                <input
                                    type="radio"
                                    value={'Email'}
                                    id="email"
                                    name="option"
                                    className="w-[10%] scale-125 text-lg accent-sky-600"
                                    onChange={(e) => setOptionActive({ ...optionActive, type_of_content: e.target.value })}
                                />
                                <span className=" w-full text-center">Email</span>
                            </label>
                            <label
                                htmlFor="video"
                                className={`w-full cursor-pointer rounded-sm ${optionActive?.type_of_content === 'video' ? 'bg-[#bde3fa]' : 'bg-[#dbf0fc]'} flex items-center px-3 py-4 text-sky-600`}
                            >
                                <input
                                    type="radio"
                                    value={'Video'}
                                    id="video"
                                    name="option"
                                    className="w-[10%] scale-125 text-lg accent-sky-600"
                                    onChange={(e) => setOptionActive({ ...optionActive, type_of_content: e.target.value })}
                                />
                                <span className=" w-full text-center">Video</span>
                            </label>
                            <label
                                htmlFor="blog"
                                className={`w-full cursor-pointer rounded-sm ${optionActive?.type_of_content === 'Blog' ? 'bg-[#bde3fa]' : 'bg-[#dbf0fc]'} flex items-center px-3 py-4 text-sky-600`}
                            >
                                <input
                                    type="radio"
                                    value={'Blog'}
                                    id="blog"
                                    name="option"
                                    className="w-[10%] scale-125 text-lg accent-sky-600"
                                    onChange={(e) => setOptionActive({ ...optionActive, type_of_content: e.target.value })}
                                />
                                <span className=" w-full text-center">Blog</span>
                            </label>
                            <label
                                htmlFor="testimonial"
                                className={`w-full cursor-pointer rounded-sm ${
                                    optionActive?.type_of_content === 'Case Study Or Testimonial' ? 'bg-[#bde3fa]' : 'bg-[#dbf0fc]'
                                } flex items-center px-3 py-4 text-sky-600`}
                            >
                                <input
                                    type="radio"
                                    value={'Case Study Or Testimonial'}
                                    id="testimonial"
                                    name="option"
                                    className="w-[10%] scale-125 text-lg accent-sky-600"
                                    onChange={(e) => setOptionActive({ ...optionActive, type_of_content: e.target.value })}
                                />
                                <span className=" w-full text-center">Case Study Or Testimonial</span>
                            </label>
                            <label
                                htmlFor="other"
                                className={`w-full cursor-pointer rounded-sm ${optionActive?.type_of_content === 'Other' ? 'bg-[#bde3fa]' : 'bg-[#dbf0fc]'} flex items-center px-3 py-4 text-sky-600`}
                            >
                                <input
                                    type="radio"
                                    value={'Other'}
                                    id="other"
                                    name="option"
                                    className="w-[10%] scale-125 text-lg accent-sky-600"
                                    onChange={(e) => setOptionActive({ ...optionActive, type_of_content: e.target.value })}
                                />
                                <span className=" w-full text-center">Other</span>
                            </label>
                        </div>
                        <div className="next-back mt-10 flex w-full justify-between">
                            <div className="back">
                                <button type="button" className="text-lg" onClick={() => router.back()}>
                                    Back
                                </button>
                            </div>
                            <div className="next w-35">
                                <button type="button" onClick={() => goToPayment()} className="w-full rounded-md bg-[#26A8F4] px-10 py-1.5 text-white shadow-xl">
                                    Next
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Options;
