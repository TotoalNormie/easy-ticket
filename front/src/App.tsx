import { BrowserRouter, Route, Routes } from "react-router-dom";
import { isLoggedIn } from "./auth/isLoggedIn";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

const App = () => {
  const user = isLoggedIn();
  return (
    <QueryClientProvider client={queryClient}>
    <BrowserRouter>
    <header></header>
    <nav></nav>
    <main>
      <Routes>
        <Route index element={<div>
          {user ?
          <>
          <h1>{user.name}</h1>
          <p>{user.email}</p>
          </>: null
          }
        </div>} />
      </Routes>
    </main>
    </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App