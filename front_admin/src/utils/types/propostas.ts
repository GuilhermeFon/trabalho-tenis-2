import {TenisI} from "./sapatos";
import {ClienteI} from "./clientes";

export interface PropostaI {
  id: number;
  clienteId: string;
  cliente: ClienteI;
  tenisId: number;
  tenis: TenisI;
  tamanho: string;
  descricao: string;
  resposta: string | null;
  createdAt: string;
  updatedAt: string | null;
}
