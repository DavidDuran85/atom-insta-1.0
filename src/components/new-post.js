import React, { Component } from 'react'
import Modal from './modal'

class NewPost extends Component {
    constructor(props){
        super(props)
        this.state ={
            classNameModal: ''
        }   
     }
     showmodal = () => {
        this.setState({
            classNameModal: 'is-active'
        })
     }
     handleClose = () => {
         this.setState({
             classNameModal: ''
         })
     }
    render() {
        let {
            classNameModal
        } = this.state
        return (
            <div>
                <Modal 
                    title="Nuevo post"
                    onClose={this.handleClose}
                    className={classNameModal}>
                    Hola
                </Modal>
                <button className="button is-danger" onClick={this.showmodal}>
                    Nuevo Post
                </button>
            </div>
        )
    }
}

export default NewPost