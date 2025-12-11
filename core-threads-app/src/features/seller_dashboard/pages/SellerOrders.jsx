
import styles from '../styles/seller.orders.module.css';
import { useState } from 'react';

function SellerOrders() {
    const [activeTab, setActiveTab] = useState('pending');

    const tabs = [
        { id: 'pending', label: 'Pending' },
        { id: 'shipped', label: 'Shipped' },
        { id: 'receive', label: 'Receive' },
        { id: 'completed', label: 'Completed' },
        { id: 'cancelled', label: 'Cancelled' },
        { id: 'return', label: 'Return Refund' }
    ];

    const orders = [
        { id: '#1049', customer: 'Sarah Wilson', date: '12/06/2025', total: '$245.00', status: 'pending' },
        { id: '#1048', customer: 'Michael Chen', date: '12/05/2025', total: '$189.50', status: 'shipped' },
        { id: '#1047', customer: 'Emma Davis', date: '12/04/2025', total: '$312.75', status: 'receive' },
        { id: '#1046', customer: 'James Brown', date: '12/03/2025', total: '$456.20', status: 'completed' },
        { id: '#1045', customer: 'Lisa Anderson', date: '12/02/2025', total: '$128.90', status: 'cancelled' },
        { id: '#1044', customer: 'Robert Taylor', date: '12/01/2025', total: '$198.40', status: 'return' }
    ];

    const filteredOrders = orders.filter(order => order.status === activeTab);

    const getStatusBadge = (status) => {
        const badges = {
            pending: { label: 'Pending', className: styles.statusPending },
            shipped: { label: 'Shipped', className: styles.statusShipped },
            receive: { label: 'To Receive', className: styles.statusReceive },
            completed: { label: 'Completed', className: styles.statusCompleted },
            cancelled: { label: 'Cancelled', className: styles.statusCancelled },
            return: { label: 'Return/Refund', className: styles.statusReturn }
        };
        return badges[status] || badges.pending;
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
                        <div key={order.id} className={styles.orderCard}>
                            <div className={styles.orderHeader}>
                                <div className={styles.orderInfo}>
                                    <h4 className={styles.orderId}>{order.id}</h4>
                                    <p className={styles.customerName}>{order.customer}</p>
                                </div>
                                <div className={`${getStatusBadge(order.status).className}`}>
                                    {getStatusBadge(order.status).label}
                                </div>
                            </div>
                            <div className={styles.orderDetails}>
                                <span className={styles.orderDate}>{order.date}</span>
                                <span className={styles.orderTotal}>{order.total}</span>
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