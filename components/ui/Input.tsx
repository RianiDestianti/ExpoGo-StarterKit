import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
import { colors } from "@/libs/theme";

interface InputProps extends TextInputProps {
    label?      : string
    required?   : boolean
    error?      : string | null
}

export function Input ({ label, required = false, error, style, ...props }: InputProps) {
    return (
        <View style={styles.wrapper}>
            {
                label && (
                    <Text style={styles.label}>
                        {label}{required && <Text style={styles.required}>*</Text>}
                    </Text>
                )
            }
            <TextInput
                placeholderTextColor={colors.muted}
                style={[styles.input, error ? styles.inputError : null, style]}
                {...props}
            />
            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper     : {
        marginBottom    : 16,
    },
    label       : {
        fontWeight      : "700",
        marginBottom    : 6,
        color           : colors.text,
    },
    required    : {
        color           : colors.danger,
    },
    input       : {
        borderWidth     : 1,
        borderColor     : colors.border,
        borderRadius    : 8,
        paddingHorizontal : 12,
        paddingVertical : 10,
        backgroundColor : colors.card,
        color           : colors.text,
    },
    inputError  : {
        borderColor     : colors.danger,
    },
    error       : {
        color           : colors.danger,
        marginTop       : 4,
        fontSize        : 12,
    },
});
