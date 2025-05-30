import { StatusBar } from "expo-status-bar";
import { StyleSheet,SafeAreaView } from "react-native";
import RootNavigator from "./src/navigation/RootNavigator";
import { Provider } from "react-redux";
import { store } from "./src/store";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './src/services/queryClient';



export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <SafeAreaView style={styles.container}>
        <RootNavigator />
        <StatusBar style="auto" />
        </SafeAreaView>
      </Provider>
    </QueryClientProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    //alignItems: "center",
    //justifyContent: "center",
  },
});
