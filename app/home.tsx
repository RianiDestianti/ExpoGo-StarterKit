import { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Button } from "@/components/ui/Button";
import Loading from "@/components/Loading";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { usePageLoader } from "@/hooks/usePageLoader";
import { getProfile } from "@/store/controllers/auth.controller";
import { handleLogout } from "@/store/slices/authSlice";
import { removeToken } from "@/libs/storage";
import { colors } from "@/libs/theme";

export default function Home() {
    const dispatch                  = useAppDispatch()
    const { profile, errorCode }    = useAppSelector(state => state.auth)
    const { isPageLoading, runWithLoader } = usePageLoader()

    const logout = async () => {
        await removeToken()
        dispatch(handleLogout())
        router.replace("/sign-in")
    }

    useEffect(() => {
        runWithLoader(() => dispatch(getProfile()))
    }, [])

    useEffect(() => {
        if(errorCode == 401 || errorCode == 403){
            logout()
        }
    }, [errorCode])

    return (
        <>
        {isPageLoading && <Loading />}
        <SafeAreaView style={styles.container}>
            <View style={styles.card}>
                {
                    profile?.avatar && (
                        <Image source={{ uri: profile.avatar }} style={styles.avatar} />
                    )
                }
                <Text style={styles.name}>{profile?.name ?? "-"}</Text>
                <Text style={styles.email}>{profile?.email ?? "-"}</Text>

                <View style={styles.badges}>
                    <Text style={styles.badge}>{profile?.role ?? "-"}</Text>
                    <Text style={[styles.badge, { color: profile?.verified ? colors.success : colors.danger }]}>
                        {profile?.verified ? "verified" : "not verified"}
                    </Text>
                </View>
            </View>

            {
                profile?.role === "admin" && (
                    <Button title="Manage Users" onPress={() => router.push("/users")} style={styles.button} />
                )
            }
            <Button title="Logout" variant="outline" onPress={logout} />
        </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
    container   : {
        flex            : 1,
        padding         : 16,
        backgroundColor : colors.background,
    },
    card        : {
        backgroundColor : colors.card,
        borderRadius    : 12,
        padding         : 24,
        alignItems      : "center",
        marginBottom    : 16,
    },
    avatar      : {
        width           : 72,
        height          : 72,
        borderRadius    : 36,
        marginBottom    : 12,
    },
    name        : {
        fontSize        : 20,
        fontWeight      : "700",
        color           : colors.text,
    },
    email       : {
        color           : colors.muted,
        marginTop       : 4,
    },
    badges      : {
        flexDirection   : "row",
        gap             : 8,
        marginTop       : 12,
    },
    badge       : {
        borderWidth     : 1,
        borderColor     : colors.border,
        borderRadius    : 12,
        paddingHorizontal : 10,
        paddingVertical : 2,
        fontSize        : 12,
        color           : colors.text,
    },
    button      : {
        marginBottom    : 12,
    },
});
