import { useState } from "react";
import * as api from "services";
import { useAuthContext } from "./useAuthContext";

export const useVerifyEmailOTP = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [message, setMessage] = useState(null);

  const { dispatch } = useAuthContext();

  const verifyEmailOTP = async (values) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.verifyUser(values);

      const json = response.data;
      if (response.status === 200) {
        dispatch({ type: "LOGIN", payload: json });

        setIsLoading(false);
        setMessage(json.message);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setError(error.response.data.error);
    }
  };

  return { verifyEmailOTP, isLoading, error, message };
};
