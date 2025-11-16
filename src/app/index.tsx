import { View } from "react-native";

import { HomeHeader } from "@/components/HomeHeader";
import { Target } from "@/components/Target";

const summary = {
  total: "R$ 2.680,00",
  input: { label: 'Entradas', value: 'R$ 6.184,90' },
  output: { label: 'Saídas', value: '- R$ 883,65' }
}

const targets = [
  {
    id: '1',
    name: 'Comprar uma cadeira ergonônimica',
    target: 'R$ 1.200,00',
    percentage: '%75',
    current: 'R$ 900,00',
  },]

export default function Index() {
  return (
    <View style={{ flex: 1 }}>
      <HomeHeader data={summary} />
      <Target data={targets[0]} />
    </View>
  );
}