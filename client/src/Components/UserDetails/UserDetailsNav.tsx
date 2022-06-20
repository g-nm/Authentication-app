import { Outlet } from 'react-router-dom';
// import useAuth from '../../hooks/useAuth';
import useMediaMatch from '../../hooks/useMediaMatch';
import logoDark from '../../assets/devchallenges-light.svg';
import logo from '../../assets/devchallenges.svg';
import styles from './UserDetailsNav.module.css';

const UserDetailsNav = () => {
  // const { signout } = useAuth();
  // const navigate = useNavigate();
  const isDarkMode = useMediaMatch();
  return (
    <div>
      <nav className={`${styles.nav} container`}>
        <img src={isDarkMode ? logoDark : logo} alt='Dev Challenges logo' />
        <img src='' alt='' width='32px' height='36px' />
      </nav>
      <Outlet />
    </div>
  );
};

export default UserDetailsNav;
