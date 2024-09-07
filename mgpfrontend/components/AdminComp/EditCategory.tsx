import React, { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react';
import Select from 'react-select';
import api from '@/api';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import { AllCategorys, AllSubCategorys, AllPrompts } from '@/type';
import Swal from 'sweetalert2';

import { useMediaQuery } from '../hooks/useMediaQuery';

type options = {
    value: number;
    label: string;
};
type PropsAddPrompts = {
    toggleOpenCloseEdit: () => void;
    selectedCategory: AllCategorys | undefined;
    setRelaunchDataPrompt: React.Dispatch<React.SetStateAction<boolean>>;
};

type AddPromptProps = {
    prompt_text: string;
    id_subcategory: number;
};

const EditCategory = ({ toggleOpenCloseEdit, selectedCategory, setRelaunchDataPrompt }: PropsAddPrompts) => {
    const ApiUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<number | null>(null);

    const [SubCategoriesOptions, setSubCategoriesOptions] = useState<AllSubCategorys[]>();
    const [ToggleMessageAlert, setToggleMessageAlert] = useState(false);
    const [AddCategory, setAddCategory] = useState<string>();

    const isDesktop = useMediaQuery('(min-width: 1024px)');

    const fetchSubCategories = async () => {
        try {
            const response = await api.get(`/subcategories/bycategory/${selectedCategoryId}`);
            setSubCategoriesOptions(response.data);
        } catch (error) {
            console.error('Failed to fetch SubCategories', error);
        }
    };

    const handleChangeInputs = (e: ChangeEvent<HTMLInputElement>) => {
        setAddCategory(e.target.value);
    };

    const EditCategoryShowAlert = async (type: string, e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        const EditCategoryNow = {
            name: formData.get('category') as string,
            id: selectedCategory?.id,
        };
        console.log(EditCategoryNow);

        toggleOpenCloseEdit();

        if (type === 'edit category') {
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
                    const response = await api.put(`/categories/update/${selectedCategory?.id}`, EditCategoryNow);
                    console.log('Created Succ');
                    setRelaunchDataPrompt(true);
                    Swal.fire({ text: 'Category has been Update.', icon: 'success', customClass: 'sweet-alerts' });
                } catch (error) {
                    console.error('Error creating user:', error);
                    Swal.fire({ text: 'Category has not been Update.', icon: 'warning', customClass: 'sweet-alerts' });
                }
            }
        }
    };

    return (
        <>
            <div className="z-50 h-full w-full bg-black opacity-50 lg:absolute lg:left-0 lg:top-0"></div>
            <div className="fixed inset-0 z-10 flex items-end justify-center lg:z-50 lg:m-auto lg:h-[100%] lg:w-[50%] lg:items-center">
                <form
                    className="panel relative h-[93%] min-h-[50%] w-[100%] overflow-auto rounded-lg bg-white lg:h-auto dark:lg:border dark:lg:border-[#e5e7eb]"
                    onSubmit={(e: ChangeEvent<HTMLFormElement>) => {
                        EditCategoryShowAlert('edit category', e);
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
                        <h1 className="text-lg font-bold md:text-xl lg:text-2xl">Edit Category</h1>
                    </div>

                    <div className="mb-5 mt-8">
                        <div className="flex flex-col">
                            <label>Category:</label>
                            <input defaultValue={selectedCategory?.name} onChange={handleChangeInputs} type="text" placeholder="Enter Your New Category" name="category" className={`form-input`} />
                        </div>
                    </div>

                    {isDesktop ? (
                        <button type="submit" className="btn btn-primary mt-8 gap-2 border-[#26A8F4] bg-[#26A8F4]">
                            <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Edit Category
                        </button>
                    ) : (
                        <div className="mt-12 flex justify-center space-x-1">
                            <button onClick={toggleOpenCloseEdit} type="button" className="btn btn-outline-warning mt-0 w-full gap-2 whitespace-nowrap px-2">
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary mt-0 w-full gap-2 border-[#26A8F4] bg-[#26A8F4] px-2">
                                Edit Category
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </>
    );
};

export default EditCategory;
