import React from 'react';
import { SelectedPromptsDataEdit } from '@/type';
import { useMediaQuery } from '../hooks/useMediaQuery';
type ShowPromptProp = {
    toggleOpenCloseShow: () => void;
    selectedPrompts: SelectedPromptsDataEdit | undefined;
};

const ShowPrompts = ({ toggleOpenCloseShow, selectedPrompts }: ShowPromptProp) => {
    const isDesktop = useMediaQuery('(min-width: 768px)');
    return (
        <>
            <div className="z-50 h-full w-full bg-black opacity-50 md:absolute md:left-0 md:top-0"></div>
            <div className=" fixed inset-0 z-10 flex items-end justify-center md:z-50 md:m-auto md:h-[100%] md:w-[50%] md:items-center">
                <form className=" panel relative h-[93%] min-h-[50%]  w-[100%] rounded-lg bg-white md:h-auto dark:md:border dark:md:border-[#e5e7eb]">
                    <div className="relative mb-8">
                        <div className="z-60 absolute right-0 top-0 ">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={isDesktop ? '33' : '28'}
                                height={isDesktop ? '33' : '28'}
                                viewBox="0 0 33 33"
                                fill="none"
                                onClick={toggleOpenCloseShow}
                                className="cursor-pointer fill-blue-700 dark:stroke-white-light"
                            >
                                <path d="M24.75 8.25L8.25 24.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M8.25 8.25L24.75 24.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h1 className="text-lg font-bold md:text-xl lg:text-2xl">Prompt Text</h1>
                    </div>
                    <div className="mb-5 flex items-center space-x-3">
                        <div className="flex flex-1 flex-col">
                            <label>Prompt Text:</label>
                            <textarea
                                disabled
                                id="ctnTextarea"
                                rows={6}
                                className="form-textarea"
                                placeholder="Enter Your Text..."
                                required
                                defaultValue={selectedPrompts?.prompt_prompt_text}
                            ></textarea>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default ShowPrompts;
