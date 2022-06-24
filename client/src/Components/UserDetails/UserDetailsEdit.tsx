import { MdArrowBackIosNew } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { useGetDetails } from '../../hooks/useGetDetails';
import UserInputForm from '../Form/UserInputForm';
import styles from './UserDetailsEdit.module.css';

const UserDetailsEdit = () => {
  const { data, isLoading } = useGetDetails();

  if (!data || isLoading) return <div>Loading....</div>;

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
        <UserInputForm data={data} />
      </div>
    </div>
  );
};

export default UserDetailsEdit;
