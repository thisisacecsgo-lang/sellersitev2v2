import type { Order, Product } from "@/types";
import { mockProducts } from "@/data/mockData";

export const formatOrderQuantity = (order: Order): string => {
  const product = mockProducts.find(p => p.id === order.productId);
  if (!product) {
    return order.quantity; // Возвращаем исходное количество, если продукт не найден
  }

  const numericValueMatch = order.quantity.match(/(\d+(\.\d+)?)/);
  let numericValue = numericValueMatch ? parseFloat(numericValueMatch[1]) : 0;
  const originalUnitText = order.quantity.replace(String(numericValueMatch ? numericValueMatch[0] : ''), '').trim().toLowerCase();

  let finalUnit = product.priceUnit;

  // Обработка специфических преобразований на основе исходной единицы и единицы измерения продукта
  if (originalUnitText.includes("dozen") && product.priceUnit === "piece") {
    numericValue *= 12; // 1 дюжина = 12 штук
  } else if (originalUnitText.includes("loaf") && product.priceUnit === "kg") {
    // Предполагаем, что 1 буханка хлеба на закваске весит 600 г (0.6 кг)
    numericValue *= 0.6;
  } else if (originalUnitText === "l" && product.priceUnit === "liter") {
    // Нет изменения в числовом значении, просто нормализуем текст единицы
  } else if (originalUnitText.includes("g") && product.priceUnit === "kg") {
    numericValue /= 1000; // Конвертируем граммы в килограммы
  } else if (originalUnitText.includes("kg") && product.priceUnit === "g") {
    numericValue *= 1000; // Конвертируем килограммы в граммы
  }
  // Для других случаев, когда исходная единица уже является priceUnit,
  // numericValue остается как есть, а finalUnit - это priceUnit продукта.

  // Форматируем числовое значение. Используем 0 десятичных знаков для "piece", 2 для остальных.
  const formattedValue = product.priceUnit === "piece" ? numericValue.toFixed(0) : numericValue.toFixed(2);

  return `${formattedValue} ${finalUnit}`;
};