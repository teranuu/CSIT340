import { useState } from "react";
import styles from "../styles/admin.products.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faTrash, faCheckCircle, faFlag } from "@fortawesome/free-solid-svg-icons";

function AdminProduct() {
	const [products, setProducts] = useState([
		{
			id: 101,
			name: "Eco Canvas Tote",
			seller: "Eco Threads",
			category: "Bags",
			price: 29.99,
			status: "active",
			flags: ["User flagged: counterfeit concern"],
		},
		{
			id: 102,
			name: "Replica Designer Watch",
			seller: "Urban Gear",
			category: "Accessories",
			price: 120.0,
			status: "flagged",
			flags: ["Suspected counterfeit", "Violation of platform policy"],
		},
		{
			id: 103,
			name: "Offensive Graphic Tee",
			seller: "Green Living",
			category: "Apparel",
			price: 22.5,
			status: "flagged",
			flags: ["Offensive content"],
		},
		{
			id: 104,
			name: "Organic Cotton Tee",
			seller: "Eco Threads",
			category: "Apparel",
			price: 35,
			status: "active",
			flags: [],
		},
	]);

	const updateStatus = (id, status) => {
		setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
	};

	const handleApprove = (id) => updateStatus(id, "active");
	const handleHide = (id) => updateStatus(id, "hidden");
	const handleDelete = (id) => updateStatus(id, "removed");

	return (
		<div className={styles.wrapper}>
			<header className={styles.header}>
				<div>
					<h2 className={styles.pageTitle}>Product Moderation</h2>
					<p className={styles.subtitle}>Read-only listings with moderation actions (approve, hide, remove)</p>
				</div>
				<div className={styles.summary}>
					<span>Total: {products.length}</span>
					<span>Flagged: {products.filter(p => p.status === 'flagged').length}</span>
					<span>Hidden: {products.filter(p => p.status === 'hidden').length}</span>
				</div>
			</header>

			<section className={styles.section}>
				<div className={styles.listHeader}>
					<span>Listing</span>
					<span className={styles.listHeaderMeta}>Seller</span>
					<span className={styles.listHeaderMeta}>Category</span>
					<span className={styles.listHeaderMeta}>Price</span>
					<span className={styles.listHeaderMeta}>Status</span>
					<span className={styles.listHeaderMeta}>Actions</span>
				</div>

				<div className={styles.listBody}>
					{products.map((product) => (
						<div key={product.id} className={styles.row}>
							<div className={styles.listingInfo}>
								<p className={styles.title}>{product.name}</p>
								<div className={styles.flags}>
									{product.flags.length === 0 && <span className={styles.flagOk}><FontAwesomeIcon icon={faCheckCircle}/> Clean</span>}
									{product.flags.map((flag, idx) => (
										<span key={idx} className={styles.flagChip}><FontAwesomeIcon icon={faFlag}/> {flag}</span>
									))}
								</div>
							</div>
							<span className={styles.meta}>{product.seller}</span>
							<span className={styles.meta}>{product.category}</span>
							<span className={styles.meta}>${product.price.toFixed(2)}</span>
							<span className={`${styles.status} ${
								product.status === 'flagged' ? styles.statusFlagged :
								product.status === 'hidden' ? styles.statusHidden :
								product.status === 'removed' ? styles.statusRemoved :
								styles.statusActive
							}`}>{product.status}</span>
							<div className={styles.actions}>
								<button className={styles.approveBtn} onClick={() => handleApprove(product.id)}>
									<FontAwesomeIcon icon={faCheckCircle}/> Approve
								</button>
								<button className={styles.hideBtn} onClick={() => handleHide(product.id)}>
									<FontAwesomeIcon icon={faEyeSlash}/> Hide
								</button>
								<button className={styles.removeBtn} onClick={() => handleDelete(product.id)}>
									<FontAwesomeIcon icon={faTrash}/> Remove
								</button>
							</div>
						</div>
					))}
				</div>
			</section>
		</div>
	);
}

export default AdminProduct;
