import { TenisI } from "./tenis"

export interface PropostaI {
  id: number
  clienteId: string
  tenisId: number
  tenis: TenisI
  descricao: string
  resposta: string | null
  createdAt: string
  updatedAt: string | null
}