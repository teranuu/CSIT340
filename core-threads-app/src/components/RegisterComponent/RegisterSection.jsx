import './RegisterSection.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function RegisterSection(){


    return(

        <>

            <section className="login-section">

            <div className="login-section-content">

                <div className="section-left">


                    <div className="login-section-title">
                        HELLO USER
                    </div>

                    <div style ={{color:'#808080', fontSize:'1.3rem'}}>
                        Enter the following information to sign-up
                    </div>

                    <div className="login-input-section">

                        <div className="input-wrapper">
                            <FontAwesomeIcon icon={["fas", "user"]} size="1g" color="#000" className="input-icon"/>
                            <input type="text" placeholder="Username" />

                        </div>

                        <div className="input-wrapper">
                            <FontAwesomeIcon icon={["fas", "user"]} size="1g" color="#000" className="input-icon"/>
                            <input type="password" placeholder="First Name"></input>

                        </div>

                          <div className="input-wrapper">
                            <FontAwesomeIcon icon={["fas", "user"]} size="1g" color="#000" className="input-icon"/>
                            <input type="password" placeholder="Last Name"></input>

                        </div>

                        <div className="input-wrapper">
                            <FontAwesomeIcon icon={["fas", "key"]} size="1g" color="#000" className="input-icon"/>
                            <input type="password" placeholder="Password"></input>

                        </div>

                        <div className="input-wrapper">
                            <FontAwesomeIcon icon={["fas", "lock"]} size="1g" color="#000" className="input-icon"/>
                            <input type="password" placeholder="Confirm Password"></input>

                        </div>


                    </div>
                


                    <div className="button-sign-in-wrapper">
                        <button className="button-sign-in">Sign Up</button>
                    </div>

                    <div style ={{color:'#808080', fontSize:'1.2rem'}}>OR USE</div>

                    <div className="gf-section">

                    <button className="gf-btn">
                        {/* <img 
                        src="https://cdn-icons-png.flaticon.com/512/300/300221.png" 
                        alt="Google icon" 
                        className="gf-icon" 
                        /> */}
                        <FontAwesomeIcon icon={["fab", "google"]} size="lg" color="#000"/>
                        Google
                    </button>

                    <button className="gf-btn">
                        {/* <img 
                        src="https://cdn-icons-png.flaticon.com/512/1384/1384005.png" 
                        alt="Facebook icon" 
                        className="gf-icon" 
                        /> */}
                        <FontAwesomeIcon icon={["fab", "facebook"]} size="lg" color="#000"/>
                        Facebook
                    </button>

                    </div>



                </div>

                <div className="section-right">

                            
                    <div className="button-sign-in-wrapper">
                        <button className="button-sign-in">Go Back to Log-in</button>
                    </div>


                    <div className="button-sign-in-wrapper">
                        <button className="button-sign-in">Sign Up</button>
                    </div>

                 



                </div>

                
            </div>

            
            


            
        </section>
        </>
    );

}

export default RegisterSection