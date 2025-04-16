import express from 'express'
import cors from 'cors'
import pkg from '@prisma/client';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

const app = express()
app.use(express.json())
app.use(cors('http://localhost:5173'))

/* Users routes */

app.post('/users', async (req, res) => { //Register user
    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    await prisma.user.create({
        data: {
            email: req.body.email,
            name: req.body.name,
            password: hashedPassword,
            document: req.body.document
        }
    })
    
    res.status(201).json(req.body)

})

app.get('/users', async (req, res) => { //Get users

    const users = await prisma.user.findMany()

    res.status(200).json(users)
})

app.put('/users/:id', async (req, res) => { //Update users

    await prisma.user.update({
        where: {
            user_id: req.params.id
        },
        data: {
            email: req.body.email,
            name: req.body.name,
            password: req.body.password,
            document: req.body.document
        }
    })
    
    res.status(201).json(req.body)

})

app.delete('/users/:id', async (req, res) => { //Delete users
    await prisma.user.delete({
        where: {
            user_id: req.params.id
        }
    })

    res.status(200).json({ message: " Usuário Deletado "})
})

/* Autentication Users */

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    if (!token) return res.sendStatus(401)
  
    jwt.verify(token, 'segredo', (err, decoded) => {
      if (err) return res.sendStatus(403)
      
      req.user = decoded // aqui salva o userId no req.user
      next()
    })
  }

  app.get('/me', verifyToken, async (req, res) => {
    const user = await prisma.user.findFirst({
      where: {
        user_id: req.user.user_id
      },
      select: {
        user_id: true,
        name: true,
        email: true,
        document: true,
      }
    })
  
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' })
  
    res.json(user)
  })

  //Rota de Login
  app.post('/login', async (req, res) => {
    const { email, password } = req.body
  
    const user = await prisma.user.findUnique({ where: { email } })
  
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' })
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if (!isPasswordCorrect) {
      return res.status(401).json({ error: 'Credenciais inválidas' })
    }
  
    const token = jwt.sign({ userId: user.user_id }, 'segredo', { expiresIn: '100y' })
    res.json({ token })
  })
  
  // Rota protegida para verificação
  app.get('/verify-token', verifyToken, (req, res) => {
    res.status(200).json({ message: 'Token válido', userId: req.user.userId })
  })  

  app.get('/users', verifyToken, async (req, res) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          user_id: req.user.userId
        }
      })
  
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' })
      }
  
      res.status(200).json(user)
    } catch (error) {
      console.error('Erro ao buscar usuário autenticado:', error)
      res.status(500).json({ error: 'Erro interno do servidor' })
    }
  })

/* Products routes */

app.post('/products/:id', async (req, res) => { //Register products
    try {
        await prisma.products.create({
            data: {
                name: req.body.name.trim().toLowerCase(),
                desc: req.body.desc,
                qnt: parseInt(req.body.qnt),
                value: parseFloat(req.body.value),
                amount: parseFloat(req.body.amount),
                batch: req.body.batch,
                vality: req.body.vality,
                supplier: req.body.supplier
            }
        })

        await prisma.user.update({
            where: {
                user_id: req.params.id
            },
            data: {
                operations: {
                    increment: 1
                }
            }
        })

        res.status(201).json(req.body)
    }
    catch(error) {
        console.error(error)
        res.status(500).json({ error: 'Erro ao registrar o produto.' })
    }
})

app.get('/products', async (req, res) => { //Get products

    const products = await prisma.products.findMany()

    res.status(200).json(products)
})

app.put('/products/:id/:uid', async (req, res) => { //Update products
    try {
        await prisma.products.update({
            where: {
                prod_id: req.params.id
            },
            data: {
                name: req.body.name,
                desc: req.body.desc,
                qnt: req.body.qnt,
                value: req.body.value,
                amount: req.body.amount,
                batch: req.body.batch,
                vality: req.body.vality,
                supplier: req.body.supplier
            }
        })

        await prisma.user.update({
            where: {
                user_id: req.params.uid
            },
            data: {
                operations: {
                    increment: 1
                }
            }
        })
        
        res.status(201).json(req.body)
    }
    catch(error) {
        console.error(error)
        res.status(500).json({ error: 'Erro ao atualizar o produto.' })
    }
})

app.delete('/products/:id/:uid', async (req, res) => { //Delete products
    try {
        await prisma.user.update({
            where: {
                user_id: req.params.uid
            },
            data: {
                operations: {
                    increment: 1
                }
            }
        })

        await prisma.products.delete({
            where: {
                prod_id: req.params.id
            }
        })

        res.status(200).json({ message: " Produto Deletado "})
    }
    catch(error) {
        console.error(error)
        res.status(500).json({ error: 'Erro ao deletar o produto.' })
    }
})

app.listen(3000)