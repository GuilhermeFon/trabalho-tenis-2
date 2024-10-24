'use client'
import { InputPesquisa } from "@/components/InputPesquisa"
import { ItemTenis } from "@/components/itemTenis";
import { TenisI } from "@/utils/types/tenis";
import { useEffect, useState } from "react";
import { Toaster } from 'sonner'
import { useClienteStore } from "@/context/cliente";

export default function Home() {
  const [tenis, setTenis] = useState<TenisI[]>([])
  const { logaCliente } = useClienteStore()

  useEffect(() => {

    async function buscaCliente(idCliente: string) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/clientes/${idCliente}`)
      if (response.status == 200) {
        const dados = await response.json()
        logaCliente(dados)
      }
    }

    if (localStorage.getItem("client_key")) {
      const idClienteLocal = localStorage.getItem("client_key") as string
      buscaCliente(idClienteLocal)
    }

    async function buscaDados() {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/sapatos`) 
      const dados = await response.json()
      setTenis(dados) 
    }
    buscaDados()
  }, [])

  const listaTenis = tenis.map(tenis => ( // Alterado para listaTenis
    <ItemTenis data={tenis} key={tenis.id} /> // Alterado para tenis
  ))

  return (
    <main>
      <InputPesquisa setTenis={setTenis} /> 

      <section className="max-w-screen-xl mx-auto">
        <h1 className="mb-5 mt-2 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-5xl dark:text-black">Tênis <span className="underline underline-offset-3 decoration-8 decoration-blue-900 dark:decoration-blue-400">em destaque</span></h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {listaTenis} {/* Alterado para listaTenis */}
        </div>

      </section>
      <Toaster position="top-right" richColors />
    </main>
  );
}
