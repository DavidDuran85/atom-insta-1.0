import React, { Component } from 'react';
import firebase from 'firebase'
import Moment from 'react-moment'
import 'moment/locale/es';

class CommentsPost extends Component {
  constructor(props){
    super(props)
    this.state={
      author: '',
      loading: true
    }
  }
  componentDidMount = () =>{
    this.loadAuthor()
  }
  loadAuthor = () => {
    let {
      comentario
    } = this.props
    let authorRef = firebase.database().ref(`users/${comentario.userID}`)
    authorRef.once('value', (snapshot) => {
      this.setState({
        author: snapshot.val(),
        loading: false
      })
    })
  }
  render() {
    let {
      comentario
    } = this.props
    let {
      author
    } = this.state
    console.log(comentario)
    return (
      <>
      {
        !author.userID && (
          <div className="media card-content-padding">
            <div className="media-left">
              <figure className="image card-image-comment">
                <img className="is-rounded" src={author.photoURL} />
              </figure>
            </div> 
          
          <div className="media-content">
            <p className="subtitle is-size-7 has-text-link">{author.displayName} <h6 className="subtitle is-size-7 has-text-grey-darker">{comentario.content} <Moment fromNow>{comentario.createdAt}</Moment></h6></p>
            
          </div>
          </div> )
      }
      </>
    )
  }
}

export default CommentsPost;

/*
<div className="content">
        {/* <div className="media">
          <div className="media-left">
            <figure className="image is-48X48">
              <img className="is-rounded" src={author.photoURL} />
            </figure>
          </div> 
*/