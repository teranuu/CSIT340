import styles from '../styles/account.wallet.module.css';
function AccountWallet(){


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


     return (
        <>
            <div className={styles.accountWalletWrapper}>

                <div className={styles.balanceWrapper}>
                    <div>Current Balance </div>
                    <div>$400.23</div>
                </div>

                <button className={styles.addBalanceBtn}>+ Add Balance</button>

                <div className={styles.purchaseHistoryWrapper}>
                    <h3>Purchase History</h3>

                    {purchaseHistory.map(order => (
                        <div key={order.id} className={styles.orderCard}>
                            <div><strong>Order ID:</strong> {order.id}</div>
                            <div><strong>Date:</strong> {order.date}</div>
                            <div><strong>Status:</strong> {order.status}</div>
                            <ul>
                                {order.items.map((item, idx) => (
                                    <li key={idx}>
                                        {item.name} × {item.quantity} — ${item.price.toFixed(2)}
                                    </li>
                                ))}
                            </ul>
                            <div><strong>Total:</strong> ${order.total.toFixed(2)}</div>
                        </div>
                    ))}
                </div>

            </div>
        </>
    );

}

export default AccountWallet;