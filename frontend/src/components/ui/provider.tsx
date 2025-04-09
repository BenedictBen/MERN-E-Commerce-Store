"use client"

import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode"
import { store,persistor } from "@/redux/store"
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

export function Provider(props: ColorModeProviderProps) {
  return (

    <ChakraProvider value={defaultSystem} resetCSS={false}>
      <ReduxProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
        <ColorModeProvider {...props} />
        </PersistGate>
      </ReduxProvider>
    </ChakraProvider>
  )
}
