import React, { Component } from 'react';
import firebase from 'firebase'
import moment from 'moment'
import 'moment/locale/es'

class CommentDetail extends Component{
		state =({
			author: [],
			loading:true
		})
	componentDidMount =()  =>{
		this.loadAuthor()
	}
	loadAuthor =() => {
		let {
      comment
    } = this.props
    console.log(comment)
    let authorRef = firebase.database().ref(`users/${comment.userId}`)

    authorRef.once('value', (snapshot) => {
			console.log(snapshot.val())
      this.setState({
        author: snapshot.val(),
        loading: false
      })
	})
	console.log(this.state.author)
	}
	
	render () {
		let {
			comment
		} = this.props
		let{
			loading,
			author
		} = this.state
		if(loading){
			return <div />
		}
		return(
			<div className="media">
				<figure className="media-left">
					<p className="image is-64x64">
						{/* <img className="is-rounded" src={author.photoURL} /> */}
					
					</p>
				</figure>
				<div className="media-content">
					<p>
						{
							comment.content
						}
					</p>
					<small>
						{
							moment(comment.createdAt).fromNow().toString()
						}
					</small>
				</div>		
			</div>
		)
	}
}

export default CommentDetail