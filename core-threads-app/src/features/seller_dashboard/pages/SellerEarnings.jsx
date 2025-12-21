import styles from "../styles/seller.earnings.module.css";
import SellerStatCard from '../components/SellerStatCard';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faClock, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';

function SellerEarnings() {
    const [activeTab, setActiveTab] = useState('pending');

    // Earnings data - to be populated from API
    const totalEarnings = 0;
    const averagePerOrder = 0;
    const pendingPayout = 0;
    const totalPaidOut = 0;

    // Pending payout transactions - to be populated from API
    const pendingPayouts = [];

    // Paid-out history - to be populated from API
    const paidOutHistory = [];

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