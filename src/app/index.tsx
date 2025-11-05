import { router } from "expo-router";
import { View, Text, Button } from "react-native";

export default function Index() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Hello, world!</Text>
        <Button title="Nova meta" onPress={() => {router.navigate("target")}}/>
        <Button title="Transação" onPress={() => {router.navigate("transaction/765890")}}/>
    </View>
  );
}