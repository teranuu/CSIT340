import styles from './seller.statcard.module.css';

function SellerStatCard({ title, value, subtitle }) {
	return (
		<div className={styles.card}>
			<div className={styles.textBlock}>
				<p className={styles.title}>{title}</p>
				{value && <h4 className={styles.value}>{value}</h4>}
				{subtitle && <span className={styles.subtitle}>{subtitle}</span>}
			</div>
		</div>
	);
}

export default SellerStatCard;
