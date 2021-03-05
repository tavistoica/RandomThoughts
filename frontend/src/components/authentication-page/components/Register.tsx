import React, { useState } from "react";
import {
  Box,
  Input,
  Text,
  Button,
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useMutation, gql } from "@apollo/client";
import { useForm } from "react-hook-form";

const REGISTER_USER = gql`
  mutation RegisterUser($username: String!, $password: String!) {
    registerUser(username: $username, password: $password)
  }
`;

export const Register: React.FC = () => {
  const [registerUser] = useMutation(REGISTER_USER);
  const [registerStatus, setRegisterStatus] = useState({
    success: true,
    message: "",
  });
  const { handleSubmit, errors, register, formState } = useForm();

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
    const response = await registerUser({
      variables: { username: values.username, password: values.password },
    });
    console.log("response", response);
    if (response.data.registerUser)
      setRegisterStatus({
        success: true,
        message: "Account succesfully created!",
      });
    else
      setRegisterStatus({
        success: false,
        message:
          "The selected username already exists. Please choose a new one.",
      });
  };

  return (
    <Box mx="auto" w="70%" textAlign="center" pt={5}>
      <Text fontSize={25} pb={5}>
        Register Form
      </Text>
      <Text color={registerStatus.success ? "green" : "red"} mb={2}>
        {registerStatus.message}
      </Text>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box w="30%" textAlign="center" mx="auto">
          <FormControl isInvalid={errors.username}>
            <Input
              mb={errors.username ? 0 : 5}
              name="username"
              placeholder="Username"
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
            <Box mb={5}>
              <Button
                variant="outline"
                bgColor="green.100"
                type="submit"
                isLoading={formState.isSubmitting}
              >
                Register
              </Button>
            </Box>
          </FormControl>
        </Box>
      </form>
    </Box>
  );
};
