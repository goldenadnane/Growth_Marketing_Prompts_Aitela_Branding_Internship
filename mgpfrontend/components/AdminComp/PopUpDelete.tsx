import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { Allusers, AllPrompts } from '@/type';

type PopUpDeleteProps = {
    message: string;
    deleteRow?: (user: Allusers) => Promise<void>;
    userToDelete?: Allusers;
    TogglePopUpDelete?: (user: Allusers) => void;
    TogglePopUpDeletePrompt: (Prompt: AllPrompts) => void;
};

const PopUpDelete = ({ message, TogglePopUpDelete, userToDelete, deleteRow }: PopUpDeleteProps) => {
    console.log('user:', userToDelete);

    return (
        <>
            <div className="absolute left-0 top-0 z-50 h-full w-full bg-black opacity-50"></div>
            <div className=" panel absolute left-[50%] top-[40%] z-50  translate-x-[-50%] translate-y-[-50%] lg:row-span-2">
                <div className="m-auto mx-auto flex w-fit items-center">
                    <svg width="" height="" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className=" h-20 w-20">
                        <circle opacity="1" cx="12" cy="12" r="10" stroke="#DC143C" strokeWidth="1.5"></circle>
                        <path d="M14.5 9.50002L9.5 14.5M9.49998 9.5L14.5 14.5" stroke="#DC143C" strokeWidth="1.5" strokeLinecap="round"></path>
                    </svg>
                </div>
                <h1 className="p-6 pt-3 text-center text-2xl font-bold text-rose-500">Are you sure?</h1>
                <p className="text-center text-base font-medium italic">{message}</p>
                <div className="flex items-center justify-center space-x-10 p-6 pb-0">
                    <button
                        className="btn btn-danger flex-1"
                        onClick={() => {
                            if (userToDelete && deleteRow) {
                                deleteRow(userToDelete);
                            }
                        }}
                    >
                        Delete
                    </button>
                    <button
                        className="btn btn-info flex-1"
                        onClick={() => {
                            if (userToDelete && TogglePopUpDelete) {
                                TogglePopUpDelete(userToDelete);
                            }
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </>
    );
};

export default PopUpDelete;
