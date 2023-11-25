import { PhoneIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Stack,
} from "@chakra-ui/react";

import { Field, Form, FormikProvider, useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "services";

function PersonalInfoCard({ initialValues, schema, formSubmit, formFields }) {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues,
    validationSchema: schema,
    onSubmit: (formValues) => {
      try {
        formSubmit(formValues);
      } catch (error) {
        console.log(error);
      }
    },
  });
  useEffect(() => {
    const fetchConfigurationOptionsByDepartment = async (key) => {
      let configuration = await api.getConfigurationsByName(key);

      configuration.data.items.forEach((department) =>
        setDepartment((prev) => [...prev, department.name])
      );
    };
    const fetchConfigurationOptionsByRole = async (key) => {
      let configuration = await api.getConfigurationsByName(key);

      configuration.data.items.forEach((role) =>
        setUserRole((prev) => [...prev, role.name])
      );
    };
    fetchConfigurationOptionsByDepartment("department");
    fetchConfigurationOptionsByRole("role");
  }, []);
  const [userRole, setUserRole] = useState([]);
  const [departments, setDepartment] = useState([]);
  return (
    <FormikProvider value={formik}>
      <Form>
        <Stack>
          <Stack
            spacing="9"
            direction={{
              base: "column",
              md: "row",
            }}
          >
            <Field name="firstName" key="firstName">
              {({ field, form }) => (
                <FormControl id="firstName">
                  <FormLabel>First Name</FormLabel>
                  <Input {...field} />
                </FormControl>
              )}
            </Field>
            <Field name="middleName" key="middleName">
              {({ field, form }) => (
                <FormControl id="middleName">
                  <FormLabel>Middle Name</FormLabel>
                  <Input {...field} />
                </FormControl>
              )}
            </Field>
            <Field name="lastName" key="lastName">
              {({ field, form }) => (
                <FormControl id="lastName">
                  <FormLabel>Last Name</FormLabel>
                  <Input {...field} />
                </FormControl>
              )}
            </Field>
          </Stack>
          <Stack
            spacing="6"
            direction={{
              base: "column",
              md: "row",
            }}
          >
            <Field name="role" key="role">
              {({ field, form }) => (
                <FormControl id="role">
                  <FormLabel>Role</FormLabel>
                  <Select {...field}>
                    {userRole.length &&
                      userRole.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                  </Select>
                </FormControl>
              )}
            </Field>
            <Field name="department" key="department">
              {({ field, form }) => (
                <FormControl id="department">
                  <FormLabel>Department</FormLabel>
                  <Select {...field}>
                    {departments.length &&
                      departments.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                  </Select>
                </FormControl>
              )}
            </Field>
          </Stack>
          <Stack
            spacing="6"
            direction={{
              base: "column",
              md: "row",
            }}
          >
            <Field name="phoneNumber" key="phoneNumber">
              {({ field, form }) => (
                <FormControl id="phoneNumber">
                  <FormLabel>Phone Number</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <PhoneIcon color="gray.300" />
                    </InputLeftElement>
                    <Input type="tel" placeholder="Phone number" {...field} />
                  </InputGroup>
                </FormControl>
              )}
            </Field>
            <Field name="annualSalary" key="annualSalary">
              {({ field, form }) => (
                <FormControl id="annualSalary">
                  <FormLabel>Annual Salary</FormLabel>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      color="gray.300"
                      fontSize="1.2em"
                      children="$"
                    />
                    <Input {...field} />
                  </InputGroup>
                </FormControl>
              )}
            </Field>
          </Stack>
          {/* <Field name="streetNumber" key="streetNumber">
            {({ field, form }) => (
              <FormControl id="streetNumber">
                <FormLabel>Street</FormLabel>
                <Input {...field} />
              </FormControl>
            )}
          </Field>
          <Stack
            spacing="6"
            direction={{
              base: "column",
              md: "row",
            }}
          >
            <Field name="city" key="city">
              {({ field, form }) => (
                <FormControl id="city">
                  <FormLabel>City</FormLabel>
                  <Input {...field} />
                </FormControl>
              )}
            </Field>
            <Field name="state" key="state">
              {({ field, form }) => (
                <FormControl id="state">
                  <FormLabel>State / Province</FormLabel>
                  <Input {...field} />
                </FormControl>
              )}
            </Field>
          </Stack>
          <Stack
            spacing="6"
            direction={{
              base: "column",
              md: "row",
            }}
          >
            <Field name="postalCode" key="postalCode">
              {({ field, form }) => (
                <FormControl id="postalCode">
                  <FormLabel>ZIP/ Postal Code</FormLabel>
                  <Input {...field} />
                </FormControl>
              )}
            </Field>
            <Field name="country" key="country">
              {({ field, form }) => (
                <FormControl id="country">
                  <FormLabel>Country</FormLabel>
                  <Input {...field} />
                </FormControl>
              )}
            </Field>
          </Stack> */}
        </Stack>
        <Flex py="4" justifyContent="end">
          <Button type="submit" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          &nbsp;
          <Button type="submit" variant="primary">
            Save
          </Button>
        </Flex>
      </Form>
    </FormikProvider>
  );
}

export default PersonalInfoCard;
