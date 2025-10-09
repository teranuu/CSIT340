import './LoginSection.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function LoginSection(){


    return(
        
    <>
        
        <section className="login-section">

            <div className="login-section-content">

                <div className="section-left">


                    <div className="login-section-title">
                        WELCOME BACK
                    </div>

                    <div style ={{color:'#808080', fontSize:'1.3rem'}}>
                        Enter your credentials to log-in!
                    </div>

                    <div className="login-input-section">

                          <div className="input-wrapper">
                            <img 
                                src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png" 
                                alt="user icon" 
                                className="input-icon" 
                            />

                        <input type="text" placeholder="Username" />

                        </div>

                        <div className="input-wrapper">
                            <img 
                                src="https://cdn-icons-png.flaticon.com/512/3064/3064197.png" 
                                alt="lock icon" 
                                className="input-icon" 
                            />

                            <input placeholder="Password"></input>

                        </div>

                    </div>
                    
                    <div className="login-section-toggle-switch-forgot-password-wrapper">
                        <div className="toggle-switch-wrapper">
                            <div className="toggle-switch">
                                <label className="switch">
                                <input type="checkbox" />
                                <span className="slider round"></span>
                                </label>
                                
                            </div>

                            <span>Remember me</span>

                        </div>

                        <a className="forgot-password">
                            Forgot your password?
                        </a>
                    </div>


                    <div className="button-sign-in-wrapper">
                        <button className="button-sign-in">Sign in</button>
                    </div>

                    <div style ={{color:'#808080', fontSize:'1.2rem'}}>OR USE</div>

                    <div className="gf-section">

                    <button className="gf-btn">
                        {/* <img 
                        src="https://cdn-icons-png.flaticon.com/512/300/300221.png" 
                        alt="Google icon" 
                        className="gf-icon" 
                        /> */}
                        <FontAwesomeIcon icon={["fab", "google"]} size="1g" color="#000"/>
                        Google
                    </button>

                    <button className="gf-btn">
                        {/* <img 
                        src="https://cdn-icons-png.flaticon.com/512/1384/1384005.png" 
                        alt="Facebook icon" 
                        className="gf-icon" 
                        /> */}
                        <FontAwesomeIcon icon={["fab", "facebook"]} size="1g" color="#000"/>
                        Facebook
                    </button>

                    </div>



                </div>

                <div className="section-right">

                 



                </div>

                
            </div>

            
            


            
        </section>
    
    </>

    )
   

}

export default LoginSection