import styles from "../styles/seller.earnings.module.css";
import SellerStatCard from '../components/SellerStatCard';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faClock, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';

function SellerEarnings() {
    const [activeTab, setActiveTab] = useState('pending');

    // Sample earnings data
    const totalEarnings = 24300;
    const averagePerOrder = 44.83;
    const pendingPayout = 3250;
    const totalPaidOut = 21050;

    // Sample pending payout transactions
    const pendingPayouts = [
        { id: 1, orderId: 'ORD-2024-1156', amount: 125.00, date: '2024-12-08', customer: 'Sarah Chen' },
        { id: 2, orderId: 'ORD-2024-1155', amount: 89.50, date: '2024-12-07', customer: 'Mike Johnson' },
        { id: 3, orderId: 'ORD-2024-1154', amount: 210.00, date: '2024-12-07', customer: 'Emma Davis' },
        { id: 4, orderId: 'ORD-2024-1153', amount: 67.25, date: '2024-12-06', customer: 'Alex Rivera' },
        { id: 5, orderId: 'ORD-2024-1152', amount: 156.75, date: '2024-12-05', customer: 'Lisa Wong' }
    ];

    // Sample paid-out history
    const paidOutHistory = [
        { id: 1, payoutId: 'PAY-2024-089', amount: 2450.00, date: '2024-12-01', status: 'completed', orders: 54 },
        { id: 2, payoutId: 'PAY-2024-088', amount: 3120.50, date: '2024-11-24', status: 'completed', orders: 68 },
        { id: 3, payoutId: 'PAY-2024-087', amount: 1890.25, date: '2024-11-17', status: 'completed', orders: 42 },
        { id: 4, payoutId: 'PAY-2024-086', amount: 2750.00, date: '2024-11-10', status: 'completed', orders: 61 },
        { id: 5, payoutId: 'PAY-2024-085', amount: 3340.75, date: '2024-11-03', status: 'completed', orders: 73 }
    ];

    const statCards = [
        { title: 'Total Earnings', value: `$${totalEarnings.toLocaleString()}`, subtitle: 'All-time revenue' },
        { title: 'Average Per Order', value: `$${averagePerOrder}`, subtitle: 'Mean order value' },
        { title: 'Pending Payout', value: `$${pendingPayout.toLocaleString()}`, subtitle: `${pendingPayouts.length} orders awaiting` },
        { title: 'Total Paid Out', value: `$${totalPaidOut.toLocaleString()}`, subtitle: 'Successfully transferred' }
    ];

    return (
        <div className={styles.earningsWrapper}>
            <header className={styles.header}>
                <h2 className={styles.pageTitle}>Earnings</h2>
                <p className={styles.subtitle}>Track your revenue and payout history</p>
            </header>

            <div className={styles.statsGrid}>
                {statCards.map((card, index) => (
                    <SellerStatCard key={index} {...card} />
                ))}
            </div>

            <div className={styles.tabNavigation}>
                <button
                    type="button"
                    className={`${styles.tabButton} ${activeTab === 'pending' ? styles.active : ''}`}
                    onClick={() => setActiveTab('pending')}
                >
                    <FontAwesomeIcon icon={faClock} className={styles.tabIcon} />
                    Pending Payout
                </button>
                <button
                    type="button"
                    className={`${styles.tabButton} ${activeTab === 'history' ? styles.active : ''}`}
                    onClick={() => setActiveTab('history')}
                >
                    <FontAwesomeIcon icon={faCheckCircle} className={styles.tabIcon} />
                    Paid-Out History
                </button>
            </div>

            {activeTab === 'pending' && (
                <div className={styles.transactionsPanel}>
                    <div className={styles.panelHeader}>
                        <h3 className={styles.panelTitle}>Pending Payouts</h3>
                        <span className={styles.panelBadge}>{pendingPayouts.length} transactions</span>
                    </div>
                    <div className={styles.transactionsList}>
                        {pendingPayouts.map((payout) => (
                            <div key={payout.id} className={styles.transactionCard}>
                                <div className={styles.transactionIcon}>
                                    <FontAwesomeIcon icon={faClock} />
                                </div>
                                <div className={styles.transactionInfo}>
                                    <p className={styles.transactionId}>{payout.orderId}</p>
                                    <p className={styles.transactionCustomer}>{payout.customer}</p>
                                    <p className={styles.transactionDate}>{payout.date}</p>
                                </div>
                                <div className={styles.transactionAmount}>
                                    <span className={styles.amountValue}>${payout.amount.toFixed(2)}</span>
                                    <span className={`${styles.statusBadge} ${styles.statusPending}`}>Pending</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'history' && (
                <div className={styles.transactionsPanel}>
                    <div className={styles.panelHeader}>
                        <h3 className={styles.panelTitle}>Paid-Out History</h3>
                        <span className={styles.panelBadge}>{paidOutHistory.length} payouts</span>
                    </div>
                    <div className={styles.transactionsList}>
                        {paidOutHistory.map((payout) => (
                            <div key={payout.id} className={styles.transactionCard}>
                                <div className={`${styles.transactionIcon} ${styles.iconCompleted}`}>
                                    <FontAwesomeIcon icon={faCheckCircle} />
                                </div>
                                <div className={styles.transactionInfo}>
                                    <p className={styles.transactionId}>{payout.payoutId}</p>
                                    <p className={styles.transactionCustomer}>{payout.orders} orders included</p>
                                    <p className={styles.transactionDate}>{payout.date}</p>
                                </div>
                                <div className={styles.transactionAmount}>
                                    <span className={styles.amountValue}>${payout.amount.toLocaleString()}</span>
                                    <span className={`${styles.statusBadge} ${styles.statusCompleted}`}>Completed</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default SellerEarnings;