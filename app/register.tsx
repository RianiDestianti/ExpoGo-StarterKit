import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Loading from "@/components/Loading";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { usePageLoader } from "@/hooks/usePageLoader";
import { handleActionRegister } from "@/store/controllers/auth.controller";
import { handleCleanResponse } from "@/store/slices/authSlice";
import { RegisterRequest } from "@/store/types/AuthType";
import { firstError, handleChangeInput } from "@/libs/general";
import { setToken } from "@/libs/storage";
import { colors } from "@/libs/theme";

export default function Register() {
    const dispatch          = useAppDispatch()
    const stateRegister     = useAppSelector(state => state.auth)
    const { isPageLoading, runWithLoader } = usePageLoader()

    const [request, setRequest] = useState<RegisterRequest>({
        name        : "",
        email       : "",
        password    : ""
    });

    const handleRegister = () => {
        runWithLoader(() => dispatch(handleActionRegister(request)))
    }

    useEffect(() => {
        dispatch(handleCleanResponse())
    }, [])

    useEffect(() => {
        if(stateRegister.responseRegister){
            setToken(stateRegister.responseRegister.key).then(() => {
                dispatch(handleCleanResponse())
                router.replace("/home")
            })
        }
    }, [stateRegister.responseRegister])

    return (
        <>
        {isPageLoading && <Loading />}
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                <View style={styles.card}>
                    <Text style={styles.title}>Create Account</Text>

                    {
                        stateRegister.error && (
                            <View style={styles.alert}>
                                <Text style={styles.alertText}>{stateRegister.error}</Text>
                            </View>
                        )
                    }

                    <Input
                        label="Name"
                        required
                        placeholder="Enter name"
                        value={request.name}
                        error={firstError(stateRegister.errorFields, "name")}
                        onChangeText={(value) => handleChangeInput("name", value, setRequest)}
                    />
                    <Input
                        label="Email"
                        required
                        placeholder="Enter email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={request.email}
                        error={firstError(stateRegister.errorFields, "email")}
                        onChangeText={(value) => handleChangeInput("email", value, setRequest)}
                    />
                    <Input
                        label="Password"
                        required
                        placeholder="Minimum 6 characters"
                        secureTextEntry
                        value={request.password}
                        error={firstError(stateRegister.errorFields, "password")}
                        onChangeText={(value) => handleChangeInput("password", value, setRequest)}
                    />

                    <Button title="REGISTER" onPress={handleRegister} style={styles.button} />
                    <Button title="Back to sign in" variant="outline" onPress={() => router.back()} />
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
    title       : {
        fontSize        : 20,
        fontWeight      : "700",
        textAlign       : "center",
        marginBottom    : 24,
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
