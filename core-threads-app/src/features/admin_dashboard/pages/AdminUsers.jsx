import { useState } from "react";
import styles from "../styles/admin.users.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faShoppingBag, faExclamationTriangle, faEye, faBan, faTimes, faCheckCircle, faLock } from "@fortawesome/free-solid-svg-icons";

function AdminUsers() {
	const [users, setUsers] = useState([
		{
			id: "U001",
			name: "Sarah Chen",
			email: "sarah.chen@email.com",
			orderCount: 12,
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
			disputeCount: 5,
			joinedDate: "2024-11-01",
			status: "suspended",
			lastActive: "2024-12-05",
			suspensionReason: "Abusive behavior towards sellers",
		},
	]);

	const [selectedUser, setSelectedUser] = useState(null);
	const [showOrderHistory, setShowOrderHistory] = useState(false);
	const [showSuspensionModal, setShowSuspensionModal] = useState(false);
	const [suspensionReason, setSuspensionReason] = useState("");

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

	const handleSuspendAccount = () => {
		if (suspensionReason.trim() && selectedUser) {
			setUsers(
				users.map(u =>
					u.id === selectedUser.id
						? { ...u, status: "suspended", suspensionReason: suspensionReason }
						: u
				)
			);
			setSelectedUser(null);
			setShowSuspensionModal(false);
			setSuspensionReason("");
			setShowOrderHistory(false);
		}
	};

	const handleReactivateAccount = (userId) => {
		setUsers(
			users.map(u =>
				u.id === userId
					? { ...u, status: "active", suspensionReason: undefined }
					: u
			)
		);
	};

	const activeUsers = users.filter(u => u.status === "active").length;
	const suspendedUsers = users.filter(u => u.status === "suspended").length;
	const totalDisputes = users.reduce((sum, u) => sum + u.disputeCount, 0);

	return (
		<div className={styles.wrapper}>
			<header className={styles.header}>
				<div>
					<h2 className={styles.pageTitle}>User Management</h2>
					<p className={styles.subtitle}>View and manage buyer accounts, monitor activity, and handle suspensions</p>
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
					<div className={styles.summaryCard}>
						<FontAwesomeIcon icon={faLock} className={styles.summaryIcon} />
						<div>
							<p className={styles.summaryLabel}>Suspended</p>
							<p className={styles.summaryValue}>{suspendedUsers}</p>
						</div>
					</div>
					<div className={styles.summaryCard}>
						<FontAwesomeIcon icon={faExclamationTriangle} className={styles.summaryIcon} />
						<div>
							<p className={styles.summaryLabel}>Total Disputes</p>
							<p className={styles.summaryValue}>{totalDisputes}</p>
						</div>
					</div>
				</div>
			</header>

			<section className={styles.section}>
				<div className={styles.listHeader}>
					<span>User</span>
					<span className={styles.metaHead}>Email</span>
					<span className={styles.metaHead}>Orders</span>
					<span className={styles.metaHead}>Disputes</span>
					<span className={styles.metaHead}>Joined</span>
					<span className={styles.metaHead}>Status</span>
					<span className={styles.metaHead}>Actions</span>
				</div>
				<div className={styles.listBody}>
					{users.map(user => (
						<div key={user.id} className={styles.row}>
							<span className={styles.userName}>{user.name}</span>
							<span className={styles.meta}>{user.email}</span>
							<span className={styles.meta}>
								<FontAwesomeIcon icon={faShoppingBag} className={styles.metaIcon} /> {user.orderCount}
							</span>
							<span className={`${styles.meta} ${user.disputeCount > 0 ? styles.disputeWarning : ""}`}>
								{user.disputeCount > 0 && <FontAwesomeIcon icon={faExclamationTriangle} className={styles.metaIcon} />}
								{user.disputeCount}
							</span>
							<span className={styles.meta}>{user.joinedDate}</span>
							<span className={`${styles.status} ${
								user.status === 'active' ? styles.statusActive :
								styles.statusSuspended
							}`}>
								{user.status === 'active' ? 'Active' : 'Suspended'}
							</span>
							<div className={styles.actions}>
								<button
									className={styles.viewBtn}
									onClick={() => handleViewDetails(user)}
									title="View order history"
								>
									<FontAwesomeIcon icon={faEye} /> Details
								</button>
								{user.status === 'active' ? (
									<button
										className={styles.suspendBtn}
										onClick={() => {
											setSelectedUser(user);
											setShowSuspensionModal(true);
										}}
										title="Suspend account for fraud, abuse, or fake payments"
									>
										<FontAwesomeIcon icon={faBan} /> Suspend
									</button>
								) : (
									<button
										className={styles.reactivateBtn}
										onClick={() => handleReactivateAccount(user.id)}
										title="Reactivate suspended account"
									>
										<FontAwesomeIcon icon={faCheckCircle} /> Reactivate
									</button>
								)}
							</div>
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
							{selectedUser.status === 'active' && (
								<button
									className={styles.suspendFromModal}
									onClick={() => setShowSuspensionModal(true)}
								>
									<FontAwesomeIcon icon={faBan} /> Suspend Account
								</button>
							)}
						</div>
					</div>
				</div>
			)}

			{/* Suspension Modal */}
			{showSuspensionModal && selectedUser && (
				<div className={styles.modal}>
					<div className={styles.modalContent}>
						<div className={styles.modalHeader}>
							<div>
								<h3>Suspend Account</h3>
								<p className={styles.modalSubtitle}>{selectedUser.name}</p>
							</div>
							<button
								className={styles.closeBtn}
								onClick={() => {
									setShowSuspensionModal(false);
									setSuspensionReason("");
								}}
							>
								<FontAwesomeIcon icon={faTimes} />
							</button>
						</div>
						<div className={styles.modalBody}>
							<div className={styles.warningBox}>
								<FontAwesomeIcon icon={faExclamationTriangle} className={styles.warningIcon} />
								<div>
									<p><strong>Warning:</strong> Suspending an account will prevent this user from making purchases or placing orders. This action should only be taken in extreme cases of fraud, abuse, or fake payments.</p>
								</div>
							</div>

							<label className={styles.formGroup}>
								<span className={styles.label}>Suspension Reason (Required)</span>
								<select
									className={styles.select}
									value={suspensionReason}
									onChange={(e) => setSuspensionReason(e.target.value)}
									autoFocus
								>
									<option value="">Select a reason...</option>
									<option value="Fraudulent payment attempts">Fraudulent payment attempts</option>
									<option value="Multiple chargebacks">Multiple chargebacks</option>
									<option value="Abusive behavior towards sellers">Abusive behavior towards sellers</option>
									<option value="Excessive disputes without merit">Excessive disputes without merit</option>
									<option value="Fake account / Identity fraud">Fake account / Identity fraud</option>
									<option value="Other (requires description)">Other (requires description)</option>
								</select>
							</label>

							{suspensionReason === "Other (requires description)" && (
								<label className={styles.formGroup}>
									<span className={styles.label}>Please Describe the Issue</span>
									<textarea
										className={styles.textarea}
										placeholder="Enter detailed reason for suspension..."
										rows="4"
										onChange={(e) => setSuspensionReason(`Other: ${e.target.value}`)}
									/>
								</label>
							)}
						</div>
						<div className={styles.modalActions}>
							<button
								className={styles.cancelBtn}
								onClick={() => {
									setShowSuspensionModal(false);
									setSuspensionReason("");
								}}
							>
								Cancel
							</button>
							<button
								className={styles.confirmBtn}
								onClick={handleSuspendAccount}
								disabled={!suspensionReason.trim()}
							>
								<FontAwesomeIcon icon={faBan} /> Confirm Suspension
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default AdminUsers;
