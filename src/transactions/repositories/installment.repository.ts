export abstract class InstallmentRepository {
    abstract create(data: Installment): Promise<Installment>

    abstract find(data: Partial<Installment>): Promise<Installment>

    abstract findMany(data: Partial<Installment>): Promise<Installment[]>

    abstract update(id: string, data: Partial<Installment>): Promise<Installment>

    abstract delete(id: string): Promise<void>
}