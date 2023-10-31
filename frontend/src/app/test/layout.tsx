import styles from './test.module.css';

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <div className={styles.main}>{children}</div>;
}
