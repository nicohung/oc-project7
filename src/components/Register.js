import '../styles/Form.css'
import React, { Fragment, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../logo.png';

const Register = ({setIsAuthenticated}) => {
    const navigate = useNavigate();
    
    const [inputs, setInputs] = useState({
        email: "",
        password: "",
        name: ""
    })

    const [alert, setAlert] = useState("");  // State to store the alert message

    const {email, password, name } = inputs;

    const onChange = (e) => {
        setInputs({...inputs, [e.target.name] : e.target.value });
    }

    const onSubmitForm = async(e) => {
        //prevent refresh
        e.preventDefault()

        try {
            const body = { 
                user_email: email, 
                user_password: password, 
                user_name: name 
            };
            console.log(body);
    
            const response = await fetch(`http://localhost:8000/auth/register`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body)
            });
      
            console.log(response);

            const parseRes = await response.json();
            console.log(parseRes);

            if (response.status === 401) {
                // If the login fails, set the alert message
                setAlert("User already exists");
                setIsAuthenticated(false);
            } else {
                //save the token to local storage, and use it to set setAuth to True. 
                localStorage.setItem("token", parseRes.token);
                setIsAuthenticated(true);
                localStorage.setItem("user_id", parseRes.user_id);
                localStorage.setItem("user_name", parseRes.user_name);
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