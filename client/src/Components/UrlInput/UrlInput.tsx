import React from 'react';
import styles from './UrlInput.module.css';
import avatar from '../../assets/avatar.svg';

const UrlInput = React.forwardRef(
  (
    {
      picture,
      handleImageError,
      handleChange,
      imageError,
    }: {
      picture: string;
      handleImageError: (error: string) => void;
      imageError: string;
      handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    },
    imageRefIsImageValid: React.Ref<HTMLImageElement>
  ) => {
    return (
      <div>
        <img
          src={picture || avatar}
          alt=''
          width='72px'
          height='72px'
          ref={imageRefIsImageValid}
          onError={(e) => {
            console.log('got called');
            handleImageError('Invalid image');
          }}
          onLoad={(e) => {
            console.log('I loaded');
            handleImageError('');
          }}
          style={{ display: 'none' }}
        />

        <label>
          <div>Image Url</div>
          <input
            type='url'
            name='picture'
            placeholder='https://www.myimage.png'
            className={styles.input}
            value={picture}
            onChange={handleChange}
            aria-describedby='urlAlert'
          />
        </label>
        <div id='urlAlert' aria-live='assertive' className={styles.alert}>
          {imageError}
        </div>
      </div>
    );
  }
);

export default UrlInput;
