import { VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { isExtraPay } from "utils";
import { formatDateMMDDYYShort, monthDayYearShortFormat } from "utils/convertDate";
import currentImg from "../../../../assets/card_bg.png";
import PayPeriodDetailCard from "./PayPeriodDetailCard";
import { workViewPath } from "routes";
import { BsCalendarWeek, BsCalendarCheck, BsCashCoin } from "react-icons/bs";

function Slide({ content, animationConfig, moveSlide }) {
  const navigate = useNavigate();

  return (
    <VStack
      spacing={0}
      borderRadius="10px"
      width="100%"
      p="0.5em 0.8em"
      backgroundImage={currentImg}
      backgroundSize="cover"
      color="var(--main_color)"
      boxShadow="md"
      height="100%"
    >
      <PayPeriodDetailCard
        payNum={isExtraPay(content.payPeriod, content?.isExtraRun)}
        borderTopLeftRadius={"10px"}
        borderTopRightRadius={"10px"}
        header={"Pay Period"}
        text1={`${monthDayYearShortFormat(content?.payPeriodStartDate)} -`}
        text2={monthDayYearShortFormat(content?.payPeriodEndDate)}
        actionText="Manage Payroll"
        pb={0}
        icon={BsCalendarWeek}
        iconSize="2em"
        handleClic={() => navigate(workViewPath)}
      />
      {content && (
        <PayPeriodDetailCard
          header={"Processing"}
          text1={monthDayYearShortFormat(content?.payPeriodProcessingDate)}
          actionText={content?.name}
          pb={0}
          bg={content?.bg}
          color={content?.color}
          icon={BsCalendarCheck}
          iconSize="2em"
          handleClick={() => navigate(workViewPath)}
        />
      )}
      <PayPeriodDetailCard
        header={"Pay Date"}
        text1={monthDayYearShortFormat(content?.payPeriodPayDate)}
        isOutlineButton
        icon={BsCashCoin}
        iconSize="2em"
        borderBottomLeftRadius={"10px"}
        borderBottomRightRadius={"10px"}
      />
    </VStack>
  );
}

export default Slide;
