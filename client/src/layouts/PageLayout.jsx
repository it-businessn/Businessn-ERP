import { Box } from "@chakra-ui/react";
import PageHeader from "components/PageHeader";
import BoxCard from "components/ui/card";
import { tabScrollCss } from "erp-modules/payroll/onboard-user/customInfo";
import { useBreakpointValue } from "services/Breakpoint";

const PageLayout = ({
  children,
  showSelectBox,
  title,
  handleChange,
  data,
  selectedValue,
  width,
  showBgLayer,
  selectAttr,
  selectPlaceholder,
  isTimesheet,
  showCheckBox,
  size,
  zIndex = 0,
  position = "sticky",
  pb = 0,
  isMobile,
  mobileTitlePadding,
  bg = "var(--page_layout_bg)",
  showPayGroup,
  hasMultiPaygroups,
  overflow = "hidden",
  overflowY = "auto",
  p = "1em",
  pr,
}) => {
  // F-02: 52 of 56 pages never pass `isMobile`, so on phones they kept the
  // desktop 6em header gap on top of .main_content's own offset. Detect it here.
  const { isMobile: isMobileViewport } = useBreakpointValue();
  const onPhone = isMobile ?? isMobileViewport;
  return (
    <Box
      p={onPhone ? "0.5em" : p}
      pr={pr}
      mt={onPhone ? "0.5em" : "6em"}
      overflow={overflow}
      zIndex={zIndex}
      position={position}
      pb={pb}
      bg={bg}
      flex={1}
      overflowY={overflowY}
      css={tabScrollCss}
    >
      <PageHeader
        hasMultiPaygroups={hasMultiPaygroups}
        size={size}
        showSelectBox={showSelectBox}
        showPayGroup={showPayGroup}
        title={title}
        handleChange={handleChange}
        data={data}
        value={selectedValue}
        width={!onPhone && width}
        selectAttr={selectAttr}
        selectPlaceholder={selectPlaceholder}
        isTimesheet={isTimesheet}
        showCheckBox={showCheckBox}
        mobileTitlePadding={mobileTitlePadding}
      />
      {showBgLayer ? (
        <BoxCard pb={pb} borderWidth={"2px"}>
          {children}
        </BoxCard>
      ) : (
        children
      )}
    </Box>
  );
};

export default PageLayout;
