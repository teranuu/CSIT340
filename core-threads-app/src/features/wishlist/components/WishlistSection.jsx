import styles from "../styles/wishlist.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

function WishlistSection() {
  const wishlist = [
    {
      id: 1,
      name: "Casual T-Shirt – Basic Black",
      price: 500,
      stock: "In Stock",
      image: "/img1.jpg"
    },
    {
      id: 2,
      name: "Sneakers – Jordan 69",
      price: 20999,
      stock: "In Stock",
      image: "/img2.jpg"
    },
    {
      id: 3,
      name: "Loose Pants – Denim",
      price: 2000,
      stock: "Out of Stock",
      image: "/img3.jpg"
    }
  ];

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.card}>
        <h2 className={styles.title}>Wishlist</h2>

        {/* HEADER */}
        <div className={`${styles.tableHeader} ${styles.gridLayout}`}>
          <span></span>
          <span></span>
          <span>Product Name</span>
          <span>Unit Price</span>
          <span>Stock Status</span>
          <span>Action</span>
        </div>


        <div className={styles.divider}></div>

        {/* ROWS */}
        {wishlist.map(item => (
          <div key={item.id} className={`${styles.row} ${styles.gridLayout}`}>

            {/* Delete */}
            <button className={styles.trashBtn}>
              <FontAwesomeIcon icon={faTrash} />
            </button>

            {/* Image */}
            <div className={styles.imageBox}>
              <img src={item.image} alt={item.name} />
            </div>

            {/* Name */}
            <span className={styles.productName}>{item.name}</span>

            {/* Price */}
            <span className={styles.itemPrice}>
              ₱ {item.price.toLocaleString()}
            </span>

            {/* Stock */}
            <span className={styles.itemStock}>{item.stock}</span>

            {/* Button */}
            <button className={styles.addBtn}>Add to cart</button>

          </div>
        ))}
      </div>
    </div>
  );
}

export default WishlistSection;
