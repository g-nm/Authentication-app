import React, { useEffect, useMemo, useRef, useState } from 'react';
import devchallenges_light from '../../assets/devchallenges-light.svg';
import devchallenges_dark from '../../assets/devchallenges.svg';
import styles from './Credentials.module.css';
import { MdMail, MdLock } from 'react-icons/md';
import { AiOutlineGoogle } from 'react-icons/ai';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Action, IUser } from '../../types';
import useAuth from '../../hooks/useAuth';

function Credentials({ action = Action.SIGNUP }: { action?: Action }) {
  const isSignUp = action === Action.SIGNUP;
  const ImageRef = useRef<HTMLImageElement>(null);
  const isDark = useMemo(() => matchMedia('(prefers-color-scheme:dark)'), []);
  useEffect(() => {
    const callOnChange = (e: MediaQueryListEvent) => {
      if (!e.matches && ImageRef.current) {
        ImageRef.current.src = devchallenges_dark;
        return;
      }
      if (ImageRef.current) {
        ImageRef.current.src = devchallenges_light;
        return;
      }
    };
    isDark.addEventListener('change', callOnChange);

    return () => {
      isDark.removeEventListener('change', callOnChange, true);
    };
  }, [isDark]);
  const [userCredentials, setUserCredentials] = useState<IUser>({
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const location = useLocation();

  type LocationState = {
    from: Location;
  };
  const state = location.state as LocationState;

  const { login, signup } = useAuth();

  const handleFormSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSignUp) {
      return signup(userCredentials, (error) => {
        if (!error) {
          navigate('/details', {});
        }
      });
    } else {
      return login(userCredentials, (error) => {
        if (!error) {
          navigate(state?.from || '/details', { replace: true });
        }
      });
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserCredentials({
      ...userCredentials,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <div className={`${styles.main__wrapper} `}>
      <main className={styles.main}>
        <div className={styles.main__content}>
          <div className={styles.logo__wrapper}>
            <img
              src={isDark.matches ? devchallenges_light : devchallenges_dark}
              alt='Dev Challenges'
              ref={ImageRef}
            />
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
          <form className={styles.form} onSubmit={handleFormSubmit}>
            <label className={styles.label}>
              <span className={styles.icon__wrapper}>
                <MdMail />
              </span>
              <input
                type='text'
                name='email'
                placeholder='Email'
                className={`${styles.input} ${styles.input__email}`}
                value={userCredentials.email}
                onChange={handleInputChange}
                required={true}
              />
            </label>
            <label className={styles.label}>
              <span className={styles.icon__wrapper}>
                <MdLock />
              </span>
              <input
                type='password'
                name='password'
                placeholder='Password'
                className={`${styles.input} ${styles.input__password}`}
                value={userCredentials.password}
                onChange={handleInputChange}
                required={true}
              />
            </label>
            <button className={styles.btn__submit}>
              {isSignUp ? 'Start Coding now' : ' Login'}
            </button>
          </form>
          <p className={styles.p__info}> or continue with a social profile</p>
          <ul className={styles.social__list}>
            <li className={styles.social__list_item}>
              <button className={styles.social__list_btn}>
                <AiOutlineGoogle focusable={false} aria-hidden='true' />
              </button>
            </li>
          </ul>
          <p className={styles.p__info_action}>
            {isSignUp ? 'Already a member? ' : "Don't have an account yet?"}
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
