/* eslint-disable @next/next/no-img-element */
"use client";
import {Dispatch, SetStateAction} from "react";
import {TiDeleteOutline} from "react-icons/ti";
import {FaRegEdit} from "react-icons/fa";
import Cookies from "js-cookie";
import {PropostaI} from "@/utils/types/propostas";
import Image from "next/image";

import OkImage from "../../public/ok.png";

interface listaPropostaProps {
  proposta: PropostaI;
  propostas: PropostaI[];
  setPropostas: Dispatch<SetStateAction<PropostaI[]>>;
}

function ItemProposta({proposta, propostas, setPropostas}: listaPropostaProps) {
  async function excluirProposta() {
    if (
      confirm(`Confirma Exclusão da Reserva de "${proposta.cliente.nome}"?`)
    ) {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_API}/propostas/${proposta.id}`,
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
        const propostas2 = propostas.filter((x) => x.id != proposta.id);
        setPropostas(propostas2);
        alert("Reserva excluída com sucesso");
      } else {
        alert("Erro... Reserva não foi excluída");
      }
    }
  }

  async function responderProposta() {
    const respostaLoja = prompt(
      `Resposta da Loja para "${proposta.cliente.nome}"`
    );

    if (respostaLoja == null || respostaLoja.trim() == "") {
      return;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}/propostas/${proposta.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
          Authorization: ("Bearer " +
            Cookies.get("admin_logado_token")) as string,
        },
        body: JSON.stringify({resposta: respostaLoja}),
      }
    );

    if (response.status == 200) {
      const propostas2 = propostas.map((x) => {
        if (x.id == proposta.id) {
          return {...x, resposta: respostaLoja};
        }
        return x;
      });
      setPropostas(propostas2);
    }
  }

  return (
    <tr
      key={proposta.id}
      className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
    >
      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
      >
        <img
          src={proposta.tenis.foto}
          alt="Foto do Tênis"
          style={{width: 200}}
        />
      </th>
      <td className={"px-6 py-4"}>{proposta.tenis.modelo}</td>
      <td className={"px-6 py-4"}>
        {Number(proposta.tenis.preco).toLocaleString("pt-br", {
          minimumFractionDigits: 2,
        })}
      </td>
      <td className={`px-6 py-4`}>{proposta.tamanho}</td>
      <td className={`px-6 py-4`}>{proposta.cliente.nome}</td>
      <td className={`px-6 py-4`}>{proposta.resposta}</td>
      <td className="px-6 py-4">
        {proposta.resposta ? (
          <>
            <Image src={OkImage} alt="Ok" width={60} height={60} />
          </>
        ) : (
          <>
            <TiDeleteOutline
              className="text-3xl text-red-600 inline-block cursor-pointer"
              title="Excluir"
              onClick={excluirProposta}
            />
            &nbsp;
            <FaRegEdit
              className="text-3xl text-yellow-600 inline-block cursor-pointer"
              title="Destacar"
              onClick={responderProposta}
            />
          </>
        )}
      </td>
    </tr>
  );
}

export default ItemProposta;
