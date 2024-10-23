import { MarcaI } from "./marcas"

export interface TenisI {
  id: number
  modelo: string
  ano: number
  preco: number
  km: number
  destaque: boolean
  foto: string
  detalhes: string
  createdAt: Date
  updatedAt: Date
  combustivel: string
  marca: MarcaI
  marcaId: number
}