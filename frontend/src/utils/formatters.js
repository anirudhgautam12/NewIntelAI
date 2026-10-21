/**
 * Format timestamp string into clean human-readable date and time
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Format decimal confidence score (e.g. 0.87) or raw number to percentage (e.g. 87%)
 */
export const formatPercentage = (value) => {
  if (value === undefined || value === null) return '0%';
  const multiplier = value <= 1.0 ? 100 : 1;
  return `${Math.round(value * multiplier)}%`;
};

/**
 * Format compression ratio decimal/number into a percentage string
 */
export const formatCompressionRatio = (value) => {
  if (value === undefined || value === null) return '0%';
  const multiplier = value <= 1.0 ? 100 : 1;
  return `${Math.round(value * multiplier)}%`;
};
