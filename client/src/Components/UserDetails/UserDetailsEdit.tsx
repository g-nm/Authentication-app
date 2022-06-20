import React, { useEffect, useRef, useState } from 'react';
import { MdArrowBackIosNew } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { useGetDetails } from '../../hooks/useGetDetails';
import styles from './UserDetailsEdit.module.css';
import avatar from '../../assets/avatar.svg';

const UserDetailsEdit = () => {
  const [isUrlChecked, setUrlChecked] = useState<boolean>(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const { data, isLoading } = useGetDetails();
  const [formInput, setFormInput] = useState({
    name: '',
    bio: '',
    phone: '',
    email: '',
    password: '',
    imageUrl: '',
  });
  useEffect(() => {
    if (data) {
      setFormInput({
        name: data.name || '',
        bio: data.bio || '',
        phone: data.phone || '',
        email: data.email,
        password: '',
        imageUrl: '',
      });
    }
  }, [data]);

  if (!data || isLoading) return <div>Loading....</div>;

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrlChecked(e.target.checked);
    if (!imageRef.current) return;
    if (isUrlChecked) URL.revokeObjectURL(imageRef.current.src);
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!imageRef.current) return;
    URL.revokeObjectURL(imageRef.current.src);

    let imageData: string = '';
    if (!e.target.files) return;
    imageData = URL.createObjectURL(e.target.files[0]);

    imageRef.current.src = imageData;
    return;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const inputName = e.target.name;
    const value = e.target.value;

    setFormInput({ ...formInput, [inputName]: value });
  };
  const handleFormSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formdata = new FormData(e.currentTarget);
    for (const value of formdata.entries()) {
      // const entries = formdata.entries();
      // console.log(entries);
      console.log(value);
    }
  };
  return (
    <div className={styles.main}>
      <div>
        <Link to='/details' className={styles.link__back}>
          <MdArrowBackIosNew className={styles.link__left_arrow} />
          <span>Back</span>
        </Link>
      </div>
      <div className={styles.user__details_wrapper}>
        <h1 className={styles.user__details_title}>Change Info</h1>
        <p className={styles.user__details_info}>
          Changes will be reflected to every service
        </p>
        <form className={styles.form} onSubmit={handleFormSubmit}>
          <div className={styles.input__file_wrapper}>
            {!isUrlChecked ? (
              <label className={styles.label__input_file}>
                <img
                  src={data.picture || avatar}
                  alt=''
                  width='72px'
                  height='72px'
                  ref={imageRef}
                />
                <span>CHANGE PHOTO</span>
                <input
                  type='file'
                  name='file'
                  className={styles.input__file}
                  accept='image/*'
                  onChange={handleFileChange}
                />
              </label>
            ) : (
              <label>
                <div>Image Url</div>
                <input
                  type='url'
                  name='imageUrl'
                  placeholder='https://www.myimage.png'
                  className={styles.input}
                  value={formInput.imageUrl}
                  onChange={handleChange}
                />
              </label>
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
      </div>
    </div>
  );
};

export default UserDetailsEdit;
