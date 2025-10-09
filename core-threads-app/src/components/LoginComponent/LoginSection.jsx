import './LoginSection.css'


function LoginSection(){


    return(
        
    <>
        
        <section className="login-section">

            <div className="login-section-content">

                <div className="section-left">


                    <div className="login-section-title">
                        WELCOME BACK!
                    </div>

                    <div className="login-section-subtitle">
                        Enter your credentials to log-in!
                    </div>

                    <div className="input-username">
                        <input placeholder="Username"></input>
                    </div>

                    <div className="input-password">
                        <input placeholder="Password"></input>
                        
                    </div>

                    <div className="login-section-toggle-switch-forgot-password">
                        <div className="toggle-switch">
                            <label class="switch">
                            <input type="checkbox"></input>
                            <span class="slider round"></span>
                            </label>
                        </div>

                        <div className="forgot-password">
                            Forgot your password? 
                        </div>
                    </div>

                    <div>
                        <button className="button-sign-in">Sign in</button>
                    </div>

                    <div className="gf-section">
                        <div>

                            <button className="gf-section-btn">Google</button>

                        </div>

                        <div>

                            <button className="gf-section-btn">Facebook</button>

                        </div>
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