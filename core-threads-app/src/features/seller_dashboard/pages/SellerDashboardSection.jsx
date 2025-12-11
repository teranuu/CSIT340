import styles from '../styles/seller.section.module.css';
import SellerStatCard from '../components/SellerStatCard';

function SellerDashboardSection(){

    const statCards = [
        { title: 'Total Sales', value: '$24,300' },
        { title: 'Total Products', value: '128' },
        { title: 'Total Orders', value: '542' }
    ];

    const topProducts = [
        { name: 'Eco Tote Bag', sales: '$4,320' },
        { name: 'Bamboo Cutlery Set', sales: '$3,980' },
        { name: 'Organic Cotton Tee', sales: '$3,540' }
    ];

    const latestOrders = [
        { id: '#1045', customer: 'Jane Cooper', total: '$120.00' },
        { id: '#1044', customer: 'Devon Lane', total: '$86.50' },
        { id: '#1043', customer: 'Courtney Henry', total: '$142.10' }
    ];

    return(
        <div className={styles.sectionWrapper}>
            <div className={styles.statGrid}>
                {statCards.map(card => (
                    <SellerStatCard key={card.title} title={card.title} value={card.value} />
                ))}
            </div>

            <div className={styles.panel}>
                <div className={styles.panelHeader}>Top Products by Sales</div>
                <div className={styles.list}>
                    {topProducts.map(item => (
                        <div key={item.name} className={styles.listRow}>
                            <span>{item.name}</span>
                            <span className={styles.listValue}>{item.sales}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.panel}>
                <div className={styles.panelHeader}>Latest Orders</div>
                <div className={styles.list}>
                    {latestOrders.map(order => (
                        <div key={order.id} className={styles.listRow}>
                            <span>{order.id} — {order.customer}</span>
                            <span className={styles.listValue}>{order.total}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

}

export default SellerDashboardSection;