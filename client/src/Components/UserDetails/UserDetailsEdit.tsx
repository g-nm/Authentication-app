import React, { useState } from 'react';
import { MdArrowBackIosNew } from 'react-icons/md';
import { Link } from 'react-router-dom';
import styles from './UserDetailsEdit.module.css';

const UserDetailsEdit = () => {
  const [isUrlChecked, setUrlChecked] = useState<boolean>(false);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrlChecked(e.target.checked);
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
        <form className={styles.form}>
          <div className={styles.input__file_wrapper}>
            {!isUrlChecked ? (
              <label className={styles.label__input_file}>
                <img src='' alt='' width='72px' height='72px' />
                <span>CHANGE PHOTO</span>
                <input
                  type='file'
                  name='photo'
                  className={styles.input__file}
                  accept='image/*'
                />
              </label>
            ) : (
              <label>
                <div>Image Url</div>
                <input
                  type='url'
                  name='url'
                  placeholder='https://www.myimage.png'
                  className={styles.input}
                />
              </label>
            )}
            <label>
              <input
                type='checkbox'
                name=''
                id=''
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
            />
          </label>
          <label>
            <div>Bio</div>
            <textarea
              name='bio'
              id=''
              cols={30}
              rows={4}
              placeholder='Enter you bio...'
              className={styles.input}
            ></textarea>
          </label>
          <label>
            <div>Phone</div>
            <input
              type='text'
              name='phone'
              placeholder='Enter your phone...'
              className={styles.input}
            />
          </label>
          <label>
            <div>Email</div>
            <input
              type='email'
              name='email'
              placeholder='Enter you email...'
              className={styles.input}
            />
          </label>
          <label>
            <div>Password</div>
            <input
              type='password'
              name='password'
              placeholder='Enter your password...'
              className={styles.input}
            />
          </label>
          <button className={styles.btn}>Save</button>
        </form>
      </div>
    </div>
  );
};

export default UserDetailsEdit;
