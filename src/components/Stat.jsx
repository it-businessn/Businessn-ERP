import {
    Box,
    Heading,
    HStack,
    Icon,
    Square,
    Stack,
    Text,
} from "@chakra-ui/react";

const Stat = (props) => {
    const { label, value, icon, delta, ...boxProps } = props;
    return (
        <Box
            px={{
                base: "4",
                md: "6",
            }}
            py={{
                base: "5",
                md: "6",
            }}
            bg="bg.surface"
            borderRadius="lg"
            boxShadow="sm"
            {...boxProps}
        >
            <Stack>
                <Stack direction="row" justify="space-between">
                    <HStack spacing="4">
                        <Square
                            size="12"
                            bg="bg.accent.subtle"
                            borderRadius="md"
                        >
                            <Icon
                                as={icon}
                                boxSize="6"
                                color="fg.accent.default"
                            />
                        </Square>
                        <Text fontWeight="medium">{label}</Text>
                    </HStack>
                    {/* <Icon as={FiMoreVertical} boxSize="5" color="fg.muted" /> */}
                </Stack>
                <Stack>
                    <Heading
                        size={{
                            base: "sm",
                            md: "md",
                        }}
                    >
                        {value}
                    </Heading>
                    {/* {delta && (
                        <HStack spacing="1" fontWeight="medium">
                            <Icon
                                color={
                                    delta.isUpwardsTrend ? "success" : "error"
                                }
                                as={
                                    delta.isUpwardsTrend
                                        ? FiArrowUpRight
                                        : FiArrowDownRight
                                }
                                boxSize="5"
                            />
                            {/* <Text
                                color={
                                    delta.isUpwardsTrend ? "success" : "error"
                                }
                            >
                                {delta.value}
                            </Text> */}
                    {/* <Text color="fg.muted">vs last week</Text> 
                        </HStack>
                    )} */}
                </Stack>
            </Stack>
        </Box>
    );
};
export default Stat;
