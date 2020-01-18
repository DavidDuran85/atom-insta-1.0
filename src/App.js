import React, { Component } from 'react';
import firebase from 'firebase'
import {
  BrowserRouter as Router, //Enrutador
  Switch, //navegacion entre rutas
  Route, //ruta
  Link //componente h-ref permite navegar entre paginas
} from 'react-router-dom';

//Baobab
import { root } from 'baobab-react/higher-order'
import store from './tree'

// css
import 'bulma/css/bulma.css';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

//Components
import Layout from './components/layout'

//pages
import Home from './pages/home'
import Login from './pages/login'
import PostDetail from './pages/post-detail'


let firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "atom-insta85.firebaseapp.com",
  databaseURL: "https://atom-insta85.firebaseio.com",
  projectId: "atom-insta85",
  storageBucket: "atom-insta85.appspot.com",
  messagingSenderId: "697486915007",
  appId: "1:697486915007:web:0b361eec96411631411d0a",
  measurementId: "G-84N4NF1504"
};

//console.log(firebaseConfig)
firebase.initializeApp(firebaseConfig)

class App extends Component{
  constructor(props){
    super(props)
  }
  
  render(){
    console.log(process.env)
    return (
        <Router>

          <Layout>
            <Switch>
              <Route 
                path="/" exact
                component={Login}
              />
              <Route 
                path="/home" exact
                component={Home}
              />
              <Route
               path="/post/:id"
               component={PostDetail}>

              </Route>
            </Switch>
          </Layout>
          
        </Router>
      )
  }
}

const RootedApp = root(store, App)

export default RootedApp;
