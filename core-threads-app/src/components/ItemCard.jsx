import './ItemCard.css';

function ItemCard({name, style}){


    return(

        <>
        <div className="category-item" style={style}>{name}</div>
        </>


    );

}

export default ItemCard;