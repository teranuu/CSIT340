import styles from '../styles/account.wallet.module.css';

function AccountWallet() {
    const purchaseHistory = [
        {
            id: "ORD-2001",
            date: "2025-10-21",
            items: [
                { name: "Oversized Graphic Tee", quantity: 1, price: 34.99 },
                { name: "Distressed Denim Jeans", quantity: 1, price: 79.99 }
            ],
            total: 114.98,
            status: "Delivered"
        },
        {
            id: "ORD-2002",
            date: "2025-09-30",
            items: [
                { name: "Embroidered Logo Hoodie", quantity: 1, price: 89.99 }
            ],
            total: 89.99,
            status: "Delivered"
        },
        {
            id: "ORD-2003",
            date: "2025-09-14",
            items: [
                { name: "Cargo Pants", quantity: 1, price: 69.99 },
                { name: "Chunky Sneakers", quantity: 1, price: 129.99 }
            ],
            total: 199.98,
            status: "Shipped"
        },
        {
            id: "ORD-2004",
            date: "2025-08-28",
            items: [
                { name: "Flannel Overshirt", quantity: 1, price: 59.99 }
            ],
            total: 59.99,
            status: "Cancelled"
        },
        {
            id: "ORD-2005",
            date: "2025-08-10",
            items: [
                { name: "Streetwear Bomber Jacket", quantity: 1, price: 149.99 },
                { name: "Snapback Cap", quantity: 1, price: 29.99 }
            ],
            total: 179.98,
            status: "Delivered"
        }
    ];

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case "delivered":
                return styles.statusDelivered;
            case "shipped":
                return styles.statusShipped;
            case "cancelled":
                return styles.statusCancelled;
            default:
                return "";
        }
    };

    return (
        <>
            <div className={styles.accountWalletWrapper}>
                {/* Balance Card Section */}
                <div className={styles.balanceCard}>
                    <div className={styles.balanceContent}>
                        <span className={styles.balanceLabel}>Current Balance</span>
                        <span className={styles.balanceAmount}>$400.23</span>
                    </div>
                    <button className={styles.addBalanceBtn}>+ Add Balance</button>
                </div>

                {/* Purchase History Section */}
                <div className={styles.historySection}>
                    <h3 className={styles.historyTitle}>Purchase History</h3>

                    <div className={styles.purchaseHistoryWrapper}>
                        {purchaseHistory.map(order => (
                            <div key={order.id} className={styles.orderCard}>
                                {/* Order Header */}
                                <div className={styles.orderHeader}>
                                    <div className={styles.orderInfo}>
                                        <span className={styles.orderId}>{order.id}</span>
                                        <span className={styles.orderDate}>{order.date}</span>
                                    </div>
                                    <span className={`${styles.orderStatus} ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>

                                {/* Order Items */}
                                <div className={styles.orderItems}>
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className={styles.itemRow}>
                                            <span className={styles.itemName}>{item.name}</span>
                                            <span className={styles.itemQty}>×{item.quantity}</span>
                                            <span className={styles.itemPrice}>${item.price.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Order Footer */}
                                <div className={styles.orderFooter}>
                                    <span className={styles.totalLabel}>Total</span>
                                    <span className={styles.totalPrice}>${order.total.toFixed(2)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default AccountWallet;