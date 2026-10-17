import { ActivityIndicator, Modal, StyleSheet, View } from "react-native";
import { colors } from "@/libs/theme";

export default function Loading () {
    return (
        <Modal transparent animationType="fade" statusBarTranslucent>
            <View style={styles.overlay}>
                <View style={styles.box}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay : {
        flex            : 1,
        alignItems      : "center",
        justifyContent  : "center",
        backgroundColor : "rgba(0,0,0,0.25)",
    },
    box     : {
        padding         : 24,
        borderRadius    : 12,
        backgroundColor : colors.card,
    },
});
