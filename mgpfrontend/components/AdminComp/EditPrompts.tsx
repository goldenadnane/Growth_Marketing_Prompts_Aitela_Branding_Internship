import React, { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import Select from 'react-select';
import { OptionsOrGroups, GroupBase } from 'react-select';
import { SelectedPromptsDataEdit, AllCategorys, AllSubCategorys } from '@/type';
import Swal from 'sweetalert2';
import { useMediaQuery } from '../hooks/useMediaQuery';
import api from '@/api';

type options = {
    value: number;
    label: string;
};

type EditPromptProp = {
    toggleOpenCloseEdit: () => void;
    selectedPrompts: SelectedPromptsDataEdit | undefined;
    setSelectedPrompts: Dispatch<SetStateAction<SelectedPromptsDataEdit | undefined>>;
    AllCategorys: AllCategorys[] | undefined;
    AllSubCategorys: AllSubCategorys[] | undefined;
    ToggleSuccess: () => void;
    setRelaunchDataPrompt: Dispatch<SetStateAction<boolean>>;
};

const EditPrompts = ({ toggleOpenCloseEdit, selectedPrompts, setSelectedPrompts, AllCategorys, setRelaunchDataPrompt, ToggleSuccess }: EditPromptProp) => {
    const ApiUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const [activeTab, setActiveTab] = useState<boolean>();

    const [SubCategoriesOptions, setSubCategoriesOptions] = useState<AllSubCategorys[]>();
    const isDesktop = useMediaQuery('(min-width: 1024px)');

    const fetchSubCategories = async () => {
        try {
            const response = await api.get(`/subcategories/bycategory/${selectedCategoryId}`);
            setSubCategoriesOptions(response.data);
        } catch (error) {
            console.error('Failed to fetch SubCategories', error);
        }
    };

    const handleChangeTextPrompt = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        if (selectedPrompts) {
            setSelectedPrompts({
                ...selectedPrompts,
                [e.target.name]: e.target.value,
            });
        }
    };

    const handleOnchangeCategory = (selectedOption: options | null) => {
        if (selectedOption) {
            const selectedValue = selectedOption.value;
            setSelectedCategoryId(selectedValue);
        } else {
            setSelectedCategoryId(undefined);
        }
    };

    const ChooseCategorys = AllCategorys?.map((category) => ({
        value: category.id,
        label: category.name,
    }));

    const initialIdCategory = ChooseCategorys?.find((option) => option.label === selectedPrompts?.category_name)?.value;
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(initialIdCategory);
    useEffect(() => {
        if (selectedCategoryId !== undefined) {
            console.log(selectedCategoryId);
            fetchSubCategories();
        }
    }, [selectedCategoryId]);

    const ChooseSubCategorys = SubCategoriesOptions?.map((subcategory) => ({
        value: subcategory.id,
        label: subcategory.name,
    }));

    // Prompt Active or Desactive
    useEffect(() => {
        if (selectedPrompts?.prompt_status === true) {
            setActiveTab(true);
        } else {
            setActiveTab(false);
        }
    }, [selectedPrompts?.prompt_status]);

    const EditUsershowAlert = async (type: string, e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();

        const FormDataPrompt = {
            id: selectedPrompts?.prompt_id,
            prompt_text: selectedPrompts?.prompt_prompt_text,
            status: activeTab,
        };

        toggleOpenCloseEdit();

        if (type === 'update prompt') {
            const result = await Swal.fire({
                icon: 'info',
                text: `You want to Edit Prompt`,
                showCancelButton: true,
                confirmButtonText: 'Update',
                padding: '2em',
                customClass: 'sweet-alerts',
            });

            if (result.value) {
                try {
                    const response = await api.put(`/prompts/update/${FormDataPrompt.id}`, FormDataPrompt);
                    console.log('Created Succ', response.data);
                    setRelaunchDataPrompt(true);
                    Swal.fire({ text: 'Prompt has been Edited.', icon: 'success', customClass: 'sweet-alerts' });
                } catch (error) {
                    console.error('Error creating user:', error);
                    Swal.fire({ text: 'Prompt has not been Edited.', icon: 'warning', customClass: 'sweet-alerts' });
                }
            }
        }
    };

    console.log('all', selectedPrompts);
    console.log('Sub', activeTab);

    return (
        <>
            <div className="z-50 h-full w-full bg-black opacity-50 lg:absolute lg:left-0 lg:top-0"></div>
            <div className=" fixed inset-0 z-10 flex items-end justify-center lg:z-50 lg:m-auto lg:h-[100%] lg:w-[50%] lg:items-center">
                <form
                    className="panel relative h-[93%] min-h-[50%] w-[100%]  overflow-auto rounded-lg bg-white lg:h-auto dark:lg:border dark:lg:border-[#e5e7eb]"
                    onSubmit={(e: ChangeEvent<HTMLFormElement>) => {
                        EditUsershowAlert('update prompt', e);
                    }}
                >
                    <div className="relative">
                        <div className="z-60 absolute right-0 top-0 ">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="33"
                                height="33"
                                viewBox="0 0 33 33"
                                fill="none"
                                onClick={toggleOpenCloseEdit}
                                className="hidden cursor-pointer fill-blue-700 dark:stroke-white-light lg:block"
                            >
                                <path d="M24.75 8.25L8.25 24.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M8.25 8.25L24.75 24.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h1 className="text-lg font-bold md:text-xl lg:text-2xl">Edit Prompt</h1>
                    </div>
                    <div className="mb-5 mt-8">
                        <div className="flex flex-col">
                            <label className="hidden lg:block">Category:</label>

                            <Select
                                placeholder="Choose Your Category..."
                                defaultValue={ChooseCategorys?.find((option) => option.label === selectedPrompts?.category_name)}
                                onChange={handleOnchangeCategory}
                                options={ChooseCategorys}
                                isSearchable={false}
                            />
                        </div>
                    </div>
                    <div className="mb-5">
                        <div className="flex flex-col">
                            <label className="hidden lg:block">SubCategory:</label>
                            {ChooseSubCategorys ? (
                                <Select
                                    placeholder="Choose Your SubCategory..."
                                    defaultValue={ChooseSubCategorys?.find((option) => option.label === selectedPrompts?.subcategory_name)}
                                    options={ChooseSubCategorys}
                                    isSearchable={false}
                                />
                            ) : (
                                ''
                            )}
                        </div>
                    </div>
                    <div className="mb-5 flex items-center space-x-3">
                        <div className="flex flex-1 flex-col">
                            <label className="hidden lg:block">Prompt Goal:</label>
                            <input
                                name="goal"
                                type="text"
                                defaultValue={selectedPrompts?.prompt_goal}
                                onChange={handleChangeTextPrompt}
                                id="ctnTextarea"
                                className="form-input"
                                placeholder="Enter Your Text..."
                                required
                            ></input>
                        </div>
                    </div>
                    <div className="mb-5 flex items-center space-x-3">
                        <div className="flex flex-1 flex-col">
                            <label>Prompt Text:</label>
                            <textarea
                                onChange={handleChangeTextPrompt}
                                id="ctnTextarea"
                                defaultValue={selectedPrompts?.prompt_prompt_text}
                                name="prompt_prompt_text"
                                rows={isDesktop ? 3 : 5}
                                className="form-textarea"
                                placeholder="Enter Your Text..."
                                required
                            ></textarea>
                        </div>
                    </div>
                    <div>
                        <label className="font-bold">Status:</label>
                        <div className="inline-block w-[65%] md:w-[45%] lg:w-[40%]">
                            <ul className="mb-5 flex items-center space-x-3  text-center">
                                <li className=" flex-1 cursor-pointer">
                                    <div
                                        className={`${activeTab === true ? '!bg-[#90ee907a] ' : ''}
                                        block rounded-lg border-2  border-[#90ee907a] p-1 font-bold text-green-800 dark:bg-[#1b2e4b] lg:p-2.5`}
                                        onClick={() => setActiveTab(true)}
                                    >
                                        Active
                                    </div>
                                </li>

                                <li className="  flex-1 cursor-pointer">
                                    <div
                                        className={`${activeTab === false ? '!bg-red-400 ' : ''} block rounded-lg  border-2
                                        border-red-400 p-1 font-bold text-red-600 dark:bg-[#1b2e4b] lg:p-2.5`}
                                        onClick={() => setActiveTab(false)}
                                    >
                                        Desactive
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {isDesktop ? (
                        <button type="submit" className="btn btn-primary mt-8 gap-2 border-[#26A8F4] bg-[#26A8F4] px-16 font-bold">
                            Save
                        </button>
                    ) : (
                        <div className="mt-12 flex justify-center space-x-1 ">
                            <button onClick={toggleOpenCloseEdit} type="button" className="btn btn-outline-warning mt-0 w-full gap-2 whitespace-nowrap">
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary w-full gap-2 border-[#26A8F4] bg-[#26A8F4] px-2 font-bold">
                                Edit Prompt
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </>
    );
};

export default EditPrompts;
