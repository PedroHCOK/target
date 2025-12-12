import { useCallback, useState } from "react";
import { View, Alert, StatusBar} from "react-native";
import { useLocalSearchParams, router, useFocusEffect } from "expo-router";
import dayjs from "dayjs";

import { List } from "@/components/List";
import { Button } from '@/components/Button';
import { Loading } from "@/components/Loading";
import { Progress } from "@/components/Progress";
import { PageHeader } from "@/components/PageHeader";
import { Transaction, TransactionProps } from "@/components/Transaction";

import { TransactionTypes } from '@/utils/TransactionsTypes';
import { numberToCurrency } from "@/utils/numberToCurrency";

import { useTargetDatabase } from "@/database/useTargetDatabase";
import { useTransactionsDatabase } from "@/database/useTransactionsDatabase";

export default function InProgress() {
  const [transactions, setTransactions] = useState<TransactionProps[]>([])
  const [isFetching, setIsFetching] = useState(true)
  const [details, setDetails] = useState({
      name: "",
      current: "R$ 0,00",
      target: "R$ 0,00",
      percentage: 0,
  })

  const params = useLocalSearchParams<{ id: string }>()

  const targetDatabase = useTargetDatabase()
  const transactionsDatabase = useTransactionsDatabase()



  async function fetchTargetDetails(){ //esta função busca os detalhes da meta
      try {
          const response = await targetDatabase.show(Number(params.id))
          setDetails({
              name: response.name,
              current: numberToCurrency(response.current),
              target: numberToCurrency(response.amount),
              percentage: response.percentage,
          })
      } catch (error) {
          Alert.alert("Erro", "Não foi possível carregar os detalhes da meta.")
          console.log(error)
      }
  }

  async function FetchTransactions(){ //esta função busca as transações
      try {
          const response = await transactionsDatabase.listByTargetId(
              Number(params.id)
          )

          setTransactions(
              response.map((item) => ({
                  id: String(item.id),
                  value:  numberToCurrency(item.amount),
                  date:  dayjs(item.create_at).format("DD/MM/YYYY [às] HH:mm"),
                  description: item.observation,
                  type: 
                  item.amount < 0 ? TransactionTypes.Output : TransactionTypes.Input,
              }))
          )
      } catch (error) {
          Alert.alert("Error", "Não foi possível carregar as transações")
          console.log(error)
      }
  }

  async function fetchData() { // esta função serve para manejar o carregamento das funções abaixo qque consultam o banco de dados 
      const fetchDetailsPromise = fetchTargetDetails()
      const fetchTransactionsPromise = FetchTransactions()

      await Promise.all([fetchDetailsPromise, fetchTransactionsPromise])
      setIsFetching(false)

  } 

  function handleTransanctionRemove(id: string){
    try {
      Alert.alert(
        "Remover", 
        "Deseja confirmar a ação",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Excluir",
            style: "destructive",
            onPress:() => TransanctionRemove(id)
          }
        ])
    } catch (error) {
      
    }
  }

  async function TransanctionRemove(id: string){
    try {
      await transactionsDatabase.remove(Number(id))
      fetchData()
      Alert.alert("Transação removida")
    } catch (error) {
      Alert.alert("Erro", "Não foi possível remover a transação")
      console.log(error)
    }
  }

  useFocusEffect(useCallback(() => {fetchData()}, []))

  if (isFetching) {
      return<Loading />
  }

  return (
      <View style={{ flex: 1, padding: 32, gap: 32 }}>
        <StatusBar barStyle="dark-content"/>
          <PageHeader 
              title={details.name}
              rightButton={{
                  icon: "edit",
                  onPress: () => router.navigate(`/target?id=${params.id}`)
              }}
          />
          <Progress 
              data={details}
          />

          <List
              title="Transações" 
              data={transactions} 
              renderItem={({item}) => (
                  <Transaction data={item} onRemove={() =>handleTransanctionRemove(item.id)} />
              )}
              emptyMessage="Nenhuma transação. Toque em nova transação para guardar seu primeiro dinheiro aqui"
          />

          <Button title="Nova transação" onPress={() => router.navigate(`/transaction/${params.id}`)} />
      </View>
  );
}