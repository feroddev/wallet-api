import { DateUtils } from './date.utils';

describe('DateUtils', () => {
  describe('createLocalDate', () => {
    it('deve criar uma data com fuso horário preservado', () => {
      const date = DateUtils.createLocalDate(2025, 6, 15);
      
      expect(date.getFullYear()).toBe(2025);
      expect(date.getMonth()).toBe(6);
      expect(date.getDate()).toBe(15);
      expect(date.getHours()).toBe(3); // Hora padrão
    });
  });

  describe('fromDate', () => {
    it('deve criar uma cópia da data preservando o fuso horário', () => {
      const originalDate = new Date(2025, 6, 15, 14, 30, 45);
      const newDate = DateUtils.fromDate(originalDate);
      
      expect(newDate.getFullYear()).toBe(2025);
      expect(newDate.getMonth()).toBe(6);
      expect(newDate.getDate()).toBe(15);
      expect(newDate.getHours()).toBe(14);
      expect(newDate.getMinutes()).toBe(30);
      expect(newDate.getSeconds()).toBe(45);
    });

    it('deve criar uma data a partir de uma string ISO', () => {
      const dateString = '2025-07-15T14:30:45.000Z';
      const date = DateUtils.fromDate(dateString);
      
      // A data será convertida para o fuso horário local
      const localDate = new Date(dateString);
      
      expect(date.getFullYear()).toBe(localDate.getFullYear());
      expect(date.getMonth()).toBe(localDate.getMonth());
      expect(date.getDate()).toBe(localDate.getDate());
      expect(date.getHours()).toBe(localDate.getHours());
      expect(date.getMinutes()).toBe(localDate.getMinutes());
      expect(date.getSeconds()).toBe(localDate.getSeconds());
    });
  });

  describe('createDateInMonth', () => {
    it('deve criar uma data no mês e ano especificados mantendo o dia e hora', () => {
      const sourceDate = new Date(2025, 5, 15, 14, 30, 45);
      const targetDate = DateUtils.createDateInMonth(sourceDate, 7, 2026);
      
      expect(targetDate.getFullYear()).toBe(2026);
      expect(targetDate.getMonth()).toBe(7);
      expect(targetDate.getDate()).toBe(15);
      expect(targetDate.getHours()).toBe(14);
      expect(targetDate.getMinutes()).toBe(30);
      expect(targetDate.getSeconds()).toBe(45);
    });
  });

  describe('setDayOfMonth', () => {
    it('deve ajustar o dia da data', () => {
      const date = new Date(2025, 6, 15);
      const newDate = DateUtils.setDayOfMonth(date, 20);
      
      expect(newDate.getFullYear()).toBe(2025);
      expect(newDate.getMonth()).toBe(6);
      expect(newDate.getDate()).toBe(20);
    });

    it('deve ajustar para o último dia do mês se o dia for maior que o disponível', () => {
      const date = new Date(2025, 1, 15); // Fevereiro
      const newDate = DateUtils.setDayOfMonth(date, 30);
      
      expect(newDate.getFullYear()).toBe(2025);
      expect(newDate.getMonth()).toBe(1);
      expect(newDate.getDate()).toBe(28); // Fevereiro de 2025 tem 28 dias
    });
  });

  describe('startOfMonth', () => {
    it('deve retornar o primeiro dia do mês', () => {
      const date = new Date(2025, 6, 15);
      const startOfMonth = DateUtils.startOfMonth(date);
      
      expect(startOfMonth.getFullYear()).toBe(2025);
      expect(startOfMonth.getMonth()).toBe(6);
      expect(startOfMonth.getDate()).toBe(1);
    });
  });

  describe('endOfMonth', () => {
    it('deve retornar o último dia do mês', () => {
      const date = new Date(2025, 6, 15); // Julho tem 31 dias
      const endOfMonth = DateUtils.endOfMonth(date);
      
      expect(endOfMonth.getFullYear()).toBe(2025);
      expect(endOfMonth.getMonth()).toBe(6);
      expect(endOfMonth.getDate()).toBe(31);
    });
  });
});
