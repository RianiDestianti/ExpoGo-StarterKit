import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StoreProvider } from "@/providers/StoreProvider";
import { colors } from "@/libs/theme";

export default function RootLayout() {
    return (
        <StoreProvider>
            <StatusBar style="dark" />
            <Stack
                screenOptions={{
                    headerShown     : false,
                    contentStyle    : { backgroundColor: colors.background },
                }}
            />
        </StoreProvider>
    );
}
