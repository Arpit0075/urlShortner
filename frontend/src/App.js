import "./App.css";
import Nav from "./Nav";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import ForgotPass from "./ForgotPass";
import Private from "./Private";

let isLogged = false;
if (localStorage.getItem("authToken") !== null) {
  isLogged = true;
}
// console.log(localStorage.getItem("authToken"));
// console.log(isLogged);

function App() {
  return (
    <Router>
      <div className="App">
        <Nav />
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/forgotPassword" component={ForgotPass} />
          <Route path="/private">
            {isLogged ? <Private /> : <Redirect to="/" />}
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
