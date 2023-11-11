import { Box, Image } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Logo = () => {
    return (
        <Box>
            <Link to="/">
                <Image
                    width="200px"
                    margin="0 auto"
                    objectFit="cover"
                    src="https://uploads-ssl.webflow.com/643cf2f78897e3e6b64779a9/64642eaa53e8234c891aafa5_Screenshot%202023-05-16%20at%206.30.59%20PM.png"
                    alt="Company logo"
                />
            </Link>
        </Box>
    );
};

export default Logo;
