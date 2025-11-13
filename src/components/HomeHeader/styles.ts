import { StyleSheet } from 'react-native'
import { colors, fontFamily } from '@/theme'


export const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 324
  },

  label: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.white,
    marginTop: 139,
    paddingHorizontal: 24,
    fontFamily: fontFamily.regular
  },

  subtitle: {
    fontSize: 32,
    color: colors.white,
    marginTop: 5,
    marginLeft: 24,
    fontFamily: fontFamily.bold
  }
});