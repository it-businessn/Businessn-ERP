import { useState } from "react";
import api from "services";
import { useAuthContext } from "./useAuthContext";

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const { dispatch } = useAuthContext();

  const login = async (values) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.signIn(values);
      const json = response.data;
      if (response.status === 200) {
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

  return { login, isLoading, error };
};
