import React, { Component } from 'react'
import Modal from './modal'
import firebase from 'firebase'
import LoadingBar from 'react-top-loading-bar'
import { toast } from 'react-toastify'
import uuid from 'uuid/v1'
import store from '../tree'

class Post extends Component {
  constructor(props) {
    super(props)
    this.state = {
      classNameModal: '',
      errorForm: false,
      formData: {
        content: '',
        image: ''
      },
      progressUpload: 0,
      posts: [],
      loading: false
    }
  }

  handleModal = (classNameModal) => {
    this.setState({
      classNameModal
    })
  }
  handleChange = (e) => {
    let {
      formData
    } = this.state
    let {
      target
    } = e
    if (target.type === "file") {
      formData[target.name] = target.files[0]
    } else {
      formData[target.name] = target.value
    }

    this.setState({
      formData,
      errorForm: false
    })
  }
  handleSubmit = (e) => {
    e.preventDefault()
    let {
      formData
    } = this.state
    if (formData.content && formData.image) {
      //lamar subida de archivo
      this.setState({
        loading: true
      }, this.handleUploadImage)
    } else {
      this.setState({
        errorForm: true
      })
    }
  }

  handleUploadImage = () => {
    //subida del archivo y obtener URL
    let {
      formData
    } = this.state
    let name = `${uuid()}-${formData.image.name}`
    //let name = `${new Date().toDateString()}-${formData.image.name}`
    let refStorage = firebase.storage().ref(`/photos/${name}`)
    let task = refStorage.put(formData.image)

    task.on('state_changed', (snapshot) => {
      let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      //this.handleCancelUpload() // cancelar carga de imagen
      //task.cancel()
      this.setState({
        progressUpload: percentage < 20 ? 20 : percentage
      })
    }, (error) => {
      this.setState({
        loading: false
      })
      console.log(error)
      toast.error(`Error: ${error.message}`, {
        position: toast.POSITION.TOP_RIGHT
      });
      this.restartProgressBar()
    }, () => {
      task.snapshot.ref.getDownloadURL().then((url) => {
        console.log(url)
        this.handleCreatePost(url)
      })
    })
  }
  handleCreatePost = (url) => {
    //crear post con la url
    let {
      formData: { content },
      loading
    } = this.state
    let posts = firebase.database().ref('posts')
    let newpost = posts.push()
    let userInfo = store.get("user")
    newpost.set({
      content,
      photoUrl: url,
      createdAt: new Date().toJSON(),
      authorId: userInfo.userId
    })
    this.setState({
      classNameModal: '',
      loading: false,
      formData: {
        content: '',
        image: ''
      }
    })
    toast.success("Se creo el Post!", {
      position: toast.POSITION.TOP_RIGHT
    });
  }
  render() {
    let {
      classNameModal,
      formData,
      progressUpload,
      errorForm,
      loading
    } = this.state
    return (
      <div>
        <button className="button is-success"
          onClick={() => this.handleModal('is-active')}>
          Nuevo Post
                </button>
        <LoadingBar
          progress={progressUpload}
          color="orange"
          onLoaderFinished={this.restartProgressBar} />
        <Modal
          className={classNameModal}
          onClose={() => this.handleModal('')}
          title="Nuevo post">
          {
            errorForm && (<div className="notification is-danger">
              Completa los campos del formulario.
                        </div>)
          }
          <form
            onSubmit={this.handleSubmit}
          >
            <div className="field">
              <label className="label">
                Titulo
                            </label>
              <div className="control">
                <input
                  type="text"
                  value={formData.content}
                  onChange={this.handleChange}
                  name="content"
                  className="input is-info" />
              </div>
            </div>
            <div className="field">
              <div className="file">
                <label className="file-label">
                  <input
                    className="file-input"
                    type="file"
                    name="image"
                    onChange={this.handleChange} />
                  <span className="file-cta" >
                    <span className="file-icon" >
                      <i className="fas fa-upload"></i>
                    </span>
                    {
                      formData.image ? (<span>
                        {
                          formData.image.name
                        }
                      </span>) : (<span className="file-label">
                        Elige un archivo…
                                        </span>)
                    }

                  </span>
                </label>
              </div>
            </div>
            {
              loading ? (<div>
                Cargando...
                            </div>) : (<div className="columns">
                  <div className="column">
                    <div className="buttons">
                      <button
                        type="button"
                        onClick={
                          () => this.handleModal('')
                        }
                        className="button is-danger">
                        Cancelar
                                                </button>
                      <button
                        type="submit"
                        className="button is-success">
                        Publicar
                                                </button>
                    </div>
                  </div>
                </div>)
            }
          </form>
        </Modal>
      </div>
    )
  }
}

export default Post