import React, { ChangeEvent, useState } from 'react';
import Swal from 'sweetalert2';
import api from '@/api';
const Integrations = () => {
    const ApiUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const [AddIntegration, setAddIntegration] = useState({
        apikey: '',
        stripeSecretKey: '',
        param3: '',
        param4: '',
    });

    const handleChangeInputs = (e: ChangeEvent<HTMLInputElement>) => {
        setAddIntegration({
            ...AddIntegration,
            [e.target.name]: e.target.value,
        });
    };

    const AddPlanShowAlert = async (type: string, e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        const AddIntegrationNow = {
            apikey: formData.get('apikey') as string,
            stripeSecretKey: formData.get('stripeSecretKey') as string,
        };
        console.log(AddIntegrationNow);

        try {
            const response = await api.put(`/update`, AddIntegrationNow);
            console.log('Created Succ', response.data);
            Swal.fire({ text: 'Integration has been Saved.', icon: 'success', customClass: 'sweet-alerts' });
        } catch (error) {
            console.error('Error creating user:', error);
            Swal.fire({ text: 'Integration has not been Saved.', icon: 'warning', customClass: 'sweet-alerts' });
        }
    };

    return (
        <div className="mx-4 mt-4">
            <form
                className="lg:panel relative mt-10 min-h-[50%] w-[100%] rounded-lg bg-white"
                onSubmit={(e: ChangeEvent<HTMLFormElement>) => {
                    AddPlanShowAlert('save integration', e);
                }}
            >
                <div className="relative">
                    <h1 className="text-lg font-bold md:text-xl lg:text-2xl">Integrations</h1>
                </div>

                <div className="mb-5 mt-8">
                    <div className="flex flex-col">
                        <label className="font-bold">Apikey:</label>
                        <input type="text" onChange={handleChangeInputs} placeholder="Enter Price..." name="apikey" className="form-input" />
                    </div>
                </div>
                <div className="mb-5">
                    <div className="flex flex-col">
                        <label className="font-bold">StripeSecretKey:</label>
                        <input type="text" onChange={handleChangeInputs} placeholder="Enter Price..." name="stripeSecretKey" className="form-input " />
                    </div>
                </div>
                <button type="submit" className="btn btn-primary mt-8 w-full gap-2 border-[#26A8F4] bg-[#26A8F4] lg:w-auto">
                    <svg className="hidden h-5 w-5 lg:block" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Save
                </button>
            </form>
        </div>
    );
};

export default Integrations;
