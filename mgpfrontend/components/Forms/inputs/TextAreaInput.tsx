interface Props {
    value: string;
    name: string;
    placeholder: string;
    label: string;
    handle: any;
}

const TextAreaInput = ({ value, name, placeholder, label, handle }: Props) => {
    return (
        <div className="py-5">
            <label className="text-lg font-bold" htmlFor={name}>
                {label}
            </label>
            <textarea defaultValue={value} id={name} name={name} placeholder={placeholder} className="form-input" {...handle} />
        </div>
    );
};

export default TextAreaInput;
