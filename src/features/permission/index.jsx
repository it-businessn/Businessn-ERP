import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import { MemberTable } from "features/user/user-list/MemberTable";
import { DashboardLayout, ProfileContainer } from "layouts";
import { useEffect, useState } from "react";
import * as api from "services";
import { CustomSelect } from "../configuration/CustomSelect";
import { Option } from "../configuration/Option";
import SwitchMenu from "../configuration/SwitchMenu";

export default function Permission() {
  const [settingOptions, setSettingOptions] = useState(null);
  const [roleConfigurationMenu, setRoleConfigurationMenu] = useState([]);
  const [users, setUsers] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedApprover, setSelectedApprover] = useState(null);
  const [rolePermission, setRolePermission] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [approverConfigurationMenu, setApproverConfigurationMenu] =
    useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchConfigurationOptions = async () => {
    let roleList = await api.getConfigurationsByName("role");
    let approverList = await api.getConfigurationsByName("approver");
    let permissionList = await api.getConfigurationsByName("permission");
    setRoleConfigurationMenu(roleList.data);
    setApproverConfigurationMenu(approverList.data);
    setSettingOptions(permissionList.data);
    setRolePermission(permissionList.data.items);
    setIsLoaded(true);
  };

  useEffect(() => {
    fetchConfigurationOptions();
    return () => console.log("cleared");
  }, []);

  const handleChange = async (role) => {
    setSelectedRole(role);
    let permissionLength = roleConfigurationMenu.items.find(
      (item) => item.name === role
    ).permissions;
    if (permissionLength.length > 0) {
      setSettingOptions(permissionLength);
    }
    const queryParams = new URLSearchParams({ role });
    const allUsers = await api.getUserByRole(queryParams, user.token);
    allUsers?.data?.map((user) => user.firstName + " " + user.lastName);
    setUsers(allUsers.data);
  };
  const handleChangeApprover = async (approver) => {
    setSelectedApprover(approver);
  };
  const handleSubmit = async () => {
    const values = {
      selectedRole,
      selectedApprover,
      rolePermission,
    };
    let allUsers = await api.updateUserRole(
      roleConfigurationMenu._id,
      values,
      user.token
    );
    setUsers(allUsers.data);
  };
  const addRolePermission = (action, active) => {
    action.isActive = active;
    let updateItemIndex = rolePermission.findIndex(
      (item) => item.name === action.name
    );
    rolePermission[updateItemIndex].isActive = active;
    setRolePermission(rolePermission);
  };

  return (
    <DashboardLayout>
      <ProfileContainer>
        <Stack spacing={6}>
          <Flex>
            <Heading size="xs">Manage Permissions</Heading>
            <Spacer />
            {/* <Button onClick={handleSubmit}>Update</Button> */}
          </Flex>
          {isLoaded && (
            <>
              <FormControl id="role">
                <FormLabel>Role</FormLabel>
                <CustomSelect
                  name="Role Type"
                  onChange={handleChange}
                  placeholder="Select Role "
                >
                  {roleConfigurationMenu &&
                    roleConfigurationMenu?.items?.map((role) => (
                      <Option key={role._id} value={role.name}>
                        <HStack>
                          <Text>{role.name}</Text>
                        </HStack>
                      </Option>
                    ))}
                </CustomSelect>
                {users && (
                  <Button
                    variant={"link"}
                    onClick={() => setShowTable(!showTable)}
                  >
                    View/Hide Users
                  </Button>
                )}
              </FormControl>
              {showTable && <MemberTable employees={users} />}
              <FormControl id="approver">
                <FormLabel>Approver</FormLabel>
                <CustomSelect
                  name="Approver"
                  onChange={handleChangeApprover}
                  placeholder="Select Approver"
                >
                  {approverConfigurationMenu &&
                    approverConfigurationMenu?.items?.map((approver) => (
                      <Option key={approver._id} value={approver.name}>
                        <HStack>
                          <Text>{approver.name}</Text>
                        </HStack>
                      </Option>
                    ))}
                </CustomSelect>
              </FormControl>
              <FormControl id="permission">
                <FormLabel>Assign/Revoke Permissions</FormLabel>
                {settingOptions && !settingOptions?.items
                  ? settingOptions?.map((action) => (
                      <SwitchMenu
                        action={action}
                        key={action.name}
                        handleSwitch={addRolePermission}
                      />
                    ))
                  : settingOptions?.items?.map((action) => (
                      <SwitchMenu
                        action={action}
                        key={action.name}
                        handleSwitch={addRolePermission}
                      />
                    ))}
              </FormControl>
            </>
          )}
        </Stack>
      </ProfileContainer>
    </DashboardLayout>
  );
}
