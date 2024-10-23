import express from 'express'
import cors from 'cors'

import marcasRoutes from './routes/marcas'
import carrosRoutes from './routes/carros'
import fotosRoutes from './routes/fotos'
import clientesRoutes from './routes/clientes'
import propostasRoutes from './routes/propostas'

const app = express()
const port = 3004

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use("/marcas", marcasRoutes)
app.use("/carros", carrosRoutes)
app.use("/fotos", fotosRoutes)
app.use("/clientes", clientesRoutes)
app.use("/propostas", propostasRoutes)

app.get('/', (req, res) => {
  res.send('API: Sistema de Controle de Veículos')
})

app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`)
})