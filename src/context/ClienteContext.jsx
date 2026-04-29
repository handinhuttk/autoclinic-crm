import { createContext, useContext, useState } from 'react';

const ClienteContext = createContext(null);

export function ClienteProvider({ children }) {
  const [clienteId, setClienteId] = useState(1);
  return (
    <ClienteContext.Provider value={{ clienteId, setClienteId }}>
      {children}
    </ClienteContext.Provider>
  );
}

export const useCliente = () => useContext(ClienteContext);
