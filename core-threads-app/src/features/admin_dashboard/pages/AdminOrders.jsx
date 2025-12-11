import { useState } from "react";
import styles from "../styles/admin.orders.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle, faCheckCircle, faTimesCircle, faUndo, faGavel } from "@fortawesome/free-solid-svg-icons";

function AdminOrders() {
	const [orders] = useState([
		{
			id: "ORD-2024-1201",
			seller: "Eco Threads",
			buyer: "Sarah Chen",
			items: "Organic Cotton Tee x2",
			status: "completed",
			date: "2024-12-09",
			risk: "low",
		},
		{
			id: "ORD-2024-1198",
			seller: "Urban Gear",
			buyer: "Mike Johnson",
			items: "Replica Designer Watch x1",
			status: "cancelled",
			date: "2024-12-08",
			risk: "high",
			flags: ["Cancelled", "Counterfeit concern"],
		},
		{
			id: "ORD-2024-1195",
			seller: "Green Living",
			buyer: "Emma Davis",
			items: "Bamboo Cutlery Set x3",
			status: "disputed",
			date: "2024-12-07",
			risk: "high",
			flags: ["Disputed"],
		},
		{
			id: "ORD-2024-1193",
			seller: "Eco Threads",
			buyer: "Alex Rivera",
			items: "Eco Canvas Tote x1",
			status: "refunded",
			date: "2024-12-06",
			risk: "medium",
			flags: ["Refunded"],
		},
		{
			id: "ORD-2024-1189",
			seller: "Urban Gear",
			buyer: "Lisa Wong",
			items: "Offensive Graphic Tee x1",
			status: "returned",
			date: "2024-12-05",
			risk: "medium",
			flags: ["Returned"]
		},
	]);

	const highRiskStatuses = ["cancelled", "returned", "disputed", "refunded"];
	const highRiskOrders = orders.filter(o => highRiskStatuses.includes(o.status));

	return (
		<div className={styles.wrapper}>
			<header className={styles.header}>
				<div>
					<h2 className={styles.pageTitle}>Order Oversight</h2>
					<p className={styles.subtitle}>Platform-wide visibility to monitor risk and escalations</p>
				</div>
				<div className={styles.summary}>
					<span>Total: {orders.length}</span>
					<span>High-Risk: {highRiskOrders.length}</span>
				</div>
			</header>

			<section className={styles.section}>
				<div className={styles.listHeader}>
					<span>Order</span>
					<span className={styles.metaHead}>Seller</span>
					<span className={styles.metaHead}>Buyer</span>
					<span className={styles.metaHead}>Items</span>
					<span className={styles.metaHead}>Status</span>
					<span className={styles.metaHead}>Date</span>
					<span className={styles.metaHead}>Actions</span>
				</div>

				<div className={styles.listBody}>
					{orders.map(order => (
						<div key={order.id} className={styles.row}>
							<span className={styles.orderId}>{order.id}</span>
							<span className={styles.meta}>{order.seller}</span>
							<span className={styles.meta}>{order.buyer}</span>
							<span className={styles.meta}>{order.items}</span>
							<span className={`${styles.status} ${
								order.status === 'disputed' ? styles.statusDisputed :
								order.status === 'refunded' ? styles.statusRefunded :
								order.status === 'returned' ? styles.statusReturned :
								order.status === 'cancelled' ? styles.statusCancelled :
								styles.statusCompleted
							}`}>
								{order.status}
							</span>
							<span className={styles.meta}>{order.date}</span>
							<div className={styles.actions}>
								{order.status === 'disputed' ? (
									<button className={styles.escalateBtn}>
										<FontAwesomeIcon icon={faGavel}/> Escalate Review
									</button>
								) : order.status === 'cancelled' || order.status === 'returned' || order.status === 'refunded' ? (
									<button className={styles.reviewBtn}>
										<FontAwesomeIcon icon={faExclamationTriangle}/> Review Risk
									</button>
								) : (
									<span className={styles.okLabel}><FontAwesomeIcon icon={faCheckCircle}/> OK</span>
								)}
							</div>
						</div>
					))}
				</div>
			</section>

			<section className={styles.section}>
				<div className={styles.sectionHeader}>
					<h3>High-Risk Orders</h3>
					<p>Focus on cancelled, returned, disputed, and refunded orders.</p>
				</div>
				<div className={styles.cardGrid}>
					{highRiskOrders.length === 0 && <p className={styles.emptyText}>No high-risk orders.</p>}
					{highRiskOrders.map(order => (
						<div key={order.id} className={styles.card}>
							<div className={styles.cardHeader}>
								<h4 className={styles.cardTitle}>{order.id}</h4>
								<span className={`${styles.badge} ${
									order.status === 'disputed' ? styles.badgeDisputed :
									order.status === 'refunded' ? styles.badgeRefunded :
									order.status === 'returned' ? styles.badgeReturned :
									styles.badgeCancelled
								}`}>
									{order.status}
								</span>
							</div>
							<p className={styles.meta}><strong>Seller:</strong> {order.seller}</p>
							<p className={styles.meta}><strong>Buyer:</strong> {order.buyer}</p>
							<p className={styles.meta}><strong>Items:</strong> {order.items}</p>
							<p className={styles.meta}><strong>Date:</strong> {order.date}</p>
							<div className={styles.flags}>
								{(order.flags || []).map((flag, idx) => (
									<span key={idx} className={styles.flagChip}>{flag}</span>
								))}
								{(!order.flags || order.flags.length === 0) && <span className={styles.flagChip}>High-risk status</span>}
							</div>
							<div className={styles.cardActions}>
								{order.status === 'disputed' ? (
									<button className={styles.escalateBtn}>
										<FontAwesomeIcon icon={faGavel}/> Escalate Dispute
									</button>
								) : (
									<button className={styles.reviewBtn}>
										<FontAwesomeIcon icon={faExclamationTriangle}/> Review
									</button>
								)}
								<button className={styles.resolveBtn}>
									<FontAwesomeIcon icon={faUndo}/> Resolve / Follow-up
								</button>
							</div>
						</div>
					))}
				</div>
			</section>
		</div>
	);
}

export default AdminOrders;
