import Image from 'next/image';
import styles from './erFigure.module.css';
const ErFigure = () => {
  return (
    <>
      <div className={styles.main}>
        <Image src='/ERD.svg' alt='Next.js Logo' width={1000} height={1000} priority />
      </div>
    </>
  );
};

export default ErFigure;
