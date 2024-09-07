import React from 'react';
import { useEffect, useState } from 'react';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import api from '@/api';

interface ImageData {
    dataURL: string;
    titre: string;
    description: string;
    file: string;
}

function Imageshome() {
    const [images, setImages] = useState<ImageData[][]>([]);
    const [titles, setTitles] = useState<string[]>(['', '', '', '']);
    const [descriptions, setDescriptions] = useState<string[]>(['', '', '', '']);
    const maxNumber = 69;

    const onChange = (imageList: ImageListType, index: number) => {
        const newImages = [...images];
        newImages[index] = imageList as never;
        setImages(newImages);
        console.log(newImages);

        setTitles((prevTitles) => {
            const newTitles = [...prevTitles];
            newTitles[index] = images[index][0].titre;
            return newTitles;
        });
        setDescriptions((prevDescriptions) => {
            const newDescriptions = [...prevDescriptions];
            newDescriptions[index] = images[index][0].description;
            return newDescriptions;
        });
    };

    useEffect(() => {
        fetchDataIMG();
    }, []);

    const fetchDataIMG = async () => {
        try {
            const response = await api.get(`${process.env.NEXT_PUBLIC_BASE_URL}/home/1`);
            if (response.status === 200) {
                const Idata = response.data;
                setImages((prevImages) => [
                    [{ dataURL: Idata.title_background, titre: Idata.title, description: '', file: '' }],
                    [{ dataURL: Idata.slide_1_img, titre: Idata.slide_1_text, description: Idata.slide_1_description, file: '' }],
                    [{ dataURL: Idata.slide_2_img, titre: Idata.slide_2_text, description: Idata.slide_2_description, file: '' }],
                    [{ dataURL: Idata.slide_3_img, titre: Idata.slide_3_text, description: Idata.slide_3_description, file: '' }],
                ]);
            }
        } catch (error) {
            console.error('Failed to fetch data', error);
        }
    };

    const save = async () => {
        try {
            const formData = new FormData();

            formData.append('title_background', images[0][0].file);
            formData.append('title', titles[0]);

            // Check if an image is selected for slide 1
            if (images[1][0].file) {
                formData.append('slide_1_img', images[1][0].file);
                formData.append('slide_1_text', titles[1]);
                formData.append('slide_1_description', descriptions[1]);
            }

            // Check if an image is selected for slide 2
            if (images[2][0].file) {
                formData.append('slide_2_img', images[2][0].file);
                formData.append('slide_2_text', titles[2]);
                formData.append('slide_2_description', descriptions[2]);
            }

            // Check if an image is selected for slide 3
            if (images[3][0].file) {
                formData.append('slide_3_img', images[3][0].file);
                formData.append('slide_3_text', titles[3]);
                formData.append('slide_3_description', descriptions[3]);
            }

            console.log('FormData:', formData);

            console.log('title_background:', formData.get('title_background'));
            console.log('title:', formData.get('title'));
            console.log('slide_1_img:', formData.get('slide_1_img'));
            console.log('slide_1_text:', formData.get('slide_1_text'));
            console.log('slide_1_description:', formData.get('slide_1_description'));
            console.log('slide_2_img:', formData.get('slide_2_img'));
            console.log('slide_2_text:', formData.get('slide_2_text'));
            console.log('slide_2_description:', formData.get('slide_2_description'));
            console.log('slide_3_img:', formData.get('slide_3_img'));
            console.log('slide_3_text:', formData.get('slide_3_text'));
            console.log('slide_3_description:', formData.get('slide_3_description'));

            // Now, you can submit the formData to the server
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <>
            {images.map((data: any, index: number) => (
                <div key={index} className="custom-file-container border-t border-gray-500 py-4" data-upload-id="myFirstImage">
                    <div className="label-container">
                        <label>
                            {index === 0 ? 'Upload section background' : ''}
                            {index === 1 ? 'upload slide 1' : ''}
                            {index === 2 ? 'upload slide 2' : ''}
                            {index === 3 ? 'upload slide 3' : ''}
                        </label>
                    </div>
                    <label className="custom-file-container__custom-file"></label>
                    <input type="file" className="custom-file-container__custom-file__custom-file-input" accept="image/*" />
                    <input type="hidden" name="MAX_FILE_SIZE" value="10485760" />
                    <ImageUploading value={images} onChange={(imageList) => onChange(imageList, index)} maxNumber={maxNumber}>
                        {({ imageList, onImageUpload, onImageRemoveAll, onImageUpdate, onImageRemove, isDragging, dragProps }) => (
                            <div className="upload__image-wrapper ">
                                <button className="custom-file-container__custom-file__custom-file-control mt-4" onClick={onImageUpload}>
                                    Choose File...
                                </button>
                                &nbsp;
                                {data && data[0] && (
                                    <div key={index} className="custom-file-container__image-preview relative">
                                        <img src={data[0].dataURL} alt="img" className="m-auto" />
                                    </div>
                                )}
                            </div>
                        )}
                    </ImageUploading>
                    <div className={`grid w-full flex-auto grid-cols-1 gap-3 ${index > 0 ? 'lg:grid-cols-2' : 'lg:grid-cols-1'}`}>
                        <div>
                            <label>Title</label>
                            <textarea
                                defaultValue={data && data[0] ? data[0].titre : ''}
                                onChange={(e) =>
                                    setTitles((prevTitles) => {
                                        const newTitles = [...prevTitles];
                                        newTitles[index] = e.target.value;
                                        return newTitles;
                                    })
                                }
                                id={`gridTitleSection`}
                                name="title"
                                placeholder="Section title"
                                className="form-input"
                            />
                        </div>
                        {index > 0 && (
                            <div>
                                <label>Description</label>
                                <textarea
                                    defaultValue={data ? data[0].description : ''}
                                    onChange={(e) =>
                                        setDescriptions((prevDescriptions) => {
                                            const newDescriptions = [...prevDescriptions];
                                            newDescriptions[index] = e.target.value;
                                            return newDescriptions;
                                        })
                                    }
                                    id={`gridTitleSection}`}
                                    name="title"
                                    placeholder="Section title"
                                    className="form-input"
                                />
                            </div>
                        )}
                    </div>
                    {images.length === 0 ? <img src="/assets/images/file-preview.svg" className="m-auto w-full max-w-md" alt="" /> : ''}
                </div>
            ))}
            <div className=" flex w-full items-start justify-center pt-4">
                <button className="mx-8 w-1/2 rounded-md bg-cyan-800 px-3 py-1 font-mono text-xl font-bold text-white" onClick={save}>
                    Save
                </button>
            </div>
        </>
    );
}

export default Imageshome;

// import React from 'react'
// import { useEffect, useState } from 'react';
// import ImageUploading, { ImageListType } from 'react-images-uploading';
// import api from '@/api';

// function Imageshome() {
//     const [images, setImages] = useState<any>([]);
//     const maxNumber = 69;

//     const onChange = (imageList: ImageListType, index: number) => {
//         // setImages(imageList as never[]);
//         // console.log(this)
//         const newImages = [...images];
//         newImages[index] = imageList as never;
//         setImages(newImages)
//         console.log(newImages);

//     };

//     useEffect(() => {
//         fetchDataIMG();
//     }, []);

//     const fetchDataIMG = async () => {
//         try {
//             const response = await api.get(`${process.env.NEXT_PUBLIC_BASE_URL}/home/1`);
//             if (response.status === 200) {
//                 const Idata = response.data;
//                 setImages([
//                     [{ 'dataURL': Idata.title_background, 'titre': Idata.title, 'description': '', 'file': "" }],
//                     [{ 'dataURL': Idata.slide_1_img, 'titre': Idata.slide_1_text, 'description': Idata.slide_1_description, 'file': ''}],
//                     [{ 'dataURL': Idata.slide_2_img, 'titre': Idata.slide_2_text, 'description': Idata.slide_2_description, 'file': ''}],
//                     [{ 'dataURL': Idata.slide_3_img, 'titre': Idata.slide_3_text, 'description': Idata.slide_3_description, 'file': ''}],
//                 ])

//             }
//         } catch (error) {
//             console.error('Failed to fetch data', error);
//         }
//     };

//     const save = async () => {
//         try {
//             const formData = new FormData();

//             formData.append('title_background', images[0][0].file);
//             formData.append('title', images[0][0].titre);
//             formData.append('slide_1_img', images[1][0].file);
//             formData.append('slide_1_text', images[1][0].titre);
//             formData.append('slide_1_description', images[1][0].description);
//             formData.append('slide_2_img', images[2][0].file);
//             formData.append('slide_2_text', images[2][0].titre);
//             formData.append('slide_2_description', images[2][0].description);
//             formData.append('slide_3_img', images[3][0].file);
//             formData.append('slide_3_text', images[3][0].titre);
//             formData.append('slide_3_description', images[3][0].description);

//             // console.log(` data form ${formData}`);
//             console.log(` data form ${formData.append('title', images[0][0].titre)}`);

//             const response = await api.put(`/home/update/1`, formData )

//             console.log('Response from the server:', response.data);

//         } catch (error) {
//             console.error('Error:', error);
//         }
//     };

//     return (
//         <>
//             {images.map((data: any, index: number) =>

//                 <div key={index} className="custom-file-container border-t border-gray-500 py-4" data-upload-id="myFirstImage">
//                     <div className="label-container ">
//                         <label>{index === 0 ? 'Upload section background' : ''}
//                             {index === 1 ? 'upload slide 1' : ''}
//                             {index === 2 ? 'upload slide 2' : ''}
//                             {index === 3 ? 'upload slide 3' : ''}</label>
//                         {/* <button
//                             type="button"
//                             className="custom-file-container__image-clear"
//                             title="Clear Image"
//                             onClick={() => {
//                                 const newImages = [...images];
//                                 newImages[index] = null;
//                                 setImages(newImages);
//                             }}
//                         >
//                             ×
//                         </button> */}
//                     </div>
//                     <label className="custom-file-container__custom-file"></label>
//                     <input type="file" className="custom-file-container__custom-file__custom-file-input" accept="image/*" />
//                     <input type="hidden" name="MAX_FILE_SIZE" value="10485760" />
//                     <ImageUploading value={images} onChange={(imageList) => onChange(imageList, index)} maxNumber={maxNumber}>
//                         {({ imageList, onImageUpload, onImageRemoveAll, onImageUpdate, onImageRemove, isDragging, dragProps }) => (
//                             <div className="upload__image-wrapper ">
//                                 <button className="custom-file-container__custom-file__custom-file-control mt-4" onClick={onImageUpload}>
//                                     Choose File...
//                                 </button>
//                                 &nbsp;
//                                 <div key={index} className="custom-file-container__image-preview relative">
//                                     <img src={data[0].dataURL} alt="img" className="m-auto" />
//                                 </div>
//                             </div>
//                         )}
//                     </ImageUploading>
//                     <div className={`grid w-full flex-auto grid-cols-1 gap-3 ${index > 0 ? 'lg:grid-cols-2' : 'lg:grid-cols-1'}`}>
//                         <div>
//                             <label>Title</label>
//                             <textarea
//                                 defaultValue={data[0].titre}
//                                 id={`gridTitleSection`}
//                                 name="title"
//                                 placeholder="Section title"
//                                 className="form-input" />
//                         </div>
//                         {index > 0 &&
//                             <div>
//                                 <label>Description</label>
//                                 <textarea
//                                     defaultValue={data[0].description}
//                                     id={`gridTitleSection}`}
//                                     name="title"
//                                     placeholder="Section title"
//                                     className="form-input" />
//                             </div>
//                         }

//                     </div>
//                     {images.length === 0 ? <img src="/assets/images/file-preview.svg" className="max-w-md w-full m-auto" alt="" /> : ''}
//                 </div>
//             )}

//             <div className=' flex w-full justify-center items-start pt-4'>
//                 <button className='w-1/2 mx-8 py-1 px-3 bg-cyan-800 font-mono font-bold text-xl rounded-md text-white' onClick={save}>Save</button>
//             </div>

//         </>
//     )
// }

// export default Imageshome
