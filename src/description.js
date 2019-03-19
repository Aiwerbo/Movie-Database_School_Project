import React, { Component } from 'react';
import {Helmet} from "react-helmet";
import axios from 'axios';
import Rater from 'react-rater';
import {Link}from "react-router-dom";
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

export default Description;