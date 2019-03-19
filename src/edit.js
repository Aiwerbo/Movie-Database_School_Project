import React, { Component } from 'react';
import { BrowserRouter as Link, Redirect}from "react-router-dom";
import axios from 'axios';
import {Helmet} from "react-helmet";

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

export default Edit;