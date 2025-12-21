import { useState } from "react";
import styles from "../styles/admin.payout.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins, faCheckCircle, faClock, faExclamationTriangle, faCog, faDownload } from "@fortawesome/free-solid-svg-icons";

function AdminPayout() {
	const [currentTab, setCurrentTab] = useState("balances");
	const [globalCommission, setGlobalCommission] = useState(5);
	const [editingCommission, setEditingCommission] = useState(false);

	const [sellerBalances] = useState([
		{
			id: "S001",
			name: "Eco Threads",
			totalSales: 15420.50,
			platformCommission: 771.03,
			pendingPayout: 14649.47,
			status: "verified",
			payoutMethod: "Bank Transfer",
		},
		{
			id: "S002",
			name: "Urban Gear",
			totalSales: 8930.00,
			platformCommission: 446.50,
			pendingPayout: 8483.50,
			status: "verified",
			payoutMethod: "GCash",
		},
		{
			id: "S003",
			name: "Green Living",
			totalSales: 5200.75,
			platformCommission: 260.04,
			pendingPayout: 4940.71,
			status: "pending_verification",
			payoutMethod: "Bank Transfer",
		},
		{
			id: "S004",
			name: "Vintage Dreams",
			totalSales: 3150.00,
			platformCommission: 157.50,
			pendingPayout: 2992.50,
			status: "verified",
			payoutMethod: "Bank Transfer",
		},
	]);

	const [payoutRequests] = useState([
		{
			id: "PR-2024-501",
			seller: "Eco Threads",
			amount: 14649.47,
			method: "Bank Transfer",
			bank: "BPI",
			accountNumber: "****4521",
			dateRequested: "2024-12-10",
			status: "pending",
			notes: "Routine payout request",
		},
		{
			id: "PR-2024-500",
			seller: "Urban Gear",
			amount: 8483.50,
			method: "GCash",
			gcashNumber: "****5890",
			dateRequested: "2024-12-09",
			status: "pending",
			notes: "Regular monthly payout",
		},
		{
			id: "PR-2024-499",
			seller: "Vintage Dreams",
			amount: 2992.50,
			method: "Bank Transfer",
			bank: "Metrobank",
			accountNumber: "****7823",
			dateRequested: "2024-12-08",
			status: "approved",
			approvalDate: "2024-12-09",
			notes: "Verified and ready for transfer",
		},
	]);

	const [payoutHistory] = useState([
		{
			id: "PO-2024-1001",
			seller: "Eco Threads",
			amount: 12000.00,
			method: "Bank Transfer",
			dateProcessed: "2024-12-01",
			status: "completed",
			transactionRef: "TXN-20241201-0847",
		},
		{
			id: "PO-2024-1000",
			seller: "Urban Gear",
			amount: 7500.00,
			method: "GCash",
			dateProcessed: "2024-11-28",
			status: "completed",
			transactionRef: "TXN-20241128-1234",
		},
		{
			id: "PO-2024-999",
			seller: "Green Living",
			amount: 4200.00,
			method: "Bank Transfer",
			dateProcessed: "2024-11-21",
			status: "completed",
			transactionRef: "TXN-20241121-5678",
		},
		{
			id: "PO-2024-998",
			seller: "Vintage Dreams",
			amount: 2500.00,
			method: "Bank Transfer",
			dateProcessed: "2024-11-15",
			status: "completed",
			transactionRef: "TXN-20241115-9012",
		},
	]);

	const totalPlatformCommission = sellerBalances.reduce((sum, s) => sum + s.platformCommission, 0);
	const totalPendingPayouts = sellerBalances.reduce((sum, s) => sum + s.pendingPayout, 0);
	// removed: verifiedSellers metric

	return (
		<div className={styles.wrapper}>
			<header className={styles.header}>
				<div>
					<h2 className={styles.pageTitle}>Payout & Commission Management</h2>
					<p className={styles.subtitle}>Manage seller payouts, track transactions, and configure platform commission rates</p>
				</div>
				<div className={styles.summary}>
					<div className={styles.summaryCard}>
						<FontAwesomeIcon icon={faCoins} className={styles.summaryIcon} />
						<div>
							<p className={styles.summaryLabel}>Platform Commission</p>
							<p className={styles.summaryValue}>₱{totalPlatformCommission.toFixed(2)}</p>
						</div>
					</div>
					<div className={styles.summaryCard}>
						<FontAwesomeIcon icon={faClock} className={styles.summaryIcon} />
						<div>
							<p className={styles.summaryLabel}>Pending Payouts</p>
							<p className={styles.summaryValue}>₱{totalPendingPayouts.toFixed(2)}</p>
						</div>
					</div>
					{/* Removed Verified Sellers summary card */}
				</div>
			</header>

			<div className={styles.tabNav}>
				<button
					className={`${styles.tabBtn} ${currentTab === "balances" ? styles.active : ""}`}
					onClick={() => setCurrentTab("balances")}
				>
					<FontAwesomeIcon icon={faCoins} /> Seller Balances
				</button>
				<button
					className={`${styles.tabBtn} ${currentTab === "requests" ? styles.active : ""}`}
					onClick={() => setCurrentTab("requests")}
				>
					<FontAwesomeIcon icon={faClock} /> Payout Requests ({payoutRequests.filter(r => r.status === "pending").length})
				</button>
				<button
					className={`${styles.tabBtn} ${currentTab === "history" ? styles.active : ""}`}
					onClick={() => setCurrentTab("history")}
				>
					<FontAwesomeIcon icon={faDownload} /> Payout History
				</button>
				<button
					className={`${styles.tabBtn} ${currentTab === "commission" ? styles.active : ""}`}
					onClick={() => setCurrentTab("commission")}
				>
					<FontAwesomeIcon icon={faCog} /> Commission Settings
				</button>
			</div>

			{/* Seller Balances Tab */}
			{currentTab === "balances" && (
				<section className={styles.section}>
					<div className={styles.listHeader}>
						<span>Seller</span>
						<span className={styles.metaHead}>Total Sales</span>
						<span className={styles.metaHead}>Platform Commission (5%)</span>
						<span className={styles.metaHead}>Status</span>
					</div>
					<div className={styles.listBody}>
						{sellerBalances.map(seller => (
							<div key={seller.id} className={styles.row}>
								<span className={styles.sellerName}>{seller.name}</span>
								<span className={styles.amount}>₱{seller.totalSales.toFixed(2)}</span>
								<span className={styles.commission}>₱{seller.platformCommission.toFixed(2)}</span>
								<span className={`${styles.status} ${
									seller.status === 'verified' ? styles.statusVerified :
									styles.statusPending
								}`}>
									{seller.status === 'verified' ? 'Verified' : 'Pending Verification'}
								</span>
							</div>
						))}
					</div>
				</section>
			)}

			{/* Payout Requests Tab */}
			{currentTab === "requests" && (
				<section className={styles.section}>
					<div className={styles.sectionHeader}>
						<h3>Process Payout Requests</h3>
						<p>Review, verify, and approve seller payout requests</p>
					</div>
					<div className={styles.requestsGrid}>
						{payoutRequests.map(request => (
							<div key={request.id} className={styles.requestCard}>
								<div className={styles.cardHeader}>
									<div>
										<h4 className={styles.cardTitle}>{request.seller}</h4>
										<p className={styles.cardSubtitle}>{request.id}</p>
									</div>
									<span className={`${styles.badge} ${
										request.status === 'approved' ? styles.badgeApproved :
										styles.badgePending
									}`}>
										{request.status === 'approved' ? 'Approved' : 'Pending Review'}
									</span>
								</div>

								<div className={styles.cardDetails}>
									<p><strong>Amount:</strong> ₱{request.amount.toFixed(2)}</p>
									<p><strong>Method:</strong> {request.method}</p>
									{request.method === 'Bank Transfer' ? (
										<p><strong>Bank:</strong> {request.bank} | Acct: {request.accountNumber}</p>
									) : (
										<p><strong>GCash:</strong> {request.gcashNumber}</p>
									)}
									<p><strong>Date Requested:</strong> {request.dateRequested}</p>
									{request.approvalDate && <p><strong>Approved:</strong> {request.approvalDate}</p>}
									<p><strong>Notes:</strong> {request.notes}</p>
								</div>

								{request.status === 'pending' && (
									<div className={styles.cardActions}>
										<button className={styles.approveBtn}>
											<FontAwesomeIcon icon={faCheckCircle} /> Approve
										</button>
										<button className={styles.rejectBtn}>
											<FontAwesomeIcon icon={faExclamationTriangle} /> Request Verification
										</button>
									</div>
								)}
								{request.status === 'approved' && (
									<div className={styles.cardActions}>
										<button className={styles.processBtn}>
											<FontAwesomeIcon icon={faDownload} /> Process Transfer
										</button>
									</div>
								)}
							</div>
						))}
					</div>
				</section>
			)}

			{/* Payout History Tab */}
			{currentTab === "history" && (
				<section className={styles.section}>
					<div className={styles.sectionHeader}>
						<h3>Payout History</h3>
						<p>Track all completed payouts to sellers</p>
					</div>
					<div className={styles.listHeader}>
						<span>Payout ID</span>
						<span className={styles.metaHead}>Seller</span>
						<span className={styles.metaHead}>Amount</span>
						<span className={styles.metaHead}>Method</span>
						<span className={styles.metaHead}>Date Processed</span>
						<span className={styles.metaHead}>Transaction Ref</span>
					</div>
					<div className={styles.listBody}>
						{payoutHistory.map(payout => (
							<div key={payout.id} className={styles.row}>
								<span className={styles.payoutId}>{payout.id}</span>
								<span className={styles.meta}>{payout.seller}</span>
								<span className={styles.amount}>₱{payout.amount.toFixed(2)}</span>
								<span className={styles.meta}>{payout.method}</span>
								<span className={styles.meta}>{payout.dateProcessed}</span>
								<span className={`${styles.meta} ${styles.transactionRef}`}>{payout.transactionRef}</span>
							</div>
						))}
					</div>
				</section>
			)}

			{/* Commission Settings Tab */}
			{currentTab === "commission" && (
				<section className={styles.section}>
					<div className={styles.sectionHeader}>
						<h3>Commission Rate Settings</h3>
						<p>Configure the platform commission rate applied to all seller sales</p>
					</div>

					<div className={styles.settingsCard}>
						<div className={styles.settingRow}>
							<div className={styles.settingLabel}>
								<h4>Global Commission Rate</h4>
								<p>Applied to all sellers and categories</p>
							</div>
							<div className={styles.settingInput}>
								{!editingCommission ? (
									<div className={styles.currentRate}>
										<span className={styles.rateValue}>{globalCommission}%</span>
										<button
											className={styles.editBtn}
											onClick={() => setEditingCommission(true)}
										>
											<FontAwesomeIcon icon={faCog} /> Edit
										</button>
									</div>
								) : (
									<div className={styles.editRate}>
										<input
											type="number"
											min="0"
											max="100"
											step="0.5"
											value={globalCommission}
											onChange={(e) => setGlobalCommission(parseFloat(e.target.value))}
											className={styles.rateInput}
										/>
										<span className={styles.percent}>%</span>
										<button
											className={styles.saveBtn}
											onClick={() => setEditingCommission(false)}
										>
											<FontAwesomeIcon icon={faCheckCircle} /> Save
										</button>
										<button
											className={styles.cancelBtn}
											onClick={() => setEditingCommission(false)}
										>
											Cancel
										</button>
									</div>
								)}
							</div>
						</div>

						<div className={styles.infoBox}>
							<FontAwesomeIcon icon={faExclamationTriangle} className={styles.infoIcon} />
							<div>
								<p><strong>How it works:</strong> The global commission rate is automatically deducted from each seller's sales. For example, at {globalCommission}%, a ₱1,000 sale results in ₱{(1000 * (globalCommission / 100)).toFixed(2)} commission to the platform and ₱{(1000 * (1 - globalCommission / 100)).toFixed(2)} pending payout to the seller.</p>
							</div>
						</div>

						<div className={styles.categoryNote}>
							<p><strong>Future Enhancement:</strong> Per-category commission rates can be implemented later if needed.</p>
						</div>
					</div>
				</section>
			)}
		</div>
	);
}

export default AdminPayout;
