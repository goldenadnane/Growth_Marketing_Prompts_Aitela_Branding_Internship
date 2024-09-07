import React, { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react';
import Select from 'react-select';

import ImageUploading, { ImageListType } from 'react-images-uploading';
import { AllSubCategorys, AllPlans, PaymentCycleType } from '@/type';
import Swal from 'sweetalert2';
import api from '@/api';
import { useMediaQuery } from '../hooks/useMediaQuery';

type options = {
    value: number;
    label: string;
};
type PropsAddPlans = {
    toggleOpenCloseEdit: () => void;
    selectedPlan: AllPlans | undefined;
    setSelectedPlan: React.Dispatch<React.SetStateAction<AllPlans | undefined>>;
    items: AllPlans[] | undefined;
    setRelaunchDataPlan: Dispatch<SetStateAction<boolean>>;
};

const EditPlan = ({ toggleOpenCloseEdit, selectedPlan, setSelectedPlan, setRelaunchDataPlan }: PropsAddPlans) => {
    const ApiUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const [selectedPaymentCycle, setSelectedPaymentCycle] = useState<string | null>(null);
    const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<number | null>(null);

    const [SubCategoriesOptions, setSubCategoriesOptions] = useState<AllSubCategorys[]>();
    const [ToggleMessageAlert, setToggleMessageAlert] = useState(false);
    const [isAvailable, setIsAvailable] = useState(false);
    const [EditPlan, setEditPlan] = useState({
        id: selectedPlan?.id,
        name: selectedPlan?.name,
        price: selectedPlan?.price,
        pre_made_prompt: selectedPlan?.pre_made_prompt,
        chat_per_day: selectedPlan?.chat_per_day,
        saved_prompt: selectedPlan?.saved_prompt,
        custom_instructions: selectedPlan?.custom_instructions,
        payment_cycle: selectedPlan?.payment_cycle,
        is_available: selectedPlan?.is_available,
        currency: selectedPlan?.currency,
    });

    const isDesktop = useMediaQuery('(min-width: 1024px)');

    // const ChoosePaymentCycle = items?.map((payment) => ({
    //     value: payment.id,
    //     label: payment.payment_cycle,
    // }));

    // const fetchSubCategories = async () => {
    //     try {
    //         const response = await axios.get(`${ApiUrl}/subcategories/bycategory/${selectedCategoryId}`);
    //         setSubCategoriesOptions(response.data);
    //     } catch (error) {
    //         console.error('Failed to fetch SubCategories', error);
    //     }
    // };

    // useEffect(() => {
    //     if (selectedCategoryId !== null) {
    //         console.log(selectedCategoryId);
    //         fetchSubCategories();
    //     }
    //     if (selectedSubCategoryId) {
    //         console.log(selectedSubCategoryId);
    //         setAddPrompt({
    //             ...AddPrompt,
    //             id_subcategory: selectedSubCategoryId,
    //         });
    //     }
    // }, [selectedCategoryId, selectedSubCategoryId]);

    // New Value Is_Available
    const handleChangeIsAvailable = (selectedOption: { value: boolean; label: string } | null) => {
        if (selectedOption) {
            const selectedValue = selectedOption.value;
            setIsAvailable(selectedValue);
            setEditPlan({
                ...EditPlan,
                is_available: selectedValue,
            });
        } else {
            setIsAvailable(false);
        }
    };
    // Edit new Value PaymentCycle
    const handleChangePaymentCycle = (ChoosePaymentCycle: { value: string; label: string } | null) => {
        if (ChoosePaymentCycle) {
            const selectedValue = ChoosePaymentCycle.label;
            setSelectedPaymentCycle(selectedValue);
            setEditPlan({
                ...EditPlan,
                payment_cycle: selectedValue,
            });
        } else {
            setSelectedPaymentCycle('');
        }
    };
    // New values for Inputs
    const handleChangeInputs = (e: ChangeEvent<HTMLInputElement>) => {
        setEditPlan({
            ...EditPlan,
            [e.target.name]: e.target.value,
        });
    };

    const optionBooleanIsAvailable = [
        { value: true, label: 'True' },
        { value: false, label: 'False' },
    ];

    const PaymentCycle: PaymentCycleType = {
        month: 'month',
        year: 'year',
    };

    const ChoosePaymentCycle = Object.keys(PaymentCycle).map((key) => ({
        value: key,
        label: PaymentCycle[key],
    }));

    const EditPlanShowAlert = async (type: string, e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        const AddPlanNow = {
            name: formData.get('name') as string,
            payment_cycle: EditPlan.payment_cycle,
            currency: EditPlan.currency,
            is_available: EditPlan.is_available,
            price: EditPlan.price,
            pre_made_prompt: EditPlan.pre_made_prompt,
            chat_per_day: EditPlan.chat_per_day,
            saved_prompt: EditPlan.saved_prompt,
            custom_instructions: EditPlan.custom_instructions,
        };
        toggleOpenCloseEdit();
        if (type === 'edit plan') {
            const result = await Swal.fire({
                icon: 'info',
                text: `You want to Edit Plan`,
                showCancelButton: true,
                confirmButtonText: 'Update',
                padding: '2em',
                customClass: 'sweet-alerts',
            });

            if (result.value) {
                try {
                    const response = await api.put(`/plans/update/${EditPlan.id}`, AddPlanNow);
                    console.log('Created Succ', response.data);
                    setRelaunchDataPlan(true);
                    Swal.fire({ text: 'Plan has been Edit.', icon: 'success', customClass: 'sweet-alerts' });
                } catch (error) {
                    console.error('Error creating user:', error);
                    Swal.fire({ text: 'Plan has not been Edited.', icon: 'warning', customClass: 'sweet-alerts' });
                }
            }
        }
    };
    console.log('plan', EditPlan.id);

    return (
        <>
            <div className="z-50 h-full w-full bg-black opacity-50 lg:absolute lg:left-0 lg:top-0"></div>
            <div className="fixed inset-0 z-10 flex items-end justify-center lg:z-50 lg:m-auto lg:h-[100%] lg:w-[50%] lg:items-center">
                <form
                    className="panel relative h-[93%] min-h-[50%] w-[100%] overflow-auto rounded-lg bg-white lg:h-auto dark:lg:border dark:lg:border-[#e5e7eb]"
                    onSubmit={(e: ChangeEvent<HTMLFormElement>) => {
                        EditPlanShowAlert('edit plan', e);
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
                        <h1 className="text-lg font-bold md:text-xl lg:text-2xl">Edit Plan</h1>
                    </div>
                    <div className="mb-3 mt-3 lg:mb-5 lg:mt-5">
                        <div className="flex flex-col">
                            <label>Name:</label>
                            <input
                                type="text"
                                onChange={handleChangeInputs}
                                defaultValue={EditPlan?.name}
                                placeholder="Enter Name..."
                                name="name"
                                className="form-input ltr:rounded-r-none rtl:rounded-l-none"
                            />
                        </div>
                    </div>
                    <div className="mb-3 mt-3 lg:mb-5 lg:mt-5">
                        <div className="flex flex-col">
                            <label>Price:</label>
                            <input
                                type="number"
                                onChange={handleChangeInputs}
                                defaultValue={EditPlan?.price}
                                placeholder="Enter Price..."
                                className="form-input ltr:rounded-r-none rtl:rounded-l-none"
                                name="price"
                            />
                        </div>
                    </div>
                    <div className="mb-3 mt-3 lg:mb-5 lg:mt-5">
                        <div className="flex flex-col">
                            <label>Is Available:</label>
                            <Select
                                defaultValue={optionBooleanIsAvailable.find((option) => option.value === EditPlan?.is_available)}
                                onChange={handleChangeIsAvailable}
                                placeholder="Choose Your Category..."
                                options={optionBooleanIsAvailable}
                                isSearchable={false}
                            />
                        </div>
                    </div>
                    <div className="mb-3 flex flex-col items-center space-y-3 md:flex-row md:space-x-3 md:space-y-0 lg:mb-5">
                        <div className="flex w-full flex-1 flex-col">
                            <label>Pre made prompt:</label>
                            <input type="number" onChange={handleChangeInputs} defaultValue={EditPlan?.pre_made_prompt} placeholder="Your Pre..." name="pre_made_prompt" className={`form-input`} />
                        </div>

                        <div className="flex w-full flex-1 flex-col">
                            <label>Chat per month:</label>
                            <input type="number" onChange={handleChangeInputs} defaultValue={EditPlan?.chat_per_day} placeholder="Your Chat..." name="chat_per_day" className={`form-input`} />
                        </div>
                    </div>
                    <div className="mb-3 flex flex-col items-center space-y-3 md:flex-row md:space-x-3 md:space-y-0 lg:mb-5">
                        <div className="flex w-full flex-1 flex-col">
                            <label>Saved prompt:</label>
                            <input type="number" onChange={handleChangeInputs} defaultValue={EditPlan?.saved_prompt} placeholder="Your Saved..." name="saved_prompt" className={`form-input `} />
                        </div>

                        <div className="flex w-full flex-1 flex-col">
                            <label>Custom instructions:</label>
                            <input
                                type="number"
                                onChange={handleChangeInputs}
                                defaultValue={EditPlan?.custom_instructions?.toFixed(2)}
                                placeholder="Your Custom..."
                                name="custom_instructions"
                                className={`form-input`}
                            />
                        </div>
                    </div>

                    <div className="mb-3 mt-3 lg:mb-5 lg:mt-5">
                        <div className="flex flex-col">
                            <label>Payment Cycle:</label>
                            <Select
                                defaultValue={ChoosePaymentCycle?.find((option) => option.label === EditPlan?.payment_cycle)}
                                onChange={handleChangePaymentCycle}
                                placeholder="Choose Your Category..."
                                options={ChoosePaymentCycle}
                                isSearchable={false}
                            />
                        </div>
                    </div>

                    {isDesktop ? (
                        <button type="submit" className="btn btn-primary mt-8 gap-2 border-[#26A8F4] bg-[#26A8F4]">
                            <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Edit Plan
                        </button>
                    ) : (
                        <div className="mt-12 flex justify-center space-x-1">
                            <button onClick={toggleOpenCloseEdit} type="button" className="btn btn-outline-warning mt-0 w-full gap-2 whitespace-nowrap">
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary mt-0 w-full gap-2 border-[#26A8F4] bg-[#26A8F4]">
                                Edit Plan
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </>
    );
};

export default EditPlan;
