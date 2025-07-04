/**
 * Utilitário para manipulação de datas com preservação de fuso horário
 */
export class DateUtils {
  /**
   * Cria uma data preservando o fuso horário local
   * @param year Ano
   * @param month Mês (0-11)
   * @param day Dia
   * @param hours Hora (opcional, padrão 3 para garantir que a data não mude com o fuso horário)
   * @param minutes Minutos (opcional)
   * @param seconds Segundos (opcional)
   * @returns Data com fuso horário preservado
   */
  static createLocalDate(
    year: number,
    month: number,
    day: number,
    hours = 3,
    minutes = 0,
    seconds = 0
  ): Date {
    return new Date(year, month, day, hours, minutes, seconds);
  }

  /**
   * Cria uma data a partir de uma string ISO ou objeto Date, preservando o fuso horário
   * @param date Data de origem
   * @returns Nova data com mesmo fuso horário
   */
  static fromDate(date: Date | string): Date {
    const sourceDate = typeof date === 'string' ? new Date(date) : date;
    return new Date(
      sourceDate.getFullYear(),
      sourceDate.getMonth(),
      sourceDate.getDate(),
      sourceDate.getHours(),
      sourceDate.getMinutes(),
      sourceDate.getSeconds()
    );
  }

  /**
   * Cria uma data para o mesmo dia em outro mês/ano, preservando o fuso horário
   * @param sourceDate Data de origem
   * @param targetMonth Mês alvo (0-11)
   * @param targetYear Ano alvo
   * @returns Nova data no mês/ano alvo com mesmo dia e hora
   */
  static createDateInMonth(
    sourceDate: Date,
    targetMonth: number,
    targetYear: number
  ): Date {
    return new Date(
      targetYear,
      targetMonth,
      sourceDate.getDate(),
      sourceDate.getHours(),
      sourceDate.getMinutes(),
      sourceDate.getSeconds()
    );
  }

  /**
   * Ajusta o dia da data, verificando se é válido para o mês
   * @param date Data a ser ajustada
   * @param day Dia desejado
   * @returns Data ajustada
   */
  static setDayOfMonth(date: Date, day: number): Date {
    const result = new Date(date);
    const lastDayOfMonth = new Date(
      result.getFullYear(),
      result.getMonth() + 1,
      0
    ).getDate();
    
    result.setDate(Math.min(day, lastDayOfMonth));
    return result;
  }
  
  /**
   * Retorna o primeiro dia do mês da data fornecida
   * @param date Data de referência
   * @returns Data representando o primeiro dia do mês
   */
  static startOfMonth(date: Date): Date {
    return this.createLocalDate(
      date.getFullYear(),
      date.getMonth(),
      1
    );
  }
  
  /**
   * Retorna o último dia do mês da data fornecida
   * @param date Data de referência
   * @returns Data representando o último dia do mês
   */
  static endOfMonth(date: Date): Date {
    return this.createLocalDate(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    );
  }
}
