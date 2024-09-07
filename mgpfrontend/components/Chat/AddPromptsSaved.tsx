import React, { ChangeEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { setAddSavedprompt, setAdditionalVariablePrompts } from '@/store/authSlice';
import { useMediaQuery } from '../hooks/useMediaQuery';
import api from '@/api';
const SavedPrompts = () => {
    const isDesktop = useMediaQuery('(min-width: 1024px)');
    const [txtprompt, settxtprompt] = useState<string>();
    const dispatch = useDispatch();
    const handleTextfiel = (e: ChangeEvent<HTMLTextAreaElement>) => {
        settxtprompt(e.target.value);
    };
    const handlePopSavedPrompt = () => {
        dispatch(setAddSavedprompt(false));
    };

    const handlesubmitsavedprompt = async (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        const putpromptsave = {
            content: txtprompt,
        };
        try {
            const response = await api.post(`/prompts/saved_prompts/new_saved_prompt`, putpromptsave);
        } catch (error: any) {
            if (error.response) {
                if (error.response.status === 400) {
                    Swal.fire({ text: `Upgrade your plan. You cannot save more pre-made prompts.`, icon: 'error', customClass: 'sweet-alerts' });
                } else {
                    Swal.fire({ text: `This prompt already saved in your favorite.`, icon: 'error', customClass: 'sweet-alerts' });
                }
            }
        }
        dispatch(setAdditionalVariablePrompts(true));
        handlePopSavedPrompt();
    };
    return (
        <>
            <div className="z-50 h-full w-full bg-black opacity-50 lg:absolute lg:left-0 lg:top-0"></div>
            <div className=" fixed inset-0 z-10 flex items-end justify-center lg:z-50 lg:m-auto lg:h-[100%] lg:w-[50%] lg:items-center">
                <form className="panel relative h-[93%] min-h-[35%] w-[100%] overflow-auto rounded-lg bg-white lg:h-auto dark:lg:border dark:lg:border-[#e5e7eb]" onSubmit={handlesubmitsavedprompt}>
                    <div className="relative">
                        <div className="z-60 absolute right-4 top-0 ">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="33"
                                height="33"
                                viewBox="0 0 33 33"
                                fill="none"
                                onClick={handlePopSavedPrompt}
                                className="hidden cursor-pointer fill-blue-700 dark:stroke-white-light lg:block"
                            >
                                <path d="M24.75 8.25L8.25 24.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M8.25 8.25L24.75 24.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h1 className="text-lg font-bold md:text-xl lg:text-2xl">Add Saved Prompt</h1>
                    </div>
                    <div className="mb-5 mt-8">
                        <div className="flex flex-col">
                            <label className="hidden lg:block">Your Prompt:</label>
                            <textarea required onChange={handleTextfiel} value={txtprompt} placeholder="Your Prompt..." name="username" className="form-textarea" rows={3} />
                        </div>
                    </div>
                    {isDesktop ? (
                        <button type="submit" className="btn btn-primary mt-8 w-full gap-2 border-[#26A8F4] bg-[#26A8F4]">
                            <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Save
                        </button>
                    ) : (
                        <div className="mt-12 flex justify-center space-x-5">
                            <button onClick={handlePopSavedPrompt} type="button" className="btn btn-outline-warning mt-0 w-full gap-2 whitespace-nowrap">
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary mt-0 w-full  gap-2 whitespace-nowrap border-[#26A8F4] bg-[#26A8F4]">
                                <svg className="hidden h-5 w-5 lg:block" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                Save
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </>
    );
};

export default SavedPrompts;
