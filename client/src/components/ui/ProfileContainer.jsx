import { Container } from "@chakra-ui/react";

const ProfileContainer = (props) => {
    return (
        <Container
            maxW="100%"
            py={{
                base: "4",
                md: "8",
            }}
            px={{
                base: "0",
                md: 8,
            }}
        >
            {props.children}
        </Container>
    );
};

export default ProfileContainer;
