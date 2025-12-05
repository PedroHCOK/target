import { StyleSheet } from "react-native"

import { colors, fontFamily } from "@/theme";

export const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingTop: 32,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 24,
        fontFamily: fontFamily.bold,
        color: colors.black,
        marginBottom: 7,
    },
    subtitle: {
        fontSize: 14,
        fontFamily: fontFamily.regular,
        color: colors.gray[500],
    },
})
