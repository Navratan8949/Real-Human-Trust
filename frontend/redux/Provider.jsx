"use client"
import { Provider, useDispatch } from "react-redux"
import { useEffect } from "react"
import store from "./Store"
import { fetchUser } from "./features/userSlice"

function AuthInitializer({ children }) {
  const dispatch = useDispatch()
  
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (token) {
      dispatch(fetchUser())
    }
  }, [dispatch])

  return <>{children}</>
}

export function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      <AuthInitializer>{children}</AuthInitializer>
    </Provider>
  )
}
