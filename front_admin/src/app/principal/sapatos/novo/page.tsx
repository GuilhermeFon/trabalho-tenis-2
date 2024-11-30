"use client";
import {useForm} from "react-hook-form";
import Cookies from "js-cookie";
import {toast} from "sonner";
import {useState, useEffect} from "react";
import {MarcaI} from "@/utils/types/marcas";

type Inputs = {
  modelo: string;
  preco: number;
  cor: string;
  foto: string;
  descricao: string;
  marcaId: number;
};

function NovoTenis() {
  const [marcas, setMarcas] = useState<MarcaI[]>([]);
  const {register, handleSubmit, reset, setFocus} = useForm<Inputs>();

  useEffect(() => {
    async function getMarcas() {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/marcas`);
      const dados = await response.json();
      setMarcas(dados);
    }
    getMarcas();
    setFocus("modelo");
  }, []);

  const optionsMarca = marcas.map((marca) => (
    <option key={marca.id} value={marca.id}>
      {marca.nome}
    </option>
  ));

  async function incluirTenis(data: Inputs) {
    const NovoTenis: Inputs = {
      modelo: data.modelo,
      preco: Number(data.preco),
      cor: data.cor,
      foto: data.foto,
      descricao: data.descricao,
      marcaId: Number(data.marcaId),
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/sapatos`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: ("Bearer " +
          Cookies.get("admin_logado_token")) as string,
      },
      body: JSON.stringify(NovoTenis),
    });

    if (response.status == 201) {
      toast.success("Ok! Tênis cadastrado com sucesso");
      reset();
    } else {
      toast.error("Erro no cadastro do Tênis...");
    }
  }

  return (
    <>
      <h1 className="mb-4 mt-24 text-2xl font-bold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white me-56">
        Inclusão de Tênis
      </h1>

      <form className="max-w-xl mx-auto" onSubmit={handleSubmit(incluirTenis)}>
        <div className="mb-3">
          <label
            htmlFor="modelo"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Modelo do Tênis
          </label>
          <input
            type="text"
            id="modelo"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
            {...register("modelo")}
          />
        </div>
        <div className="grid gap-6 mb-3 md:grid-cols-2">
          <div className="mb-3">
            <label
              htmlFor="marcaId"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Marca
            </label>
            <select
              id="marcaId"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
              {...register("marcaId")}
            >
              {optionsMarca}
            </select>
          </div>
          {/* <div className="mb-3">
            <label
              htmlFor="tamanho"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Tamanho
            </label>
            <input
              type="number"
              id="tamanho"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
              {...register("tamanho")}
            />
          </div> */}
        </div>
        <div className="grid gap-6 mb-3 md:grid-cols-2">
          <div className="mb-3">
            <label
              htmlFor="preco"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Preço R$
            </label>
            <input
              type="number"
              id="preco"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
              {...register("preco")}
            />
          </div>
          <div className="mb-3">
            <label
              htmlFor="cor"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Cor
            </label>
            <input
              type="string"
              id="cor"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
              {...register("cor")}
            />
          </div>
        </div>
        <div className="grid gap-6 mb-3 md:grid-cols-2">
          <div className="mb-3">
            <label
              htmlFor="foto"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              URL da Foto
            </label>
            <input
              type="text"
              id="foto"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
              {...register("foto")}
            />
          </div>
        </div>
        <div className="mb-3">
          <label
            htmlFor="sinopse"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Descrição
          </label>
          <textarea
            id="descricao"
            rows={4}
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            {...register("descricao")}
          ></textarea>
        </div>

        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Incluir
        </button>
      </form>
    </>
  );
}

export default NovoTenis;
