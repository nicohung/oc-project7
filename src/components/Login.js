import '../styles/Form.css'
import React, { Fragment, useState } from 'react';
import {Link} from "react-router-dom";
import logo from '../logo.png';

const Login = ({ setIsAuthenticated }) => {

    const [inputs, setInputs] = useState({
        email: "",
        password: ""
    })

    const [alert, setAlert] = useState("");  // State to store the alert message

    const { email, password} = inputs;

    //as the user writes in the fields, 'inputs' is updated with the values entered by the user. 
    //keeps the 'inputs' in sync with what is entered in the form fields.
    const onChange = e => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };

    //onSubmit, invoke the login route, save the token and id to localStorage
    const onSubmit = async(e) => {

        //prevent default reloading of page
        e.preventDefault()

        try {

            const body = { 
                user_email: email, 
                user_password: password, 
            };

            //make request to the server
            const response = await fetch(`http://localhost:8000/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const parseRes = await response.json();
            console.log(parseRes); //returns {token: '', user_id: ''}

            if (response.status === 401) {
                // If the login fails, set the alert message
                setAlert(parseRes.message);
                setIsAuthenticated(false);

            } else {
                // Save the token and user info to localStorage
                localStorage.setItem("token", parseRes.token);
                localStorage.setItem("user_id", parseRes.user_id);
                localStorage.setItem("user_name", parseRes.user_name);

                // Set authenticated state to true
                setIsAuthenticated(true);

                // Clear any previous alert
                setAlert("");
            }

        } catch(err) {
            console.error(err.message)
        }
    }


    return (
        <Fragment>
            <div className='header'>
                <img src={logo} alt='Groupomania' className='logo' />
            </div>

            <div className="App">
                <h1>Login</h1>
                
                {alert && <div className="alert">{alert}</div>} {/* Conditionally render the alert */}

                <form onSubmit={onSubmit}>
                    <input type="email" name="email" placeholder="email" value={email} onChange={e => onChange(e)} />
                    <input type="password" name="password" placeholder="password" value={password} onChange={e => onChange(e)} />
                    <div className='actions'>
                        <button>Submit</button>
                        <Link to={'/register'}>Register</Link>
                    </div>
                </form>
                
            </div>
        </Fragment>
        
      );
}
    
export default Login;