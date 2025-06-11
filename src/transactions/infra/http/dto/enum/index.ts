export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  CASH = 'CASH',
  BANK_SLIP = 'BANK_SLIP',
  BANK_TRANSFER = 'BANK_TRANSFER',
  PIX = 'PIX',
  INVOICE = 'INVOICE',
  OTHER = 'OTHER'
}

export enum SplitType {
  INSTALLMENT = 'INSTALLMENT',
  RECURRING = 'RECURRING'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID'
}

export enum TransactionType {
  EXPENSE = 'EXPENSE',
  INCOME = 'INCOME',
  INVESTMENT = 'INVESTMENT'
}
