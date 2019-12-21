import React, { Component } from 'react'
import NavBar from './navbar'
import { ToastContainer, toast } from 'react-toastify'

class Layout extends Component{
    render(){
        return(
            <div>
                <ToastContainer />
                <NavBar/>
                <div className="container">
                    <div className="section">
                    {
                        this.props.children
                    }
                    </div>
                </div>
                
            </div>
        )
    }
}

export default Layout