import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Credentials from './Components/Credentials/Credentials';
import { Action } from './types';
import { AuthServiceProvider } from './Components/AuthService/AuthService';
import UserDetailsNav from './Components/UserDetails/UserDetailsNav';
import RequireAuth from './Components/RequireAuth/RequireAuth';
import UserDetails from './Components/UserDetails/UserDetails';
import UserDetailsEdit from './Components/UserDetails/UserDetailsEdit';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={true} />
      <AuthServiceProvider>
        <main className='App'>
          <Routes>
            <Route path='/'>
              <Route index element={<Credentials />} />
              <Route
                path='login'
                element={
                  <Credentials action={Action.LOGIN} key={Action.LOGIN} />
                }
              />
              <Route
                path='details'
                element={
                  <RequireAuth>
                    <UserDetailsNav />
                  </RequireAuth>
                }
              >
                <Route index element={<UserDetails />} />
                <Route path='edit' element={<UserDetailsEdit />} />
              </Route>
            </Route>
            <Route path='*' element={<div>You are lost</div>} />
          </Routes>
        </main>
      </AuthServiceProvider>
    </QueryClientProvider>
  );
}

export default App;
