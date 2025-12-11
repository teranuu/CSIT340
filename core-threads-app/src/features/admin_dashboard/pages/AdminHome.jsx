import { useState } from "react";
import styles from "../styles/admin.home.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faUsers,
	faHourglassEnd,
	faBox,
	faFlag,
	faShoppingBag,
	faCoins,
	faExclamationTriangle,
	faCheckCircle,
	faClock,
	faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

function AdminHome() {
	// Sample metrics data
	const [metrics] = useState({
		activeSellers: 432,
		pendingSellerApplications: 7,
		activeProducts: 12921,
		flaggedListings: 14,
		ordersLast24h: 118,
		pendingPayouts: 3,
		totalOrdersWeek: 742,
		totalRevenue: 125643.50,
	});

	const [alerts] = useState([
		{
			id: "alert-1",
			type: "pending_sellers",
			message: "7 sellers waiting for verification",
			count: 7,
			severity: "high",
			action: "Review Applications",
			actionPage: "sellers",
		},
		{
			id: "alert-2",
			type: "flagged_products",
			message: "14 products flagged for moderation",
			count: 14,
			severity: "medium",
			action: "Moderate Products",
			actionPage: "products",
		},
		{
			id: "alert-3",
			type: "disputes",
			message: "2 escalated disputes awaiting decision",
			count: 2,
			severity: "high",
			action: "Review Disputes",
			actionPage: "orders",
		},
		{
			id: "alert-4",
			type: "pending_payouts",
			message: "3 seller payout requests pending approval",
			count: 3,
			severity: "medium",
			action: "Process Payouts",
			actionPage: "payouts",
		},
	]);

	const [recentActivity] = useState([
		{
			id: 1,
			type: "order",
			message: "New order placed",
			details: "ORD-2024-1210 - $2,450.00",
			time: "2 minutes ago",
		},
		{
			id: 2,
			type: "seller",
			message: "Seller application received",
			details: "Vintage Dreams Co.",
			time: "1 hour ago",
		},
		{
			id: 3,
			type: "product",
			message: "Product flagged",
			details: "Replica Designer Watch - Suspected counterfeit",
			time: "3 hours ago",
		},
		{
			id: 4,
			type: "payout",
			message: "Payout request submitted",
			details: "Eco Threads - ₱14,649.47",
			time: "5 hours ago",
		},
		{
			id: 5,
			type: "dispute",
			message: "Dispute escalated",
			details: "ORD-2024-1195 - Item condition mismatch",
			time: "8 hours ago",
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

					{/* Flagged Listings */}
					<div className={styles.metricCard}>
						<div className={styles.metricHeader}>
							<FontAwesomeIcon icon={faFlag} className={`${styles.metricIcon} ${styles.iconDanger}`} />
							<span className={styles.metricLabel}>Flagged Listings</span>
						</div>
						<div className={`${styles.metricValue} ${metrics.flaggedListings > 10 ? styles.valueDanger : ""}`}>
							{metrics.flaggedListings}
						</div>
						<p className={styles.metricSubtext}>Requiring moderation</p>
					</div>

					{/* Orders (24h) */}
					<div className={styles.metricCard}>
						<div className={styles.metricHeader}>
							<FontAwesomeIcon icon={faShoppingBag} className={styles.metricIcon} />
							<span className={styles.metricLabel}>Orders (24h)</span>
						</div>
						<div className={styles.metricValue}>{metrics.ordersLast24h}</div>
						<p className={styles.metricSubtext}>Platform activity pulse</p>
					</div>

					{/* Pending Payouts */}
					<div className={styles.metricCard}>
						<div className={styles.metricHeader}>
							<FontAwesomeIcon icon={faCoins} className={`${styles.metricIcon} ${styles.iconWarning}`} />
							<span className={styles.metricLabel}>Pending Payouts</span>
						</div>
						<div className={`${styles.metricValue} ${metrics.pendingPayouts > 0 ? styles.valueWarning : ""}`}>
							{metrics.pendingPayouts}
						</div>
						<p className={styles.metricSubtext}>Seller requests awaiting approval</p>
					</div>
				</div>
			</section>

			{/* Alerts & Quick Actions Row */}
			<div className={styles.contentRow}>
				{/* Alerts Panel */}
				<section className={styles.alertsPanel}>
					<h2 className={styles.sectionTitle}>
						<FontAwesomeIcon icon={faExclamationTriangle} className={styles.sectionIcon} />
						Alerts & Notifications
					</h2>
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

						<button className={styles.actionBtn}>
							<FontAwesomeIcon icon={faFlag} />
							<div className={styles.actionContent}>
								<span className={styles.actionLabel}>Moderate Flagged Products</span>
								<span className={styles.actionSubtitle}>14 items to review</span>
							</div>
							<FontAwesomeIcon icon={faArrowRight} className={styles.actionIcon} />
						</button>

						<button className={styles.actionBtn}>
							<FontAwesomeIcon icon={faExclamationTriangle} />
							<div className={styles.actionContent}>
								<span className={styles.actionLabel}>View Disputes</span>
								<span className={styles.actionSubtitle}>2 escalated cases</span>
							</div>
							<FontAwesomeIcon icon={faArrowRight} className={styles.actionIcon} />
						</button>

						<button className={styles.actionBtn}>
							<FontAwesomeIcon icon={faCoins} />
							<div className={styles.actionContent}>
								<span className={styles.actionLabel}>Process Payouts</span>
								<span className={styles.actionSubtitle}>3 requests pending</span>
							</div>
							<FontAwesomeIcon icon={faArrowRight} className={styles.actionIcon} />
						</button>
					</div>
				</section>
			</div>

			{/* Recent Activity */}
			<section className={styles.activitySection}>
				<h2 className={styles.sectionTitle}>
					<FontAwesomeIcon icon={faClock} className={styles.sectionIcon} />
					Recent Activity
				</h2>
				<div className={styles.activityList}>
					{recentActivity.map((activity) => (
						<div key={activity.id} className={styles.activityItem}>
							<div className={`${styles.activityIcon} ${styles[`icon${activity.type}`]}`}>
								<FontAwesomeIcon
									icon={
										activity.type === "order"
											? faShoppingBag
											: activity.type === "seller"
											? faUsers
											: activity.type === "product"
											? faBox
											: activity.type === "payout"
											? faCoins
											: faExclamationTriangle
									}
								/>
							</div>
							<div className={styles.activityContent}>
								<div className={styles.activityHeader}>
									<p className={styles.activityMessage}>{activity.message}</p>
									<span className={styles.activityTime}>{activity.time}</span>
								</div>
								<p className={styles.activityDetails}>{activity.details}</p>
							</div>
						</div>
					))}
				</div>
			</section>
		</div>
	);
}

export default AdminHome;
