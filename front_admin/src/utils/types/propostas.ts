import { CarroI } from "./carros"
import { ClienteI } from "./clientes"

export interface PropostaI {
  id: number
  clienteId: string
  cliente: ClienteI
  carroId: number
  carro: CarroI
  descricao: string
  resposta: string | null
  createdAt: string
  updatedAt: string | null
}