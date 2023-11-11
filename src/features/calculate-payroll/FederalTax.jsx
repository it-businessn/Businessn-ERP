import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { useAuthContext } from "hooks/useAuthContext";
import { DashboardLayout, ProfileContainer } from "layouts";
import { useEffect, useState } from "react";
import { BsCalendar2Week } from "react-icons/bs";
import { Form } from "react-router-dom";
import * as api from "services";
import PayrollTable from "./PayrollTable";
import CalcPayroll from "./CalcPayroll";
import Loader from "features/Loader";

function FederalTaxSummary() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [data, setData] = useState(null);
  const [graph, setGraph] = useState(null);
  console.log(user);
  let deductions = [];
  let netSalary = [];
  let grossSalary = [];
  if (graph && graph.length) {
    graph.forEach((graphData) => {
      deductions.push(graphData.totalDeductions);
      netSalary.push(graphData.totalNetPay);
      grossSalary.push(graphData.totalGross);
    });
    deductions.unshift(34, 0, 0, 0, 0);
    netSalary.unshift(34, 0, 0, 0, 0);
    grossSalary.unshift(34, 0, 0, 0, 0);
  }

  const fetchFederalTaxByUser = async (userId, token) => {
    let response = await api.getFederalTaxById(userId, token);
    setData(response.data);
  };
  useEffect(() => {
    fetchFederalTaxByUser(user?.user?._id, user?.token);
  }, []);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [filter, setFilter] = useState(null);
  const [create, setCreate] = useState(null);
  const generatePayslip = () => {
    setCreate(true);
    onOpen();
  };
  const applyFilter = () => {
    setFilter(true);
    onOpen();
  };
  const dismiss = () => {
    setCreate(false);
    setFilter(false);
    onClose();
  };
  const [paySlipPeriodStartDate, setPaySlipPeriodStartDate] = useState(null);
  const [paySlipPeriodEndDate, setPaySlipPeriodEndDate] = useState(null);

  return (
    <DashboardLayout>
      <ProfileContainer>
        <Stack>
          <Heading size="xs">
            Payroll Summary
            <IconButton
              onClick={applyFilter}
              // icon={<FiFilter fontSize="1.5rem" />}
              variant="ghost"
              aria-label="Edit employee"
            />
          </Heading>
          {!data && <Loader />}

          {user && data && <CalcPayroll user={user?.user} record={data} />}
        </Stack>
      </ProfileContainer>
    </DashboardLayout>
  );
}

export default FederalTaxSummary;
