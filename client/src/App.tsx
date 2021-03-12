import React from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import Login from "./views/auth/Login";
import Signup from "./views/auth/Signup";
import Chat from "./views/chat/Chat";
import Home from "./views/Home";

function App() {
  return (
    <div className="h-screen">
      <Router>
        <Switch>
          <Route path="/chat" component={() => <Chat />} />
          <Route
            exact
            path="/"
            component={() => (
              <div className="flex h-screen justify-center items-center flex-col">
                <h1 className="text-4xl">Admin Page</h1>
                <h2 className="text-2xl">Locations</h2>
                <Link to="/" className="underline text-blue-400 mr-3">
                  Homepage
                </Link>
                <Link to="/chat" className="underline text-blue-400">
                  Chat
                </Link>
                <Link to="/auth/login" className="underline text-blue-400">
                  Login
                </Link>
                <Link to="/auth/signup" className="underline text-blue-400">
                  Signup
                </Link>
              </div>
            )}
          />
          <Route exact path="/auth/login" component={() => <Login />} />
          <Route exact path="/auth/signup" component={() => <Signup />} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
