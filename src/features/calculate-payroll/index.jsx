import {
  Button,
  Flex,
  Heading,
  Spacer,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { DashboardLayout, ProfileContainer } from "layouts";
import { useEffect, useState } from "react";
import * as api from "services";
import PayrollTable from "./PayrollTable";
import { TOAST } from "config/constant";

function PayrollSummary() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [data, setData] = useState(null);
  const fetchPayrollList = async (token) => {
    let response = await api.getPayrollData(token);
    setData(response.data);
  };
  const toast = useToast();
  useEffect(() => {
    fetchPayrollList(user?.token);
  }, []);
  console.log(user);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateData = await api.processPayroll(data, user.token);
      if (updateData.statusText === "OK") {
        toast({
          title: "Payroll processed successfully",
          status: "success",
          isClosable: true,
        });
      }
    } catch (error) {
      toast(TOAST.ERROR);
      // setError(error.response.data.error);
      console.log(error);
    }
  };
  return (
    <DashboardLayout>
      <ProfileContainer>
        <Stack>
          <Flex>
            <Heading size="xs">Payroll Summary</Heading>
            <Spacer />
            <Button onClick={handleSubmit}>Process Payroll</Button>
          </Flex>

          {data && <PayrollTable user={user?.user} payrolls={data} />}
        </Stack>
      </ProfileContainer>
    </DashboardLayout>
  );
}

export default PayrollSummary;
