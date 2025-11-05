import { router } from "expo-router";
import { View, Text, Button } from "react-native";

export default function Target() {
  return(
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Target</Text>
        <Button title="voltar" onPress={() => router.back()} />
    </View>
  )
}