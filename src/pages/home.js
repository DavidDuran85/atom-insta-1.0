import React, { Component } from 'react'
import firebase from 'firebase'
import LoadingBar from 'react-top-loading-bar'
import { toast } from 'react-toastify'

//let task
class Home extends Component{
    constructor(props){
        super(props)
        this.state ={
            image: null,
            progressUpload: 0,
            posts: []
        }
    }
    componentDidMount = () => {
        let postsRef= firebase.database().ref('posts')
        postsRef.on('value', (snapshot) => {
            let posts = snapshot.val()
            console.log('posts',posts)
            let newPosts = []
            for( let post in posts){
                console.log(post)
                newPosts.push({
                    id:post,
                    content:posts[post].content,
                    photoUrl: posts[post].photoUrl,
                })
            }
            this.setState({
                posts: newPosts
            })
        })
    }


    handleChange = (e) => {
        //debugger
        let [image] = e.target.files
        this.setState({
            image:image
        })
        let name = `${new Date().toDateString()}-${image.name}`
        let refStorage = firebase.storage().ref(`/photos/${name}`)
        let task = refStorage.put(image)

        task.on('state_changed', (snapshot) =>{
            //debugger
            let percentage = (snapshot.bytesTransferred / snapshot.totalBytes ) * 100
            //this.handleCancelUpload() // cancelar carga de imagen
            //task.cancel()
            this.setState({
                progressUpload: percentage < 20 ? 20 : percentage
            })
        }, (error) =>{
            console.log(error)
            toast.error(`Error: ${error.message}`, {
                position: toast.POSITION.TOP_RIGHT
              });
              this.restartProgressBar()
        }, () => {
            task.snapshot.ref.getDownloadURL().then((url) => {
                toast.success("Carga completada!", {
                    position: toast.POSITION.TOP_RIGHT
                  });
                console.log(url)
            })
        })
    }
/*
    handleCancelUpload = () => {
        task.cancel()
    }*/
    restartProgressBar = () =>{
        this.setState({
            progressUpload:0
        })
    }
    addPost = () => {
        let posts= firebase.database().ref('posts')
        let newpost= posts.push()
        newpost.set({
            content: `Hola ${new Date().toDateString()}`,
            photoUrl: 'https://firebasestorage.googleapis.com/v0/b/atom-insta85.appspot.com/o/photos%2FSat%20Dec%2021%202019-flower.jpg?alt=media&token=0c378698-550f-4830-9c95-bf967a44efbd',
            createdAt: new Date().toJSON()
        })
    }
    render(){
    let {
        image,
        progressUpload,
        posts
    } = this.state
    return(<div>
        Insta Atom
        <LoadingBar 
            progress={progressUpload} 
            color="orange"
            onLoaderFinished={this.restartProgressBar} />
            <button onClick={this.addPost}>
                New post
            </button>
        <div className="file has-name">
            <label className="file-label">
                <input className="file-input" type="file" name="resume" onChange={this.handleChange}/>
                <span className="file-cta">
                    <span className="file-icon">
                        <i className="fas fa-upload"></i>
                    </span>
                    <span className="file-label">
                        Selecciona archivo…
                    </span>
                </span>
                {
                    image ? (<span className="file-name">
                    {image.name}
                    </span>) : null
                }
            </label>
        </div>
        <div className="columns is-multiline">
            {
                posts.map( l => {
                    return(
                        <div key={l.id} className="column is-4">
                            <img  src={l.photoUrl}/>
                        </div>
                    )
                })
            }
        </div>
        
        </div>)
    }
}

export default Home;