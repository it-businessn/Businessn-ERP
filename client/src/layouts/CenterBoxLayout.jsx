import { Box, Container, Stack } from "@chakra-ui/react";

const CenterBoxLayout = (props) => {
    return (
        <Box
            bgGradient={{
                sm: "linear(to-r, brand.600, brand.600)",
            }}
            py={{
                base: "12",
                md: "24",
            }}
            display="flex"
            minH="100vh"
            alignItems="center"
        >
            <Container
                maxW="md"
                py={{
                    base: "0",
                    sm: "8",
                }}
                px={{
                    base: "4",
                    sm: "10",
                }}
                bg={{
                    base: "transparent",
                    sm: "bg.surface",
                }}
                boxShadow={{
                    base: "none",
                    sm: "xl",
                }}
                borderRadius={{
                    base: "none",
                    sm: "xl",
                }}
            >
                <Stack spacing="8">{props.children}</Stack>
            </Container>
        </Box>
    );
};

export default CenterBoxLayout;
