import { Link } from 'react-router-dom';
import { useGetDetails } from '../../hooks/useGetDetails';
import avatar from '../../assets/avatar.svg';

import styles from './UserDetails.module.css';

const UserDetails = () => {
  const { data, isLoading } = useGetDetails();

  if (!data || isLoading) {
    return <div>Loading.....</div>;
  }

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1 className={styles.header__title}>Personal info</h1>
        <p className={styles.header__info}>
          Basic info, like your name and photo
        </p>
      </div>

      <div className={styles.user__header}>
        <div className={styles.user__info_wrapper}>
          <h2 className={styles.user__header_title}>Profile</h2>
          <p className={styles.user__info}>
            Some info may be visible to other people
          </p>
        </div>
        <Link to='/details/edit' className={styles.user__details_edit}>
          Edit
        </Link>
      </div>
      <div className={styles.user__details}>
        <ul className={styles.user__details_list}>
          <li className={styles.user__details_item}>
            <div className={styles.user__details_wrapper}>
              <p className={styles.user__details_title}>PHOTO</p>
              <div className={styles.user__details_info}>
                <img
                  src={data.picture || avatar}
                  alt=''
                  width='72px'
                  height='72px'
                  onError={(e) => {
                    let count = 0;
                    if (count === 0) {
                      e.currentTarget.src = avatar;
                    }
                    count = count + 1;
                  }}
                />
              </div>
            </div>
          </li>
          <li className={styles.user__details_item}>
            <div className={styles.user__details_wrapper}>
              <p className={styles.user__details_title}>NAME</p>
              <p className={styles.user__details_info}>{data.name}</p>
            </div>
          </li>
          <li className={styles.user__details_item}>
            <div className={styles.user__details_wrapper}>
              <p className={styles.user__details_title}>BIO</p>
              <p className={`${styles.bio} ${styles.user__details_info}`}>
                {data.bio}
              </p>
            </div>
          </li>
          <li className={styles.user__details_item}>
            <div className={styles.user__details_wrapper}>
              <p className={styles.user__details_title}>PHONE</p>
              <p className={styles.user__details_info}>{data.phone}</p>
            </div>
          </li>
          <li className={styles.user__details_item}>
            <div className={styles.user__details_wrapper}>
              <p className={styles.user__details_title}>EMAIL</p>
              <p className={styles.user__details_info}>{data.email}</p>
            </div>
          </li>
          <li className={styles.user__details_item}>
            <div className={styles.user__details_wrapper}>
              <p className={styles.user__details_title}>PASSWORD</p>
              <p className={styles.user__details_info}>*************</p>
            </div>
          </li>
        </ul>
      </div>
    </main>
  );
};

export default UserDetails;
