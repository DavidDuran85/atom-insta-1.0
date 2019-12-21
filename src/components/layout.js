import React, { Component } from 'react'
import NavBar from './navbar'

class Layout extends Component{
    render(){
        return(
            <div>
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