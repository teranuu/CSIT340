import './DashboardSection.css';
import ApparelCard from '../ApparelCard';
import ItemCard from '../ItemCard';

function DashboardSection() {
  // ✅ Define cards inside the component scope
  const cards = Array.from({ length: 12 }); // 6 rows

  return (
    <div className="dashboard-section-wrapper">
     
      <div className="category-sidebar-wrapper">
        <ItemCard name="All" style={{height:"7rem"}}/>
        <ItemCard name="Hoodies" style={{height:"7rem"}}/>
        <ItemCard name="Shirts" style={{height:"7rem"}} />
        <ItemCard name="Pants" style={{height:"7rem"}}/>
        <ItemCard name="Kicks" style={{height:"7rem"}}/>
      </div>

     
      <div className="apparel-display-section">
        {cards.map((_, i) => (
          <div key={i} className="apparel-item-row">
            <ApparelCard
              image="https://via.placeholder.com/150"
              name="Hoodie"
              price="$49.99"
            />
            <ApparelCard
              image="https://via.placeholder.com/150"
              name="T-Shirt"
              price="$29.99"
            />
            <ApparelCard
              image="https://via.placeholder.com/150"
              name="Pants"
              price="$39.99"
            />
          </div>
        ))}
      </div>

      {/* Right Sidebar */}
      <div className="right-display-wrapper">
        <div className="right-section-wrapper">
          <span>Recently Viewed</span>
          <ItemCard style={{ height: '10rem' }}/>
        </div>

        <div className="right-section-wrapper">
          <span>Suggestion for you</span>
          <ItemCard style={{ height: '10rem' }}/>
        </div>
      </div>
    </div>
  );
}

export default DashboardSection;