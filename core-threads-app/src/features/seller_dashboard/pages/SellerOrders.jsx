
import styles from '../styles/seller.orders.module.css';
import { useState, useEffect } from 'react';

function SellerOrders() {
    const [activeTab, setActiveTab] = useState('pending');
    const [allOrders, setAllOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const tabs = [
        { id: 'pending', label: 'Pending' },
        { id: 'processing', label: 'Processing' },
        { id: 'shipped', label: 'Shipped' },
        { id: 'delivered', label: 'Delivered' },
        { id: 'cancelled', label: 'Cancelled' }
    ];

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch('http://localhost:8080/api/sellers/orders', {
                    credentials: 'include'
                });
                if (res.ok) {
                    const data = await res.json();
                    setAllOrders(data.orders || []);
                } else {
                    setError('Failed to fetch orders');
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching orders:', err);
                setError('Failed to load orders');
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className={styles.ordersWrapper}>
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p>Loading orders...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.ordersWrapper}>
                <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    const filteredOrders = allOrders.filter(order => 
        order.status && order.status.toLowerCase() === activeTab
    );

    const getStatusBadge = (status) => {
        const badges = {
            pending: { label: 'Pending', className: styles.statusPending },
            processing: { label: 'Processing', className: styles.statusProcessing },
            shipped: { label: 'Shipped', className: styles.statusShipped },
            delivered: { label: 'Delivered', className: styles.statusCompleted },
            cancelled: { label: 'Cancelled', className: styles.statusCancelled }
        };
        return badges[status?.toLowerCase()] || badges.pending;
    };

    return (
        <div className={styles.ordersWrapper}>
            <div className={styles.tabNavigation}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className={styles.ordersList}>
                {filteredOrders.length > 0 ? (
                    filteredOrders.map(order => (
                        <div key={order.orderId} className={styles.orderCard}>
                            <div className={styles.orderHeader}>
                                <div className={styles.orderInfo}>
                                    <h4 className={styles.orderId}>#{order.orderNumber || order.orderId}</h4>
                                    <p className={styles.customerName}>{order.customerName}</p>
                                </div>
                                <div className={`${getStatusBadge(order.status).className}`}>
                                    {getStatusBadge(order.status).label}
                                </div>
                            </div>
                            <div className={styles.orderDetails}>
                                <span className={styles.orderDate}>
                                    {new Date(order.createdAt).toLocaleDateString('en-US')}
                                </span>
                                <span className={styles.orderTotal}>
                                    ${parseFloat(order.totalAmount).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={styles.emptyState}>
                        <p>No orders in this category</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SellerOrders;