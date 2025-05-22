import { useState } from 'react';

const useImageHandler = () => {
    const [image, setImage] = useState(null);
    const [imageFile, setImageFile] = useState();

    const handleImageClick = () => {
        document.getElementById('image-upload-input').click();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);

        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
                setImage(reader.result);
            };

            if (file) {
                reader.readAsDataURL(file);
            }
        }
    };

    return { image, imageFile, handleImageClick, handleImageChange };
};

export default useImageHandler;
