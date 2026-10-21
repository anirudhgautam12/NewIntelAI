/**
 * Map spaCy entity labels (GPE, ORG, PERSON, etc.) to user-friendly names
 * and target Lucide icons.
 */
export const entityLabels = {
  PERSON: {
    title: 'People',
    icon: 'User'
  },
  ORG: {
    title: 'Organizations',
    icon: 'Building2'
  },
  GPE: {
    title: 'Places',
    icon: 'MapPin'
  },
  LOC: {
    title: 'Locations',
    icon: 'Globe'
  },
  DATE: {
    title: 'Dates',
    icon: 'Calendar'
  },
  MONEY: {
    title: 'Monetary Values',
    icon: 'Coins'
  },
  EVENT: {
    title: 'Events',
    icon: 'Flag'
  },
  PRODUCT: {
    title: 'Products',
    icon: 'Package'
  }
};

/**
 * Fallback config for untracked entity types
 */
export const fallbackLabel = {
  title: 'Other Entities',
  icon: 'Tags'
};
