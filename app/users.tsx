import { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Loading from "@/components/Loading";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { usePageLoader } from "@/hooks/usePageLoader";
import { deleteUser, getListUser } from "@/store/controllers/user.controller";
import { resetResponse } from "@/store/slices/userSlice";
import { User } from "@/store/types/UserType";
import { colors } from "@/libs/theme";

export default function Users() {
    const dispatch                              = useAppDispatch()
    const [keyword, setKeyword]                 = useState("")
    const [page, setPage]                       = useState<number>(1)

    const { users, total, response, error }     = useAppSelector((state) => state.user)
    const { isPageLoading, runWithLoader }      = usePageLoader()

    const loadData = (targetPage: number = page) => {
        runWithLoader(() => dispatch(getListUser({ keyword, page: targetPage })))
    }

    const handleSearch = () => {
        setPage(1)
        loadData(1)
    }

    const handleChangePage = (targetPage: number) => {
        setPage(targetPage)
        loadData(targetPage)
    }

    const handleDeleteData = (user: User) => {
        Alert.alert("Delete user", `Delete ${user.name}?`, [
            { text: "Cancel", style: "cancel" },
            { text: "Delete", style: "destructive", onPress: () => runWithLoader(() => dispatch(deleteUser(user.id))) },
        ])
    }

    useEffect(() => {
        loadData(1)
    }, [])

    useEffect(() => {
        if(response.delete){
            Alert.alert(response.delete.status == 200 ? "Success" : "Failed", response.delete.message)
            dispatch(resetResponse())
        }
    }, [response.delete])

    return (
        <>
        {isPageLoading && <Loading />}
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Button title="Back" variant="outline" onPress={() => router.back()} />
                <Text style={styles.title}>Users ({total.data})</Text>
            </View>

            <View style={styles.search}>
                <Input
                    placeholder="Search name, email, phone"
                    value={keyword}
                    autoCapitalize="none"
                    returnKeyType="search"
                    onChangeText={setKeyword}
                    onSubmitEditing={handleSearch}
                />
            </View>

            {error && <Text style={styles.error}>{error}</Text>}

            <FlatList
                data={users}
                keyExtractor={(item) => String(item.id)}
                contentContainerStyle={styles.list}
                ListEmptyComponent={<Text style={styles.empty}>No data</Text>}
                renderItem={({ item }) => (
                    <View style={styles.row}>
                        <View style={styles.rowInfo}>
                            <Text style={styles.rowName}>{item.name}</Text>
                            <Text style={styles.rowMeta}>{item.email}</Text>
                            <Text style={styles.rowMeta}>{item.role}</Text>
                        </View>
                        <Button title="Delete" variant="danger" onPress={() => handleDeleteData(item)} />
                    </View>
                )}
            />

            <View style={styles.pagination}>
                <Button title="Previous" variant="outline" disabled={page <= 1} onPress={() => handleChangePage(page - 1)} />
                <Text style={styles.pageText}>{page} / {Math.max(total.pages, 1)}</Text>
                <Button title="Next" variant="outline" disabled={page >= total.pages} onPress={() => handleChangePage(page + 1)} />
            </View>
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
    header      : {
        flexDirection   : "row",
        alignItems      : "center",
        gap             : 12,
        marginBottom    : 16,
    },
    title       : {
        fontSize        : 18,
        fontWeight      : "700",
        color           : colors.text,
    },
    search      : {
        marginBottom    : 4,
    },
    error       : {
        color           : colors.danger,
        marginBottom    : 8,
    },
    list        : {
        gap             : 8,
        paddingBottom   : 16,
    },
    empty       : {
        textAlign       : "center",
        color           : colors.muted,
        marginTop       : 24,
    },
    row         : {
        flexDirection   : "row",
        alignItems      : "center",
        backgroundColor : colors.card,
        borderRadius    : 8,
        padding         : 12,
    },
    rowInfo     : {
        flex            : 1,
    },
    rowName     : {
        fontWeight      : "600",
        color           : colors.text,
    },
    rowMeta     : {
        color           : colors.muted,
        fontSize        : 12,
    },
    pagination  : {
        flexDirection   : "row",
        alignItems      : "center",
        justifyContent  : "space-between",
        paddingTop      : 8,
    },
    pageText    : {
        color           : colors.text,
    },
});
