import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Spacer,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";

import ConfigurationCard from "components/ConfigurationCard";
import { BENEFITS, DEDUCTIONS, USER_PERMISSIONS } from "config/constant";
import { Field, Form, Formik } from "formik";
import { useAuthContext } from "hooks/useAuthContext";
import { DashboardLayout, ProfileContainer } from "layouts";
import { useEffect, useState } from "react";
import * as api from "services";
import EditMenu from "./EditMenu";
import SwitchMenu from "./SwitchMenu";

const Settings = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalHeader, setModalHeader] = useState("");
  const [initialValues, setInitialValues] = useState(null);
  const [formFields, setFormFields] = useState(null);
  const [settingOptions, setSettingOptions] = useState(null);
  const [configurationId, setConfigurationId] = useState(null);
  const [isItemEdited, setIsItemEdited] = useState(false);
  const { user } = useAuthContext();
  const fetchConfigurationOptions = async () => {
    let configuration = await api.getConfigurations(user.token);
    let configurationMenu = configuration.data.filter(
      (data) =>
        data.key !== "permission" &&
        data.key !== "approver" &&
        data.key !== "role"
    );
    setSettingOptions(configurationMenu);
  };
  const [isUpdated, setIsUpdated] = useState(false);
  useEffect(() => {
    fetchConfigurationOptions();
    return () => console.log("cleared");
  }, [isUpdated]);
  const openModal = (id, config, title) => {
    setConfigurationId(id);
    setIsItemEdited(false);
    const keys = config.length
      ? Object.keys(config[0])
      : ["name", "description"];
    let initValue = {};
    for (const key of keys) {
      initValue[key] = key === "isActive" ? false : "";
    }
    setModalHeader(`Add ${title} `);
    setInitialValues(initValue);
    setFormFields([
      {
        type: "input",
        label: "Name",
        id: "name",
      },
      {
        type: "input",
        label: "Description",
        id: "description",
      },
      {
        type: "textarea",
        label: "Additional Information",
        id: "subtext",
      },
    ]);
    onOpen();
  };
  const addRecord = ({
    name,
    description,
    isActive,
    subtext = "",
    deductionAmount = "",
  }) => {
    let userIndex = settingOptions.findIndex((setting) =>
      setting.title.includes("User")
    );
    let benefitIndex = settingOptions.findIndex((setting) =>
      setting.title.includes("Benefit")
    );
    let deductionIndex = settingOptions.findIndex((setting) =>
      setting.title.includes("Deduction")
    );
    if (modalHeader.includes("User")) {
      settingOptions[userIndex].content = [
        ...USER_PERMISSIONS,
        {
          name,
          description,
          isActive: isActive === "false" ? false : true,
          subtext,
        },
      ].map((permission, id) => (
        <SwitchMenu action={permission} key={permission.name} />
      ));
    }

    if (modalHeader.includes("Benefit")) {
      settingOptions[benefitIndex].content = [
        ...BENEFITS,
        {
          name,
          description,
          isActive: isActive === "false" ? false : true,
        },
      ].map((benefit, id) => (
        <SwitchMenu action={benefit} key={benefit.name} />
      ));
    }
    if (modalHeader.includes("Deduction")) {
      settingOptions[deductionIndex].content = [
        ...DEDUCTIONS,
        {
          name,
          description,
          deductionAmount,
        },
      ].map((deduction) => (
        <EditMenu key={deduction.name} action={deduction} />
      ));
    }
  };
  /**
   * The function describes the implementation of separate user permission and generic configuration
   * settings, including the management of roles, approvers, permissions, and user-company relationships and permissions, as well as the addition
   * of a company collection for organizing user information.
   */
  const userstory_description_here = () => {
    let g = `
general config setting - system options/non-system or new user options provided by user

user cannot edit or delete system provided options> they can only add or edit their own created options. they can ask for delete the system option but that will only hide it from their saved setting but not delete from database so just show filtered list not remove the item completely-soft delete

deduction rule is system provided-user cannot change or delete anything here-they can only view

add new collection for company- so all information in the interface is data for a particular company, every user information of all modules should belong to one company, so add company collection where every user will belong to a companyID> companyref in the model.`;
  };
  const handleChange = async (itemName, id, title, isSoftDeleted = false) => {
    setIsItemEdited(true);
    setConfigurationId(id);
    if (!isSoftDeleted) {
      setModalHeader(`Add ${title} `);
      setInitialValues(itemName);
      setFormFields([
        {
          type: "input",
          label: "Name",
          id: "name",
        },
        {
          type: "input",
          label: "Description",
          id: "description",
        },
        {
          type: "textarea",
          label: "Additional Information",
          id: "subtext",
        },
      ]);
      onOpen();
    } else {
      itemName.isSoftDeleted = isSoftDeleted;
      updateConfigurationOptions(itemName);
    }
  };
  const updateConfigurationOptions = async (values) => {
    const updatedResult = await api.updateConfigurationItem(
      user.token,
      values,
      configurationId
    );
    setIsUpdated(updatedResult.statusText === "OK");
  };
  const handleSubmit = (values, actions) => {
    let configOptions = null;
    if (isItemEdited) {
      updateConfigurationOptions(values);
    } else {
      values.isSystemMenu = false;
      values.id = crypto.randomUUID();
      const addConfigurationOptions = async () => {
        configOptions = await api.addConfigurationItem(
          user.token,
          values,
          configurationId
        );
        setIsUpdated(configOptions.statusText === "OK");
      };
      addConfigurationOptions();
    }
    actions.setSubmitting(false);
    onClose();
  };
  return (
    <DashboardLayout>
      <ProfileContainer>
        <Stack>
          <Flex>
            <Heading size="xs">Configuration Settings</Heading>
            <Spacer />
            {/* <Button onClick={() => openModal("new")}>
              Add New Configuration
            </Button> */}
          </Flex>
          <Tabs isLazy size="md" isFitted>
            <TabList>
              {!settingOptions && <p>Loading...</p>}
              {settingOptions &&
                settingOptions.map((config) => (
                  <Tab key={`**7_8+${config.name}`}>{config.name}</Tab>
                ))}
            </TabList>

            <TabPanels>
              {!settingOptions && <p>Loading...</p>}
              {settingOptions &&
                settingOptions.map((setting) => (
                  <TabPanel key={setting.key}>
                    <ConfigurationCard
                      id={setting._id}
                      handleChange={handleChange}
                      title={setting.name}
                      description={setting.description}
                      onOpen={openModal}
                      content={setting.items}
                    />
                  </TabPanel>
                ))}
            </TabPanels>
          </Tabs>
        </Stack>
      </ProfileContainer>

      <Modal
        // initialFocusRef={initialRef}
        // finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{modalHeader}</ModalHeader>
          <ModalCloseButton />

          <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            {(props) => (
              <Form>
                <ModalBody pb={6}>
                  {formFields.map((formField) => {
                    switch (formField.type) {
                      case "input":
                        return (
                          <Field key={formField.label} name={formField.id}>
                            {({ field, form }) => (
                              <FormControl>
                                <FormLabel>{formField.label}</FormLabel>
                                <Input {...field} />
                              </FormControl>
                            )}
                          </Field>
                        );
                      case "textarea":
                        return (
                          <Field name={formField.id} key={formField.label}>
                            {({ field, form }) => (
                              <FormControl>
                                <FormLabel>{formField.label}</FormLabel>
                                <Textarea {...field} />
                              </FormControl>
                            )}
                          </Field>
                        );
                      case "radio":
                        return (
                          <Field name={formField.id} key={formField.label}>
                            {({ field, form }) => (
                              <FormControl
                              // isInvalid={
                              //     form.errors.name &&
                              //     form.touched.name
                              // }
                              >
                                <FormLabel>{formField.label}</FormLabel>
                                <RadioGroup defaultValue="false">
                                  <Stack spacing={5} direction="row">
                                    <Radio
                                      {...field}
                                      colorScheme="red"
                                      value="false"
                                    >
                                      No
                                    </Radio>
                                    <Radio
                                      {...field}
                                      colorScheme="green"
                                      value="true"
                                    >
                                      Yes
                                    </Radio>
                                  </Stack>
                                </RadioGroup>
                              </FormControl>
                            )}
                          </Field>
                        );
                      default:
                        return <></>;
                    }
                  })}
                </ModalBody>

                <ModalFooter>
                  <Button variant="outline" mr={3} onClick={onClose}>
                    Cancel
                  </Button>
                  <Button isLoading={props.isSubmitting} type="submit">
                    Save
                  </Button>
                </ModalFooter>
              </Form>
            )}
          </Formik>
        </ModalContent>
      </Modal>
    </DashboardLayout>
  );
};

export default Settings;
