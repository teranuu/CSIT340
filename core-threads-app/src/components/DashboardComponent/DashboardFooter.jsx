import './DashboardFooter.css';
import ItemCard from '../ItemCard';

function DashboardFooter(){

    return(

        <>

            <div className="dashboard-footer-wrapper">
            
                <div className="deals-wrapper">

                    <span style={{fontWeight:"bold", fontSize:"1.2rem"}}>Deals of the Day</span>
                    <div className="deals-borderline" style={{border:"1px solid"}}/>
                    <span style={{fontWeight:"bold", fontSize:"1.2rem"}}>20 : 45 : 12 Left!</span>

                </div>

                <div className="deals-item-wrapper">

                    <ItemCard style={{height:"10rem", border: "2.5px solid"}}/>
                    <ItemCard style={{height:"10rem", border: "2.5px solid"}}/>
                    <ItemCard style={{height:"10rem", border: "2.5px solid"}}/>
                    <ItemCard style={{height:"10rem", border: "2.5px solid"}}/>
                </div>



            </div>
        
        
        </>


    );


}

export default DashboardFooter