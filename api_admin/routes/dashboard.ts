import {PrismaClient} from "@prisma/client";
import {Router} from "express";

const prisma = new PrismaClient();
const router = Router();

router.get("/gerais", async (req, res) => {
  try {
    const clientes = await prisma.cliente.count();
    const sapatos = await prisma.tenis.count();
    const propostas = await prisma.proposta.count();
    res.status(200).json({clientes, sapatos, propostas});
  } catch (error) {
    res.status(400).json(error);
  }
});

router.get("/sapatosMarca", async (req, res) => {
  try {
    const sapatos = await prisma.tenis.groupBy({
      by: ["marcaId"],
      _count: {
        id: true,
      },
    });

    // Para cada tenis, inclui o nome da marca relacionada ao marcaId
    const sapatosMarca = await Promise.all(
      sapatos.map(async (tenis) => {
        const marca = await prisma.marca.findUnique({
          where: {id: tenis.marcaId},
        });
        return {
          marca: marca?.nome,
          num: tenis._count.id,
        };
      })
    );
    res.status(200).json(sapatosMarca);
  } catch (error) {
    res.status(400).json(error);
  }
});

export default router;
