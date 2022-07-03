import { Link, Outlet, useNavigate } from 'react-router-dom';
// import useAuth from '../../hooks/useAuth';
import useMediaMatch from '../../hooks/useMediaMatch';
import logoDark from '../../assets/devchallenges-light.svg';
import logo from '../../assets/devchallenges.svg';
import styles from './UserDetailsNav.module.css';
import { useGetDetails } from '../../hooks/useGetDetails';
import avatar from '../../assets/avatar.svg';
import {
  MdAccountCircle,
  MdOutlineArrowDropDown,
  MdOutlineExitToApp,
} from 'react-icons/md';
import useAuth from '../../hooks/useAuth';
import { useState } from 'react';

const UserDetailsNav = () => {
  const [showSubNav, setShowSubNav] = useState(false);
  const { signout } = useAuth();
  const navigate = useNavigate();
  const isDarkMode = useMediaMatch();
  const { data } = useGetDetails();
  return (
    <div>
      <nav className={`${styles.nav} container`}>
        <img src={isDarkMode ? logoDark : logo} alt='Dev Challenges logo' />
        <button
          className={styles.btn__navigation}
          onClick={() => {
            setShowSubNav(!showSubNav);
          }}
          aria-controls='subNav'
          aria-expanded={showSubNav}
        >
          <img
            src={data?.picture || avatar}
            alt='user Avatar'
            width='32px'
            height='36px'
            className={styles.btn__image}
            onError={(e) => {
              let count = 0;
              if (count === 0) {
                e.currentTarget.src = avatar;
              }
              count = count + 1;
            }}
          />
          <span className={styles.nav__username}>{data?.name || ''}</span>
          <MdOutlineArrowDropDown />
        </button>
        <div
          className={styles.nav__subNav}
          style={{ display: showSubNav ? 'block' : 'none' }}
          id='subNav'
          tabIndex={-1}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) {
              setShowSubNav(false);
            }
          }}
        >
          <ul className={styles.subNav__list}>
            <li className={styles.subNav__item}>
              <Link to='/details' className={styles.subNav__link}>
                <MdAccountCircle />
                <span>My Profile</span>
              </Link>
            </li>
            <li className={styles.subNav__item}>
              <Link
                to='/login'
                onClick={() =>
                  signout(() => {
                    navigate('/login', { replace: true });
                  })
                }
                className={styles.subNav__link}
              >
                <MdOutlineExitToApp />
                <span>Signout</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      <Outlet />
    </div>
  );
};

export default UserDetailsNav;
