import { useState, useEffect } from "react";
import { View, Alert, StatusBar } from "react-native";
import { useLocalSearchParams, router } from "expo-router";

import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { PageHeader } from "@/components/PageHeader";
import { CurrencyInput } from "@/components/CurrencyInput";

import { useTargetDatabase } from "@/database/useTargetDatabase";
export default function Target() {

  const [isProcessing, setIsProcessing] = useState(false)
  const [name, setName] = useState("")
  const [amount, setAmount] = useState(0)
  const [displayedTitle, setDisplayedTitle] = useState(() => {
    return "Nova Meta"
  })

  const params = useLocalSearchParams<{ id: string}>()
  const targetDatabase = useTargetDatabase()

  function handleSave () {
    if(!name.trim() || amount <= 0){
      return Alert.alert(
          "Atenção",
          "Preencha nome e valor precisa ser maior que zero"
        )
    }

    setIsProcessing(true)

    if(params.id){
      update()
    } else {
      create()
    }
  }

  async function update() {
    try {
      await targetDatabase.update({ id: Number(params.id), name, amount })
      setDisplayedTitle(name)
      Alert.alert("Sucesso!", "Meta atualizada com sucesso!", [
        {
          text: "Ok",
          onPress: () => router.back(),
        }
      ])
    } catch (error) {
      Alert.alert("Error", "Não foi possível atualizar essa meta.")
      console.log(error)
    }
  }

  async function create () {
    try {
      await targetDatabase.create({ name, amount })
      setDisplayedTitle(name)
      Alert.alert("Nova Meta", "Meta criada com sucesso!", [
        {
           text: "Ok", 
           onPress: () => router.back(),
        }
      ])
    } catch (error) {
      Alert.alert("Erro", "Não foi possível criar a meta.")
      console.log(error);
      setIsProcessing(false)
    }
  }

  async function fechDetails(id: number){
    try {
      const response = await targetDatabase.show(id)
      setName(response.name)
      setAmount(response.amount)
      setDisplayedTitle(response.name)
    } catch (error) {
      Alert.alert("Error", "Não foi possível carregar os detalhes da meta")
      console.log(error)
    }
  }

  function handleRemove(){
    if (!params.id) { //O return também pode ser escrito fora de chaves, já que é apenas uma única instrução
      return
    }

    Alert.alert(
      "Excluir meta",
      "Deseja realmente excluir esta meta?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              setIsProcessing(true)
              await targetDatabase.remove(Number(params.id))
              Alert.alert("Sucesso", "Meta removida com sucesso", [
                { text: "Ok", onPress: () => router.replace("/") }
              ])
            } catch (error) {
              console.log(error)
              Alert.alert("Erro", "Não foi possível remover a meta.")
            } finally {
              setIsProcessing(false)
            }
          }
        }
      ]
    )
  }

  useEffect(() => {
    if (params.id) {
      fechDetails(Number(params.id))
    }
  }, [params.id])

  return(
    <View style={{ flex: 1, padding: 24 }}>
      <StatusBar barStyle="dark-content"/>
        <PageHeader 
            title={ displayedTitle }
            subtitle="Economize para alcançar sua meta financeira."
            rightButton={
              params.id ? {icon: "delete", onPress:() => handleRemove() } : undefined
            }
        />
        <View style={{ marginTop: 32, gap: 24 }}>
          <Input 
            label="Nome da Meta" 
            placeholder="Ex: Viagem para praia, Apple Watch"
            onChangeText={setName}
            value={name}
          />
          <CurrencyInput 
            label="Valor da Meta (R$)" 
            value={amount}
            onChangeValue={setAmount}
          />
          <Button title="Salvar" onPress={handleSave} isProcessing={isProcessing}/>
        </View>
    </View>
  )
}