import styles from '../styles/account.purchase.module.css';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faTruck, faCheckCircle, faTimesCircle, faUndo, faEllipsisV } from '@fortawesome/free-solid-svg-icons';

function AccountPurchase() {
    const [activeTab, setActiveTab] = useState('all');

    const orders = [
        {
            id: 'ORD-2024-001',
            date: '2024-11-15',
            items: [
                { name: 'Premium Cotton T-Shirt', size: 'L', color: 'Black', quantity: 2, price: 29.99, image: 'https://via.placeholder.com/60' },
                { name: 'Denim Jeans', size: '32', color: 'Blue', quantity: 1, price: 79.99, image: 'https://via.placeholder.com/60' }
            ],
            total: 139.97,
            status: 'completed',
            shippingMethod: 'Express Delivery'
        },
        {
            id: 'ORD-2024-002',
            date: '2024-11-20',
            items: [
                { name: 'Leather Jacket', size: 'M', color: 'Brown', quantity: 1, price: 199.99, image: 'https://via.placeholder.com/60' }
            ],
            total: 199.99,
            status: 'ship',
            shippingMethod: 'Standard Shipping'
        },
        {
            id: 'ORD-2024-003',
            date: '2024-11-25',
            items: [
                { name: 'Running Shoes', size: '10', color: 'White', quantity: 1, price: 89.99, image: 'https://via.placeholder.com/60' }
            ],
            total: 89.99,
            status: 'receive',
            shippingMethod: 'Express Delivery'
        },
        {
            id: 'ORD-2024-004',
            date: '2024-10-10',
            items: [
                { name: 'Wool Sweater', size: 'L', color: 'Grey', quantity: 1, price: 59.99, image: 'https://via.placeholder.com/60' }
            ],
            total: 59.99,
            status: 'cancelled',
            shippingMethod: 'Standard Shipping'
        },
        {
            id: 'ORD-2024-005',
            date: '2024-12-01',
            items: [
                { name: 'Sports Cap', size: 'One Size', color: 'Black', quantity: 3, price: 19.99, image: 'https://via.placeholder.com/60' }
            ],
            total: 59.97,
            status: 'pay',
            shippingMethod: 'Express Delivery'
        }
    ];

    const tabs = [
        { id: 'all', label: 'All', icon: faBox },
        { id: 'pay', label: 'Pay', icon: faBox },
        { id: 'ship', label: 'Ship', icon: faTruck },
        { id: 'receive', label: 'Receive', icon: faBox },
        { id: 'completed', label: 'Completed', icon: faCheckCircle },
        { id: 'cancelled', label: 'Cancelled', icon: faTimesCircle },
        { id: 'return', label: 'Return Refund', icon: faUndo }
    ];

    const getStatusBadge = (status) => {
        const statusMap = {
            pay: { label: 'Awaiting Payment', className: styles.statusPay },
            ship: { label: 'Shipped', className: styles.statusShip },
            receive: { label: 'To Receive', className: styles.statusReceive },
            completed: { label: 'Completed', className: styles.statusCompleted },
            cancelled: { label: 'Cancelled', className: styles.statusCancelled },
            return: { label: 'Return/Refund', className: styles.statusReturn }
        };
        return statusMap[status] || { label: status, className: '' };
    };

    const filteredOrders = activeTab === 'all' 
        ? orders 
        : orders.filter(order => order.status === activeTab);

    return (
        <div className={styles.purchaseWrapper}>
            <h2 className={styles.sectionTitle}>My Purchase</h2>

            {/* Tab Navigation */}
            <div className={styles.tabNav}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`${styles.tabButton} ${activeTab === tab.id ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Orders List */}
            <div className={styles.ordersList}>
                {filteredOrders.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>No orders found</p>
                    </div>
                ) : (
                    filteredOrders.map(order => (
                        <div key={order.id} className={styles.orderCard}>
                            {/* Order Header */}
                            <div className={styles.orderHeader}>
                                <div className={styles.orderMeta}>
                                    <span className={styles.orderId}>{order.id}</span>
                                    <span className={styles.orderDate}>{new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                </div>
                                <div className={styles.orderActions}>
                                    <span className={`${styles.statusBadge} ${getStatusBadge(order.status).className}`}>
                                        {getStatusBadge(order.status).label}
                                    </span>
                                    <button className={styles.moreBtn}>
                                        <FontAwesomeIcon icon={faEllipsisV} />
                                    </button>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className={styles.orderItems}>
                                {order.items.map((item, idx) => (
                                    <div key={idx} className={styles.orderItem}>
                                        <div className={styles.itemImage}>
                                            <img src={item.image} alt={item.name} />
                                        </div>
                                        <div className={styles.itemDetails}>
                                            <h4 className={styles.itemName}>{item.name}</h4>
                                            <div className={styles.itemSpecs}>
                                                <span>Size: {item.size}</span>
                                                <span>Color: {item.color}</span>
                                                <span>Qty: {item.quantity}</span>
                                            </div>
                                        </div>
                                        <div className={styles.itemPrice}>
                                            <span className={styles.price}>₱{item.price.toFixed(2)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Order Footer */}
                            <div className={styles.orderFooter}>
                                <div className={styles.shippingInfo}>
                                    <FontAwesomeIcon icon={faTruck} className={styles.truckIcon} />
                                    <span>{order.shippingMethod}</span>
                                </div>
                                <div className={styles.totalSection}>
                                    <span className={styles.totalLabel}>Order Total:</span>
                                    <span className={styles.totalAmount}>₱{order.total.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className={styles.orderButtons}>
                                {order.status === 'pay' && (
                                    <button className={styles.primaryBtn}>Pay Now</button>
                                )}
                                {order.status === 'ship' && (
                                    <button className={styles.secondaryBtn}>Track Order</button>
                                )}
                                {order.status === 'receive' && (
                                    <button className={styles.primaryBtn}>Confirm Receipt</button>
                                )}
                                {order.status === 'completed' && (
                                    <>
                                        <button className={styles.secondaryBtn}>Buy Again</button>
                                        <button className={styles.secondaryBtn}>Leave Review</button>
                                    </>
                                )}
                                <button className={styles.outlineBtn}>Contact Seller</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default AccountPurchase;