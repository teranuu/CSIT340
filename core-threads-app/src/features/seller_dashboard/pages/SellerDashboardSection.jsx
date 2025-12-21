import styles from '../styles/seller.section.module.css';
import SellerStatCard from '../components/SellerStatCard';
import { useState, useEffect } from 'react';

function SellerDashboardSection(){
    const [stats, setStats] = useState({ totalSales: 0, totalProducts: 0, totalOrders: 0 });
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch dashboard stats
                const statsRes = await fetch('http://localhost:8080/api/sellers/dashboard/stats', {
                    credentials: 'include'
                });
                if (statsRes.ok) {
                    const statsData = await statsRes.json();
                    setStats(statsData);
                }

                // Fetch seller products
                const productsRes = await fetch('http://localhost:8080/api/sellers/products', {
                    credentials: 'include'
                });
                if (productsRes.ok) {
                    const productsData = await productsRes.json();
                    setProducts(productsData.products || []);
                }

                // Fetch seller orders
                const ordersRes = await fetch('http://localhost:8080/api/sellers/orders', {
                    credentials: 'include'
                });
                if (ordersRes.ok) {
                    const ordersData = await ordersRes.json();
                    setOrders(ordersData.orders || []);
                }

                setLoading(false);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError('Failed to load dashboard data');
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className={styles.sectionWrapper}>
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p>Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.sectionWrapper}>
                <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    const statCards = [
        { title: 'Total Sales', value: `$${stats.totalSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
        { title: 'Total Products', value: stats.totalProducts.toString() },
        { title: 'Total Orders', value: stats.totalOrders.toString() }
    ];

    const topProducts = products.slice(0, 3).map(p => ({
        name: p.name,
        sales: '$0.00' // TODO: Calculate sales from order items when available
    }));

    const latestOrders = orders.slice(0, 3).map(o => ({
        id: `#${o.orderId}`,
        customer: o.customerName,
        total: `$${parseFloat(o.totalAmount).toFixed(2)}`
    }));

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
                    {topProducts.length > 0 ? (
                        topProducts.map(item => (
                            <div key={item.name} className={styles.listRow}>
                                <span>{item.name}</span>
                                <span className={styles.listValue}>{item.sales}</span>
                            </div>
                        ))
                    ) : (
                        <div style={{ padding: '1rem', textAlign: 'center', color: '#666' }}>
                            No products yet
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.panel}>
                <div className={styles.panelHeader}>Latest Orders</div>
                <div className={styles.list}>
                    {latestOrders.length > 0 ? (
                        latestOrders.map(order => (
                            <div key={order.id} className={styles.listRow}>
                                <span>{order.id} — {order.customer}</span>
                                <span className={styles.listValue}>{order.total}</span>
                            </div>
                        ))
                    ) : (
                        <div style={{ padding: '1rem', textAlign: 'center', color: '#666' }}>
                            No orders yet
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

}

export default SellerDashboardSection;