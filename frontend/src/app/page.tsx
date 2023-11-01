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
        <Link style={{ paddingRight: '1rem' }} href={'/erFigure'}>
          ER図
        </Link>
        <Link href={'/summaryTable'}>Summary Table</Link>
      </div>
    </>
  );
};

export default Home;
