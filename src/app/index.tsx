import { View, Text, Button } from "react-native";
import { router } from "expo-router";
import { fontFamily } from "@/theme/fontFamily";

export default function Index() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontFamily: fontFamily.bold }}>
          Hello, world!!
        </Text>

        <Button title="Nova meta" onPress={() => router.navigate("target")}/>

        <Button title="Transação" onPress={() => router.navigate("transaction/765890")}/>
          
        <Button title="Progresso" onPress={() => router.navigate("in-progress/12")}/>
    </View>
  );
}