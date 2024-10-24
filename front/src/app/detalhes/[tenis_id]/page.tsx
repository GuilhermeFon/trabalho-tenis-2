"use client";
import {TenisI} from "@/utils/types/tenis";
import {FotoI} from "@/utils/types/fotos";
import {useParams} from "next/navigation";
import {useEffect, useState} from "react";
import {useClienteStore} from "@/context/cliente";
import {useForm} from "react-hook-form";
import {toast} from "sonner";

type Inputs = {
  descricao: string;
};

export default function Detalhes() {
  const params = useParams();
  const {cliente} = useClienteStore();

  const [tenis, setTenis] = useState<TenisI>(); // Estado para armazenar os dados do tênis
  const [fotos, setFotos] = useState<FotoI[]>([]); // Estado para armazenar as fotos do tênis
  const [tamanho, setTamanho] = useState(0); // Estado para armazenar o tamanho selecionado

  const {register, handleSubmit, reset} = useForm<Inputs>();

  useEffect(() => {
    async function buscaDados() {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_API}/sapatos/${params.tenis_id}`
      ); // Chamada para buscar dados do tênis
      const dados = await response.json();
      setTenis(dados); // Armazenando os dados do tênis no estado
    }
    buscaDados();

    async function buscaFotos() {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_API}/fotos/${params.tenis_id}`
      ); // Chamada para buscar fotos do tênis
      const dados = await response.json();
      setFotos(dados); // Armazenando as fotos no estado
    }
    buscaFotos();
  }, []);

  const listaFotos = fotos.map((foto) => (
    <div key={foto.id}>
      {" "}
      {/* Adicionado key para o div */}
      <img
        className="h-auto max-w-80 rounded-lg"
        src={`data:image/jpg;base64, ${foto.codigoFoto}`}
        alt={foto.descricao}
        title={foto.descricao}
      />
    </div>
  ));

  async function enviaProposta(data: Inputs) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}/propostas`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          clienteId: cliente.id,
          tenisId: Number(params.tenis_id),
          tamanho: Number(tamanho),
        }),
      }
    );

    if (response.status == 201) {
      toast.success("Obrigado. Sua reserva foi realizada com sucesso!");
      reset();
    } else {
      toast.error("Erro... Não foi possível realizar sua reserva");
    }
  }

  return (
    <>
      <section className="flex mt-6 mx-auto flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-5xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
        <img
          className="object-cover w-full rounded-t-lg h-96 md:h-2/4 md:w-2/4 md:rounded-none md:rounded-s-lg"
          src={tenis?.foto}
          alt="Foto do Tênis"
        />{" "}
        {/* Exibição da foto do tênis */}
        <div className="flex flex-col justify-between p-4 leading-normal">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {tenis?.marca?.nome} {tenis?.modelo}{" "}
            {/* Exibição da marca e modelo do tênis */}
          </h5>
          <h5 className="mb-2 text-xl tracking-tight text-gray-900 dark:text-white">
            Preço R$:{" "}
            {Number(tenis?.preco) // Exibição do preço do tênis
              .toLocaleString("pt-br", {minimumFractionDigits: 2})}
          </h5>

          {cliente.id ? (
            <>
              <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                Gostou deste Tênis? Faça uma Reserva e retire em nossa loja!
              </h3>
              <form onSubmit={handleSubmit(enviaProposta)}>
                <input
                  type="text"
                  className="mb-2 mt-4 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={`${cliente.nome} (${cliente.email})`}
                  disabled
                  readOnly
                />
                <select
                  value={tamanho}
                  onChange={(e) => setTamanho(Number(e.target.value))}
                  required
                  className="mb-2 mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="" disabled>
                    Selecione um tamanho
                  </option>
                  <option value="34">34</option>
                  <option value="35">35</option>
                  <option value="36">36</option>
                  <option value="37">37</option>
                  <option value="38">38</option>
                  <option value="39">39</option>
                  <option value="40">40</option>
                  <option value="41">41</option>
                  <option value="42">42</option>
                </select>
                <button
                  type="submit"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Reservar
                </button>
              </form>
            </>
          ) : (
            <h3 className="text-xl font-bold tracking-tight text-orange-700 dark:text-white">
              ** Faça login para fazer a proposta deste tênis
            </h3>
          )}
        </div>
      </section>

      <div className="mt-4 md:max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-4">
        {listaFotos} {/* Exibição das fotos do tênis */}
      </div>
    </>
  );
}
