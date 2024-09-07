import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);
const SendEmail = () => {
    const [EmailContent, setEmailContent] = useState({
        title: '',
        text: '',
    });
    const router = useRouter();

    const showMessage = () => {
        MySwal.fire({
            title: 'Please fill in Your Title & Text',
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            showCloseButton: true,
        });
    };

    const handleChangeEmail = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setEmailContent({
            ...EmailContent,
            [e.target.name]: e.target.value,
        });
    };

    useEffect(() => {
        console.log(EmailContent);
    }, [EmailContent]);

    return (
        <div className="mx-4 mt-4">
            <div className="relative  mb-6 mt-1 space-y-4 lg:mt-8">
                <h1 className="text-xl font-bold  lg:text-2xl ">Mailing List</h1>
            </div>

            <form className="lg:panel relative min-w-full space-y-6 ">
                <h1 className="text-xl font-bold lg:text-2xl">Send Mail</h1>
                <div className="mb-5">
                    <div className="flex flex-col">
                        <label className="hidden lg:block">Title:</label>

                        <input onChange={handleChangeEmail} type="text" placeholder="Your Title" name="title" className="form-input rounded" />
                    </div>
                </div>
                <div className="mb-5 flex items-center space-x-3">
                    <div className="flex flex-1 flex-col">
                        <label className="hidden lg:block">Text:</label>
                        <textarea onChange={handleChangeEmail} name="text" id="ctnTextarea" rows={3} className="form-textarea" placeholder="Enter Your Text..."></textarea>
                    </div>
                </div>
                <button
                    type="button"
                    className="btn btn-info ml-auto mt-8 w-full gap-2 px-12 lg:w-auto"
                    onClick={() => {
                        if (EmailContent.title.trim() !== '' && EmailContent.text.trim() !== '') {
                            const userJson = JSON.stringify(EmailContent);
                            router.push({
                                pathname: '/admin/emailling/listofuser',
                                query: { ContentofEmail: userJson },
                            });
                        } else {
                            showMessage();
                        }
                    }}
                >
                    Next
                </button>
            </form>
        </div>
    );
};

export default SendEmail;
