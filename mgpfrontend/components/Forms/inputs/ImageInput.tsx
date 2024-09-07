import axios from 'axios';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface Props {
    value: string;
    label: string;
    name: string;
    handle: any;
}

const ImageInput = ({ value, label, handle }: Props) => {
    const [image, setImage] = useState('');
    const { onChange, onBlur, name, ref } = handle;
    useEffect(() => {
        setImage(value);
    }, [value]);
    const handleImage = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('Myimage', file);
            axios
                .post('/api/upload', formData)
                .then((res) => {
                    setImage(file.name);
                    onChange(e);
                })
                .catch((err) => console.log(err));
        }
    };
    return (
        <div className="py-5">
            <span className="text-lg font-bold">{label}</span>
            <label htmlFor={name} className="image-container relative m-auto mt-5 max-h-[500px] max-w-[700px]">
                <div className="hover-layer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="white" height="3em" viewBox="0 0 512 512">
                        <path d="M288 109.3V352c0 17.7-14.3 32-32 32s-32-14.3-32-32V109.3l-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352H192c0 35.3 28.7 64 64 64s64-28.7 64-64H448c35.3 0 64 28.7 64 64v32c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V416c0-35.3 28.7-64 64-64zM432 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z" />
                    </svg>
                    <span className="mt-3 text-lg text-white">Click here to upload an image</span>
                </div>
                <input type="file" id={name} className="hidden" accept="image/*" onChange={handleImage} onBlur={onBlur} name={name} ref={ref} />
                <Image src={`/assets/uploads/${image}`} alt={name} width={700} height={500} className="image m-auto" />
            </label>
        </div>
    );
};

export default ImageInput;
