import styles from './marquee.module.css';

function Marquee() {
  const text = "start your streetwear journey with corethreads®";

  return (
    <div className={styles.marqueeContainer}>
      <div className={styles.marqueeContent}>
        <span className={styles.marqueeItem}>{text}</span>
        <span className={styles.marqueeItem}>{text}</span>
        <span className={styles.marqueeItem}>{text}</span>
        <span className={styles.marqueeItem}>{text}</span> {/* duplicate for seamless loop */}
      </div>
    </div>
  );
}

export default Marquee;