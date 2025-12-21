import styles from '../styles/account.wallet.module.css';
import { useAuth } from '../../../context/AuthContext.jsx';
import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../../config/api.js';

function AccountWallet() {
    const { user } = useAuth();
    const [purchaseHistory, setPurchaseHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                if (!user?.customerId) {
                    setLoading(false);
                    return;
                }

                const url = `${API_BASE_URL}/api/orders/customer/${user.customerId}`;
                
                const response = await fetch(url, {
                    method: 'GET',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch orders: ${response.status}`);
                }

                const orders = await response.json();
                
                // Transform orders to match UI structure
                const transformed = orders.map((order, idx) => ({
                    id: order.orderNumber || `ORD-${idx}`,
                    date: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A',
                    status: order.status || 'PENDING',
                    items: (order.orderItems || []).map(item => ({
                        name: item.variant?.product?.name || `Product ${item.productId}`,
                        quantity: item.quantity,
                        price: item.unitPrice ? parseFloat(item.unitPrice) : 0
                    })),
                    total: order.totalAmount ? parseFloat(order.totalAmount) : 0
                }));

                setPurchaseHistory(transformed);
                setError(null);
            } catch (err) {
                console.error('Error fetching orders:', err);
                setError('Unable to load purchase history');
                setPurchaseHistory([]);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

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
                        <span className={styles.balanceAmount}>
                            ${Number(user?.balance ?? 1000).toFixed(2)}
                        </span>
                    </div>
                    <button className={styles.addBalanceBtn}>+ Add Balance</button>
                </div>

                {/* Purchase History Section */}
                <div className={styles.historySection}>
                    <h3 className={styles.historyTitle}>Purchase History</h3>

                    {loading && (
                        <div className={styles.loadingState}>
                            <p>Loading your orders...</p>
                        </div>
                    )}

                    {error && (
                        <div className={styles.errorState}>
                            <p>{error}</p>
                        </div>
                    )}

                    {!loading && !error && purchaseHistory.length === 0 && (
                        <div className={styles.emptyState}>
                            <p>No purchase history yet</p>
                        </div>
                    )}

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