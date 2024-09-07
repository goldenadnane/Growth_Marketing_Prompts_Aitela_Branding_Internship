import React, { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react';
import Select from 'react-select';
import Swal from 'sweetalert2';
import api from '@/api';
import { useMediaQuery } from '@/components/hooks/useMediaQuery';

type PropsEditCustomInstr = {
    toggleOpenCloseEdit: () => void;
    selectedCustomInstr: ManagSettingInstruction | undefined;
    setSelectedCustomInstr: React.Dispatch<React.SetStateAction<ManagSettingInstruction | undefined>>;
    setRelaunchDataCustomInstr: Dispatch<SetStateAction<boolean>>;
};

const EditCustomInstructions = ({ toggleOpenCloseEdit, selectedCustomInstr, setSelectedCustomInstr, setRelaunchDataCustomInstr }: PropsEditCustomInstr) => {
    const ApiUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const isDesktop = useMediaQuery('(min-width: 1024px)');

    const [EditCustomInstructions, setEditCustomInstruction] = useState({
        id: selectedCustomInstr?.id,
        brand: selectedCustomInstr?.brand,
        product_service: selectedCustomInstr?.product_service,
        target_audience: selectedCustomInstr?.target_audience,
        feature1: selectedCustomInstr?.feature1,
        feature2: selectedCustomInstr?.feature2,
        feature3: selectedCustomInstr?.feature3,
    });

    // New values for Inputs
    const handleChangeInputs = (e: ChangeEvent<HTMLInputElement>) => {
        setEditCustomInstruction({
            ...EditCustomInstructions,
            [e.target.name]: e.target.value,
        });
    };

    const EditCustomInstrShowAlert = async (type: string, e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();

        const EditCustomInstrNow = {
            brand: EditCustomInstructions.brand,
            product_service: EditCustomInstructions.product_service,
            target_audience: EditCustomInstructions.target_audience,
            feature1: EditCustomInstructions.feature1,
            feature2: EditCustomInstructions.feature2,
            feature3: EditCustomInstructions.feature3,
        };
        toggleOpenCloseEdit();
        if (type === 'edit custom instruction') {
            const result = await Swal.fire({
                icon: 'info',
                text: `You want to Edit Custom Instruction`,
                showCancelButton: true,
                confirmButtonText: 'Update',
                padding: '2em',
                customClass: 'sweet-alerts',
            });

            if (result.value) {
                try {
                    const response = await api.put(`${ApiUrl}/prompts/prompts/custom_instruction/${EditCustomInstructions.id}`, EditCustomInstrNow);
                    console.log('Edit Succ', response.data);
                    setRelaunchDataCustomInstr(true);
                    Swal.fire({ text: 'Custom Instriction has been Updated.', icon: 'success', customClass: 'sweet-alerts' });
                } catch (error) {
                    console.error('Error creating user:', error);
                    Swal.fire({ text: 'Custom Instriction has not been Updated.', icon: 'warning', customClass: 'sweet-alerts' });
                }
            }
        }
    };

    return (
        <>
            <div className="z-50 h-full w-full bg-black opacity-50 lg:absolute lg:left-0 lg:top-0"></div>
            <div className="fixed inset-0 z-10 flex items-end justify-center lg:z-50 lg:m-auto lg:h-[100%] lg:w-[50%] lg:items-center">
                <form
                    onSubmit={(e: ChangeEvent<HTMLFormElement>) => {
                        EditCustomInstrShowAlert('edit custom instruction', e);
                    }}
                    className="panel relative h-[93%] min-h-[50%] w-[100%] overflow-auto rounded-lg bg-white lg:h-auto dark:lg:border dark:lg:border-[#e5e7eb]"
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
                        <h1 className="text-lg font-bold md:text-xl lg:text-2xl">Edit Custom Instructions</h1>
                    </div>

                    <div className="mb-3 mt-3 lg:mb-5 lg:mt-5">
                        <label className="hidden lg:block" htmlFor="brand">
                            Brand
                        </label>
                        <input
                            type="text"
                            id="brand"
                            required
                            name="brand"
                            placeholder="Your Brand"
                            defaultValue={EditCustomInstructions?.brand}
                            className="w-full rounded-md border-2 px-3 py-2 duration-200 read-only:bg-slate-100 dark:bg-transparent dark:text-white"
                            onChange={handleChangeInputs}
                        />
                    </div>
                    <div className="mb-3 mt-3 lg:mb-5 lg:mt-5">
                        <label className="hidden lg:block" htmlFor="product_service">
                            Product/Service
                        </label>
                        <input
                            type="text"
                            id="product_service"
                            required
                            name="product_service"
                            placeholder="Your Product Service"
                            defaultValue={EditCustomInstructions?.product_service}
                            className="w-full rounded-md border-2 px-3 py-2 duration-200 read-only:bg-slate-100 dark:bg-transparent dark:text-white"
                            onChange={handleChangeInputs}
                        />
                    </div>
                    <div className="mb-3 mt-3 lg:mb-5 lg:mt-5">
                        <label className="hidden lg:block" htmlFor="audience">
                            Target Audience
                        </label>
                        <input
                            type="text"
                            id="audience"
                            required
                            name="target_audience"
                            placeholder="Your Target Audience"
                            defaultValue={EditCustomInstructions?.target_audience}
                            className="w-full rounded-md border-2 px-3 py-2 duration-200 read-only:bg-slate-100 dark:bg-transparent dark:text-white"
                            onChange={handleChangeInputs}
                        />
                    </div>
                    <div className="mb-3 mt-3 lg:mb-5 lg:mt-5">
                        <label className="hidden lg:block" htmlFor="feature1">
                            Feature 1
                        </label>
                        <input
                            type="text"
                            id="feature1"
                            required
                            name="feature1"
                            placeholder="Your Feature"
                            defaultValue={EditCustomInstructions?.feature1}
                            className="w-full rounded-md border-2 px-3 py-2 duration-200 read-only:bg-slate-100 dark:bg-transparent dark:text-white"
                            onChange={handleChangeInputs}
                        />
                    </div>
                    <div className="mb-3 mt-3 lg:mb-5 lg:mt-5">
                        <label className="hidden lg:block" htmlFor="feature2">
                            Feature 2
                        </label>
                        <input
                            type="text"
                            id="feature2"
                            required
                            name="feature2"
                            placeholder="Your Feature"
                            defaultValue={EditCustomInstructions?.feature2}
                            className="w-full rounded-md border-2 px-3 py-2 duration-200 read-only:bg-slate-100 dark:bg-transparent dark:text-white"
                            onChange={handleChangeInputs}
                        />
                    </div>
                    <div className="mb-3 mt-3 lg:mb-5 lg:mt-5">
                        <label className="hidden lg:block" htmlFor="feature3">
                            Feature 3
                        </label>
                        <input
                            type="text"
                            id="feature3"
                            required
                            name="feature3"
                            placeholder="Your Feature"
                            defaultValue={EditCustomInstructions?.feature3}
                            className="w-full rounded-md border-2 px-3 py-2 duration-200 read-only:bg-slate-100 dark:bg-transparent dark:text-white"
                            onChange={handleChangeInputs}
                        />
                    </div>
                    {isDesktop ? (
                        <button type="submit" className="btn btn-primary mt-8 gap-2 border-[#26A8F4] bg-[#26A8F4]">
                            <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Edit Brand
                        </button>
                    ) : (
                        <div className="mt-12 flex justify-center space-x-1">
                            <button onClick={toggleOpenCloseEdit} type="button" className="btn btn-outline-warning mt-0 w-full gap-2 whitespace-nowrap">
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary mt-0 w-full gap-2 border-[#26A8F4] bg-[#26A8F4]">
                                Edit brand
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </>
    );
};

export default EditCustomInstructions;
