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
    toggleOpenCloseShow: () => void;
    selectedPlan: AllPlans | undefined;
    setSelectedPlan: React.Dispatch<React.SetStateAction<AllPlans | undefined>>;
    items: AllPlans[] | undefined;
    setRelaunchDataPlan: Dispatch<SetStateAction<boolean>>;
};

const ShowPlans = ({ toggleOpenCloseShow, selectedPlan, setSelectedPlan, setRelaunchDataPlan }: PropsAddPlans) => {
    const ApiUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const [selectedPaymentCycle, setSelectedPaymentCycle] = useState<string | null>(null);
    const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<number | null>(null);

    const isDesktop = useMediaQuery('(min-width: 768px)');

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

    return (
        <>
            <div className="z-50 h-full w-full bg-black opacity-50 lg:absolute lg:left-0 lg:top-0"></div>
            <div className="fixed inset-0 z-10 flex items-end justify-center lg:z-50 lg:m-auto lg:h-[100%] lg:w-[50%] lg:items-center">
                <form
                    className="panel relative h-[93%] min-h-[50%] w-[100%] overflow-auto rounded-lg bg-white lg:h-auto dark:lg:border dark:lg:border-[#e5e7eb]"
                    onSubmit={(e: ChangeEvent<HTMLFormElement>) => {
                        //EditPlanShowAlert('edit plan', e);
                    }}
                >
                    <div className="relative">
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
                        <h1 className="text-lg font-bold md:text-xl lg:text-2xl">Show Plan</h1>
                    </div>
                    <div className="mb-5 mt-8">
                        <div className="flex flex-col">
                            <label>Name:</label>
                            <h1>{EditPlan.name}</h1>
                        </div>
                    </div>
                    <div className="mb-5 mt-8">
                        <div className="flex flex-col">
                            <label>Price:</label>
                            <p>{EditPlan.price}</p>
                        </div>
                    </div>
                    <div className="mb-5 mt-8">
                        <div className="flex flex-col">
                            <label>IsAvailable:</label>
                            <p>{optionBooleanIsAvailable.find((option) => option.value === EditPlan?.is_available)?.value === true ? 'True' : 'False'}</p>
                        </div>
                    </div>
                    <div className="mb-5 flex items-center space-x-3">
                        <div className="flex flex-1 flex-col">
                            <label>Pre_made_prompt:</label>
                            <p>{EditPlan.pre_made_prompt}</p>
                        </div>

                        <div className="flex flex-1 flex-col">
                            <label>Chat_per_day:</label>
                            <p>{EditPlan.chat_per_day}</p>
                        </div>
                    </div>
                    <div className="mb-5 flex items-center space-x-3">
                        <div className="flex flex-1 flex-col">
                            <label>Saved_prompt:</label>
                            <p>{EditPlan.saved_prompt}</p>
                        </div>

                        <div className="flex flex-1 flex-col">
                            <label>Custom_instructions:</label>
                            <p>{EditPlan.custom_instructions}</p>
                        </div>
                    </div>

                    <div className="mb-5 mt-8">
                        <div className="flex flex-col">
                            <label>Payment Cycle:</label>
                            <p>{ChoosePaymentCycle?.find((option) => option.label === EditPlan?.payment_cycle)?.value}</p>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default ShowPlans;
