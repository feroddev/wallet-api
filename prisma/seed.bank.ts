import {
  PrismaClient,
  CategoryType,
  PaymentMethod,
  TransactionType,
  Plan,
  Category
} from '@prisma/client'
import { addMonths, subDays, subMonths } from 'date-fns'

const prisma = new PrismaClient()
const userId = '96b7c31e-a953-4fbc-9992-0f8cbd1c56aa'

async function main() {
  // Limpar dados existentes
  await cleanDatabase()

  const categories = await getCategories()

  // Criar cartões de crédito
  const creditCards = await createCreditCards()

  // Criar faturas
  const invoices = await createInvoices(creditCards)

  // Criar transações
  await createTransactions(categories, creditCards, invoices)

  // Criar planos do usuário
  await createUserPlans()

  // Criar orçamentos
  await createBudgets(categories)

  // Criar contas a pagar
  await createBillsToPay()

  // Criar metas financeiras
  await createGoals()

  console.log('Seed executado com sucesso!')
}

async function cleanDatabase() {
  // Limpar dados existentes para o usuário específico
  await prisma.transaction.deleteMany({ where: { userId } })
  await prisma.invoice.deleteMany({ where: { userId } })
  await prisma.category.deleteMany()
  await prisma.creditCard.deleteMany({ where: { userId } })
  await prisma.userPlan.deleteMany({ where: { userId } })
  await prisma.budget.deleteMany({ where: { userId } })
  await prisma.recurringBill.deleteMany({ where: { userId } })
  await prisma.goal.deleteMany({ where: { userId } })
}

async function getCategories() {
  return await prisma.category.findMany()
}

async function createCreditCards() {
  const creditCard1 = await prisma.creditCard.create({
    data: {
      userId,
      cardName: 'Nubank',
      lastDigits: 1234,
      limit: 5000,
      closingDay: 10,
      dueDay: 15
    }
  })

  const creditCard2 = await prisma.creditCard.create({
    data: {
      userId,
      cardName: 'Itaú',
      lastDigits: 5678,
      limit: 8000,
      closingDay: 20,
      dueDay: 25
    }
  })

  return [creditCard1, creditCard2]
}

async function createInvoices(creditCards) {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const invoices = []

  // Criar faturas para os últimos 2 meses e próximo mês para cada cartão
  for (const card of creditCards) {
    for (let i = -1; i <= 1; i++) {
      const invoiceDate = new Date(currentYear, currentMonth + i, 1)
      const month = invoiceDate.getMonth() + 1
      const year = invoiceDate.getFullYear()

      const closingDate = new Date(year, month - 1, card.closingDay)
      const dueDate = new Date(year, month - 1, card.dueDay)

      // Se a data de fechamento já passou, a fatura do próximo mês deve ser considerada
      if (closingDate < now && i === 0) {
        closingDate.setMonth(closingDate.getMonth() + 1)
        dueDate.setMonth(dueDate.getMonth() + 1)
      }

      const isPaid = i < 0 // Faturas passadas estão pagas

      const invoice = await prisma.invoice.create({
        data: {
          userId,
          creditCardId: card.id,
          month,
          year,
          totalAmount: i < 0 ? 1500 + i * 200 : 0, // Valor para faturas passadas
          isPaid,
          paidAt: isPaid ? subDays(now, 15 * Math.abs(i)) : null,
          closingDate,
          dueDate
        }
      })

      invoices.push(invoice)
    }
  }

  return invoices
}

async function createTransactions(categories, creditCards, invoices) {
  const transactions = []
  const now = new Date()

  // Obter categorias por tipo
  const expenseCategories = categories.filter(
    (c) => c.type === CategoryType.EXPENSE
  )
  const incomeCategories = categories.filter(
    (c) => c.type === CategoryType.INCOME
  )
  const investmentCategories = categories.filter(
    (c) => c.type === CategoryType.INVESTMENT
  )

  // Criar transações de despesas
  for (let i = 0; i < 10; i++) {
    const date = subDays(now, i * 3)
    const category = expenseCategories[i % expenseCategories.length]

    const transaction = await prisma.transaction.create({
      data: {
        userId,
        categoryId: category.id,
        name: `Despesa ${i + 1}`,
        type: TransactionType.EXPENSE,
        description: `Descrição da despesa ${i + 1}`,
        paymentMethod:
          i % 2 === 0 ? PaymentMethod.CREDIT_CARD : PaymentMethod.DEBIT_CARD,
        date,
        totalAmount: 100 + i * 50,
        isPaid: true,
        isRecurring: i % 3 === 0,
        creditCardId:
          i % 2 === 0 ? creditCards[i % creditCards.length].id : null
      }
    })

    transactions.push(transaction)
  }

  // Criar transações de receitas
  for (let i = 0; i < 5; i++) {
    const date = subDays(now, i * 7)
    const category = incomeCategories[i % incomeCategories.length]

    const transaction = await prisma.transaction.create({
      data: {
        userId,
        categoryId: category.id,
        name: `Receita ${i + 1}`,
        type: TransactionType.INCOME,
        description: `Descrição da receita ${i + 1}`,
        paymentMethod: PaymentMethod.BANK_TRANSFER,
        date,
        totalAmount: 2000 + i * 500,
        isPaid: true,
        isRecurring: i === 0 // Apenas a primeira é recorrente (salário)
      }
    })

    transactions.push(transaction)
  }

  for (let i = 0; i < 3; i++) {
    const date = subDays(now, i * 15)
    const category = investmentCategories[i % investmentCategories.length]

    const transaction = await prisma.transaction.create({
      data: {
        userId,
        categoryId: category.id,
        name: `Investimento ${i + 1}`,
        type: TransactionType.INVESTMENT,
        description: `Descrição do investimento ${i + 1}`,
        paymentMethod: PaymentMethod.BANK_TRANSFER,
        date,
        totalAmount: 500 + i * 250,
        isPaid: true,
        isRecurring: false
      }
    })

    transactions.push(transaction)
  }

  return transactions
}

async function createUserPlans() {
  // Plano atual
  await prisma.userPlan.create({
    data: {
      userId,
      plan: Plan.PREMIUM,
      startDate: subMonths(new Date(), 1),
      endDate: addMonths(new Date(), 11) // 12 meses de plano
    }
  })

  // Plano anterior
  await prisma.userPlan.create({
    data: {
      userId,
      plan: Plan.BASIC,
      startDate: subMonths(new Date(), 13),
      endDate: subMonths(new Date(), 1)
    }
  })
}

async function createBudgets(categories: Category[]) {
  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentYear = now.getFullYear()

  // Criar orçamentos para o mês atual
  for (let i = 0; i < 5; i++) {
    await prisma.budget.upsert({
      where: {
        userId_categoryId: {
          userId,
          categoryId: categories[i].id
        }
      },
      create: {
        userId,
        categoryId: categories[i].id,
        limit: 500 + i * 200
      },
      update: {
        userId,
        categoryId: categories[i].id,
        limit: 500 + i * 200
      }
    })
  }

  for (let i = 0; i < 5; i++) {
    const category = categories[i]

    await prisma.budget.upsert({
      where: {
        userId_categoryId: {
          userId,
          categoryId: category.id
        }
      },
      create: {
        userId,
        categoryId: category.id,
        limit: 600 + i * 200
      },
      update: {
        userId,
        categoryId: category.id,
        limit: 600 + i * 200
      }
    })
  }
}

async function createBillsToPay() {
  const now = new Date()

  // Conta recorrente
  await prisma.recurringBill.create({
    data: {
      userId,
      name: 'Aluguel',
      description: 'Pagamento mensal do aluguel',
      amount: 1200,
      recurrenceDay: 10
    }
  })

  // Conta não recorrente
  await prisma.recurringBill.create({
    data: {
      userId,
      name: 'IPTU',
      description: 'Imposto anual',
      amount: 800,
      recurrenceDay: 10
    }
  })

  // Conta já paga
  await prisma.recurringBill.create({
    data: {
      userId,
      name: 'Internet',
      description: 'Fatura mensal de internet',
      amount: 120,
      recurrenceDay: 15
    }
  })
}

async function createGoals() {
  const now = new Date()

  // Meta de curto prazo
  await prisma.goal.create({
    data: {
      userId,
      name: 'Viagem de férias',
      description: 'Viagem para a praia no final do ano',
      targetValue: 5000,
      savedValue: 2000,
      deadline: addMonths(now, 6)
    }
  })

  // Meta de longo prazo
  await prisma.goal.create({
    data: {
      userId,
      name: 'Comprar um carro',
      description: 'Juntar dinheiro para entrada de um carro novo',
      targetValue: 20000,
      savedValue: 5000,
      deadline: addMonths(now, 24)
    }
  })

  // Meta quase concluída
  await prisma.goal.create({
    data: {
      userId,
      name: 'Novo notebook',
      description: 'Comprar um notebook para trabalho',
      targetValue: 4000,
      savedValue: 3800,
      deadline: addMonths(now, 1)
    }
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
