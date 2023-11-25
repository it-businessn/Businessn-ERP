import { Box } from "@chakra-ui/react";

const Card = ({ children, minH="3sx",...props }) => (
    <Box
        borderWidth="1px"
        minH={minH}
        bg="#fff"
        boxShadow="sm"
        borderRadius="lg"
        {...props}
    >
        {children}
    </Box>
);
export default Card;
