import React from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import Chat from "./views/Chat";

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
                <h1 className="text-4xl">Locations</h1>
                <Link to="/" className="underline text-blue-400 mr-3">
                  Homepages
                </Link>
                <Link to="/chat" className="underline text-blue-400">
                  Chat
                </Link>
              </div>
            )}
          />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
