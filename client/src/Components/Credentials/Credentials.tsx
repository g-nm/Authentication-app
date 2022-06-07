import React, { useRef } from 'react';
import devchallenges_light from '../../assets/devchallenges-light.svg';
import devchallenges_dark from '../../assets/devchallenges.svg';
import styles from './Credentials.module.css';
import { MdFacebook, MdMail, MdLock } from 'react-icons/md';
import { AiOutlineTwitter, AiOutlineGoogle } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { Action } from '../../types';

function Credentials({ action = Action.SIGNUP }: { action?: Action }) {
  const ImageRef = useRef<HTMLImageElement>(null);
  const isSignUp = action === 'signup';
  return (
    <div className={`${styles.main__wrapper} `}>
      <main className={styles.main}>
        <div className={styles.main__content}>
          <div className={styles.logo__wrapper}>
            <img src={devchallenges_dark} alt="Dev Challenges" ref={ImageRef} />
          </div>

          <p className={`${styles.p} ${styles.p__dark}`}>
            {isSignUp
              ? 'Join thousand of learners from around the world'
              : 'Login'}
          </p>
          {isSignUp && (
            <p>
              Master web development by making real-life projects. There are
              multiple paths for you to choose
            </p>
          )}
          <form className={styles.form}>
            <label className={styles.label}>
              <span className={styles.icon__wrapper}>
                <MdMail />
              </span>
              <input
                type="text"
                name="email"
                placeholder="Email"
                className={`${styles.input} ${styles.input__email}`}
              />
            </label>
            <label className={styles.label}>
              <span className={styles.icon__wrapper}>
                <MdLock />
              </span>
              <input
                type="password"
                name="password"
                placeholder="Password"
                className={`${styles.input} ${styles.input__password}`}
              />
            </label>
            <button className={styles.btn__submit}>
              {isSignUp ? 'Start Coding now' : ' Login'}
            </button>
          </form>
          <p className={styles.p__info}> or continue with social profile</p>
          <ul className={styles.social__list}>
            <li className={styles.social__list_item}>
              <a href="#" className={styles.social__list_link}>
                <AiOutlineGoogle focusable={false} aria-hidden="true" />
              </a>
            </li>
            <li className={styles.social__list_item}>
              <a href="#" className={styles.social__list_link}>
                <MdFacebook focusable="false" aria-hidden="true" />
              </a>
            </li>
            <li className={styles.social__list_item}>
              <a href="#" className={styles.social__list_link}>
                <AiOutlineTwitter focusable="false" aria-hidden="true" />
              </a>
            </li>
          </ul>
          <p className={styles.p__info_action}>
            {isSignUp ? 'Already a member? ' : "Don't have an account yet? "}
            <Link to={isSignUp ? '/login' : '/'} className={styles.nav__link}>
              {isSignUp ? 'Login' : 'Register'}
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default Credentials;
