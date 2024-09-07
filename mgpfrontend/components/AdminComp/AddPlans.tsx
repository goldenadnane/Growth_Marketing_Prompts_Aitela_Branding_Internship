import React, { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react';
import Select from 'react-select';
import { useMediaQuery } from '../hooks/useMediaQuery';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import { AllCategorys, AllSubCategorys, AllPrompts, AllPlans, PaymentCycleType } from '@/type';
import Swal from 'sweetalert2';
import api from '@/api';
type options = {
    value: number;
    label: string;
};

type PropsAddPlans = {
    toggleOpenClose: () => void;
    ToggleSuccess: () => void;
    records: AllPlans[] | undefined;
    setRecords: React.Dispatch<React.SetStateAction<AllPlans[] | undefined>>;
    AllCategorys: AllCategorys[] | undefined;
    AllSubCategorys: AllSubCategorys[] | undefined;
    setRelaunchDataPlan: Dispatch<SetStateAction<boolean>>;
    items: AllPlans[] | undefined;
};

const AddPlans = ({ toggleOpenClose, AllCategorys, setRelaunchDataPlan, items }: PropsAddPlans) => {
    const ApiUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const [selectedPaymentCycle, setSelectedPaymentCycle] = useState<string>();
    const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<number | null>(null);

    const [SubCategoriesOptions, setSubCategoriesOptions] = useState<AllSubCategorys[]>();
    const [ToggleMessageAlert, setToggleMessageAlert] = useState(false);
    const [isAvailable, setIsAvailable] = useState<boolean>(false);

    const isDesktop = useMediaQuery('(min-width: 1024px)');

    const PaymentCycle: PaymentCycleType = {
        month: 'month',
        year: 'year',
    };

    const ChoosePaymentCycle = Object.keys(PaymentCycle).map((key) => ({
        value: key,
        label: PaymentCycle[key],
    }));

    const [AddPlans, setAddPlans] = useState<AllPlans>({
        id: 0,
        name: '',
        price: 0,
        pre_made_prompt: 0,
        saved_prompt: 0,
        chat_per_day: 0,
        custom_instructions: 0,
        payment_cycle: selectedPaymentCycle || '',
        is_available: isAvailable,
        currency: 'USD',
    });

    const handleChangeInputs = (e: ChangeEvent<HTMLInputElement>) => {
        setAddPlans({
            ...AddPlans,
            [e.target.name]: e.target.value,
        });
    };

    const handleChangeIsAvailable = (selectedOption: { value: boolean; label: string } | null) => {
        if (selectedOption) {
            const selectedValue = selectedOption.value;
            setIsAvailable(selectedValue);
            setAddPlans({
                ...AddPlans,
                is_available: selectedValue,
            });
        } else {
            setIsAvailable(false);
        }
    };

    const handleChangePaymentCycle = (ChoosePaymentCycle: { value: string; label: string } | null) => {
        if (ChoosePaymentCycle) {
            const selectedValue = ChoosePaymentCycle.label;
            setSelectedPaymentCycle(selectedValue);
            setAddPlans({
                ...AddPlans,
                payment_cycle: selectedValue,
            });
        } else {
            setSelectedPaymentCycle(' ');
        }
    };

    const AddPlanShowAlert = async (type: string, e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        const AddPlanNow = {
            name: formData.get('name') as string,
            payment_cycle: selectedPaymentCycle,
            currency: AddPlans.currency,
            is_available: isAvailable,
            price: AddPlans.price,
            pre_made_prompt: AddPlans.pre_made_prompt,
            chat_per_day: AddPlans.chat_per_day,
            saved_prompt: AddPlans.saved_prompt,
            custom_instructions: AddPlans.custom_instructions,
        };
        console.log(AddPlanNow);

        toggleOpenClose();

        if (type === 'create plan') {
            const result = await Swal.fire({
                icon: 'info',
                text: `You want to Create Plan`,
                showCancelButton: true,
                confirmButtonText: 'Create',
                padding: '2em',
                customClass: 'sweet-alerts',
            });

            if (result.value) {
                try {
                    const response = await api.post(`${process.env.NEXT_PUBLIC_BASE_URL}/plans/create-plan`, AddPlanNow);
                    console.log('Created Succ', response.data);
                    setRelaunchDataPlan(true);
                    Swal.fire({ text: 'Plan has been Created.', icon: 'success', customClass: 'sweet-alerts' });
                } catch (error) {
                    console.error('Error creating user:', error);
                    Swal.fire({ text: 'Plan has not been created.', icon: 'warning', customClass: 'sweet-alerts' });
                }
            }
        }
    };

    return (
        <>
            <div className="z-50 h-full w-full bg-black opacity-50 lg:absolute lg:left-0 lg:top-0"></div>
            <div className=" fixed inset-0 z-10 flex items-end justify-center lg:z-50 lg:m-auto lg:h-[100%] lg:w-[50%] lg:items-center">
                <form
                    className="panel relative h-[93%] min-h-[50%] w-[100%] overflow-auto rounded-lg bg-white lg:h-auto dark:lg:border dark:lg:border-[#e5e7eb]"
                    onSubmit={(e: ChangeEvent<HTMLFormElement>) => {
                        AddPlanShowAlert('create plan', e);
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
                        <h1 className="text-lg font-bold md:text-xl lg:text-2xl">New Plan</h1>
                    </div>
                    <div className="mb-3 mt-3 lg:mb-5 lg:mt-5">
                        <div className="flex flex-col">
                            <label className="hidden lg:block">Name:</label>
                            <input type="text" onChange={handleChangeInputs} placeholder="Enter Name..." name="name" className="form-input ltr:rounded-r-none rtl:rounded-l-none" />
                        </div>
                    </div>
                    <div className="mb-3 mt-3 lg:mb-5 lg:mt-5">
                        <div className="flex flex-col">
                            <label className="hidden lg:block">Price:</label>
                            <input type="number" onChange={handleChangeInputs} placeholder="Enter Price..." name="price" className="form-input ltr:rounded-r-none rtl:rounded-l-none" />
                        </div>
                    </div>
                    <div className="mb-3 mt-3 lg:mb-5 lg:mt-5">
                        <div className="flex flex-col">
                            <label className="hidden lg:block">Is Available:</label>
                            <Select
                                onChange={handleChangeIsAvailable}
                                placeholder="Choose Your Category..."
                                options={[
                                    { value: true, label: 'True' },
                                    { value: false, label: 'False' },
                                ]}
                                isSearchable={false}
                            />
                        </div>
                    </div>
                    <div className="mb-3 flex flex-col items-center space-y-3 md:flex-row md:space-x-3 md:space-y-0 lg:mb-5">
                        <div className="flex w-full flex-1 flex-col">
                            <label className="hidden lg:block">Pre made prompt:</label>
                            <input type="number" onChange={handleChangeInputs} placeholder="Pre made prompt" name="pre_made_prompt" className={`form-input `} />
                        </div>

                        <div className="flex w-full flex-1 flex-col">
                            <label className="hidden lg:block">Chat per month:</label>
                            <input type="number" onChange={handleChangeInputs} placeholder="Chat per month" name="chat_per_day" className={`form-input`} />
                        </div>
                    </div>
                    <div className="mb-3 flex flex-col items-center space-y-3 md:flex-row md:space-x-3 md:space-y-0 lg:mb-5">
                        <div className="flex w-full flex-1 flex-col">
                            <label className="hidden lg:block">Saved prompt:</label>
                            <input type="number" onChange={handleChangeInputs} placeholder="Saved prompt" name="saved_prompt" className={`form-input `} />
                        </div>

                        <div className="flex w-full flex-1 flex-col">
                            <label className="hidden lg:block">Custom instructions:</label>
                            <input type="number" onChange={handleChangeInputs} placeholder="Custom instructions" name="custom_instructions" className={`form-input`} />
                        </div>
                    </div>

                    <div className="mb-3 mt-3 lg:mb-5 lg:mt-5">
                        <div className="flex flex-col">
                            <label className="hidden lg:block">Payment Cycle:</label>
                            <Select onChange={handleChangePaymentCycle} placeholder="Choose Your Payment Cycle" options={ChoosePaymentCycle} isSearchable={false} />
                        </div>
                    </div>

                    {isDesktop ? (
                        <button type="submit" className="btn btn-primary mt-8 gap-2 border-[#26A8F4] bg-[#26A8F4]">
                            <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Add Prompt
                        </button>
                    ) : (
                        <div className="mt-12 flex justify-center space-x-1">
                            <button onClick={toggleOpenClose} type="button" className="btn btn-outline-warning mt-0 w-full gap-2 whitespace-nowrap">
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary mt-0 w-full gap-2 border-[#26A8F4] bg-[#26A8F4]">
                                Add Plan
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </>
    );
};

export default AddPlans;
