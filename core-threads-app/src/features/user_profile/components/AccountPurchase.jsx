import styles from '../styles/account.purchase.module.css';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faTruck, faCheckCircle, faTimesCircle, faUndo, faEllipsisV } from '@fortawesome/free-solid-svg-icons';

function AccountPurchase() {
    const [activeTab, setActiveTab] = useState('all');

    const orders = [];

    const tabs = [
        { id: 'all', label: 'All', icon: faBox },
        { id: 'pay', label: 'Pay', icon: faBox },
        { id: 'completed', label: 'Completed', icon: faCheckCircle }
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