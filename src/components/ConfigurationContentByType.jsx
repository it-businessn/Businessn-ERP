import { Text } from "@chakra-ui/react";
import { getPaymentIcons } from "config/formfields";
import {
  CheckboxCard,
  CheckboxCardGroup,
} from "features/configuration/CheckboxCardGroup";
import EditMenu from "features/configuration/EditMenu";
import {
  RadioCard,
  RadioCardGroup,
} from "features/configuration/RadioCardGroup";
import SwitchMenu from "features/configuration/SwitchMenu";

const ConfigurationContentByType = ({ name, content }) => {
  getPaymentIcons(name, content);
  switch (name) {
    case "User Permission":
    case "User Benefit":
      return content.map((action) => (
        <SwitchMenu action={action} key={action.name} />
      ));
    case "Attendance Status":
      return (
        <CheckboxCardGroup defaultValue={["Present", "Overtime"]} spacing="3">
          {content.map((option) => (
            <CheckboxCard key={option.name} value={option.name}>
              <Text color="emphasized" fontWeight="medium" fontSize="sm">
                {option.name}
              </Text>
              <Text color="muted" fontSize="sm">
                {option.description}
              </Text>
            </CheckboxCard>
          ))}
        </CheckboxCardGroup>
      );
    case "Leave Request Status":
      return (
        <RadioCardGroup defaultValue="one" spacing="3">
          {content.map((status) => (
            <RadioCard key={status.name} value={status.name}>
              <Text color="emphasized" fontWeight="medium" fontSize="sm">
                {status.name}
              </Text>
              <Text color="muted" fontSize="sm">
                {status.description}
              </Text>
            </RadioCard>
          ))}
        </RadioCardGroup>
      );
    // case "Payment Method":
    //     return (
    //         <FormControl id="colormode">
    //             <FormLabel>{name}</FormLabel>
    //             <CustomSelect
    //                 name="Payment Type"
    //                 // value={colorMode}
    //                 // onChange={setColorMode}
    //                 placeholder="Select payment type"
    //             >
    //                 {content.map((paymentType) => (
    //                     <Option
    //                         key={paymentType.name}
    //                         value={paymentType.name}
    //                     >
    //                         <HStack>
    //                             <Icon as={paymentType.icon} />
    //                             <Text>{paymentType.name}</Text>
    //                         </HStack>
    //                     </Option>
    //                 ))}
    //             </CustomSelect>
    //         </FormControl>
    //     );
    default:
      return content.map((action) => (
        <EditMenu action={action} key={action.name} />
      ));
  }
};

export default ConfigurationContentByType;
