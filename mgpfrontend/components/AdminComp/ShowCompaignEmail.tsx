import React from 'react';
import { AllMails } from '@/type';
import { useMediaQuery } from '../hooks/useMediaQuery';
type ShowPromptProp = {
    toggleOpenCloseEdit: () => void;
    selectedUser: AllMails | undefined;
};

const ShowCompaignEmail = ({ toggleOpenCloseEdit, selectedUser }: ShowPromptProp) => {
    const isDesktop = useMediaQuery('(min-width: 768px)');
    return (
        <>
            <div className="z-50 h-full w-full bg-black opacity-50 lg:absolute lg:left-0 lg:top-0"></div>
            <div className="fixed inset-0 z-10 flex items-end justify-center lg:z-50 lg:m-auto lg:h-[100%] lg:w-[50%] lg:items-center">
                <form className="panel relative h-[93%] min-h-[50%] w-[100%] overflow-auto rounded-lg bg-white lg:h-auto dark:lg:border dark:lg:border-[#e5e7eb] ">
                    <div className="relative">
                        <div className="z-60 absolute right-0 top-0 ">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={isDesktop ? '33' : '28'}
                                height={isDesktop ? '33' : '28'}
                                viewBox="0 0 33 33"
                                fill="none"
                                stroke="currentColor"
                                onClick={toggleOpenCloseEdit}
                                className="cursor-pointer"
                            >
                                <path d="M24.75 8.25L8.25 24.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M8.25 8.25L24.75 24.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h1 className="mb-4 ml-4 text-lg font-bold md:text-xl lg:text-2xl">Email</h1>
                    </div>
                    <div className="ml-4 flex flex-col space-y-8 ">
                        <div className="flex flex-col">
                            <label className="mb-4 font-bold">Title:</label>
                            <p>{selectedUser?.title}</p>
                        </div>
                        <div className="flex flex-col">
                            <label className="mb-4 font-bold">Text:</label>
                            <p>{selectedUser?.text}</p>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default ShowCompaignEmail;
