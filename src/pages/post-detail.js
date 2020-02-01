import React, { Component } from 'react'
import PostCard from '../components/post-card'
import firebase from 'firebase'
import CommentDetail from '../components/comment-detail'
import { validateUser } from '../validate-user'
class PostDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      post: null,
      loading: true,
      comments:[]
    }
  }
  componentDidMount = () => {
    validateUser()
    this.loadDetail()
    this.loadComments()
  }
  loadDetail = () => {
    const {
      match: {
        params: {
          id
        }
      }
    } = this.props
    console.info(id)
    let postRef = firebase.database().ref(`posts/${id}`)
    postRef.once('value', (snapshot) => {
      console.info(snapshot.val())
      this.setState({
        post: {
           ...snapshot.val(),
           id:id
        },
        loading: false
      })
    })
  }
  loadComments = () => {
    const {
      match: {
        params: {
          id
        }
      }
    } = this.props
    console.info(id)
    let commentRef = firebase.database().ref(`postComments/${id}`)
    commentRef.on('value', (snapshot) => {
      const comments = snapshot.val()
      let newComments = []
      for( let comment in comments){
        newComments.push({
          id:comment,
          content: comments[comment].content,
          createAt: comments[comment].createAt,
          userId: comments[comment].userId
        })
      }
      this.setState({
        comments:newComments
      })
    })
  }
  render() {
    let {
      loading,
      post,
      comments
    } = this.state
    console.log(post)
    if (loading) {
      return (<div className="is-vertical-center"
                style={{
                  height: '100vh',
                  background: 'gray'
                }}>
              <p className="has-text-centered cursive-font">
                Cargando
              </p>
      </div>
      )
    }
    return (<div className="columns">
      <div className="column">
        <PostCard 
          post={post}
          readOnly={true}/>
      </div>
      <div className="column">
        <div className="card">
          <div className="card-header">
            <p className="card-header-title">
              Comentarios
            </p>
          </div>
          <div className="card-content">
          {
            comments.length > 0 ? (
              <React.Fragment>
                {
                  comments.map(comment =>  <CommentDetail  comment={comment} key={comment.id}/>)
                }
              </React.Fragment>
            ): (<div>
                Escribe un comentario
              </div>
              )
          }
          </div>
        </div>
      </div>
      
    </div>)
  }
}
export default PostDetail