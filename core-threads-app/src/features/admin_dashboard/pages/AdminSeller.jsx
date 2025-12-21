import { useState } from "react";
import styles from "../styles/admin.seller.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTimesCircle, faEye, faIdCard } from "@fortawesome/free-solid-svg-icons";

function AdminSeller() {
	const [sellers, setSellers] = useState([
		{
			id: 1,
			name: "Eco Threads",
			email: "eco@threads.com",
			products: 42,
			liveOrders: 18,
			cancellations: 2,
			disputes: 1,
			status: "pending",
			documents: ["Government ID", "Business Permit", "Storefront Screenshot"]
		},
		{
			id: 2,
			name: "Urban Gear",
			email: "team@urbangear.io",
			products: 120,
			liveOrders: 54,
			cancellations: 6,
			disputes: 2,
			status: "approved",
			documents: ["Government ID", "DTI Permit"]
		},
		{
			id: 3,
			name: "Green Living",
			email: "support@greenliving.com",
			products: 68,
			liveOrders: 27,
			cancellations: 1,
			disputes: 0,
			status: "suspended",
			documents: ["Government ID", "Business Permit"]
		}
	]);

	const handleApprove = (id) => {
		setSellers((prev) => prev.map((s) => s.id === id ? { ...s, status: "approved", rejectionReason: "" } : s));
	};

	const handleReject = (id) => {
		const reason = window.prompt("Enter rejection reason:");
		if (!reason) return;
		setSellers((prev) => prev.map((s) => s.id === id ? { ...s, status: "rejected", rejectionReason: reason } : s));
	};

	const handleViewDocs = (docs) => {
		window.alert(`Documents:\n- ${docs.join("\n- ")}`);
	};

	const pendingApplications = sellers.filter((s) => s.status === "pending");
	const activeSellers = sellers.filter((s) => s.status === "approved" || s.status === "active");

	return (
		<div className={styles.wrapper}>
			<header className={styles.header}>
				<div>
					<h2 className={styles.pageTitle}>Seller Management</h2>
					<p className={styles.subtitle}>Approve, suspend, and review seller performance</p>
				</div>
				<div className={styles.summary}>
					<span>Pending: {pendingApplications.length}</span>
					<span>Active: {activeSellers.length}</span>
					{/* Removed Suspended summary */}
				</div>
			</header>

			<section className={styles.section}>
				<div className={styles.sectionHeader}>
					<h3>Approve / Reject Seller Applications</h3>
					<p>Review documents before granting dashboard access.</p>
				</div>
				<div className={styles.cardGrid}>
					{pendingApplications.length === 0 && <p className={styles.emptyText}>No pending applications.</p>}
					{pendingApplications.map((seller) => (
						<div key={seller.id} className={styles.card}>
							<div className={styles.cardHeader}>
								<div>
									<h4 className={styles.cardTitle}>{seller.name}</h4>
									<p className={styles.meta}>{seller.email}</p>
								</div>
								<span className={styles.badgePending}>Pending</span>
							</div>
							<div className={styles.docs}>
								<FontAwesomeIcon icon={faIdCard} className={styles.iconMuted} />
								<div className={styles.docsList}>
									{seller.documents.map((doc) => (
										<span key={doc} className={styles.docChip}>{doc}</span>
									))}
								</div>
								<button className={styles.linkBtn} onClick={() => handleViewDocs(seller.documents)}>
									<FontAwesomeIcon icon={faEye} /> View Docs
								</button>
							</div>
							<div className={styles.actionsRow}>
								<button className={styles.approveBtn} onClick={() => handleApprove(seller.id)}>
									<FontAwesomeIcon icon={faCheckCircle} /> Approve
								</button>
								<button className={styles.rejectBtn} onClick={() => handleReject(seller.id)}>
									<FontAwesomeIcon icon={faTimesCircle} /> Reject
								</button>
							</div>
						</div>
					))}
				</div>
			</section>

			<section className={styles.section}>
				<div className={styles.sectionHeader}>
					<h3>Seller Profiles</h3>
					<p>Quick view of performance and activity.</p>
				</div>
				<div className={styles.profileGrid}>
					{sellers.map((seller) => (
						<div key={seller.id} className={styles.profileCard}>
							<div className={styles.profileTop}>
								<div>
									<h4 className={styles.cardTitle}>{seller.name}</h4>
									<p className={styles.meta}>{seller.email}</p>
								</div>
								<span className={
									seller.status === 'suspended' ? styles.badgeSuspended :
									seller.status === 'pending' ? styles.badgePending :
									styles.badgeActive
								}>
									{seller.status}
								</span>
							</div>
							<div className={styles.profileStats}>
								<div>
									<p className={styles.statLabel}>Products</p>
									<p className={styles.statValue}>{seller.products}</p>
								</div>
								<div>
									<p className={styles.statLabel}>Live Orders</p>
									<p className={styles.statValue}>{seller.liveOrders}</p>
								</div>
								<div>
									<p className={styles.statLabel}>Cancellations</p>
									<p className={styles.statValue}>{seller.cancellations}</p>
								</div>
								<div>
									<p className={styles.statLabel}>Disputes</p>
									<p className={styles.statValue}>{seller.disputes}</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</section>
		</div>
	);
}

export default AdminSeller;
