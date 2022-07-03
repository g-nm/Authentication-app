import styles from './UserInputForm.module.css';
import { IUserDetails } from '../../types';
import { useRef, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { axiosInstance } from '../../scripts/axiosInstance';
import FileInput from '../FileInput/FileInput';
import UrlInput from '../UrlInput/UrlInput';
const UserInputForm = ({ data }: { data: IUserDetails }) => {
  const [formInput, setFormInput] = useState({
    name: data.name || '',
    bio: data.bio || '',
    phone: data.phone || '',
    email: data.email,
    password: '',
    picture: data.picture || '',
  });
  const [isUrlChecked, setUrlChecked] = useState<boolean>(false);
  const [imageError, setImageError] = useState('');
  const imageRef = useRef<HTMLImageElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const imageRefIsImageValid = useRef<HTMLImageElement>(null);

  const queryClient = useQueryClient();
  const mutation = useMutation(
    (data: FormData) => {
      return axiosInstance.put('/details', data, {
        headers: {
          'Content-Type': 'multipart/formdata',
        },
      });
    },
    {
      onSuccess(data, variables, context) {
        queryClient.setQueryData(['userDetails'], data.data);
      },
    }
  );

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrlChecked(() => e.target.checked);
    if (!e.target.checked) {
      setImageError('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('file input changed');

    if (!imageRef.current) return;
    URL.revokeObjectURL(imageRef.current.src);
    if (!e.target.files) return;
    if (e.target.files.length === 0) return;
    imageRef.current.src = URL.createObjectURL(e.target.files[0]);
    return;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const inputName = e.target.name;
    const value = e.target.value;
    setFormInput({ ...formInput, [inputName]: value });
    if (inputName === 'picture') {
      if (!imageRefIsImageValid.current) return;
      imageRefIsImageValid.current.src = value;
    }
  };
  const handleFormSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (imageError) {
      return;
    }

    e.currentTarget.reportValidity();
    const formdata = new FormData();

    if (
      !isUrlChecked &&
      fileRef.current?.files &&
      fileRef.current.files.length
    ) {
      console.log('file set as picture');
      formdata.append('picture', fileRef.current.files[0]);
    }
    for (const [key, value] of Object.entries(formInput)) {
      if (!formdata.has(key)) {
        console.log(key, value);
        formdata.append(key, value);
      }
    }

    mutation.mutate(formdata);
  };
  const handleImageError = (error: string) => {
    setImageError(error);
  };

  return (
    <form className={styles.form} onSubmit={handleFormSubmit}>
      <div className={styles.input__file_wrapper}>
        {!isUrlChecked ? (
          <FileInput
            data={data}
            fileRef={fileRef}
            handleFileChange={handleFileChange}
            ref={imageRef}
            key={'file'}
          />
        ) : (
          <UrlInput
            handleChange={handleChange}
            picture={formInput.picture}
            imageError={imageError}
            handleImageError={handleImageError}
          />
        )}
        <label>
          <input
            type='checkbox'
            name='useUrl'
            onChange={handleCheckboxChange}
          />
          <span>Provide image as url</span>
        </label>
      </div>
      <label>
        <div>Name</div>
        <input
          type='text'
          name='name'
          placeholder='Enter your name...'
          className={styles.input}
          value={formInput.name}
          onChange={handleChange}
        />
      </label>
      <label>
        <div>Bio</div>
        <textarea
          name='bio'
          cols={30}
          rows={4}
          placeholder='Enter you bio...'
          className={styles.input}
          value={formInput.bio}
          onChange={handleChange}
        ></textarea>
      </label>
      <label>
        <div>Phone</div>
        <input
          type='text'
          name='phone'
          placeholder='Enter your phone...'
          className={styles.input}
          value={formInput.phone}
          onChange={handleChange}
        />
      </label>
      <label>
        <div>Email</div>
        <input
          type='email'
          name='email'
          placeholder='Enter you email...'
          className={styles.input}
          value={formInput.email}
          onChange={handleChange}
        />
      </label>
      <label>
        <div>Password</div>
        <input
          type='password'
          name='password'
          placeholder='Enter your password...'
          className={styles.input}
          value={formInput.password}
          onChange={handleChange}
        />
      </label>
      <button className={styles.btn}>Save</button>
    </form>
  );
};

export default UserInputForm;
