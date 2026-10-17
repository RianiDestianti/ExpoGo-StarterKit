import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Loading from "@/components/Loading";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { usePageLoader } from "@/hooks/usePageLoader";
import { handleActionLogin } from "@/store/controllers/auth.controller";
import { handleCleanResponse } from "@/store/slices/authSlice";
import { LoginRequest } from "@/store/types/AuthType";
import { firstError, handleChangeInput } from "@/libs/general";
import { setToken } from "@/libs/storage";
import { colors } from "@/libs/theme";

export default function SignIn() {
    const dispatch      = useAppDispatch()
    const stateLogin    = useAppSelector(state => state.auth)
    const { isPageLoading, runWithLoader } = usePageLoader()

    const [request, setRequest] = useState<LoginRequest>({
        email       : "",
        password    : ""
    });

    const handleLogin = () => {
        runWithLoader(() => dispatch(handleActionLogin(request)))
    }

    useEffect(() => {
        dispatch(handleCleanResponse())
    }, [])

    useEffect(() => {
        if(stateLogin.responseLogin){
            setToken(stateLogin.responseLogin.key).then(() => {
                dispatch(handleCleanResponse())
                router.replace("/home")
            })
        }
    }, [stateLogin.responseLogin])

    return (
        <>
        {isPageLoading && <Loading />}
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                <View style={styles.card}>
                    <View style={styles.brand}>
                        <View style={styles.logo}>
                            <Text style={styles.logoText}>S</Text>
                        </View>
                        <Text style={styles.brandText}>Skeleton</Text>
                    </View>

                    {
                        stateLogin.error && (
                            <View style={styles.alert}>
                                <Text style={styles.alertText}>{stateLogin.error}</Text>
                            </View>
                        )
                    }

                    <Input
                        label="Email"
                        required
                        placeholder="Enter email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={request.email}
                        error={firstError(stateLogin.errorFields, "email")}
                        onChangeText={(value) => handleChangeInput("email", value, setRequest)}
                    />
                    <Input
                        label="Password"
                        required
                        placeholder="Enter password"
                        secureTextEntry
                        value={request.password}
                        error={firstError(stateLogin.errorFields, "password")}
                        onChangeText={(value) => handleChangeInput("password", value, setRequest)}
                    />

                    <Button title="SIGN IN" onPress={handleLogin} style={styles.button} />
                    <Button title="Create an account" variant="outline" onPress={() => router.push("/register")} />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
        </>
    )
}

const styles = StyleSheet.create({
    container   : {
        flex            : 1,
        backgroundColor : colors.background,
    },
    content     : {
        flexGrow        : 1,
        justifyContent  : "center",
        padding         : 16,
    },
    card        : {
        backgroundColor : colors.card,
        borderRadius    : 12,
        padding         : 24,
    },
    brand       : {
        flexDirection   : "row",
        alignItems      : "center",
        justifyContent  : "center",
        marginBottom    : 24,
        gap             : 8,
    },
    logo        : {
        width           : 32,
        height          : 32,
        borderRadius    : 8,
        backgroundColor : colors.primary,
        alignItems      : "center",
        justifyContent  : "center",
    },
    logoText    : {
        color           : colors.primaryText,
        fontWeight      : "700",
    },
    brandText   : {
        fontSize        : 18,
        fontWeight      : "600",
        color           : colors.text,
    },
    alert       : {
        backgroundColor : colors.dangerSoft,
        padding         : 8,
        borderRadius    : 4,
        marginBottom    : 16,
    },
    alertText   : {
        textAlign       : "center",
        color           : colors.danger,
    },
    button      : {
        marginTop       : 8,
        marginBottom    : 12,
    },
});
