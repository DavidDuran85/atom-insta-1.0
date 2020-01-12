import React, { Component } from 'react'
import firebase from 'firebase'

class PostCard extends Component{
    constructor(props){
        super(props)
        this.state = {
            author:null,
            loading:true
        }
    }
    componentDidMount = () => {
        this.loadAuthor()
    }
    loadAuthor = () => {
        let{
            post
        } = this.props
        let authorRef= firebase.database().ref(`users/${post.authorId}`)
        authorRef.once('value', (snapshot) => {
                this.setState({
                    author: snapshot.val(),
                    loading:false
            })
        })
    }
    render(){
        let{
            post
        } = this.props
        let{
            loading,
            author
        } = this.state
        if(loading){
            return <div>
                Cargando...
            </div>
        }
        return (<div className="card">
            <div className="card-header">
                <div className="card-header-title">
                { post.content}
                    <div className="media">
                        <div className="media-left">
                            <figure className= "image is 48x48">
                                <img className="is-rounded" src={author.photoURL} />
                            </figure>
                        </div>
                        <div className="media-content">
                            <p className="title is-4">{author.displayName}</p>
                            <p className="subtitle is-6">@jonsmith</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card-image">
                <figure className="image is-4by3">
                    <img src={ post.photoUrl} />
                </figure>
            </div>
            
        </div>)
    }
}

export default PostCard 
