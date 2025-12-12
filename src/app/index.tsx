import { useCallback, useState} from "react"; // É recomendado usar o useCallback junto do useFocusEffect para garantir que a funcão dejs executada de forma performatica.
import { View, StatusBar, Alert } from "react-native";
import { router, useFocusEffect } from "expo-router";

import { List } from "@/components/List";
import { Button } from "@/components/Button";
import { Loading } from "@/components/Loading";
import { HomeHeader, HomeHeaderProps } from "@/components/HomeHeader";
import { Target, TargetProps } from "@/components/Target";

import { numberToCurrency } from "@/utils/numberToCurrency";

import { useTargetDatabase } from "@/database/useTargetDatabase"
import { useTransactionsDatabase } from "@/database/useTransactionsDatabase";

export default function Index() {
  const [summary, setSummary] = useState<HomeHeaderProps>()
  const [isFetching, setIsFetching] = useState(true)
  const [targets, setTargets] = useState<TargetProps[]>([])

  const targetDatabase = useTargetDatabase();
  const transactionsDatabase = useTransactionsDatabase()

  async function fetchTargets():Promise<TargetProps[]>{
    try{
      const response = await targetDatabase.listedByCloseTarget()
      
      return response.map((item) => ({
        id: String(item.id),
        name: item.name,
        current: numberToCurrency(item.current),
        percentage: item.percentage.toFixed(0) + "%",
        target: numberToCurrency(item.amount),
      }))

    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar as metas")

      console.log(error)
    }
  }

  async function fetchSummary(): Promise<HomeHeaderProps>{
    try {
      const response = await transactionsDatabase.summary()
      
      return{
        total: numberToCurrency(response.input + response.output),
        input:{
          label: "Entradas",
          value: numberToCurrency(response.input)
        },
        output:{
          label: "Saídas",
          value: numberToCurrency(response.output)
        }
      }
      
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar o resumo")
      console.log(error)
    }
  }

  async function fetchData(){
    const targetDataPromise = fetchTargets()
    const dataSummaryProps = fetchSummary()

    const [targetData, dataSummary] = await Promise.all([
      targetDataPromise,
      dataSummaryProps
    ])

    setTargets(targetData)
    setSummary(dataSummary)

    setIsFetching(false)
  }

  useFocusEffect(useCallback(() => {fetchData()}, []))

  if(isFetching){
    return<Loading />
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content"/>
      <HomeHeader data={summary} />

      <List
        title="Metas"
        data={targets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Target 
            data={item} 
            onPress={() => router.navigate(`/in-progress/${item.id}`)
          }/>
        )}
        emptyMessage="Nenhuma meta. Toque em nova meta para criar"
        containerStyle={{ paddingHorizontal: 24 }}
      />
      <View style={{ paddingHorizontal: 24, marginBottom: 32 }}>
        <Button title="Nova Meta" onPress={() => router.navigate('/target')} />
      </View>
    </View>
  );
}