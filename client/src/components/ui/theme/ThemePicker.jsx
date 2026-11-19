import { Button, ButtonGroup, IconButton, Text, Tooltip, VStack } from "@chakra-ui/react";
import useAppTheme from "hooks/useAppTheme";
import { FaFire, FaMoon, FaSun } from "react-icons/fa";

const ICONS = { light: <FaSun />, dark: <FaMoon />, warm: <FaFire /> };

/**
 * THEMES-01: Light | Dark | Warm switch. `compact` (collapsed sidebar) shows one
 * button that moves to the next theme.
 */
const ThemePicker = ({ compact, ...props }) => {
	const { theme, setTheme, themes } = useAppTheme();

	if (compact) {
		const index = themes.findIndex(({ id }) => id === theme);
		const next = themes[(index + 1) % themes.length];
		const current = themes[index] || themes[0];
		return (
			<Tooltip label={`Theme: ${current.label} (click for ${next.label})`} placement="right" hasArrow>
				<IconButton
					size="sm"
					variant="ghost"
					color="var(--nav_color)"
					icon={ICONS[current.id]}
					aria-label={`Theme: ${current.label}. Switch to ${next.label}`}
					onClick={() => setTheme(next.id)}
					{...props}
				/>
			</Tooltip>
		);
	}

	return (
		<VStack align="start" spacing={1} {...props}>
			<Text fontSize="xs" color="var(--text_soft)">
				Theme
			</Text>
			<ButtonGroup size="xs" isAttached variant="outline" role="radiogroup" aria-label="Theme">
				{themes.map(({ id, label }) => (
					<Button
						key={id}
						role="radio"
						aria-checked={theme === id}
						onClick={() => setTheme(id)}
						bg={theme === id ? "var(--banner_bg)" : undefined}
						color={theme === id ? "white" : undefined}
						_hover={{ bg: theme === id ? "var(--primary_btn_hover)" : undefined }}
					>
						{label}
					</Button>
				))}
			</ButtonGroup>
		</VStack>
	);
};

export default ThemePicker;
