import React from "react";
import {
  Box,
  Input,
  Text,
  Button,
  FormControl,
  FormErrorMessage,
  Grid,
  Center,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useMutation, gql } from "@apollo/client";
import { useForm } from "react-hook-form";
import { setAccessToken } from "../../../AccessToken";
import { useHistory } from "react-router-dom";

import { GoogleLogin } from "react-google-login";
import FacebookLogin from "react-facebook-login";
import TwitterLogin from "react-twitter-login";

const LOGIN_USER = gql`
  mutation LoginUser($username: String!, $password: String!) {
    loginUser(username: $username, password: $password) {
      accessToken
      user {
        username
      }
    }
  }
`;

interface LoginProps {
  setRefresh: (refresh: boolean) => void;
}

export const Login: React.FC<LoginProps> = ({ setRefresh }) => {
  const [loginUser] = useMutation(LOGIN_USER);
  const { handleSubmit, errors, register, formState } = useForm();
  const history = useHistory();

  function validateUsername(value: string) {
    if (!value) {
      return "Username is required";
    } else if (value.length < 8) {
      return "Your username is too short. (6 characters min)";
    } else return true;
  }

  function validatePassword(value: string) {
    if (!value) {
      return "Password is required";
    } else if (value.length < 8) {
      return "Your password is too short. (8 characters min)";
    } else return true;
  }

  const onSubmit = async (values: { username: string; password: string }) => {
    const response = await loginUser({
      variables: { username: values.username, password: values.password },
    });
    console.log("response", response);
    if (response?.data) {
      setAccessToken(response?.data?.loginUser.accessToken);
      setRefresh(true);
      history.push("/");
    }
  };

  const responseGoogle = (response: any) => {
    console.log("random", response);
  };

  const responseFacebook = (response: any) => {
    console.log(response);
  };

  const authHandler = (err: any, data: any) => {
    console.log(err, data);
  };

  return (
    <Box mx="auto" w="70%" textAlign="center" pt={5}>
      <Text fontSize={25} pb={5}>
        Login Form
      </Text>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box w="30%" textAlign="center" mx="auto">
          <FormControl isInvalid={errors.username}>
            <Input
              mb={errors.username ? 0 : 5}
              placeholder="Username"
              name="username"
              type="text"
              ref={register({ validate: validateUsername })}
            />
            <FormErrorMessage mb={2}>
              {errors.username && errors.username.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.password}>
            <Input
              mb={errors.password ? 0 : 5}
              name="password"
              placeholder="Password"
              type="password"
              ref={register({ validate: validatePassword })}
            />
            <FormErrorMessage mb={2}>
              {errors.password && errors.password.message}
            </FormErrorMessage>
          </FormControl>
          <Box mb={5}>
            <Button
              mr={5}
              ml="30%"
              bgColor="blue.100"
              type="submit"
              isLoading={formState.isSubmitting}
            >
              Login
            </Button>
            <Button
              as={Link}
              variant="outline"
              bgColor="green.100"
              to="/register"
            >
              Register
            </Button>
          </Box>
        </Box>
      </form>
      <Grid w="30%" textAlign="center" mx="auto" gap={2}>
        <Center>
          <GoogleLogin
            clientId="141790828939-vlrtavg5q2s5tqf4nd78rp3tttg89rf4.apps.googleusercontent.com"
            buttonText="Log in with Google"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy={"single_host_origin"}
            theme="dark"
            uxMode="redirect"
          />
        </Center>
        <Center>
          <FacebookLogin
            appId="175071541477673"
            fields="name,email,picture"
            onClick={responseFacebook}
            callback={responseFacebook}
            textButton="Log in with Facebook"
          />
        </Center>
        <Center>
          <TwitterLogin
            authCallback={authHandler}
            consumerKey={"test"}
            consumerSecret={"test"}
            buttonTheme="dark"
          />
        </Center>
      </Grid>
    </Box>
  );
};
