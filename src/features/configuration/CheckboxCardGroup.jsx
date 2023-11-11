import {
    Box,
    Checkbox,
    Stack,
    useCheckbox,
    useCheckboxGroup,
    useId,
    useStyleConfig,
} from "@chakra-ui/react";
import { Children, cloneElement, isValidElement, useMemo } from "react";

export const CheckboxCardGroup = (props) => {
    const { children, defaultValue, value, onChange, ...rest } = props;
    const { getCheckboxProps } = useCheckboxGroup({
        defaultValue,
        value,
        onChange,
    });
    const cards = useMemo(
        () =>
            Children.toArray(children)
                .filter(isValidElement)
                .map((card) => {
                    return cloneElement(card, {
                        checkboxProps: getCheckboxProps({
                            value: card.props.value,
                        }),
                    });
                }),
        [children, getCheckboxProps]
    );
    return <Stack {...rest}>{cards}</Stack>;
};
export const CheckboxCard = (props) => {
    const { checkboxProps, children, ...rest } = props;
    const { getInputProps, getCheckboxProps, getLabelProps, state } =
        useCheckbox(checkboxProps);
    const id = useId(undefined, "checkbox-card");
    const styles = useStyleConfig("RadioCard", props);
    return (
        <Box
            as="label"
            cursor="pointer"
            {...getLabelProps()}
            sx={{
                ".focus-visible + [data-focus]": {
                    boxShadow: "outline",
                    zIndex: 1,
                },
            }}
        >
            <input {...getInputProps()} aria-labelledby={id} />
            <Box sx={styles} {...getCheckboxProps()} {...rest}>
                <Stack direction="row">
                    <Box flex="1">{children}</Box>
                    <Checkbox
                        pointerEvents="none"
                        isFocusable={false}
                        isChecked={state.isChecked}
                        alignSelf="start"
                    />
                </Stack>
            </Box>
        </Box>
    );
};
