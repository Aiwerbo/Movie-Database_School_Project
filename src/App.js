import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect}from "react-router-dom";
import {Helmet} from "react-helmet";
import Rater from 'react-rater'
import 'react-rater/lib/react-rater.css'
import './App.css';
import axios from 'axios';
import Table from './table.js'

class Add extends Component{
 
  constructor(props){
    super(props);
    this.state = {data: {title: null, description: null, director: null, rating: 0 }, redirect: false, errorMessage: '', validate: '', disabled: false}
    this.addMovie = this.addMovie.bind(this);
    this.addTitle = this.addTitle.bind(this);
    this.addDesc = this.addDesc.bind(this);
    this.addDirector = this.addDirector.bind(this);
    this.addRating = this.addRating.bind(this);
    this.validateTitle = this.validateTitle.bind(this)
    this.validateDesc = this.validateDesc.bind(this);
    this.validateDirector = this.validateDirector.bind(this)
  }

  validateTitle(title){
   
  if(title.length < 1 || title.length > 39){  
    
      this.setState({validate: 'Title field must contain between 1 and 40 characters.'});
  }
  else{
      this.setState({validate: ''});

  }
}

  validateDesc(description){
    
    if(description.length < 1 || description.length > 299){
      this.setState({validate: 'Description field must contain between 1 and 300 characters.'})
    }
    else{
      this.setState({validate: ''})
    }
}
  validateDirector(director){
    if(director.length < 1 || director.length > 39){
      this.setState({validate: 'Director field must contain between 1 and 40 characters.'})
    }
    else{
      this.setState({validate: ''})
    }
  }

  
  addMovie(){
    this.setState({disabled: true});
    this.source = axios.CancelToken.source();
    
    axios.post('http://ec2-13-53-132-57.eu-north-1.compute.amazonaws.com:3000/movies', this.state.data, {headers: {"Content-Type": "application/json"}, cancelToken: this.source.token })
    
    .then(response =>  {

      console.log(response);
      if(response.status === 201){
        this.setState({disabled:false})
        this.setState({redirect: true})
      }
      
    })
    
    .catch(error =>{
      if (axios.isCancel(error)) {
        return;
      }

      if(error.response && error.response.status >= 500){
        this.setState({errorMessage: 'Something went wrong on the server, Go back to movie Page and try again.'});
        this.setState({disabled: false});
      }
      
      if(error.response && error.response.status === 400){
        this.setState({errorMessage: 'The Movie cannot be added. Please fill in the blanks.'});
        this.setState({disabled: false});
      }
      
    })
  }
  
  componentWillUnmount(){
    if (this.source) {
      this.source.cancel();
    }
  }

  addTitle(e){
    this.validateTitle(e.target.value)
    this.setState({data: {...this.state.data, title: e.target.value}, errorMessage:''})
    
  }
  addDesc(e){
    this.validateDesc(e.target.value)
    this.setState({data: {...this.state.data, description: e.target.value}, errorMessage:''})
  }
  addDirector(e){
    this.validateDirector(e.target.value)
    this.setState({data: {...this.state.data, director: e.target.value}, errorMessage:''})
  }
  addRating(e){
    
    this.setState({data: {...this.state.data, rating: e.target.value}, errorMessage:''})
    
  }

  render(){
   
    if(this.state.redirect === true){
      return <Redirect to='/' />;
    }

    return(

      

      <>
        <form>
        <label>Title:</label>
        <input id="textInputEdit" className="textField" maxLength="40" type="text" onChange={this.addTitle}></input><br/>
        <label id="labelDesc">Description:</label>
        <textarea rows="5" cols="50" maxLength="300" onChange={this.addDesc}></textarea><br/>
        <label>Director:</label>
        <input id="textInputDirector" className="textField" maxLength="40" type="text" onChange={this.addDirector}></input><br/>
        <label>Rating:</label>
        <input id="ratingRange" type="range" name="points" min="0" max="5" step="0.1" value={this.state.data.rating} onChange={this.addRating}></input>
        <label id="ratingCount">{this.state.data.rating}</label>
        </form>
        <button id="saveButton" onClick={this.addMovie} disabled={this.state.disabled}>Save</button>
        <p>{this.state.errorMessage}</p>
        <p>{this.state.validate}</p>
        <Helmet><title>Add Movie</title></Helmet>
      </>
    )
  }
  

}


class Edit extends Component{

  constructor(props){
    super(props);
    this.state ={data: null, redirect: false, errorMessage: '', validate: '', disabled: false};
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDesc = this.onChangeDesc.bind(this);
    this.onChangeDirector = this.onChangeDirector.bind(this);
    this.onChangeRating = this.onChangeRating.bind(this);
    this.updateMovie = this.updateMovie.bind(this)
    this.validateTitle = this.validateTitle.bind(this)
    this.validateDesc = this.validateDesc.bind(this);
    this.validateDirector = this.validateDirector.bind(this)
  }

  componentDidMount(){
    this.source = axios.CancelToken.source();
    const id = this.props.match.params.id
    axios.get('http://ec2-13-53-132-57.eu-north-1.compute.amazonaws.com:3000/movies/' + id, {headers: {"Content-Type": "application/json"}, cancelToken: this.source.token })
  .then(response => {
    console.log(response)
    if(response.status === 200){
      this.setState({data: response.data})
    }
  })
  .catch(error => {
    if (axios.isCancel(error)) {
      return;
    }
    console.log(error.response)
    if(error.response && error.response.status >= 500){
      this.setState({errorMessage: 'Something went wrong on the server, Go back to movie Page and try again.'})
    }

    if(error.response && error.response.status === 404){
      
      this.setState({errorMessage: 'This page does not exist anymore. Click here to go back to the Movie list'})
    }
    
    
  })
  }

  componentWillUnmount(){
    if (this.source) {
      this.source.cancel();
    }
  }

  updateMovie(){
    this.setState({disabled: true});
    this.source = axios.CancelToken.source();
    const dataId = this.state.data.id;
    const data = this.state.data;
    axios.put('http://ec2-13-53-132-57.eu-north-1.compute.amazonaws.com:3000/movies/' + dataId, data, {headers: {"Content-Type": "application/json"}, cancelToken: this.source.token})
    .then(response => {
      if(response.status === 200){
        this.setState({redirect: true});
        console.log(response.status)
      }
    })
    .catch(error => {
      if (axios.isCancel(error)) {
        return;
      }

      if(error.response && error.response.status >= 500){
        this.setState({errorMessage: 'Something went wrong on the server, Go back to movie Page and try again.'})
        this.setState({disabled: false});
      }

      if(error.response && error.response.status === 400){
        this.setState({errorMessage: 'The Movie cannot be updated. Please fill in the blanks.'});
        this.setState({disabled: false});
      }
      
    })
  }
  validateTitle(title){
    if(title.length < 1 || title.length > 39){  
    
      this.setState({validate: 'Title field must contain between 1 and 40 characters.'});
  }
  else{
      this.setState({validate: ''});
  }
}

  validateDesc(description){
    if(description.length < 1 || description.length > 299){
      this.setState({validate: 'Description field must contain between 1 and 300 characters.'})
    }
    else{
      this.setState({validate: ''})
    }
}
  validateDirector(director){
    if(director.length < 1 || director.length > 39){
      this.setState({validate: 'Director field must contain between 1 and 40 characters'})
    }
    else{
      this.setState({validate: ''})
    }
  }

  onChangeTitle(e){
    this.validateTitle(e.target.value)
    this.setState({data: {...this.state.data, title: e.target.value}, errorMessage: ''})
  }
  onChangeDesc(e){
    this.validateDesc(e.target.value)
    this.setState({data: {...this.state.data, description: e.target.value}, errorMessage: ''})
  }
  onChangeDirector(e){
    this.validateDirector(e.target.value)
    this.setState({data: {...this.state.data, director: e.target.value}, errorMessage: ''})
  }
  onChangeRating(e){
    this.setState({data: {...this.state.data, rating: e.target.value}, errorMessage: ''})
  }
  
  render(){
    let data = this.state.data;
    if(this.state.errorMessage === 'This page does not exist anymore. Click here to go back to the Movie list'){
      return <p>This page does not exist anymore. <Link to="/">Click here to go back to the Movie list</Link></p>
    }

    if (this.state.data === null) {
      return <p>Loading data...</p>;
    }
    
    
    if(this.state.redirect === true){
      return <Redirect to='/'/>;
    }
    
    console.log(this.state.errorMessage)
    console.log(this.state.redirect)
    //console.log(this.state.data)
    return(
      <>
      <form>
        <label>Edit Title:</label>
        <input id="textInputEdit" className="textField" maxLength="40" type="text" value={data.title} onChange={this.onChangeTitle}></input><br/>
        <label id="labelDesc">Edit Description:</label>
        <textarea rows="5" cols="50" maxLength="300" value={data.description} onChange={this.onChangeDesc}></textarea><br/>
        <label>Edit Director:</label>
        <input id="textInputDirector" className="textField" maxLength="40" type="text" value={data.director} onChange={this.onChangeDirector}></input><br/>
        <label>Edit Rating:</label>
        <input id="ratingRange" type="range" name="points" min="0" max="5" step="0.1" value={data.rating} onChange={this.onChangeRating}></input>
        <label id="ratingCount">{data.rating}</label>
        </form>

        <button id="saveButton" onClick={this.updateMovie} disabled={this.state.disabled}>Save</button>
        <p>{this.state.errorMessage}</p>
        <p>{this.state.validate}</p>
        <Helmet><title>Edit Movie</title></Helmet>
      </>
    )
  }
}

class Description extends Component{
  constructor(props){
    super(props);
    this.state = {data: [], errorMessage: ''}
  }
  componentDidMount(){
    this.source = axios.CancelToken.source();
    const id = this.props.match.params.id
    axios.get('http://ec2-13-53-132-57.eu-north-1.compute.amazonaws.com:3000/movies/' + id, {headers: {"Content-Type": "application/json"}, cancelToken: this.source.token})
  .then(response => {
    
    this.setState({data: response.data})
  
  })
  .catch(error => {
    if (axios.isCancel(error)) {
      return;
    }

    if(error.response && error.response.status >= 500){
      this.setState({errorMessage: 'Something went wrong on the server, Go back to movie Page and try again.'})
    }

    if(error.response && error.response.status === 404){
      this.setState({errorMessage: 'The page cannot be found'})
    }
  })
  }

  componentWillUnmount(){
    if (this.source) {
      this.source.cancel();
    }
  }
  render(){

    if(this.state.errorMessage === 'The page cannot be found'){
      return <div className="errorMessage">{this.state.errorMessage} <Link to="/">Click here to go back to the Movie page.</Link> </div>
    }

    const data = this.state.data;
    console.log(this.state.data)
    return (
      <>
      <Helmet><title>Description</title></Helmet>
      <p>Title: {data.title}</p>
      <p id="description">Description:{data.description}</p>
      <p>Director: {data.director}</p>
      <div>Rating: <Rater total={5} interactive={false} rating={Number(data.rating)}/> {data.rating}</div>
      <Link to={'/edit/' + data.id}><button className="edit">Edit</button></Link>
      
      </>
    )
  }
}


class Main extends Component{
  constructor(props){
    super(props);
    this.state = {data: []};
    //this.deleteMovie = this.deleteMovie.bind(this)
    this.onDelete = this.onDelete.bind(this)
  }

  onDelete(id){
    this.source = axios.CancelToken.source();
    const data = this.state.data;

    axios.delete('http://ec2-13-53-132-57.eu-north-1.compute.amazonaws.com:3000/movies/' + id, {headers: {"Content-Type": "application/json"}, cancelToken: this.source.token})
    .then(response => {
      if(response.status === 204){
        const index = data.findIndex(x => x.id === id);

        if(index >= 0){
          const newData = [...data.slice(0, index), ...data.slice(index + 1)];
          this.setState({data: newData})
        }
        
      }
      console.log(response)
    })
    .catch(error => {
      if (axios.isCancel(error)) {
        return;
      }

      if(error.response && error.response.status >= 500){
        this.setState({errorMessage: 'Something went wrong on the server, Go back to movie Page and try again.'})
      }

      if(error.response && error.response.status === 404){
        const index = data.findIndex(x => x.id === id);

        if(index >= 0){
          const newData = [...data.slice(0, index), ...data.slice(index + 1)];
          this.setState({data: newData})
        }
      }
    })
  }
 

  componentDidMount(){
    this.source = axios.CancelToken.source();
    axios.get('http://ec2-13-53-132-57.eu-north-1.compute.amazonaws.com:3000/movies', {headers: {"Content-Type": "application/json"}, cancelToken: this.source.token})
  .then(response => {
 
    this.setState({data: response.data})
    
  })
  .catch(error => {
    if (axios.isCancel(error)) {
      return;
    }
  
  
  })
}
componentWillUnmount(){
  if (this.source) {
    this.source.cancel();
  }
}


  render(){
    
    //console.log(this.props.location.state)
    return(
      <>
        <Table onDelete={this.onDelete} data={this.state.data}></Table>
      </>
    );
  }
}

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
