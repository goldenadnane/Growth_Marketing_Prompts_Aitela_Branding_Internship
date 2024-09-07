import { useRouter } from 'next/navigation';
import api from '@/api';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { setAddToFavorite, setTxtSavedPrompts } from '@/store/authSlice';
import { useEffect } from 'react';
import Dropdown from './Dropdown';
import Swal from 'sweetalert2';

function Prompt({ ...props }) {
    const router = useRouter();
    const ApiUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const dispatch = useDispatch();
    const addInSavedPrompt = (id: string) => {
        api.post(`${ApiUrl}/prompts/${id}`)
            .then((res) => {
                dispatch(setAddToFavorite(true));
                Swal.fire({ text: `Prompt added in favorite.`, icon: 'success', customClass: 'sweet-alerts' });
            })
            .catch((err) => {
                console.log(err);
                Swal.fire({ text: `An error was occured, please repate another time`, icon: 'warning', customClass: 'sweet-alerts' });
            });
    };
    const navigateToChatBot = (data: string) => {
        dispatch(setTxtSavedPrompts(data));
        router.push('/main/chatbot');
    };
    return (
        <>
            <div className=" mt-4 lg:mt-8">
                <div className="grid  grid-cols-1  gap-4 2xs:grid-cols-2 md:grid-cols-3   lg:grid-cols-4">
                    {props.prompt?.map((item: any, i: any) => {
                        return (
                            <div
                                key={i}
                                className="flex h-full w-full flex-row items-center justify-between whitespace-normal rounded-lg bg-[#ECECEE] p-3 text-[#000] dark:bg-[#CACAD1] "
                                onClick={() => {
                                    if (item.promptId)
                                        api.post(`${ApiUrl}/prompts/prompts/get_prompt_to_increase_used_field/${item.promptId}`)
                                            .then((res) => navigateToChatBot(item.prompt_prompt_text))
                                            .catch((err) => console.log(err));
                                    else {
                                        if (item.prompt_prompt_text)
                                            api.post(`${ApiUrl}/prompts/prompts/get_prompt_to_increase_used_field/${item.prompt_id}`)
                                                .then((res) => navigateToChatBot(item.prompt_prompt_text))
                                                .catch((err) => console.log(err));
                                        else navigateToChatBot(item.prompt_goal);
                                    }
                                }}
                            >
                                <span className="text-left">{item.prompt_goal}</span>
                                <div className="dropdown">
                                    <Dropdown
                                        btnClassName=" dropdown-toggle"
                                        button={
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-7 w-7">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                                                    />
                                                </svg>
                                            </>
                                        }
                                    >
                                        <ul className="!m-0 !p-1 ">
                                            <li
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    addInSavedPrompt(item.prompt_id);
                                                }}
                                                className="cursor-pointer"
                                            >
                                                Add to favorite
                                            </li>
                                        </ul>
                                    </Dropdown>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}

export default Prompt;
