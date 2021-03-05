import React from "react";
import ReactDOM from "react-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { TokenRefreshLink } from "apollo-link-token-refresh";
import jwtDecode, { JwtPayload } from "jwt-decode";
import App from "./App";
import { getAccessToken, setAccessToken } from "./AccessToken";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

const httpLink = createHttpLink({
  uri: "http://localhost:8080/graphql",
  credentials: "include",
});

const authLink = setContext((_, { headers }) => {
  const token = getAccessToken();

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const tokenRefreshLink = new TokenRefreshLink({
  accessTokenField: "accessToken",
  isTokenValidOrUndefined: () => {
    const token = getAccessToken();

    if (!token) {
      return true;
    }

    try {
      const { exp } = jwtDecode<JwtPayload>(token);
      console.log("exp", exp && Date.now() >= exp * 1000, exp);

      if (exp && Date.now() >= exp * 1000) {
        return false;
      } else {
        return true;
      }
    } catch (e) {
      console.log("Error here...");
      return false;
    }
  },
  fetchAccessToken: () => {
    return fetch("http://localhost:8080/refresh-token", {
      method: "POST",
      credentials: "include",
    });
  },
  handleFetch: (accessToken) => {
    console.log("kekekeke", accessToken);
    setAccessToken(accessToken);
  },
  handleError: (err) => {
    console.warn("Your refresh token is invalid. Try to relogin");
    console.log(err);
  },
});

const client = new ApolloClient({
  // For some reason Typescript doesn't agree with the tokenRefreshLink type here
  // @ts-ignore
  link: from([tokenRefreshLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});

const colors = {
  brand: {
    900: "#1a365d",
    800: "#153e75",
    700: "#d9d9d9",
  },
};
const theme = extendTheme({ colors });

ReactDOM.render(
  <ChakraProvider theme={theme}>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </ChakraProvider>,
  document.getElementById("root")
);
