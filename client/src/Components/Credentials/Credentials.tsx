import React, { useRef } from 'react';
import devchallenges_light from '../../assets/devchallenges-light.svg';
import devchallenges_dark from '../../assets/devchallenges.svg';
import styles from './Credentials.module.css';
import { MdFacebook } from 'react-icons/md';
import { AiOutlineTwitter, AiOutlineGoogle } from 'react-icons/ai';
import { Link } from 'react-router-dom';

function Credentials() {
  const ImageRef = useRef<HTMLImageElement>(null);
  return (
    <main>
      <div>
        <img src={devchallenges_light} alt="Dev Challenges" ref={ImageRef} />
      </div>
      <p className={`${styles.p} ${styles.p__dark}`}>
        Join thousand of learners from around the world
      </p>
      <p>
        Master web development by making real-life projects. There are multiple
        paths for you to choose
      </p>
      <form>
        <label>
          <input
            type="text"
            name="email"
            placeholder="Email"
            className={`${styles.input} ${styles.input__email}`}
          />
        </label>
        <label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            className={`${styles.input} ${styles.input__password}`}
          />
        </label>
        <button className={styles.btn__submit}>Start Coding now</button>
      </form>
      <p> or continue with social profile</p>
      <ul>
        <li>
          <a href="#">
            <AiOutlineGoogle focusable={false} aria-hidden="true" />
          </a>
        </li>
        <li>
          <a href="#">
            <MdFacebook focusable="false" aria-hidden="true" />
          </a>
        </li>
        <li>
          <a href="#">
            <AiOutlineTwitter focusable="false" aria-hidden="true" />
          </a>
        </li>
      </ul>
      <p>
        Already a member? <Link to={'/login'}>Login</Link>
      </p>
    </main>
  );
}

export default Credentials;
