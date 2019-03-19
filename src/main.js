import React, { Component } from 'react';
import axios from 'axios';
import Table from './table.js'

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

export default Main;