import { useState } from "react";
import styles from "../styles/admin.users.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faShoppingBag, faEye, faCheckCircle } from "@fortawesome/free-solid-svg-icons";

function AdminUsers() {
	const [users, setUsers] = useState([
		{
			id: "U001",
			name: "Sarah Chen",
			email: "sarah.chen@email.com",
			orderCount: 12,
			productCount: 0,
			disputeCount: 0,
			joinedDate: "2024-08-15",
			status: "active",
			lastActive: "2024-12-11",
		},
		{
			id: "U002",
			name: "Mike Johnson",
			email: "mike.j@email.com",
			orderCount: 8,
			productCount: 0,
			disputeCount: 1,
			joinedDate: "2024-09-20",
			status: "active",
			lastActive: "2024-12-10",
		},
		{
			id: "U003",
			name: "Emma Davis",
			email: "emma.davis@email.com",
			orderCount: 25,
			productCount: 0,
			disputeCount: 0,
			joinedDate: "2024-07-10",
			status: "active",
			lastActive: "2024-12-11",
		},
		{
			id: "U004",
			name: "Alex Rivera",
			email: "alex.rivera@email.com",
			orderCount: 5,
			productCount: 0,
			disputeCount: 3,
			joinedDate: "2024-10-05",
			status: "suspended",
			lastActive: "2024-11-20",
			suspensionReason: "Multiple fraudulent payment attempts",
		},
		{
			id: "U005",
			name: "Lisa Wong",
			email: "lisa.wong@email.com",
			orderCount: 18,
			productCount: 0,
			disputeCount: 0,
			joinedDate: "2024-08-30",
			status: "active",
			lastActive: "2024-12-09",
		},
		{
			id: "U006",
			name: "James Martinez",
			email: "james.m@email.com",
			orderCount: 3,
			productCount: 0,
			disputeCount: 5,
			joinedDate: "2024-11-01",
			status: "suspended",
			lastActive: "2024-12-05",
			suspensionReason: "Abusive behavior towards sellers",
		},
	]);

	const [selectedUser, setSelectedUser] = useState(null);
	const [showOrderHistory, setShowOrderHistory] = useState(false);

	// Sample order history for selected user
	const [orderHistory] = useState({
		U001: [
			{ id: "ORD-2024-1156", date: "2024-12-08", amount: 2450.00, status: "completed", items: "Organic Cotton Tee x2, Eco Canvas Tote x1" },
			{ id: "ORD-2024-1123", date: "2024-12-01", amount: 1200.50, status: "completed", items: "Bamboo Cutlery Set x3" },
			{ id: "ORD-2024-1089", date: "2024-11-20", amount: 3200.00, status: "completed", items: "Fair Trade Crafts Bundle x2" },
		],
		U002: [
			{ id: "ORD-2024-1201", date: "2024-12-09", amount: 890.00, status: "completed", items: "Vintage Watch x1" },
			{ id: "ORD-2024-1165", date: "2024-11-25", amount: 1500.00, status: "disputed", items: "Eco Apparel Set x1", dispute: "Item condition not as described" },
		],
		U003: [
			{ id: "ORD-2024-1198", date: "2024-12-08", amount: 5200.00, status: "completed", items: "Organic Bundle x5" },
			{ id: "ORD-2024-1150", date: "2024-11-30", amount: 2100.00, status: "completed", items: "Sustainable Home Goods x3" },
		],
		U004: [
			{ id: "ORD-2024-1087", date: "2024-10-15", amount: 1200.00, status: "refunded", items: "Counterfeit concern flagged" },
		],
		U005: [
			{ id: "ORD-2024-1180", date: "2024-12-06", amount: 3400.00, status: "completed", items: "Vintage Collection x2" },
		],
		U006: [
			{ id: "ORD-2024-1045", date: "2024-11-10", amount: 1800.00, status: "cancelled", items: "Abusive communication with seller" },
		],
	});

	const handleViewDetails = (user) => {
		setSelectedUser(user);
		setShowOrderHistory(true);
	};

	const activeUsers = users.filter(u => u.status === "active").length;
	// removed: suspendedUsers summary metric
	// removed: totalDisputes metric

	return (
		<div className={styles.wrapper}>
			<header className={styles.header}>
				<div>
					<h2 className={styles.pageTitle}>User Management</h2>
					<p className={styles.subtitle}>View and manage buyer and seller accounts, as well as monitor their activity</p>
				</div>
				<div className={styles.summary}>
					<div className={styles.summaryCard}>
						<FontAwesomeIcon icon={faUser} className={styles.summaryIcon} />
						<div>
							<p className={styles.summaryLabel}>Total Users</p>
							<p className={styles.summaryValue}>{users.length}</p>
						</div>
					</div>
					<div className={styles.summaryCard}>
						<FontAwesomeIcon icon={faCheckCircle} className={styles.summaryIcon} />
						<div>
							<p className={styles.summaryLabel}>Active</p>
							<p className={styles.summaryValue}>{activeUsers}</p>
						</div>
					</div>
					{/* Removed Suspended summary card */}
				{/* Removed Total Disputes summary card */}
			</div>
		</header>

		<section className={styles.section}>
			<div className={styles.listHeader}>
				<span>First Name</span>
				<span className={styles.metaHead}>Last Name</span>
				<span className={styles.metaHead}>Email</span>
				<span className={styles.metaHead}>Orders</span>
				<span className={styles.metaHead}>Products</span>
				<span className={styles.metaHead}>Status</span>
			</div>
				<div className={styles.listBody}>
					{users.map(user => (
						<div key={user.id} className={styles.row}>
						<span className={styles.userName}>{user.name.split(' ')[0]}</span>
						<span className={styles.meta}>{user.name.split(' ').slice(1).join(' ')}</span>
						<span className={styles.meta}>{user.email}</span>
						<span className={styles.meta}>
							<FontAwesomeIcon icon={faShoppingBag} className={styles.metaIcon} /> {user.orderCount}
						</span>
						<span className={styles.meta}>0</span>
						<span className={`${styles.status} ${
						user.orderCount > 0 && user.productCount > 0 ? styles.statusActive :
						styles.statusInactive
					}`}>
						{user.orderCount > 0 && user.productCount > 0 ? 'Active' : 'Non-Active'}
						</span>
					</div>
				))}
			</div>
		</section>

		{/* Order History Modal */}
		{showOrderHistory && selectedUser && (
				<div className={styles.modal}>
					<div className={styles.modalContent}>
						<div className={styles.modalHeader}>
							<div>
								<h3>Order History</h3>
								<p className={styles.modalSubtitle}>{selectedUser.name} ({selectedUser.email})</p>
							</div>
							<button
								className={styles.closeBtn}
								onClick={() => setShowOrderHistory(false)}
							>
								<FontAwesomeIcon icon={faTimes} />
							</button>
						</div>
						<div className={styles.modalBody}>
							{orderHistory[selectedUser.id] && orderHistory[selectedUser.id].length > 0 ? (
								<div className={styles.ordersList}>
									{orderHistory[selectedUser.id].map(order => (
										<div key={order.id} className={styles.orderCard}>
											<div className={styles.orderHeader}>
												<div>
													<h5 className={styles.orderTitle}>{order.id}</h5>
													<p className={styles.orderDate}>{order.date}</p>
												</div>
												<span className={`${styles.orderStatus} ${
													order.status === 'completed' ? styles.statusCompleted :
													order.status === 'disputed' ? styles.statusDisputed :
													order.status === 'refunded' ? styles.statusRefunded :
													styles.statusCancelled
												}`}>
													{order.status}
												</span>
											</div>
											<p className={styles.orderItems}><strong>Items:</strong> {order.items}</p>
											<div className={styles.orderFooter}>
												<span className={styles.orderAmount}>₱{order.amount.toFixed(2)}</span>
												{order.dispute && (
													<span className={styles.disputeNote}>
														<FontAwesomeIcon icon={faExclamationTriangle} /> {order.dispute}
													</span>
												)}
											</div>
										</div>
									))}
								</div>
							) : (
								<p className={styles.emptyText}>No order history for this user.</p>
							)}
						</div>
						<div className={styles.modalActions}>
							<button
								className={styles.closeModalBtn}
								onClick={() => setShowOrderHistory(false)}
							>
								Close
							</button>
						</div>
					</div>
				</div>
			)}

		</div>
	);
}

export default AdminUsers;
