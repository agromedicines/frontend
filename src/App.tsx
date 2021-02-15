import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

import {ReactComponent as UserIcon} from './user.svg'
import {ReactComponent as DatabaseIcon} from './database.svg'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from 'react-router-dom'

import UserView from './components/UserView'
import AdminView from './components/AdminView'

function App() {
  const [activeTab, setActiveTab]: [string, any] = useState('user')


  return (
    <Router>
      <Redirect to="/user"/>
      <Switch>
        <Route path="/">
          <div className="container-fluid">
            <div className="row d-flex">
              <div className="menu d-flex flex-column align-items-center text-light">
                <Link to="/user" className={(activeTab === "user" ? "active" : "") + " p-2"} onClick={() => {setActiveTab('user')}}>
                  <UserIcon width="40" height="40" className="menu-icon" fill="#ffffff" />
                </Link>
                <Link to="/admin" className={(activeTab === "admin" ? "active" : "") + " p-2"} onClick={() => {setActiveTab('admin')}}>
                  <DatabaseIcon width="40" height="40" fill="#ffffff" />
                </Link>
              </div>
              <Route path="/user">
                <UserView />
              </Route>
              <Route path="/admin">
                <AdminView />
              </Route>
            </div>
          </div>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
