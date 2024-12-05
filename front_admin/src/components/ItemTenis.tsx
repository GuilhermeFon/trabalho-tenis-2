"use client";
import {Dispatch, SetStateAction} from "react";
import {TiDeleteOutline} from "react-icons/ti";
import {FaRegStar, FaStar} from "react-icons/fa";
import Cookies from "js-cookie";
import {toast} from "sonner";
import {TenisI} from "@/utils/types/sapatos";

interface listaTenisProps {
  tenis: TenisI;
  sapatos: TenisI[];
  setSapatos: Dispatch<SetStateAction<TenisI[]>>;
}

function ItemTenis({tenis, sapatos, setSapatos}: listaTenisProps) {
  async function excluirTenis() {
    if (confirm(`Confirma a exclusão`)) {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_API}/sapatos/${tenis.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
            Authorization: ("Bearer " +
              Cookies.get("admin_logado_token")) as string,
          },
        }
      );

      if (response.status == 200) {
        const sapatos2 = sapatos.filter((x) => x.id != tenis.id);
        setSapatos(sapatos2);
        toast.success("Tênis excluído com sucesso");
      } else {
        toast.error("Erro... Tênis não foi excluído");
      }
    }
  }

  async function alterarDestaque() {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}/sapatos/destacar/${tenis.id}`,
      {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          Authorization: ("Bearer " +
            Cookies.get("admin_logado_token")) as string,
        },
      }
    );

    if (response.status == 200) {
      const sapatos2 = sapatos.map((x) => {
        if (x.id == tenis.id) {
          return {...x, destaque: !x.destaque};
        }
        return x;
      });
      setSapatos(sapatos2);
    }
  }

  return (
    <tr
      key={tenis.id}
      className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
    >
      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
      >
        <img src={tenis.foto} alt="Capa do Tênis" style={{width: 200}} />
      </th>
      <td className={`px-6 py-4 ${tenis.destaque ? "font-extrabold" : ""}`}>
        {tenis.modelo}
      </td>
      <td className={`px-6 py-4 ${tenis.destaque ? "font-extrabold" : ""}`}>
        {tenis.marca.nome}
      </td>
      <td className={`px-6 py-4 ${tenis.destaque ? "font-extrabold" : ""}`}>
        {tenis.cor}
      </td>
      <td className={`px-6 py-4 ${tenis.destaque ? "font-extrabold" : ""}`}>
        {Number(tenis.preco).toLocaleString("pt-br", {
          minimumFractionDigits: 2,
        })}
      </td>
      <td className="px-6 py-4">
        <TiDeleteOutline
          className="text-3xl text-red-600 inline-block cursor-pointer"
          title="Excluir"
          onClick={excluirTenis}
        />
        &nbsp;
        {tenis.destaque ? (
          <FaStar
            className="text-3xl text-yellow-600 inline-block cursor-pointer"
            title="Remover Destaque"
            onClick={alterarDestaque}
          />
        ) : (
          <FaRegStar
            className="text-3xl text-yellow-600 inline-block cursor-pointer"
            title="Destacar"
            onClick={alterarDestaque}
          />
        )}
      </td>
    </tr>
  );
}

export default ItemTenis;
