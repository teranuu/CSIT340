import { useState } from "react";
import styles from "../styles/admin.categories.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPencil, faTrash, faCheckCircle, faClock, faExclamationTriangle, faTimes } from "@fortawesome/free-solid-svg-icons";

function AdminCategories() {
	const [categories, setCategories] = useState([
		{
			id: "CAT-001",
			name: "Sustainable Apparel",
			productCount: 45,
			isActive: true,
			createdDate: "2024-11-01",
		},
		{
			id: "CAT-002",
			name: "Eco Accessories",
			productCount: 28,
			isActive: true,
			createdDate: "2024-11-05",
		},
		{
			id: "CAT-003",
			name: "Organic Home Goods",
			productCount: 12,
			isActive: true,
			createdDate: "2024-11-12",
		},
		{
			id: "CAT-004",
			name: "Fair Trade Crafts",
			productCount: 0,
			isActive: true,
			createdDate: "2024-12-01",
		},
		{
			id: "CAT-005",
			name: "Vintage Collectibles",
			productCount: 18,
			isActive: true,
			createdDate: "2024-11-20",
		},
	]);

	const [categoryRequests] = useState([
		{
			id: "REQ-001",
			seller: "Eco Threads",
			newCategory: "Ethical Beauty Products",
			description: "Sustainable makeup, skincare, and personal care items",
			dateRequested: "2024-12-08",
			status: "pending",
		},
		{
			id: "REQ-002",
			seller: "Urban Gear",
			newCategory: "Vintage Streetwear",
			description: "Rare and authentic vintage streetwear pieces",
			dateRequested: "2024-12-06",
			status: "pending",
		},
		{
			id: "REQ-003",
			seller: "Green Living",
			newCategory: "Zero-Waste Kitchen",
			description: "Sustainable kitchen alternatives and tools",
			dateRequested: "2024-12-05",
			status: "approved",
			approvalDate: "2024-12-09",
		},
	]);

	const [showCreateModal, setShowCreateModal] = useState(false);
	const [showRenameModal, setShowRenameModal] = useState(false);
	const [newCategoryName, setNewCategoryName] = useState("");
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [currentTab, setCurrentTab] = useState("categories");

	const handleCreateCategory = () => {
		if (newCategoryName.trim()) {
			const newCategory = {
				id: `CAT-${String(categories.length + 1).padStart(3, "0")}`,
				name: newCategoryName,
				productCount: 0,
				isActive: true,
				createdDate: new Date().toISOString().split("T")[0],
			};
			setCategories([...categories, newCategory]);
			setNewCategoryName("");
			setShowCreateModal(false);
		}
	};

	const handleRenameCategory = () => {
		if (newCategoryName.trim() && selectedCategory) {
			setCategories(
				categories.map(cat =>
					cat.id === selectedCategory.id
						? { ...cat, name: newCategoryName }
						: cat
				)
			);
			setNewCategoryName("");
			setShowRenameModal(false);
			setSelectedCategory(null);
		}
	};

	const handleDeleteCategory = (categoryId) => {
		const category = categories.find(c => c.id === categoryId);
		if (category && category.productCount === 0) {
			setCategories(categories.filter(c => c.id !== categoryId));
		}
	};

	const openRenameModal = (category) => {
		setSelectedCategory(category);
		setNewCategoryName(category.name);
		setShowRenameModal(true);
	};

	return (
		<div className={styles.wrapper}>
			<header className={styles.header}>
				<div>
					<h2 className={styles.pageTitle}>Category Management</h2>
					<p className={styles.subtitle}>Create, manage, and organize product categories</p>
				</div>
				<button className={styles.createBtn} onClick={() => setShowCreateModal(true)}>
					<FontAwesomeIcon icon={faPlus} /> New Category
				</button>
			</header>

			<div className={styles.tabNav}>
				<button
					className={`${styles.tabBtn} ${currentTab === "categories" ? styles.active : ""}`}
					onClick={() => setCurrentTab("categories")}
				>
					All Categories ({categories.length})
				</button>
				<button
					className={`${styles.tabBtn} ${currentTab === "requests" ? styles.active : ""}`}
					onClick={() => setCurrentTab("requests")}
				>
					Seller Requests ({categoryRequests.filter(r => r.status === "pending").length})
				</button>
			</div>

			{/* Categories Tab */}
			{currentTab === "categories" && (
				<section className={styles.section}>
					<div className={styles.listHeader}>
						<span>Category Name</span>
						<span className={styles.metaHead}>Products</span>
						<span className={styles.metaHead}>Created</span>
						<span className={styles.metaHead}>Status</span>
						<span className={styles.metaHead}>Actions</span>
					</div>
					<div className={styles.listBody}>
						{categories.map(category => (
							<div key={category.id} className={styles.row}>
								<span className={styles.categoryName}>{category.name}</span>
								<span className={styles.meta}>{category.productCount} product{category.productCount !== 1 ? "s" : ""}</span>
								<span className={styles.meta}>{category.createdDate}</span>
								<span className={`${styles.status} ${styles.statusActive}`}>
									<FontAwesomeIcon icon={faCheckCircle} /> Active
								</span>
								<div className={styles.actions}>
									<button
										className={styles.renameBtn}
										onClick={() => openRenameModal(category)}
										title="Rename category"
									>
										<FontAwesomeIcon icon={faPencil} /> Rename
									</button>
									<button
										className={`${styles.deleteBtn} ${category.productCount > 0 ? styles.disabled : ""}`}
										onClick={() => handleDeleteCategory(category.id)}
										disabled={category.productCount > 0}
										title={category.productCount > 0 ? "Cannot delete category with active products" : "Delete category"}
									>
										<FontAwesomeIcon icon={faTrash} /> Delete
									</button>
								</div>
							</div>
						))}
					</div>
				</section>
			)}

			{/* Seller Requests Tab */}
			{currentTab === "requests" && (
				<section className={styles.section}>
					<div className={styles.sectionHeader}>
						<h3>Seller Category Requests</h3>
						<p>Review and approve new category requests from sellers</p>
					</div>
					<div className={styles.requestsGrid}>
						{categoryRequests.length === 0 && (
							<p className={styles.emptyText}>No category requests at this time.</p>
						)}
						{categoryRequests.map(request => (
							<div key={request.id} className={styles.requestCard}>
								<div className={styles.cardHeader}>
									<div>
										<h4 className={styles.cardTitle}>{request.newCategory}</h4>
										<p className={styles.cardSubtitle}>from {request.seller}</p>
									</div>
									<span className={`${styles.badge} ${
										request.status === 'approved' ? styles.badgeApproved :
										styles.badgePending
									}`}>
										{request.status === 'approved' ? 'Approved' : 'Pending'}
									</span>
								</div>

								<p className={styles.description}>{request.description}</p>

								<div className={styles.cardMeta}>
									<span>Requested: {request.dateRequested}</span>
									{request.approvalDate && <span>Approved: {request.approvalDate}</span>}
								</div>

								{request.status === 'pending' && (
									<div className={styles.cardActions}>
										<button className={styles.approveBtn}>
											<FontAwesomeIcon icon={faCheckCircle} /> Approve
										</button>
										<button className={styles.rejectBtn}>
											<FontAwesomeIcon icon={faTimes} /> Decline
										</button>
									</div>
								)}
								{request.status === 'approved' && (
									<div className={styles.approvedNote}>
										<FontAwesomeIcon icon={faCheckCircle} /> Category approved and available for this seller
									</div>
								)}
							</div>
						))}
					</div>
				</section>
			)}

			{/* Create Category Modal */}
			{showCreateModal && (
				<div className={styles.modal}>
					<div className={styles.modalContent}>
						<div className={styles.modalHeader}>
							<h3>Create New Category</h3>
							<button
								className={styles.closeBtn}
								onClick={() => setShowCreateModal(false)}
							>
								<FontAwesomeIcon icon={faTimes} />
							</button>
						</div>
						<div className={styles.modalBody}>
							<label className={styles.formGroup}>
								<span className={styles.label}>Category Name</span>
								<input
									type="text"
									className={styles.input}
									placeholder="e.g., Sustainable Apparel"
									value={newCategoryName}
									onChange={(e) => setNewCategoryName(e.target.value)}
									autoFocus
								/>
							</label>
							<p className={styles.helperText}>
								Category names should be clear and descriptive. They will be visible to sellers and customers.
							</p>
						</div>
						<div className={styles.modalActions}>
							<button
								className={styles.cancelModalBtn}
								onClick={() => setShowCreateModal(false)}
							>
								Cancel
							</button>
							<button
								className={styles.submitModalBtn}
								onClick={handleCreateCategory}
								disabled={!newCategoryName.trim()}
							>
								<FontAwesomeIcon icon={faPlus} /> Create Category
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Rename Category Modal */}
			{showRenameModal && (
				<div className={styles.modal}>
					<div className={styles.modalContent}>
						<div className={styles.modalHeader}>
							<h3>Rename Category</h3>
							<button
								className={styles.closeBtn}
								onClick={() => setShowRenameModal(false)}
							>
								<FontAwesomeIcon icon={faTimes} />
							</button>
						</div>
						<div className={styles.modalBody}>
							<label className={styles.formGroup}>
								<span className={styles.label}>Category Name</span>
								<input
									type="text"
									className={styles.input}
									placeholder="Enter new category name"
									value={newCategoryName}
									onChange={(e) => setNewCategoryName(e.target.value)}
									autoFocus
								/>
							</label>
							<p className={styles.helperText}>
								This will update the category name for all existing and future products in this category.
							</p>
						</div>
						<div className={styles.modalActions}>
							<button
								className={styles.cancelModalBtn}
								onClick={() => setShowRenameModal(false)}
							>
								Cancel
							</button>
							<button
								className={styles.submitModalBtn}
								onClick={handleRenameCategory}
								disabled={!newCategoryName.trim()}
							>
								<FontAwesomeIcon icon={faPencil} /> Rename Category
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default AdminCategories;
