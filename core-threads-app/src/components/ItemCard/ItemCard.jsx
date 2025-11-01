import styles from './item.card.module.css';

function ItemCard({name, style}){


    return(

        <>
        <div className={styles.categoryItem} style={style}>{name}</div>
        </>


    );

}

export default ItemCard;