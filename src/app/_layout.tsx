import { Suspense } from "react";
import { Stack } from "expo-router";
import { 
  useFonts,
  Inter_400Regular, 
  Inter_500Medium, 
  Inter_700Bold 
} from "@expo-google-fonts/inter";

import { SQLiteProvider } from "expo-sqlite";

import { migrate } from "@/database/migrate"

import { Loading } from "@/components/Loading";

import { colors } from "@/theme/colors";
export default function Layout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold
  });

  if (!fontsLoaded) {
    return <Loading />;
  }

  return(
    <Suspense fallback={<Loading />}>
      <SQLiteProvider
        databaseName="target.db"
        onInit={migrate} //cria o banco de dados e suas tabelas caso não existam. 
        useSuspense={true}
      >
        <Stack screenOptions={{ 
          headerShown: false,
          contentStyle: { backgroundColor: colors.white }
        }}
      />
      </SQLiteProvider>
    </Suspense>
  )
}