import React from "react";
import { Link, Route, Switch, BrowserRouter as Router } from "react-router-dom";
import Chat from "./chat";
import Login from "./auth/Login";
import Signup from "./auth/Signup";

export const Routes = () => {
  return (
    <Router>
      <Switch>
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
        <Route path="/chat" component={() => <Chat />} />
        <Route exact path="/auth/login" component={() => <Login />} />
        <Route exact path="/auth/signup" component={() => <Signup />} />
      </Switch>
    </Router>
  );
};
