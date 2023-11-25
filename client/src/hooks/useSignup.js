import { useState } from "react";
import api from "services";
import { useAuthContext } from "./useAuthContext";

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const signup = async (values) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.signUp(values);
      const json = response.data;
      if (response.status === 200) {
        localStorage.setItem("user", JSON.stringify(json));

        dispatch({ type: "LOGIN", payload: json });

        // update loading state
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setError(error.response.data.error);
    }
  };

  return { signup, isLoading, error };
};
