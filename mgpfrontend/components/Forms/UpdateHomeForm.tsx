import api from '@/api';
import { useEffect, useState } from 'react';
import ImageInput from './inputs/ImageInput';
import TextAreaInput from './inputs/TextAreaInput';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';

const UpdateHomeForm = () => {
    const [home, setHome] = useState({
        id: 1,
        title: '',
        title_background: '',
        slide_1_text: '',
        slide_1_img: '',
        slide_1_description: '',
        slide_2_text: '',
        slide_2_img: '',
        slide_2_description: '',
        slide_3_text: '',
        slide_3_img: '',
        slide_3_description: '',
    });
    useEffect(() => {
        api.get('/home/1')
            .then((res) => setHome(res.data))
            .catch((err) => console.log(err));
    }, []);

    const submitForm = (data: any) => {
        const formData = new FormData();
        if (typeof data.title_background === 'string') data.title_background = new File([], data.title_background);
        else data.title_background = data.title_background[0];
        if (typeof data.slide_1_img === 'string') data.slide_1_img = new File([], data.slide_1_img);
        else data.slide_1_img = data.slide_1_img[0];
        if (typeof data.slide_2_img === 'string') data.slide_2_img = new File([], data.slide_2_img);
        else data.slide_2_img = data.slide_2_img[0];
        if (typeof data.slide_3_img === 'string') data.slide_3_img = new File([], data.slide_3_img);
        else data.slide_3_img = data.slide_3_img[0];
        for (let key in data) {
            formData.set(key, data[key]);
        }
        api.put('/home/update/1', formData)
            .then((res) => {
                Swal.fire({ text: 'Home has been Edited.', icon: 'success', customClass: 'sweet-alerts' });
            })
            .catch((err) => {
                Swal.fire({ text: 'Sory, an error was occured', icon: 'warning', customClass: 'sweet-alerts' });
                console.log(err);
            });
    };

    const { register, handleSubmit, reset } = useForm<any>({
        defaultValues: home,
    });

    useEffect(() => {
        reset(home);
    }, [home]);

    const onSubmit = handleSubmit((data) => submitForm(data));
    return (
        <form onSubmit={onSubmit}>
            <ImageInput name="title_background" label="Upload section background" value={home.title_background} handle={register('title_background')} />
            <TextAreaInput value={home.title} label="Title" placeholder="Section title" name="title" handle={register('title')} />
            <ImageInput name="slide_1_img" label="upload slide 1" value={home.slide_1_img} handle={register('slide_1_img')} />
            <div className="grid sm:grid-cols-1 sm:gap-0 md:grid-cols-2 md:gap-7">
                <TextAreaInput name="slide_1_text" label="Title" placeholder="Section title" value={home.slide_1_text} handle={register('slide_1_text')} />
                <TextAreaInput name="slide_1_description" label="Description" placeholder="Description title" value={home.slide_1_description} handle={register('slide_1_description')} />
            </div>
            <ImageInput name="slide_2_img" label="upload slide 2" value={home.slide_2_img} handle={register('slide_2_img')} />
            <div className="grid sm:grid-cols-1 sm:gap-0 md:grid-cols-2 md:gap-7">
                <TextAreaInput name="slide_2_text" label="Title" placeholder="Section title" value={home.slide_2_text} handle={register('slide_2_text')} />
                <TextAreaInput name="slide_2_description" label="Description" placeholder="Description title" value={home.slide_2_description} handle={register('slide_2_description')} />
            </div>
            <ImageInput name="slide_3_img" label="upload slide 3" value={home.slide_3_img} handle={register('slide_3_img')} />
            <div className="grid sm:grid-cols-1 sm:gap-0 md:grid-cols-2 md:gap-7">
                <TextAreaInput name="slide_3_text" label="Title" placeholder="Section title" value={home.slide_3_text} handle={register('slide_3_text')} />
                <TextAreaInput name="slide_3_description" label="Description" placeholder="Description title" value={home.slide_3_description} handle={register('slide_3_description')} />
            </div>
            <div className=" flex w-full items-start justify-center pt-4">
                <button className="mx-8 rounded-md bg-sky-500 px-3 py-1 font-mono text-xl font-bold text-white" type="submit">
                    Save
                </button>
            </div>
        </form>
    );
};

export default UpdateHomeForm;
