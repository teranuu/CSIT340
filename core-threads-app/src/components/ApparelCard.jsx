import './ApparelCard.css';
function ApparelCard({ image, name, price }) {
  return (

    <>
        

            <div className="apparel-item-card">
                    <div className="apparel-item-image-wrapper">
                        <img src={image} alt={name} />
                        <div className="apparel-item-details">
                        <span className="apparel-item-name">{name}</span>
                        <span className="apparel-item-price">{price}</span>
                    </div>
                    </div>
            </div>

    
    </>
    
  );
}

export default ApparelCard;