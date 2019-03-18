import React, {Component}from 'react';
import './table.css'
import { Link }from "react-router-dom";
import Rater from 'react-rater'
import 'react-rater/lib/react-rater.css'


class Table extends Component{

  constructor(props){
    super(props);
    this.renderMovies = this.renderMovies.bind(this)
    this.delete = this.delete.bind(this);
    this.state = {id: '', search: ''}
    this.search = this.search.bind(this)
  }

  delete(e){
   const id = e.target.dataset.id;
   this.props.onDelete(id)
  }



  renderMovies(obj){
    
    let rating = parseFloat(obj.rating).toFixed(1);
    return (
      
      <tr key={obj.id}>
        <td><Link to={"/description/" + obj.id} className="tableLinks">{obj.title}</Link></td>
        <td>{obj.director}</td>
        <td><Rater total={5} interactive={false} rating={Number(rating)}/> ({rating})</td>
        <td><Link to={"/edit/" + obj.id}><button className="delAndEdit">Edit</button></Link></td>
        <td><button className="delAndEdit" data-id={obj.id} onClick={this.delete}>Delete</button></td>
      </tr>
    )

  }
  
  search(e){
    this.setState({search: e.target.value})
    
  }

  render(){

    const data = this.props.data
    
    const filter = data.filter((x) => { 
      return (
        x.title.toLowerCase().includes(this.state.search.toLowerCase()) ||
        x.director.toLowerCase().includes(this.state.search.toLowerCase())
      )
       
    })
    
    
    let toRender = filter.map(this.renderMovies)
    if(toRender.length === 0){
      toRender = 
     
        <tr>
        <td colSpan='5'>Could not find any movies</td>
        </tr>
      
    }
  
    //console.log(data);
    return(
      <>
      <input id="searchField" type="text" placeholder="search" onChange={this.search}></input>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Director</th>
              <th>Rating</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {toRender}
          </tbody>
          
        </table>
        
      </>
    );
  };

  }

export default Table;


