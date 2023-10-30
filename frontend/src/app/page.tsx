import Image from 'next/image';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <div className={styles.center}>
          <Image className={styles.logo} src='/ERD.svg' alt='Next.js Logo' width={1200} height={1200} priority />
        </div>
      </div>
    </main>
  );
}
