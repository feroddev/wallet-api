import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const categories = [
    'Alimentação',
    'Transporte',
    'Moradia',
    'Saúde',
    'Educação',
    'Lazer e Entretenimento',
    'Contas fixas',
    'Roupas e Acessórios',
    'Beleza e Cuidados Pessoais',
    'Casa e Decoração',
    'Tecnologia',
    'Serviços',
    'Despesas Diversas',
    'Fatura do Cartão',
    'Outros'
  ]

  for (const category of categories) {
    await prisma.category.create({
      data: { name: category, type: 'EXPENSE' }
    })
  }

  const incomes = ['Salário', 'Rendimentos', 'Outros']

  for (const income of incomes) {
    await prisma.category.create({
      data: { name: income, type: 'INCOME' }
    })
  }

  const investments = [
    'Tesouro Direto',
    'CDB',
    'Fundo Imobiliário (FII)',
    'Meta Financeira',
    'Ações',
    'Criptomoedas',
    'Outros'
  ]

  for (const investment of investments) {
    await prisma.category.create({
      data: { name: investment, type: 'INVESTMENT' }
    })
  }

  console.log('Categorias criadas com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
