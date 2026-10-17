import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import { colors } from "@/libs/theme";

interface ButtonProps {
    title       : string
    onPress     : () => void
    variant?    : "primary" | "outline" | "danger"
    disabled?   : boolean
    style?      : ViewStyle
}

export function Button ({ title, onPress, variant = "primary", disabled = false, style }: ButtonProps) {
    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            style={({ pressed }) => [
                styles.base,
                styles[variant],
                (pressed || disabled) && styles.pressed,
                style,
            ]}
        >
            <Text style={[styles.text, variant === "outline" && styles.outlineText]}>{title}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    base        : {
        paddingVertical     : 12,
        paddingHorizontal   : 16,
        borderRadius        : 8,
        alignItems          : "center",
    },
    primary     : {
        backgroundColor     : colors.primary,
    },
    outline     : {
        backgroundColor     : "transparent",
        borderWidth         : 1,
        borderColor         : colors.primary,
    },
    danger      : {
        backgroundColor     : colors.danger,
    },
    pressed     : {
        opacity             : 0.7,
    },
    text        : {
        color               : colors.primaryText,
        fontWeight          : "600",
    },
    outlineText : {
        color               : colors.primary,
    },
});
