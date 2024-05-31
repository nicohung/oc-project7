import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {Navigate} from 'react-router-dom';

import InputPost from './components/InputPost.js';
import EditPost from './components/EditPost.js';
import Login from './components/Login.js';
import Register from './components/Register.js';
import Dashboard from './components/Dashboard.js';


function App() {

  //useState(false) initializes a state variable called isAuthenticated with an initial value of false
  //setIsAuthenticated is a function that allows you to update the isAuthenticated state.
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  //since useState is defaulted to False, every browser refresh will make it false and therefore logout. 
  //localStorage still has a valid token, but is logged out due to the false default of setAuthenticated.
  //need to check the token at every refresh, and set the setAuthenticated to true.
  async function isAuth(){
    try{
      //hit is-verify in jwtAuth.js
      const response = await fetch("http://localhost:8000/auth/is-verify", {
        method: "GET",
        headers: { token: localStorage.token }
      });

      const parseRes = await response.json();
      // console.log(parseRes); //logs "true" if it's authenticated

      //ternary operator, if parseRes is true, set auth true, otherwise set to false. 
      parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);

    } catch (err) {
      console.error(err.message);
    }
  }
  
  useEffect(() => {
    isAuth()
  })

  return (
    <div className="App">

      {/* the router should wrap around all the components that need to participate in routing */}
      <Router>
        <Routes>
          <Route path='/inputpost' element={<InputPost />} />
          <Route path='/editpost/:postId' element={<EditPost />} />

          {/* if isAuthenticated is false, return the Login component. Otherwise, if isAuthenticated is true, redirect to Listposts */}
          {/* {...props} passes all the properties, so Login has access to all the routing information */}
          {/* use render props since don't want it to remount */}
          <Route exact path='/login' element={!isAuthenticated ? <Login setIsAuthenticated={setIsAuthenticated} /> : <Navigate to='/dashboard' />} />
          <Route exact path='/' element={!isAuthenticated ? <Login setIsAuthenticated={setIsAuthenticated} /> : <Navigate to='/dashboard' />} />
          <Route exact path='/register' element={!isAuthenticated ? <Register setIsAuthenticated={setIsAuthenticated} /> : <Navigate to='/login' />} />
          <Route exact path='/dashboard' element={isAuthenticated ? <Dashboard setIsAuthenticated={setIsAuthenticated} /> : <Navigate to='/login' />} />


        </Routes>

      </Router>

    </div>
  );
}

export default App;
