import { StyleSheet } from "react-native";

import { colors, fontFamily } from "@/theme"

export const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 16,
  },
  content: {
    flex: 1,
    gap: 7,
  },     
  name: {
    fontSize: 14,
    fontFamily: fontFamily.medium,
    color: colors.black,
  },
  status: {
    fontSize: 10,
    fontFamily: fontFamily.regular,
    color: colors.gray[500],
  },
});