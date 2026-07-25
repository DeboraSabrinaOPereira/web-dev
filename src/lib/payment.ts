export function detectCardBrand(value: string) {
  const number = value.replace(/\D/g, "");
  if (/^(4011|4312|4389|4514|4576|5041|5066|5090|6277|6362|6363|650|651|655)/.test(number)) {
    return "Elo";
  }
  if (/^4/.test(number)) return "Visa";
  if (/^(5[1-5]|2[2-7])/.test(number)) return "Mastercard";
  if (/^3[47]/.test(number)) return "American Express";
  return "";
}

export function luhnValid(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length < 13) return false;

  let sum = 0;
  let alternate = false;
  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let number = Number(digits[index]);
    if (alternate) {
      number *= 2;
      if (number > 9) number -= 9;
    }
    sum += number;
    alternate = !alternate;
  }
  return sum % 10 === 0;
}

export function expiryValid(value: string) {
  const match = value.match(/^(\d{2})\/(\d{2})$/);
  if (!match) return false;

  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  const today = new Date();
  if (month < 1 || month > 12) return false;

  return (
    year > today.getFullYear() ||
    (year === today.getFullYear() && month >= today.getMonth() + 1)
  );
}

export function createPixKey() {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `00020126580014BR.GOV.BCB.PIX0136${id}5204000053039865802BR5913EDITORA COMPIA6008CAMPINAGRANDE62070503***6304MOCK`;
}
