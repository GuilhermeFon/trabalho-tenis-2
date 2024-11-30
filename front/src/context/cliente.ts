import {create} from "zustand";
import {ClienteI} from "@/utils/types/clientes";
import {persist} from "zustand/middleware";

type ClienteStore = {
  cliente: ClienteI;
  logaCliente: (clienteLogado: ClienteI) => void;
  deslogaCliente: () => void;
};

export const useClienteStore = create<ClienteStore>()(
  persist(
    (set) => ({
      cliente: {} as ClienteI,
      logaCliente: (clienteLogado) => set({cliente: clienteLogado}),
      deslogaCliente: () => set({cliente: {} as ClienteI}),
    }),
    {
      name: "cliente-storage",
    }
  )
);
