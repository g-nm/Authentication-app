import styles from './UserInputForm.module.css';
import avatar from '../../assets/avatar.svg';
import { IUserDetails } from '../../types';
import { useRef, useState } from 'react';
import { useMutation } from 'react-query';
import { axiosInstance } from '../../scripts/axiosInstance';
const UserInputForm = ({ data }: { data: IUserDetails }) => {
  const [formInput, setFormInput] = useState({
    name: data.name || '',
    bio: data.bio || '',
    phone: data.phone || '',
    email: data.email,
    password: '',
    picture: '',
  });
  const [isUrlChecked, setUrlChecked] = useState<boolean>(false);
  const [imageError, setImageError] = useState('');
  const imageRef = useRef<HTMLImageElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const urlRef = useRef<HTMLInputElement>(null);
  const imageRefIsImageValid = useRef<HTMLImageElement>(null);

  const mutation = useMutation((data: FormData) => {
    return axiosInstance.put('/details', data, {
      headers: {
        'Content-Type': 'multipart/formdata',
      },
    });
  });

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrlChecked(() => e.target.checked);
    if (!e.target.checked) {
      setImageError('');
    }
    if (!imageRef.current) return;

    // if (isUrlChecked) URL.revokeObjectURL(imageRef.current.src);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    if (!isUrlChecked && fileRef.current?.files) {
      formdata.append('picture', fileRef.current?.files[0] || '');
    }
    for (const [key, value] of Object.entries(formInput)) {
      if (!formdata.has(key)) {
        formdata.append(key, value);
      }
    }

    for (const [key, value] of formdata.entries()) {
      console.log(key, value);
    }
    mutation.mutate(formdata);
  };

  return (
    <form className={styles.form} onSubmit={handleFormSubmit}>
      <div className={styles.input__file_wrapper}>
        <img
          src=''
          alt=''
          width='72px'
          height='72px'
          ref={imageRefIsImageValid}
          onError={(e) => {
            console.log(e);
            console.log(formInput.picture);
            if (!formInput.picture) {
              setImageError('');
              return;
            }
            setImageError('Invalid image url');
          }}
          onLoad={(e) => {
            setImageError('');
          }}
          style={{ display: 'none' }}
        />
        {!isUrlChecked ? (
          <label className={styles.label__input_file}>
            <img
              src={data.picture || avatar}
              alt=''
              width='72px'
              height='72px'
              ref={imageRef}
              className={styles.img__preview}
            />
            <span>CHANGE PHOTO</span>
            <input
              type='file'
              name='file'
              className={styles.input__file}
              accept='image/*'
              onChange={handleFileChange}
              ref={fileRef}
            />
          </label>
        ) : (
          <div>
            <label>
              <div>Image Url</div>
              <input
                type='url'
                name='picture'
                placeholder='https://www.myimage.png'
                className={styles.input}
                value={formInput.picture}
                onChange={handleChange}
                aria-describedby='urlAlert'
                ref={urlRef}
              />
            </label>
            <div id='urlAlert' aria-live='assertive' className={styles.alert}>
              {imageError}
            </div>
          </div>
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
