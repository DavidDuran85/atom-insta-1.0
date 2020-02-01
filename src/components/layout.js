import React, { Component } from 'react'
import NavBar from './navbar'
import { ToastContainer, toast } from 'react-toastify'

class Layout extends Component{
	
	render(){
			let {
				children
			} = this.props
			return(
					<div>
							<ToastContainer />
							<NavBar />
							<div className="container">
									<div className="section">
											{
												children
											}
									</div>
							</div>
					</div>
			)
	}
}

export default Layout
