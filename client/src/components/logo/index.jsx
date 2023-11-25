import { Box, Image } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import logoImg from "../../assets/logo1.png";

const Logo = () => {
  return (
    <Box>
      <Link to="/">
        <Image
          width="50px"
          objectFit="cover"
          src={logoImg}
          alt="Company logo"
        />
      </Link>
    </Box>
  );
};

export default Logo;
