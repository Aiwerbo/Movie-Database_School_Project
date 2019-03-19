import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link}from "react-router-dom";
import {Helmet} from "react-helmet";
import 'react-rater/lib/react-rater.css'
import './App.css';
import Add from './add.js'
import Edit from './edit.js';
import Description from './description.js'
import Main from './main.js'

class App extends Component {

  render() {
    
    return (
      <Router>
        <>
          <Helmet>
            <title>Movies</title>
          </Helmet>
          <div className="App">
            <div id="mainContainer">
            
            <Link className="links" to='/'><button className="homeAddButtons">Movies</button></Link>
            <Link className="links" to='/add'><button className="homeAddButtons">Add</button></Link><br/>
            
            <Route exact path='/' component={Main} />
            <Route path='/edit/:id' component={Edit} />
            <Route path='/add' component={Add} />
            <Route path='/description/:id' component={Description} />

            </div>
          </div>
        </>
      </Router>
      
    );
  }
}

export default App;
