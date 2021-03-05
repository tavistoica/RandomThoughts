import React from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import { Login } from "./authentication-page/components/Login";
import { Register } from "./authentication-page/components/Register";
import { Header } from "./header/Header";
import { MainPage } from "../views/MainPage";
import { ProfilePage } from "../views/ProfilePage";

interface RouterProps {
  refresh: boolean;
  setRefresh: (refresh: boolean) => void;
}

export const Router: React.FC<RouterProps> = ({ refresh, setRefresh }) => {
  return (
    <div>
      <BrowserRouter>
        <Header refresh={refresh} setRefresh={setRefresh} />
        <Switch>
          <Route exact path="/" component={MainPage} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/profile" component={ProfilePage} />
          <Route
            exact
            path="/login"
            component={() => <Login setRefresh={setRefresh} />}
          />
        </Switch>
      </BrowserRouter>
    </div>
  );
};
