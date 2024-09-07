import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import api from '@/api';
import SavedPrompts from '@/components/Chat/AddPromptsSaved';
import { IRootState } from '@/store';
import { useSelector } from 'react-redux';
import Plan from '@/components/Plan';

function Subscription() {
    const addSavedprompt = useSelector((state: IRootState) => state.auth.addSavedprompt);
    const [plans, setPlans] = useState<plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [billPlan, setBillPlan] = useState<string>('month');

    const toggleBillPlan = () => {
        // Utilisez simplement une string pour billPlan
        setBillPlan(billPlan === 'month' ? 'year' : 'month');
    };
    useEffect(() => {
        api.get(`${process.env.NEXT_PUBLIC_BASE_URL}/plans/all`)
            .then((res) => {
                if (res.status === 200) {
                    setPlans(res.data);
                    setLoading(false);
                }
            })
            .catch((err) => new Error(err));
    }, []);

    useEffect(() => {
        if (addSavedprompt) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
    }, [addSavedprompt]);

    return (
        <>
            {addSavedprompt && <SavedPrompts />}
            <Head>
                <title>Subscription</title>
            </Head>
            <div className="min-h-[90vh] ">
                <div className="mt-8 flex items-center justify-center space-x-4">
                    <span className="text-base font-medium">Bill Monthly</span>
                    <button className="relative rounded-full " onClick={toggleBillPlan}>
                        <div className="h-8 w-16 rounded-full bg-indigo-500 shadow-md outline-none transition"></div>
                        <div
                            className={`absolute left-1 top-1 inline-flex h-6 w-6 transform items-center justify-center rounded-full bg-white shadow-sm transition-all duration-200 ease-in-out ${
                                billPlan === 'month' ? 'translate-x-0' : 'translate-x-8'
                            }`}
                        ></div>
                    </button>
                    <span className="text-base font-medium">Bill Annually</span>
                </div>
                {!loading && (
                    <div className="grid grid-cols-1 gap-x-11 gap-y-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                        {plans
                            ?.filter((tabPlan) => tabPlan.payment_cycle === billPlan)
                            ?.map((plan, i) => (
                                <Plan key={i} plan={plan} />
                            ))}
                    </div>
                )}
            </div>
        </>
    );
}

export default Subscription;
