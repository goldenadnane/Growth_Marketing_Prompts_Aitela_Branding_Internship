import axios from 'axios';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import api from '@/api';

import { useMediaQuery } from '../hooks/useMediaQuery';

type PropsUploadFileCSV = {
    toggleOpenCloseFileCSV: () => void;
};

const UploadFileCSV = ({ toggleOpenCloseFileCSV }: PropsUploadFileCSV) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const ApiUrl = process.env.NEXT_PUBLIC_BASE_URL;

    const isDesktop = useMediaQuery('(min-width: 1024px)');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            // Check if the selected file has a CSV extension
            if (file.name.endsWith('.csv')) {
                setSelectedFile(file);

                setErrorMessage(null);
            } else {
                setSelectedFile(null);
                setErrorMessage('Selected file is not a CSV file.');
            }
        }
    };

    const handleUpload = async () => {
        if (selectedFile) {
            const formDataToSubmit = new FormData();
            formDataToSubmit.append('file', selectedFile);

            const response = await api.post(`${ApiUrl}/prompts/upload`, formDataToSubmit, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Response:', response.data);
            toggleOpenCloseFileCSV();
            Swal.fire({ text: 'File has been uploaded.', icon: 'success', customClass: 'sweet-alerts' });
        } else {
            setErrorMessage('Please select a CSV file before uploading.');
        }
    };
    useEffect(() => {
        console.log(selectedFile);
    });

    return (
        <>
            <div className="z-50 h-full w-full bg-black opacity-50 lg:absolute lg:left-0 lg:top-0"></div>
            <div className="fixed inset-0 z-10 flex items-end justify-center lg:z-50 lg:m-auto lg:h-[100%] lg:w-[50%] lg:items-center">
                <div className="panel relative h-[93%] min-h-[50%] w-[100%] overflow-auto rounded-lg bg-white lg:h-auto dark:lg:border dark:lg:border-[#e5e7eb]">
                    <div className="relative pb-2">
                        <div className="z-60 absolute right-0 top-0 ">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="33"
                                height="33"
                                viewBox="0 0 33 33"
                                fill="none"
                                onClick={toggleOpenCloseFileCSV}
                                className="hidden cursor-pointer fill-blue-700 dark:stroke-white-light lg:block"
                            >
                                <path d="M24.75 8.25L8.25 24.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M8.25 8.25L24.75 24.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h1 className="text-lg font-bold md:text-xl lg:text-2xl">Add File CSV</h1>
                    </div>
                    <div className="custom-file-container border-0" data-upload-id="myFirstImage">
                        <label className="custom-file-container__custom-file custom-file-container__custom-file__custom-file-input"></label>
                        <input type="file" className="custom-file-container__custom-file__custom-file-input relative -top-2 z-50 w-[95%] cursor-pointer " accept=".csv" onChange={handleFileChange} />
                        <input type="hidden" name="MAX_FILE_SIZE" value="10485760" />
                        <button
                            className="custom-file-container__custom-file__custom-file-control  flex items-center
                                justify-between"
                        >
                            {selectedFile ? selectedFile.name : 'Upload CSV File'}
                            <button className="text-xl font-bold" onClick={() => setSelectedFile(null)}>
                                X
                            </button>
                        </button>
                        {errorMessage && <p className="font-semibold text-red-500">{errorMessage}</p>}
                    </div>

                    {isDesktop ? (
                        <button className="btn btn-primary mt-8 gap-2 border-[#26A8F4] bg-[#26A8F4]" onClick={handleUpload}>
                            <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Save
                        </button>
                    ) : (
                        <div className="mt-12 flex justify-center space-x-3">
                            <button onClick={toggleOpenCloseFileCSV} type="button" className="btn btn-outline-warning mt-0 w-full gap-2 whitespace-nowrap">
                                Cancel
                            </button>
                            <button className="btn btn-primary mt-0 w-full gap-2 border-[#26A8F4] bg-[#26A8F4]" onClick={handleUpload}>
                                Save
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default UploadFileCSV;
