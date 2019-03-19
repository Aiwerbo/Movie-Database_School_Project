import React, { Component } from 'react';
import {Redirect}from "react-router-dom";
import axios from 'axios';
import {Helmet} from "react-helmet";


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

export default Add;