import { Center, Heading, Stack, useColorModeValue } from "@chakra-ui/react";
import { CenterBoxLayout } from "layouts";
import Logo from "../../components/logo";
import VerifyPIN from "./VerifyPIN";

const VerifyEmail = () => {
    return (
        <CenterBoxLayout>
            <Stack spacing="6">
                <Logo />
                <Stack
                    spacing={{
                        base: "6",
                        md: "3",
                    }}
                    textAlign="center"
                >
                    <Heading
                        size={{
                            base: "xs",
                            md: "sm",
                        }}
                    >
                        Verify your Email
                    </Heading>
                    <Center
                        fontSize={{ base: "sm", sm: "md" }}
                        color={useColorModeValue("gray.800", "gray.400")}
                    >
                        A verification code has been sent to your email at
                    </Center>
                    <VerifyPIN />
                </Stack>
            </Stack>
        </CenterBoxLayout>
    );
};
export default VerifyEmail;
