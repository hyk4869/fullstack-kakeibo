import Link from 'next/link';
import styles from './page.module.css';
type HomeProps = {
  //
};

const Home: React.FC<HomeProps> = () => {
  return (
    <>
      <div className={styles.links}>
        <Link style={{ paddingRight: '1rem' }} href={'/test'}>
          test
        </Link>
        <Link href={'/erFigure'}>ER図</Link>
      </div>
    </>
  );
};

export default Home;
