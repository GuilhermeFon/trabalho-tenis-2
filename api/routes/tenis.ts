import { PrismaClient } from "@prisma/client"
import { Router } from "express"

const prisma = new PrismaClient()
const router = Router()

router.get("/", async (req, res) => {
  try {
    const tenis = await prisma.tenis.findMany({
      include: {
        marca: true
      }
    })
    res.status(200).json(tenis)
  } catch (error) {
    res.status(400).json(error)
  }
})

router.post("/", async (req, res) => {
  const { modelo, tamanho, preco, cor, foto, descricao, marcaId } = req.body

  if (!modelo || !tamanho || !preco || !cor || !foto || !descricao || !marcaId) {
    res.status(400).json({ "erro": "Informe modelo, tamanho, preco, cor, foto, descricao e marcaId" })
    return
  }

  try {
    const tenis = await prisma.tenis.create({
      data: { modelo, tamanho, preco, cor, foto, descricao, marcaId }
    })
    res.status(201).json(tenis)
  } catch (error) {
    res.status(400).json(error)
  }
})

router.delete("/:id", async (req, res) => {
  const { id } = req.params

  try {
    const tenis = await prisma.tenis.delete({
      where: { id: Number(id) }
    })
    res.status(200).json(tenis)
  } catch (error) {
    res.status(400).json(error)
  }
})

router.put("/:id", async (req, res) => {
  const { id } = req.params
  const { modelo, tamanho, preco, cor, foto, descricao, marcaId } = req.body

  if (!modelo || !tamanho || !preco || !cor || !foto || !descricao || !marcaId) {
    res.status(400).json({ "erro": "Informe modelo, tamanho, preco, cor, foto, descricao e marcaId" })
    return
  }

  try {
    const tenis = await prisma.tenis.update({
      where: { id: Number(id) },
      data: { modelo, tamanho, preco, cor, foto, descricao, marcaId }
    })
    res.status(200).json(tenis)
  } catch (error) {
    res.status(400).json(error)
  }
})

router.get("/pesquisa/:termo", async (req, res) => {
  const { termo } = req.params

  // tenta converter o termo em número
  const termoNumero = Number(termo)

  // se a conversão gerou um NaN (Not a Number)
  if (isNaN(termoNumero)) {
    try {
      const tenis = await prisma.tenis.findMany({
        include: {
          marca: true
        },
        where: {
          OR: [
            { modelo: { contains: termo }},
            { marca: { nome: termo }}
          ]
        }
      })
      res.status(200).json(tenis)
    } catch (error) {
      res.status(400).json(error)
    }
  } else {
    try {
      const tenis = await prisma.tenis.findMany({
        include: {
          marca: true
        },
        where: {
          OR: [
            { preco: { lte: termoNumero }},
            { tamanho: termoNumero }
          ]
        }
      })
      res.status(200).json(tenis)
    } catch (error) {
      res.status(400).json(error)
    }
  }
})

router.get("/:id", async (req, res) => {
  const { id } = req.params

  try {
    const tenis = await prisma.tenis.findUnique({
      where: { id: Number(id)},
      include: {
        marca: true
      }
    })
    res.status(200).json(tenis)
  } catch (error) {
    res.status(400).json(error)
  }
})

export default router
