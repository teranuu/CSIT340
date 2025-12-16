import styles from './item.card.module.css';

function ItemCard({name, style, onClick}){


    return(

        <>
        <div className={styles.categoryItem} style={style} onClick={onClick}>{name}</div>
        </>


    );

}

export default ItemCard;