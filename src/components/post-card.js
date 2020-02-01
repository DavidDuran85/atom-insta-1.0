import React, { Component } from 'react'
import firebase from 'firebase'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import tree from '../tree'

class PostCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      author: null,
      loading: true,
      comment:'',
      user: tree.get("user"),
      disabled:false
    }
  }
  componentDidMount = () => {
    this.loadAuthor()
  }
  loadAuthor = () => {
    let {
      post
    } = this.props
    console.log(post)
    let authorRef = firebase.database().ref(`users/${post.authorId}`)

    authorRef.once('value', (snapshot) => {
      this.setState({
        author: snapshot.val(),
        loading: false
      })
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
      comment,
      user
    } = this.state
    const{
      post
    } = this.props
    if(comment){
      this.setState({
        disabled:true
      })
      let Comments = firebase.database().ref(`postComments/${post.id}`)
      let refComments = Comments.push()
      refComments.set({
        content: comment,
        userID: user.id,
        createdAt: new Date().toJSON()
      })
      this.setState({
        comment:'',
        placeholder:'Comentario enviado'
      }, () =>{
        this.setState({
          placeholder:'Escribe un comentario',
          disabled:false
        })
      }, 300)
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
      disabled
    } = this.state
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
      {
         <div className="card-footer">
          <form 
            onSubmit={this.handleSubmit}
            className="card-footer-item">
            <div className="field is-grouped fields-comments">
              <p className="control is-expanded">
                <input
                  value={comment}
                  className="input"
                  onChange={this.handleChange}
                  disabled={disabled}
                  placeholder="Escribe un comentario..."
                />
              </p>
              <p className="control">
                <button 
                  className="button is-info"
                  disabled={disabled}>
                  Enviar
                </button>
              </p>
            </div>
           
          </form>
        </div>
      }
    </div>)
  }
}

export default PostCard 
