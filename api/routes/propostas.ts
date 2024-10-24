import {PrismaClient} from "@prisma/client";
import {Router} from "express";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();
const router = Router();

router.get("/", async (req, res) => {
  try {
    const propostas = await prisma.proposta.findMany({
      include: {
        cliente: true,
        tenis: true,
      },
    });
    res.status(200).json(propostas);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.post("/", async (req, res) => {
  const {clienteId, tenisId, tamanho} = req.body;

  if (!clienteId || !tenisId || !tamanho) {
    res.status(400).json({erro: "Informe clienteId, tenisId e tamanho"});
    return;
  }

  try {
    const proposta = await prisma.proposta.create({
      data: {clienteId, tenisId, tamanho},
    });
    res.status(201).json(proposta);
  } catch (error) {
    res.status(400).json(error);
  }
});

async function enviaEmail(
  nome: string,
  email: string,
  tamanho: number,
  resposta: string
) {
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 587,
    secure: false,
    auth: {
      user: "968f0dd8cc78d9",
      pass: "89ed8bfbf9b7f9",
    },
  });

  const info = await transporter.sendMail({
    from: "guilhermelimafonseca@gmail.com", // sender address
    to: email, // list of receivers
    subject: "Re: Reserva Loja da Pegada", // Subject line
    text: resposta, // plain text body
    html: `<h3>Estimado Cliente: ${nome}</h3>
           <h3>Tamanho: ${tamanho}</h3>
           <h3>Resposta da Reserva: ${resposta}</h3>
           <p>Muito obrigado pelo seu contato</p>
          `,
  });

  console.log("Message sent: %s", info.messageId);
}

router.patch("/:id", async (req, res) => {
  const {id} = req.params;
  const {resposta} = req.body;

  if (!resposta) {
    res.status(400).json({erro: "Informe a resposta desta proposta"});
    return;
  }

  try {
    const proposta = await prisma.proposta.update({
      where: {id: Number(id)},
      data: {resposta},
    });

    const dados = await prisma.proposta.findUnique({
      where: {id: Number(id)},
      include: {
        cliente: true,
      },
    });

    enviaEmail(
      dados?.cliente.nome as string,
      dados?.cliente.email as string,
      dados?.tamanho as number,
      resposta
    );

    res.status(200).json(proposta);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.get("/:clienteId", async (req, res) => {
  const {clienteId} = req.params;
  try {
    const propostas = await prisma.proposta.findMany({
      where: {clienteId},
      include: {
        tenis: true,
      },
    });
    res.status(200).json(propostas);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.put("/:propostaId", async (req, res) => {
  const {propostaId} = req.params;
  const {clienteId, tenisId, tamanho} = req.body; // Exemplo de campos que podem ser atualizados

  try {
    const propostaAtualizada = await prisma.proposta.update({
      where: {id: Number(propostaId)},
      data: {
        clienteId,
        tamanho,
      },
    });
    res.status(200).json(propostaAtualizada);
  } catch (error) {
    res
      .status(400)
      .json({error: "Erro ao atualizar a proposta", details: error});
  }

  router.delete("/:propostaId", async (req, res) => {
    const {propostaId} = req.params;

    try {
      await prisma.proposta.delete({
        where: {id: Number(propostaId)},
      });
      res.status(200).json({message: "Proposta excluída com sucesso"});
    } catch (error) {
      res
        .status(400)
        .json({error: "Erro ao excluir a proposta", details: error});
    }
  });
});

export default router;
