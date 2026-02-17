

import React from 'react';
import '../Pages/Home.css';
import Timer from './Timer';
//just a dummy implementation for now,
//used this page to test the timer functionality
function Login({ onBegin }) {
    return (
        <div className="auth-root">
            <h2>Login</h2>
            <p>Login component for people</p>

            {/* inserted timer component here temporarily */}
            <main>
                <Timer /> 
            </main>
            {/*end timer component */}

        </div>
    );
}

export default Login;