import React from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import Chat from "./views/Chat";
import Home from "./views/Home";

function App() {
  return (
    <div className="h-screen">
      <Router>
        <Switch>
          <Route exact path="/chat" component={() => <Chat />} />
          <Route exact path="/" component={() => <Home />} />
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
