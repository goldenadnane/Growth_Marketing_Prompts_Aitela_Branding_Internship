import React, { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react';
import Select from 'react-select';
import api from '@/api';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import { AllCategorys, AllSubCategorys, AllPrompts } from '@/type';
import { useMediaQuery } from '../hooks/useMediaQuery';
import Swal from 'sweetalert2';
type options = {
    value: number;
    label: string;
};
type PropsAddPrompts = {
    toggleOpenClose: () => void;
    ToggleSuccess: () => void;
    records: AllPrompts[] | undefined;
    setRecords: React.Dispatch<React.SetStateAction<AllPrompts[] | undefined>>;
    AllCategorys: AllCategorys[] | undefined;
    AllSubCategorys: AllSubCategorys[] | undefined;
    setRelaunchDataPrompt: Dispatch<SetStateAction<boolean>>;
};

type AddPromptProps = {
    prompt_text: string;
    id_subcategory: number;
    goal: string;
};

const AddPrompts = ({ toggleOpenClose, AllCategorys, setRelaunchDataPrompt }: PropsAddPrompts) => {
    const ApiUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<number | null>(null);
    const isDesktop = useMediaQuery('(min-width: 1024px)');

    const [SubCategoriesOptions, setSubCategoriesOptions] = useState<AllSubCategorys[]>();
    const [ToggleMessageAlert, setToggleMessageAlert] = useState(false);
    const [AddPrompt, setAddPrompt] = useState<AddPromptProps>({
        prompt_text: '',
        id_subcategory: 0,
        goal: '',
    });

    const ChooseCategorys = AllCategorys?.map((category) => ({
        value: category.id,
        label: category.name,
    }));

    const fetchSubCategories = async () => {
        try {
            const response = await api.get(`/subcategories/bycategory/${selectedCategoryId}`);
            setSubCategoriesOptions(response.data);
        } catch (error) {
            console.error('Failed to fetch SubCategories', error);
        }
    };

    useEffect(() => {
        if (selectedCategoryId !== null) {
            console.log('cat', selectedCategoryId);
            fetchSubCategories();
        }
        if (selectedSubCategoryId) {
            console.log('subcat', selectedSubCategoryId);
            setAddPrompt({
                ...AddPrompt,
                id_subcategory: selectedSubCategoryId,
            });
        }
    }, [selectedCategoryId, selectedSubCategoryId]);

    const ChooseSubCategorys = SubCategoriesOptions?.map((subcategory) => ({
        value: subcategory.id,
        label: subcategory.name,
    }));

    const handleOnchangeCategory = (selectedOption: options | null) => {
        if (selectedOption) {
            const selectedValue = selectedOption.value;
            setSelectedCategoryId(selectedValue);
        } else {
            setSelectedCategoryId(null);
        }
    };

    const handleChangeSubCategory = (selectedOption: options | null) => {
        if (selectedOption) {
            const selectedValue = selectedOption.value;
            setSelectedSubCategoryId(selectedValue);
        } else {
            setSelectedSubCategoryId(null);
        }
    };

    const handleChangeTextArea = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setAddPrompt({
            ...AddPrompt,
            [e.target.name]: e.target.value,
        });
    };

    const AddPromptShowAlert = async (type: string, e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        const AddPromptNow = {
            prompt_text: formData.get('prompt_text') as string,
            id_subcategory: selectedSubCategoryId,
            goal: formData.get('goal') as string,
        };
        console.log(AddPromptNow);

        toggleOpenClose();

        if (type === 'create prompt') {
            const result = await Swal.fire({
                icon: 'info',
                text: `You want to Create Prompt`,
                showCancelButton: true,
                confirmButtonText: 'Create',
                padding: '2em',
                customClass: 'sweet-alerts',
            });

            if (result.value) {
                try {
                    const response = await api.post(`/prompts/save`, AddPromptNow);
                    console.log('Created Succ', response.data);
                    setRelaunchDataPrompt(true);
                    Swal.fire({ text: 'Prompt has been Created.', icon: 'success', customClass: 'sweet-alerts' });
                } catch (error) {
                    console.error('Error creating user:', error);
                    Swal.fire({ text: 'Prompt has not been created.', icon: 'warning', customClass: 'sweet-alerts' });
                }
            }
        }
    };

    return (
        <>
            <div className="z-50 h-full w-full bg-black opacity-50 lg:absolute lg:left-0 lg:top-0"></div>
            <div className=" fixed inset-0 z-10 flex items-end justify-center lg:z-50 lg:m-auto lg:h-[100%] lg:w-[50%] lg:items-center">
                <form
                    className="panel relative h-[93%] min-h-[50%] w-[100%]  overflow-auto rounded-lg bg-white lg:h-auto dark:lg:border dark:lg:border-[#e5e7eb] "
                    onSubmit={(e: ChangeEvent<HTMLFormElement>) => {
                        AddPromptShowAlert('create prompt', e);
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
                                onClick={toggleOpenClose}
                                className="hidden cursor-pointer fill-blue-700 dark:stroke-white-light lg:block"
                            >
                                <path d="M24.75 8.25L8.25 24.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M8.25 8.25L24.75 24.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h1 className="text-lg font-bold md:text-xl lg:text-2xl">Add Prompt</h1>
                    </div>

                    <div className="mb-5 mt-8">
                        <div className="flex flex-col">
                            <label className="hidden lg:block">Category:</label>
                            <Select required onChange={handleOnchangeCategory} placeholder="Choose Your Category..." options={ChooseCategorys} isSearchable={false} />
                        </div>
                    </div>
                    <div className="mb-5">
                        <div className="flex flex-col">
                            <label className="hidden lg:block">SubCategory:</label>
                            {selectedCategoryId !== null ? (
                                <Select required onChange={handleChangeSubCategory} placeholder="Choose Your SubCategory..." options={ChooseSubCategorys} isSearchable={false} />
                            ) : (
                                <Select isDisabled placeholder="Choose Your SubCategory..." />
                            )}
                        </div>
                    </div>
                    <div className="mb-5 flex items-center space-x-3">
                        <div className="flex flex-1 flex-col">
                            <label className="hidden lg:block">Prompt Goal:</label>
                            <input name="goal" type="text" onChange={handleChangeTextArea} id="ctnTextarea" className="form-input" placeholder="Enter Your Text..." required></input>
                        </div>
                    </div>
                    <div className="mb-5 flex items-center space-x-3">
                        <div className="flex flex-1 flex-col">
                            <label className="hidden lg:block">Prompt Text:</label>
                            <textarea name="prompt_text" onChange={handleChangeTextArea} id="ctnTextarea" rows={3} className="form-textarea" placeholder="Enter Your Text..." required></textarea>
                        </div>
                    </div>

                    {isDesktop ? (
                        <button type="submit" className="btn btn-primary mt-8 w-full gap-2 border-[#26A8F4] bg-[#26A8F4] lg:w-auto">
                            <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Add Prompt
                        </button>
                    ) : (
                        <div className="mt-12 flex justify-center space-x-1">
                            <button onClick={toggleOpenClose} type="button" className="btn btn-outline-warning mt-0 w-full gap-2 whitespace-nowrap px-2">
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary w-full gap-2 border-[#26A8F4] bg-[#26A8F4] px-2 lg:w-auto">
                                Add Prompt
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </>
    );
};

export default AddPrompts;
