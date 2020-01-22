import React, { Component } from 'react'
import firebase from 'firebase'
import LoadingBar from 'react-top-loading-bar'
import { toast } from 'react-toastify'
import Post from '../components/post'
import PostCard from '../components/post-card'

//let task
class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      posts: []
    }
  }
  componentDidMount = () => {
    let postsRef = firebase.database().ref('posts')
    postsRef.on('value', (snapshot) => {
      let posts = snapshot.val()
      //console.log('posts',posts)
      let newPosts = []
      for (let post in posts) {
        //console.log(post)
        newPosts.push({
          id: post,
          content: posts[post].content,
          photoUrl: posts[post].photoUrl,
          authorId: posts[post].authorId,
          createdAt: posts[post].createdAt,
        })
      }
      this.setState({
        posts: newPosts
      })
    })
  }

  render() {
    let {
      posts
    } = this.state
    return (<div>
      Insta Atom
        <Post />
      <div className="columns">
        <div className="column is-half is-offset-one-quarter">
          {
            posts.map((p, i) => {
              return (
                <PostCard
                  post={p}
                  key={i}
                />
              )
            })
          }
        </div>
      </div>


    </div>)
  }
}

export default Home;