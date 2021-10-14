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

function ProtectedRoute({ component: Component, ...restOfProps }) {
  const token = localStorage.getItem("authToken");

  return (
    <Route
      {...restOfProps}
      render={(props) =>
        token ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Nav />
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/forgotPassword" component={ForgotPass} />

          <ProtectedRoute path="/private" component={Private} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
