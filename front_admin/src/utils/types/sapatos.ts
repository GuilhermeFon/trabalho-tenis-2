import {MarcaI} from "./marcas";

export interface TenisI {
  id: number;
  modelo: string;
  tamanho?: number;
  preco: number;
  cor: string;
  destaque: boolean;
  foto: string;
  descricao: string;
  marca: MarcaI;
  marcaId: number;
  adminId: number;
}
