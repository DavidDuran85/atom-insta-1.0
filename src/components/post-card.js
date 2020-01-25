import React, { Component } from 'react'
import firebase from 'firebase'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import store from '../tree'
import CommentPost from './comments'
import Anime from 'react-anime'

class PostCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      author: null,
      loading: true,
      comment:'',
      commentPost: [],
      showanimate:false
    }
  }
  componentDidMount = () => {
    this.loadAuthor()
    this.loadComentario()
  }
  loadAuthor = () => {
    let {
      post
    } = this.props
    //console.log(post)
    let authorRef = firebase.database().ref(`users/${post.authorId}`)

    authorRef.once('value', (snapshot) => {
      this.setState({
        author: snapshot.val(),
        loading: false
      })
    })
  }
  loadComentario = () => {
    let {
      post
    } = this.props
    //console.log(post)
    let commentRef = firebase.database().ref(`postComments/${post.id}`)
    commentRef.on('value', (snapshot) => {
      let comments = snapshot.val()
      let newComents = []
      for( let comment in comments){
          console.log(comment)
          newComents.push({
              id:comment,
              content:comments[comment].content,
              createdAt: comments[comment].createdAt,
              userID: comments[comment].userID,
          })
      }
      
      this.setState({
        commentPost: newComents
      })
      //console.log(newComents)
      //console.log(this.state.commentPost)
    })
  }
  handleChange = (e) => {
    let{
      target
    } = e
    this.setState({
      comment: target.value
    })
  }
  handleSubmit = (e) => {
    e.preventDefault() //evitar que cambie de url
    const{
      comment
    } = this.state
    const{
      post
    } = this.props
    if(comment){
      let Comments = firebase.database().ref(`postComments/${post.id}`)
      let refCooments = Comments.push()
      let userInfo = store.get("user")
      refCooments.set({
        content: comment,
        userID: userInfo.userId,
        createdAt: new Date().toJSON()
      })
      this.setState({
        comment:'',
        showanimate: true
      },() => {
        setTimeout(() =>{
          this.setState({
            showanimate: false
          })
        }, 100)
      }
      )
      toast.success("Se envio el comentario!", {
          position: toast.POSITION.TOP_RIGHT
        });
    }
  }
  render() {
    let {
      post,
      readOnly
    } = this.props
    let {
      loading,
      author,
      comment,
      commentPost,
      showanimate
    } = this.state
    let animeProps= showanimate ?  {
      opacity: [0,1],
      translateY:[-64,0],
      delay: (el, i) => i * 100
    } : {

    }
    console.log(this.state)
    if (loading) {
      return <div>
        Cargando...
            </div>
    }
    return (<div className="section-card">
      <div className="card-header">
        <div className="card-header-title">
          <div className="media">
            <div className="media-left">
              <figure className="image is-48x48">
                <img className="is-rounded" src={author.photoURL} />
              </figure>
            </div>
            <div className="media-content">
              <p className="title is-4">{author.displayName}</p>
              <p className="subtitle is-6">@jonsmith</p>
            </div>
          </div>
        </div>
        <div className="card-header-icon">
            {
              !readOnly && (<Link to={`/post/${post.id}`}>
                  Ver Post
              </Link>)
            }
          </div>
      </div>
      {/* <div className="subtitle is-8">
        {post.content}
      </div> */}
      <div className="card-image">
        <figure className="image is-4by3">
          <img src={post.photoUrl} />
        </figure>
      </div>
      <div className="card-content card-content-padding ">
      <Anime {...animeProps} >
      {
        
        commentPost.map((p, i) => {
          return (
                
                <CommentPost
                  comentario={p}
                  key={i}
                />
            
          )
        })
      }
      </Anime>
      
      </div>
      {
        !readOnly && (<div className="card-footer">
          <form 
            onSubmit={this.handleSubmit}
            className="card-footer-item">
            <div className="field is-grouped fields-comments">
              <p className="control is-expanded">
                <input
                  value={comment}
                  className="input"
                  onChange={this.handleChange}
                  placeholder="Escribe un comentario..."
                />
              </p>
              <p className="control">
                <button className="button is-info">
                  Enviar
                </button>
              </p>
            </div>
           
          </form>
          
        </div>)
      }
    </div>)
  }
}

export default PostCard 

