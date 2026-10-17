import { useEffect } from "react";
import { router } from "expo-router";
import { getToken } from "@/libs/storage";
import Loading from "@/components/Loading";

export default function Index() {
    useEffect(() => {
        getToken().then((token) => {
            router.replace(token ? "/home" : "/sign-in")
        })
    }, [])

    return <Loading />
}
