import React from 'react';
import { IUserDetails } from '../../types';
import styles from './FileInput.module.css';
import avatar from '../../assets/avatar.svg';
const FileInput = React.forwardRef(
  (
    {
      data,
      handleFileChange,
      fileRef,
    }: {
      data: IUserDetails;
      handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
      fileRef: React.Ref<HTMLInputElement>;
    },
    imageRef: React.Ref<HTMLImageElement>
  ) => {
    return (
      <label className={styles.label__input_file}>
        <img
          src={data.picture || avatar}
          alt=''
          width='72px'
          height='72px'
          ref={imageRef}
          className={styles.img__preview}
          onError={(e) => {
            e.currentTarget.src = avatar;
          }}
        />
        <span>CHANGE PHOTO</span>
        <input
          type='file'
          name='file'
          className={styles.input__file}
          accept='image/*'
          onChange={handleFileChange}
          ref={fileRef}
          tabIndex={0}
        />
      </label>
    );
  }
);
export default FileInput;
