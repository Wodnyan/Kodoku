import React from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import Login from "./views/auth/Login";
import Signup from "./views/auth/Signup";
import Chat from "./views/Chat";
import Home from "./views/Home";

function App() {
  return (
    <div className="h-screen">
      <Router>
        <Switch>
          <Route exact path="/chat" component={() => <Chat />} />
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
/* 0 is 241.18861389160156 
1 is 176.97003173828125 
2 is 179.90028381347656 
3 is 176.96905517578125 
4 is 174.83563232421875 
5 is 145.37539672851562 
6 is 194.4967041015625 
7 is 194.49600219726562 
8 is 107.56201171875 
9 is 107.56396484375 
10 is 176.97023010253906 
11 is 175.92355346679688 
12 is 194.49600219726562 
13 is 107.56201171875 
14 is 179.89852905273438 
15 is 142.90621948242188  */

export default App;
