import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { AllConverationChat, AllBrading, userByid, AllConveration } from '@/type';
import api from '@/api';
import Select from 'react-select';
import Swal from 'sweetalert2';
import Typewriter from 'typewriter-effect';
import { setAdditionalVariable, setAdditionalVariablePrompts, setTxtSavedPrompts } from '@/store/authSlice';
import SavedPrompts from '@/components/Chat/AddPromptsSaved';

type options = {
    value: number;
    label: string;
};

const Chatbot = () => {
    const dispatch = useDispatch();
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const userId = useSelector((state: IRootState) => (state.auth.value?.user?.id !== undefined ? state.auth.value.user.id : null));
    const additionalVariable = useSelector((state: IRootState) => state.auth.additionalVariable);
    const additionalVariablePrompts = useSelector((state: IRootState) => state.auth.additionalVariablePrompts);
    const TxtSavedPrompt = useSelector((state: IRootState) => state.auth.TxtSavedPrompt);
    const addSavedprompt = useSelector((state: IRootState) => state.auth.addSavedprompt);
    const chatContainerRef = useRef<HTMLDivElement | null>(null);
    const [animation, setAnimation] = useState('...');
    const [nameConversation, setnameConversation] = useState<AllConveration[]>();
    const [nameBranding, setnameBranding] = useState<AllBrading[]>();
    const [stateCustom, setstateCustom] = useState<userByid>();
    const [SelectedIdnameBranding, setSelectedIdnameBranding] = useState<number>();
    const [isLoadingAiResponse, setIsLoadingAiResponse] = useState(false);
    const [SelectedIdConversation, setSelectedIdConversation] = useState<string | null>();
    const router = useRouter();
    const query = router.query;
    const [typewriterActive, setTypewriterActive] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [conversations, setconversations] = useState<AllConverationChat>({
        id: 0,
        title: '',
        message: [
            {
                id: 0,
                sender: '',
                text: '',
                createdAt: `${new Date()}`,
                saved: false,
            },
        ],
    });

    const [chat, setChat] = useState({
        // userimage: `/assets/images/${stateCustom?.profile_logo || 'profile-unknown.jpeg'}`,
        userimage: `/assets/images/profile-9.jpeg`,
        chatimage: '/assets/images/GPTLOGO.png',
    });

    const [txtMsgNewCon, setTxtMsgNewCon] = useState<string>('');
    const [lastidconvo, setlastidconvo] = useState<number>();
    const authSelector: any = useSelector((state: IRootState) => (state?.auth?.value?.user ? state?.auth?.value?.user : null));

    useEffect(() => {
        console.log('indexpage', TxtSavedPrompt);
        if (TxtSavedPrompt !== '') {
            setTxtMsgNewCon(TxtSavedPrompt);
            dispatch(setTxtSavedPrompts(''));
        }
    }, [TxtSavedPrompt, dispatch]);

    const updateAdditionalVariable = () => {
        dispatch(setAdditionalVariable(true));
    };

    const handleChangeBranding = (selectedOption: options | null) => {
        if (selectedOption) {
            console.log(selectedOption.value);
            setSelectedIdnameBranding(selectedOption.value);
        }
    };

    const fetchAllBranding = async () => {
        try {
            if (userId) {
                const response = await api.get(`/prompts/prompts/custom_instructions_of_user/${userId}`);
                const responseUser = await api.get(`/users/${userId}`);
                console.log('users', responseUser.data);

                setstateCustom(responseUser.data);
                setnameBranding(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch Branding', error);
        }
    };

    // const fetchAllConversations = async () => {
    //     try {
    //         const response = await api.get(`/conversations/userconversations/${userId}`);
    //         setnameConversation(response.data);
    //     } catch (error) {
    //         console.error('Failed to fetch conversations', error);
    //     }
    // };

    const fetchAllConversations = async () => {
        try {
            const response = await api.get(`/conversations/userconversations/${userId}`);
            const conversationsData = response.data;

            if (Array.isArray(conversationsData)) {
                setnameConversation(conversationsData); // Update the state
                return conversationsData;
            } else {
                throw new Error('Conversations data is not an array.');
            }
        } catch (error) {
            console.error('Failed to fetch conversations', error);
            return []; // Return an empty array or handle the error as needed
        }
    };

    //  useEffect(()=>{  setTxtMsg(query.data);}, [])
    // useEffect(() => {
    //     if (Array.isArray(query.data)) {
    //         setTxtMsgNewCon(query.data.join(' '));
    //     } else if (query.data !== undefined) {
    //         setTxtMsgNewCon(query.data);
    //     }
    // }, []);

    useEffect(() => {
        const filloutput = async () => {
            try {
                await fetchAllBranding();
                await fetchAllConversations();
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        filloutput();
    }, []);

    const choosethebrand = nameBranding?.map((brand) => ({
        value: brand.id,
        label: brand.brand,
    }));

    const verifyIdAndIncrementLast = async () => {
        console.log('nameconversation', nameConversation);
        console.log('nameconversationUSERID', userId);
        if (userId) {
            const response = await api.get(`/conversations/lastconversation_of_user/${userId}`);
            const lastId = response.data;
            setlastidconvo(lastId.id);
            console.log('lastconvoid', response.data.id);
        } else {
            console.error('nameConversation is undefined or empty.');
        }
    };

    useEffect(() => {
        console.log('last id', lastidconvo);
    }, [lastidconvo]);

    useEffect(() => {
        if (nameConversation) {
            console.log('last convo', nameConversation);
        }
    }, [nameConversation]);

    const addToChat = (text: string, sender: string) => {
        setconversations((prev) => ({
            ...prev,
            message: [
                ...prev.message,
                {
                    id: new Date().getTime(),
                    sender,
                    text,
                    createdAt: `${new Date()}`,
                    saved: false,
                },
            ],
        }));
    };

    const updateFav = (i: number) => {};

    const SendMessage = async (e: any) => {
        e.preventDefault();
        const SendMessageData = {
            promptText: txtMsgNewCon,
            customInstructionId: SelectedIdnameBranding,
        };
        setTypewriterActive(true);
        console.log(SendMessageData);
        addToChat(txtMsgNewCon, 'user');
        setTxtMsgNewCon('');
        setIsLoadingAiResponse(true);

        try {
            const inputElement = document.getElementById('textinput');
            if (inputElement instanceof HTMLInputElement) {
                inputElement.value = '';
            }
            const response = await api.post(`/ai-responses/generate`, SendMessageData);
            console.log('send Succ', response.data);
            addToChat(response.data, 'AI');
            updateAdditionalVariable();
            verifyIdAndIncrementLast();
            setIsLoadingAiResponse(false);
        } catch (error) {
            console.error('Error send:', error);
            Swal.fire({ text: '"Oops! There was an error generating the response. If you see this message frequently, please contact support.', icon: 'warning', customClass: 'sweet-alerts' });
            setTypewriterActive(false);
            const inputElement = document.getElementById('textinput');

            if (inputElement instanceof HTMLInputElement) {
                inputElement.value = '';
            }
            setIsLoadingAiResponse(false);
        }
    };

    useEffect(() => {
        const fetchSelectedConvo = async () => {
            setIsLoading(true);
            if (SelectedIdConversation) {
                const response = await api.get(`/conversations/${SelectedIdConversation}`);
                console.log('New Convo', response);
            }
            setIsLoading(false);
        };
        fetchSelectedConvo();
    }, [SelectedIdConversation]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            console.log('Scrolling to the bottom...');
        }
    }, [conversations]);

    function replaceDateTime(date: string) {
        const now = new Date(date);

        now.setHours(now.getHours() - 1);

        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        return `${hours}:${minutes}:${seconds}`;
    }

    const savedPrompts = async (txtprompt: string) => {
        const putpromptsave = {
            content: txtprompt,
        };
        console.log(putpromptsave);
        await api.post(`/prompts/saved_prompts/new_saved_prompt`, putpromptsave);
        dispatch(setAdditionalVariablePrompts(true));
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            // Update the animation state
            setAnimation((prevAnimation) => {
                if (prevAnimation === '...') {
                    return '.';
                } else if (prevAnimation === '.') {
                    return '..';
                } else {
                    return '...';
                }
            });
        }, 1000);
        return () => {
            clearInterval(intervalId);
        };
    }, []);

    const handleInputNewConv = (value: string) => {
        setTxtMsgNewCon(value);
    };

    const formatText = (text: string) => {
        const parts = text.split('**');
        return parts.map((part, index) => {
            if (index % 2 === 0) {
                return (
                    <span key={index} style={{ whiteSpace: 'pre-line' }}>
                        {part.replace(/\./g, '\n')}
                    </span>
                );
            } else {
                return <strong key={index}>{part}</strong>;
            }
        });
    };
    useEffect(() => {
        if (addSavedprompt) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
    }, [addSavedprompt]);

    return (
        <>
            <>
                {addSavedprompt && <SavedPrompts />}
                <div className="min-h-[90vh] py-2 pt-12">
                    <form className=" main-section mx-auto h-full w-11/12 rounded-md pb-3 pt-0 shadow-lg dark:bg-[#162844]" onSubmit={SendMessage}>
                        {isLoading ? (
                            <div className="screen_loader animate__animated !fixed inset-0 !left-0 !top-0 !z-[9999] grid h-screen min-h-screen w-full place-content-center !bg-white dark:bg-[#060818]">
                                <svg width="64" height="64" viewBox="0 0 135 135" xmlns="http://www.w3.org/2000/svg" fill="#4361ee">
                                    <path d="M67.447 58c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10zm9.448 9.447c0 5.523 4.477 10 10 10 5.522 0 10-4.477 10-10s-4.478-10-10-10c-5.523 0-10 4.477-10 10zm-9.448 9.448c-5.523 0-10 4.477-10 10 0 5.522 4.477 10 10 10s10-4.478 10-10c0-5.523-4.477-10-10-10zM58 67.447c0-5.523-4.477-10-10-10s-10 4.477-10 10 4.477 10 10 10 10-4.477 10-10z">
                                        <animateTransform attributeName="transform" type="rotate" from="0 67 67" to="-360 67 67" dur="2.5s" repeatCount="indefinite" />
                                    </path>
                                    <path d="M28.19 40.31c6.627 0 12-5.374 12-12 0-6.628-5.373-12-12-12-6.628 0-12 5.372-12 12 0 6.626 5.372 12 12 12zm30.72-19.825c4.686 4.687 12.284 4.687 16.97 0 4.686-4.686 4.686-12.284 0-16.97-4.686-4.687-12.284-4.687-16.97 0-4.687 4.686-4.687 12.284 0 16.97zm35.74 7.705c0 6.627 5.37 12 12 12 6.626 0 12-5.373 12-12 0-6.628-5.374-12-12-12-6.63 0-12 5.372-12 12zm19.822 30.72c-4.686 4.686-4.686 12.284 0 16.97 4.687 4.686 12.285 4.686 16.97 0 4.687-4.686 4.687-12.284 0-16.97-4.685-4.687-12.283-4.687-16.97 0zm-7.704 35.74c-6.627 0-12 5.37-12 12 0 6.626 5.373 12 12 12s12-5.374 12-12c0-6.63-5.373-12-12-12zm-30.72 19.822c-4.686-4.686-12.284-4.686-16.97 0-4.686 4.687-4.686 12.285 0 16.97 4.686 4.687 12.284 4.687 16.97 0 4.687-4.685 4.687-12.283 0-16.97zm-35.74-7.704c0-6.627-5.372-12-12-12-6.626 0-12 5.373-12 12s5.374 12 12 12c6.628 0 12-5.373 12-12zm-19.823-30.72c4.687-4.686 4.687-12.284 0-16.97-4.686-4.686-12.284-4.686-16.97 0-4.687 4.686-4.687 12.284 0 16.97 4.686 4.687 12.284 4.687 16.97 0z">
                                        <animateTransform attributeName="transform" type="rotate" from="0 67 67" to="360 67 67" dur="8s" repeatCount="indefinite" />
                                    </path>
                                </svg>
                            </div>
                        ) : (
                            <>
                                <div className=" slide  relative rounded-t-lg bg-[#26A8F4] py-4 text-center text-white dark:bg-[#03396c]  ">
                                    <p>GMP</p>
                                    <div className="absolute right-3 top-[50%] translate-y-[-50%] text-black">
                                        {stateCustom && stateCustom.custom_instuctions_status === false ? (
                                            <Select isDisabled placeholder="List of Branding" />
                                        ) : (
                                            <Select onChange={handleChangeBranding} placeholder="List of Branding" options={choosethebrand} isSearchable={false} />
                                        )}
                                    </div>
                                </div>
                                <div className="text h-[65vh] overflow-y-auto py-3 xl:h-[68vh]" ref={chatContainerRef}>
                                    {conversations &&
                                        conversations?.message.map((message) => (
                                            <div className="content-box flex flex-col p-2" key={message.id}>
                                                {message.sender === 'user' ? (
                                                    <div className="user flex max-w-[80%] flex-row-reverse gap-2 self-end ">
                                                        <Image
                                                            width={40}
                                                            height={40}
                                                            src={`/assets/uploads/${authSelector?.profileLogo}` || 'profile-unknown.jpeg'}
                                                            alt=""
                                                            className="h-10 w-10 rounded-full object-cover"
                                                        />
                                                        <div className="flex-col">
                                                            <p className="max-w-[100%] break-words rounded-xl rounded-tr-none bg-[#f7f7f7] px-2  py-4 text-sm dark:bg-[#e2e8f0] dark:text-[#506690]">
                                                                {message.text}
                                                            </p>
                                                            <p className="text-right text-[10px] text-gray-800 dark:text-white" suppressHydrationWarning>
                                                                {replaceDateTime(message.createdAt)}
                                                            </p>
                                                        </div>
                                                        <button type="button" className="h-12" onClick={() => savedPrompts(message.text)}>
                                                            <svg
                                                                className={`${message.saved ? 'fill-yellow-300' : 'fill-none'}`}
                                                                width="18"
                                                                height="18"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path
                                                                    d="M12.89 5.87988H5.11C4.28599 5.88252 3.49648 6.21103 2.91381 6.79369C2.33114 7.37636 2.00264 8.16587 2 8.98988V20.3499C2 21.7999 3.04 22.4199 4.31 21.7099L8.24 19.5199C8.66 19.2899 9.34 19.2899 9.75 19.5199L13.68 21.7099C14.95 22.4199 15.99 21.7999 15.99 20.3499V8.98988C15.9907 8.58213 15.911 8.17824 15.7556 7.80127C15.6001 7.4243 15.372 7.08164 15.0841 6.79285C14.7962 6.50406 14.4543 6.2748 14.0779 6.11815C13.7014 5.9615 13.2978 5.88054 12.89 5.87988Z"
                                                                    stroke="#888EA8"
                                                                    strokeWidth="1.5"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                />
                                                                <path
                                                                    d="M16 8.98988V20.3499C16 21.7999 14.96 22.4099 13.69 21.7099L9.76 19.5199C9.34 19.2899 8.66 19.2899 8.24 19.5199L4.31 21.7099C3.04 22.4099 2 21.7999 2 20.3499V8.98988C2 7.27988 3.4 5.87988 5.11 5.87988H12.89C14.6 5.87988 16 7.27988 16 8.98988Z"
                                                                    stroke="#888EA8"
                                                                    strokeWidth="1.5"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className={`chat flex max-w-[80%] flex-col gap-2 self-start`}>
                                                        {message.sender === 'AI' ? (
                                                            <div className="flex gap-2">
                                                                <Image width={40} height={40} src={chat.chatimage} alt="" className="h-10 w-10 rounded-full object-cover" />
                                                                <div className="flex-col">
                                                                    <div className="max-w-[100%] break-words rounded-xl rounded-tl-none bg-[#26A8F4] px-2 py-2 text-sm text-white dark:bg-[#03396c]">
                                                                        <Typewriter
                                                                            options={{
                                                                                delay: 15,
                                                                            }}
                                                                            onInit={(typewriter) => {
                                                                                const formattedText = message.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                                                                                const formattedHTML = formattedText.replace(/\n/g, '<br>');
                                                                                typewriter
                                                                                    .typeString(formattedHTML)
                                                                                    .callFunction(() => {
                                                                                        if (message.text === 'Your plan has expired') {
                                                                                            setTypewriterActive(false);
                                                                                        } else {
                                                                                            const newUrl = lastidconvo ? `/main/chatbot/${lastidconvo}?conversation=${lastidconvo}` : '/main/chatbot';
                                                                                            router.push(newUrl);
                                                                                        }
                                                                                    })
                                                                                    .pauseFor(1000)
                                                                                    .start();
                                                                            }}
                                                                        />
                                                                    </div>
                                                                    <p className="text-left text-[10px] text-gray-800" suppressHydrationWarning>
                                                                        {replaceDateTime(message.createdAt)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            formatText(message.text)
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    {isLoadingAiResponse && (
                                        <div className="chat flex max-w-[50%] flex-col gap-2 self-start">
                                            <div className="flex gap-2">
                                                <Image width={40} height={40} src={chat.chatimage} alt="" className="h-10 w-10 rounded-full object-cover" />
                                                <div className="flex-col">
                                                    <p className="max-w-[250px] break-words rounded-xl rounded-tl-none bg-[#26A8F4] px-2 py-2 text-sm text-white">{animation}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="chatbar h-[20%] w-full px-3">
                                    <div className="mx-auto w-full px-[30px] pt-3">
                                        <div className="box relative flex w-full items-center justify-between rounded-lg border">
                                            <textarea
                                                name="text"
                                                id="textinput"
                                                placeholder="Ask me anything about this site..."
                                                className="w-full break-words rounded-lg border-0 bg-white p-3 pr-[40px] outline-none"
                                                onChange={(e) => handleInputNewConv(e.target.value)}
                                                disabled={typewriterActive}
                                                rows={2}
                                                value={txtMsgNewCon}
                                                onKeyDown={(event) => {
                                                    if (event.key === 'Enter' && !event.shiftKey) {
                                                        event.preventDefault();
                                                        SendMessage(event);
                                                    }
                                                }}
                                            ></textarea>
                                            <button type="submit" className="absolute right-[22px] w-4">
                                                <FontAwesomeIcon icon={faPaperPlane} className="cursor-pointer" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </form>
                </div>
            </>
        </>
    );
};
export default Chatbot;
