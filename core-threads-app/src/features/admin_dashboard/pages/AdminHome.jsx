import { useState } from "react";
import styles from "../styles/admin.home.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faUsers,
	faHourglassEnd,
	faBox,
	faCoins,
	faExclamationTriangle,
	faCheckCircle,
	faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

function AdminHome() {
	// Sample metrics data
	const [metrics] = useState({
		activeSellers: 3,
		pendingSellerApplications: 1,
		activeProducts: 18,
		// removed: flaggedListings
		// removed: ordersLast24h
		// removed: pendingPayouts
		totalOrdersWeek: 9,
		totalRevenue: 12450.50,
	});

	const [alerts] = useState([
		{
			id: "alert-1",
			type: "pending_sellers",
			message: "1 seller waiting for verification",
			count: 1,
			severity: "high",
			action: "Review Applications",
			actionPage: "sellers",
		},
	]);

	// Helper to get metric color
	const getMetricTrend = (value) => {
		if (value > 100) return "trending-up";
		if (value < 20) return "trending-down";
		return "stable";
	};

	return (
		<div className={styles.wrapper}>
			{/* Header */}
			<header className={styles.header}>
				<div>
					<h1 className={styles.pageTitle}>Admin Dashboard</h1>
					<p className={styles.subtitle}>Platform health overview and quick access to critical operations</p>
				</div>
				<div className={styles.lastUpdate}>
					Last updated: Today at {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
				</div>
			</header>

			{/* Key Metrics */}
			<section className={styles.metricsSection}>
				<h2 className={styles.sectionTitle}>Key Metrics</h2>
				<div className={styles.metricsGrid}>
					{/* Active Sellers */}
					<div className={styles.metricCard}>
						<div className={styles.metricHeader}>
							<FontAwesomeIcon icon={faUsers} className={styles.metricIcon} />
							<span className={styles.metricLabel}>Active Sellers</span>
						</div>
						<div className={styles.metricValue}>{metrics.activeSellers}</div>
						<p className={styles.metricSubtext}>Verified and operational</p>
					</div>

					{/* Pending Seller Applications */}
					<div className={styles.metricCard}>
						<div className={styles.metricHeader}>
							<FontAwesomeIcon icon={faHourglassEnd} className={`${styles.metricIcon} ${styles.iconWarning}`} />
							<span className={styles.metricLabel}>Pending Applications</span>
						</div>
						<div className={`${styles.metricValue} ${metrics.pendingSellerApplications > 0 ? styles.valueWarning : ""}`}>
							{metrics.pendingSellerApplications}
						</div>
						<p className={styles.metricSubtext}>Awaiting verification</p>
					</div>

					{/* Active Products */}
					<div className={styles.metricCard}>
						<div className={styles.metricHeader}>
							<FontAwesomeIcon icon={faBox} className={styles.metricIcon} />
							<span className={styles.metricLabel}>Active Products</span>
						</div>
						<div className={styles.metricValue}>{metrics.activeProducts.toLocaleString()}</div>
						<p className={styles.metricSubtext}>Live listings on platform</p>
					</div>
				</div>
			</section>

			{/* Alerts & Notifications */}
			<section className={styles.alertsPanel}>
				<h2 className={styles.sectionTitle}>Alerts & Notifications</h2>
				<div className={styles.alertsList}>
					{alerts.map((alert) => (
						<div key={alert.id} className={`${styles.alert} ${styles[`severity${alert.severity === "high" ? "High" : "Medium"}`]}`}>
							<div className={styles.alertContent}>
								<p className={styles.alertMessage}>{alert.message}</p>
								<span className={`${styles.alertBadge} ${styles[`badge${alert.severity === "high" ? "High" : "Medium"}`]}`}>
									{alert.count}
								</span>
							</div>
							<button className={styles.alertAction}>
								{alert.action}
								<FontAwesomeIcon icon={faArrowRight} />
							</button>
						</div>
					))}
				</div>
			</section>

			{/* Quick Actions */}
			<section className={styles.quickActionsPanel}>
				<h2 className={styles.sectionTitle}>Quick Actions</h2>
				<div className={styles.actionsList}>
					<button className={styles.actionBtn}>
						<FontAwesomeIcon icon={faUsers} />
						<div className={styles.actionContent}>
							<span className={styles.actionLabel}>Review Seller Applications</span>
							<span className={styles.actionSubtitle}>7 pending approval</span>
						</div>
						<FontAwesomeIcon icon={faArrowRight} className={styles.actionIcon} />
					</button>
				</div>
			</section>
		</div>
	);
}

export default AdminHome;
