import '../styles/Form.css'
import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../logo.png';

const Register = ({setIsAuthenticated}) => {
    
    const [inputs, setInputs] = useState({
        email: "",
        password: "",
        name: ""
    })

    const [alert, setAlert] = useState("");  // State to store the alert message

    const {email, password, name } = inputs;

    //as the user writes in the fields, 'inputs' is updated with the values entered by the user. 
    //keeps the 'inputs' in sync with what is entered in the form fields.
    const onChange = (e) => {
        setInputs({...inputs, [e.target.name] : e.target.value });
    }

    const onSubmitForm = async(e) => {
        //prevent refresh
        e.preventDefault()

        try {
            //rename the keys to match the expect format on the server. 
            const body = { 
                user_email: email, 
                user_password: password, 
                user_name: name 
            };
            console.log(body);
    
            //send data to the server
            const response = await fetch(`http://localhost:8000/auth/register`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body)
            });

            //handle server response, paseing to JSON
            const parseRes = await response.json();
            console.log(parseRes);

            //check response
            if (response.status === 401) {
                // If the login fails, set the alert message, which is "user already exists", as defined in jwtAuth.js
                setAlert(parseRes.message);
                setIsAuthenticated(false);

            } else {
                //else, take the token from the response and save it to local storage. 
                //Also save user_id and user_name (used later on to post items and mark things as read/unread, etc)
                //set the authentication to TRUE.
                localStorage.setItem("token", parseRes.token);
                localStorage.setItem("user_id", parseRes.user_id);
                localStorage.setItem("user_name", parseRes.user_name);

                setIsAuthenticated(true);

                // Clear any previous alert
                setAlert("");
            }


          } catch (err) {
            console.error(err.message);
          }
    }


    return (
        <Fragment>
            <div className='header'>
                <img src={logo} alt='Groupomania' className='logo' />
            </div>
            <h1>Register</h1>

            {alert && <div className="alert">{alert}</div>} {/* Conditionally render the alert */}
            
            <form onSubmit={onSubmitForm}>
                <input type="email" name="email" placeholder="email" value={email} onChange={e => onChange(e)} />
                <input type="password" name="password" placeholder="password" value={password} onChange={e => onChange(e)} />
                <input type="text" name="name" placeholder="name" value={name} onChange={e => onChange(e)} />
                
                <div className='actions'>
                    <button>Create Account</button>
                    <Link to={'/login'}>Login</Link>
                </div>
                
            </form>
        </Fragment>
        
      );
}
    
export default Register;