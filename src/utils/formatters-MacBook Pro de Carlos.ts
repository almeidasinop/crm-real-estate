/**
 * Formatação de moeda brasileira (BRL)
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

/**
 * Formatação de moeda brasileira com decimais
 */
export const formatCurrencyDetailed = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

/**
 * Formatação de área em metros quadrados
 */
export const formatArea = (value: number): string => {
  return `${value.toLocaleString('pt-BR')} m²`;
};

/**
 * Formatação de números com separadores brasileiros
 */
export const formatNumber = (value: number): string => {
  return value.toLocaleString('pt-BR');
};

/**
 * Formatação de data brasileira
 */
export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('pt-BR');
};

/**
 * Formatação de data e hora brasileira
 */
export const formatDateTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleString('pt-BR');
};

/**
 * Formatação de porcentagem brasileira
 */
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1).replace('.', ',')}%`;
};

/**
 * Formatação de telefone brasileiro
 */
export const formatPhone = (phone: string): string => {
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.length === 11) {
    return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2, 7)}-${cleanPhone.slice(7)}`;
  } else if (cleanPhone.length === 10) {
    return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2, 6)}-${cleanPhone.slice(6)}`;
  }
  
  return phone;
};

/**
 * Conversão de hectares para metros quadrados
 */
export const hectaresToSquareMeters = (hectares: number): number => {
  return hectares * 10000;
};

/**
 * Formatação de área com conversão automática de hectares para m²
 */
export const formatAreaFromHectares = (hectares: number): string => {
  const squareMeters = hectaresToSquareMeters(hectares);
  return formatArea(squareMeters);
};

/**
 * Formatação de distância em quilômetros
 */
export const formatDistance = (value: number): string => {
  return `${value.toLocaleString('pt-BR')} km`;
};

/**
 * Formatação de peso em quilogramas
 */
export const formatWeight = (value: number): string => {
  return `${value.toLocaleString('pt-BR')} kg`;
};

/**
 * Formatação de volume em litros
 */
export const formatVolume = (value: number): string => {
  return `${value.toLocaleString('pt-BR')} L`;
};