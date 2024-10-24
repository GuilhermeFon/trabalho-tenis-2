"use client";
import "./page.css";
import {useEffect, useState} from "react";
import {useClienteStore} from "@/context/cliente";
import {PropostaI} from "@/utils/types/propostas";

export default function propostas() {
  const [propostas, setPropostas] = useState<PropostaI[]>([]);
  const {cliente} = useClienteStore();

  useEffect(() => {
    async function buscaDados() {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_API}/propostas/${cliente.id}`
      );
      const dados = await response.json();
      setPropostas(dados);
    }
    buscaDados();
  }, []);

  // para retornar apenas a data do campo no banco de dados
  // 2024-10-10T22:46:27.227Z => 10/10/2024
  function dataDMA(data: string) {
    const ano = data.substring(0, 4);
    const mes = data.substring(5, 7);
    const dia = data.substring(8, 10);
    return dia + "/" + mes + "/" + ano;
  }

  const propostasTable = propostas.map((proposta) => {
    return (
      <tr
        id={String(proposta.id)}
        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
      >
        <th
          scope="row"
          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
        >
          {proposta.tenis.modelo}
        </th>
        <td className="px-6 py-4">
          <img
            src={proposta.tenis.foto}
            className="fotoTenis"
            alt="Foto Tenis"
          />
        </td>
        <td className="px-6 py-4">
          <p>
            <b>{proposta.tamanho}</b>
          </p>
        </td>
        <td className="px-6 py-4">
          <p>
            <i>Reservado em: {dataDMA(proposta.createdAt)}</i>
          </p>
        </td>
      </tr>
    );
  });

  return (
    <section className="max-w-7xl mx-auto">
      <h1 className="mb-6 mt-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-5xl dark:text-black">
        Listagem de{" "}
        <span className="underline underline-offset-3 decoration-8 decoration-orange-400 dark:decoration-orange-600">
          Minhas Reservas
        </span>
      </h1>

      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Modelo do Tenis
            </th>
            <th scope="col" className="px-6 py-3">
              Foto
            </th>
            <th scope="col" className="px-6 py-3">
              Tamanho
            </th>
            <th scope="col" className="px-6 py-3">
              Reserva
            </th>
          </tr>
        </thead>
        <tbody id="table">{propostasTable}</tbody>
      </table>
    </section>
  );
}
