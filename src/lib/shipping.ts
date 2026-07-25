import type { ShippingOption } from "../types";

export async function quoteShipping(
  cep: string,
  physicalCount: number,
): Promise<ShippingOption[]> {
  const digits = cep.replace(/\D/g, "");
  if (digits.length !== 8) {
    throw new Error("Informe um CEP com 8 dígitos.");
  }

  const variation = Number(digits.slice(-2)) % 5;
  const volume = Math.max(1, physicalCount);

  await new Promise((resolve) => window.setTimeout(resolve, 350));

  return [
    {
      id: "pac",
      label: "PAC",
      carrier: "Correios",
      price: 14.9 + variation + volume * 1.8,
      days: 7 + variation,
      kind: "delivery",
    },
    {
      id: "sedex",
      label: "SEDEX",
      carrier: "Correios",
      price: 27.9 + variation + volume * 2.7,
      days: 2 + (variation % 2),
      kind: "delivery",
    },
    {
      id: "transportadora",
      label: "Entrega econômica",
      carrier: "Transportadora parceira",
      price: 19.9 + variation + volume * 2.2,
      days: 5 + variation,
      kind: "delivery",
    },
    {
      id: "retirada",
      label: "Retirada na editora",
      carrier: "COMPIA - Campina Grande/PB",
      price: 0,
      days: 0,
      kind: "pickup",
    },
  ];
}
