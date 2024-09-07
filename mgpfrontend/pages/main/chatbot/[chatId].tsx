import Typewriter from 'typewriter-effect';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState, useRef, ChangeEvent } from 'react';
import { AllConverationChat } from '@/type';
import Head from 'next/head';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faL, faLowVision, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { isUndefined } from 'lodash';
import Dropdown from '@/components/Dropdown';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { AllConveration, AllBrading, userByid } from '@/type';

import Select from 'react-select';
import Swal from 'sweetalert2';
import ChatPage from '@/components/Chat/AddPromptsSaved';
import api from '@/api';
import { GetServerSideProps } from 'next';
import { setAdditionalVariable, setAdditionalVariablePrompts, setAddSavedprompt, setTxtSavedPrompts } from '@/store/authSlice';
import SavedPrompts from '@/components/Chat/AddPromptsSaved';
type options = {
    value: number;
    label: string;
};

const ChatBotID = () => {
    const dispatch = useDispatch();
    const [stateCustom, setstateCustom] = useState<userByid>();
    const [chat, setChat] = useState({
        // userimage: `/assets/images/${stateCustom?.profile_logo || 'profile-unknown.jpeg'}`,
        userimage: '',
        chatimage: '/assets/images/GPTLOGO.png',
    });
    // console.log('photo', `/assets/images/${stateCustom?.profile_logo}`);

    const chatContainerRef = useRef<HTMLDivElement | null>(null);
    const authSelector: any = useSelector((state: IRootState) => (state?.auth?.value?.user ? state?.auth?.value?.user : null));

    const userId = useSelector((state: IRootState) => (state.auth.value?.user?.id ? state.auth.value.user.id : null));
    const addSavedprompt = useSelector((state: IRootState) => state.auth.addSavedprompt);
    const additionalVariable = useSelector((state: IRootState) => state.auth.additionalVariable);
    const TxtSavedPrompt = useSelector((state: IRootState) => state.auth.TxtSavedPrompt);
    const router = useRouter();
    const query = router.query;
    const conversation = router.query.conversation ? JSON.parse(router.query.conversation as string) : null;
    const txtpromptQueryParam = router.query.txtprompt;
    let txtprompt = '';

    if (txtpromptQueryParam) {
        const txtpromptKey = JSON.parse(txtpromptQueryParam as string);
        txtprompt = txtpromptKey.key || '';
    }

    const [txtMsg, setTxtMsg] = useState<string>(txtprompt || '');

    const [conversations, setconversations] = useState<AllConverationChat>({
        id: 0,
        title: '',
        message: [
            {
                id: 0,
                sender: '',
                text: '',
                createdAt: '',
                saved: false,
            },
        ],
    });
    const [displayText, setDisplayText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [latestAiResponse, setLatestAiResponse] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [animation, setAnimation] = useState('...');
    const [nameBranding, setnameBranding] = useState<AllBrading[]>();

    const [SelectedIdnameBranding, setSelectedIdnameBranding] = useState<number>();
    const [isLoadingAiResponse, setIsLoadingAiResponse] = useState(false);

    const [SelectedIdConversation, setSelectedIdConversation] = useState<string | null>();

    useEffect(() => {
        console.log('indexpage', TxtSavedPrompt);
        if (TxtSavedPrompt !== '') {
            setTxtMsg(TxtSavedPrompt);
        } else {
            setTxtMsg('');
        }
    }, [TxtSavedPrompt]);

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

    // const [aiMessage, setAiMessage] = useState<string | null>(null);

    // const typeOutString = (text: string, delay = 100) => {
    //     let currentIndex = 0;
    //     const textLength = text.length;

    //     const displayNextCharacter = () => {
    //         if (currentIndex < textLength) {
    //             const char = text.charAt(currentIndex);
    //             setAiMessage((prevMessage) => (prevMessage ? prevMessage + char : char));

    //             currentIndex++;
    //             setTimeout(displayNextCharacter, delay);
    //         }
    //     };

    //     displayNextCharacter();
    // };

    const fetchConversation = async () => {
        try {
            if (conversation) {
                const response = await api.get(`/conversations/conversations/${conversation}`);
                setconversations(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch conversation', error);
        }
    };

    useEffect(() => {
        const filloutput = async () => {
            await fetchConversation();
            setIsLoading(false);
        };
        filloutput();
    }, [conversation]);

    const choosethebrand = nameBranding?.map((brand) => ({
        value: brand.id,
        label: brand.brand,
    }));
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
                console.log('customInst', response.data);
                const responseUser = await api.get(`/users/${userId}`);
                console.log('users', responseUser.data);

                setstateCustom(responseUser.data);
                setnameBranding(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch Branding', error);
        }
    };

    useEffect(() => {
        const filloutput = async () => {
            await fetchAllBranding();
            setIsLoading(false);
        };
        filloutput();
    }, []);

    useEffect(() => {
        if (Array.isArray(query.data)) {
            setTxtMsg(query.data.join(' '));
        } else if (query.data !== undefined) {
            setTxtMsg(query.data);
        }
    }, []);

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

    const [typewriterActive, setTypewriterActive] = useState(false);

    const SendMessage = async (e: any) => {
        e.preventDefault();
        const SendMessageData = {
            promptText: txtMsg,
            customInstructionId: SelectedIdnameBranding,
        };
        setTypewriterActive(true);

        console.log(SendMessageData);
        addToChat(txtMsg, 'user');
        setTxtMsg('');
        setIsLoadingAiResponse(true);

        try {
            const inputElement = document.getElementById('textinput');
            if (inputElement instanceof HTMLInputElement) {
                inputElement.value = '';
            }
            const response = await api.post(`/ai-responses/generate/${conversation}`, SendMessageData);
            console.log('send Succ', response.data);
            addToChat(response.data, 'AI');
            setLatestAiResponse(response.data);

            setIsLoadingAiResponse(false);
        } catch (error) {
            console.error('Error send:', error);
            Swal.fire({ text: '"Oops! There was an error generating the response. If you see this message frequently, please contact support.', icon: 'warning', customClass: 'sweet-alerts' });
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

    function replaceDateTime(date: string) {
        const now = new Date(date);
        now.setHours(now.getHours() - 1);
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }

    const handleInputPrompt = (value: string) => {
        setTxtMsg(value);
    };

    useEffect(() => {
        dispatch(setTxtSavedPrompts(txtMsg));
    }, [txtMsg]);

    // useEffect(() => {
    //     setTxtMsg(txtprompt || '');
    // }, [txtprompt]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            console.log('Scrolling to the bottom...');
        }
    }, [conversations]);

    const savedPromptsConvo = async (txtprompt: string) => {
        const putpromptsave = {
            content: txtprompt,
        };
        console.log(putpromptsave);
        try {
            const response = await api.post(`/prompts/saved_prompts/new_saved_prompt`, putpromptsave);
        } catch (error: any) {
            if (error.response) {
                if (error.response.status === 400) {
                    Swal.fire({ text: `Upgrade your plan. You cannot save more pre-made prompts.`, icon: 'error', customClass: 'sweet-alerts' });
                } else {
                    Swal.fire({ text: `This prompt already saved in your favorite.`, icon: 'error', customClass: 'sweet-alerts' });
                }
            }
        }

        dispatch(setAdditionalVariablePrompts(true));
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
        console.log('chatbot', additionalVariable);
    }, [additionalVariable]);

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
            <div className="min-h-[90vh] pb-2 pt-12">
                <form className="main-section mx-auto w-11/12 rounded-md pb-3 pt-0 shadow-lg dark:bg-[#162844]" onSubmit={SendMessage}>
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
                                    {stateCustom && stateCustom?.custom_instuctions_status === false ? (
                                        <Select isDisabled placeholder="List of Branding" />
                                    ) : (
                                        <Select onChange={handleChangeBranding} placeholder="List of Branding" options={choosethebrand} isSearchable={false} />
                                    )}
                                </div>
                            </div>
                            <div className="text h-[65vh] overflow-y-auto py-3 xl:h-[68vh]" ref={chatContainerRef}>
                                {conversations.title &&
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
                                                        <p className="max-w-[100%] break-words rounded-xl rounded-tr-none bg-[#f7f7f7] px-2 py-4 text-sm dark:bg-[#e2e8f0] dark:text-[#506690]">
                                                            {message.text}
                                                        </p>
                                                        <p className="text-right text-[10px] text-gray-800 dark:text-white" suppressHydrationWarning>
                                                            {replaceDateTime(message.createdAt)}
                                                        </p>
                                                    </div>
                                                    <button type="button" className="h-12" onClick={() => savedPromptsConvo(message.text)}>
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
                                                    <div className="flex gap-2">
                                                        <Image width={40} height={40} src={chat.chatimage} alt="" className="h-10 w-10 rounded-full object-cover" />
                                                        <div className="flex-col">
                                                            <div className="max-w-[100%] break-words rounded-xl rounded-tl-none bg-[#26A8F4] px-2 py-2 text-sm text-white dark:bg-[#03396c]">
                                                                {message.sender === 'AI' && message.text === latestAiResponse ? (
                                                                    <Typewriter
                                                                        options={{
                                                                            delay: 15,
                                                                        }}
                                                                        onInit={(typewriter) => {
                                                                            const formattedText = message.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                                                                            const formattedHTML = formattedText.replace(/\n/g, '<br>');
                                                                            typewriter
                                                                                .typeString(formattedHTML)
                                                                                .start()
                                                                                .callFunction(() => {
                                                                                    console.log('Typing finished');
                                                                                    setTypewriterActive(false);
                                                                                });
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    formatText(message.text)
                                                                )}
                                                            </div>
                                                            <p className="text-left text-[10px] text-gray-800 dark:text-white" suppressHydrationWarning>
                                                                {replaceDateTime(message.createdAt)}
                                                            </p>
                                                        </div>
                                                    </div>
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
                                            onChange={(e) => handleInputPrompt(e.target.value)}
                                            disabled={typewriterActive}
                                            rows={2}
                                            value={txtMsg}
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
    );
};

export default ChatBotID;
