import React from 'react';
import {
  User,
  Building2,
  MapPin,
  Globe,
  Calendar,
  Coins,
  Flag,
  Package,
  Tags,
  Fingerprint
} from 'lucide-react';
import { entityLabels, fallbackLabel } from '../../utils/entityLabels.js';

// Static Icon map lookup to avoid dynamic resolver builds failure in Vite
const iconLookup = {
  User,
  Building2,
  MapPin,
  Globe,
  Calendar,
  Coins,
  Flag,
  Package,
  Tags
};

/**
 * Renders categorized named entities from spaCy
 */
const EntitiesCard = ({ entities }) => {
  if (!entities || entities.length === 0) {
    return (
      <div className="glass-panel rounded-xl p-6 flex flex-col gap-4 h-full">
        <div className="flex items-center gap-2 border-b border-brand-border/40 pb-4">
          <Fingerprint className="w-5 h-5 text-brand-accent shrink-0" />
          <h3 className="text-base font-bold text-gray-100 font-heading">Named Entities</h3>
        </div>
        <p className="text-sm text-gray-500 italic py-4">No named entities were identified.</p>
      </div>
    );
  }

  // Group text values by uppercase labels (deduplicating entries)
  const groupedEntities = {};
  entities.forEach((ent) => {
    const key = ent.label.toUpperCase();
    if (!groupedEntities[key]) {
      groupedEntities[key] = [];
    }
    if (!groupedEntities[key].includes(ent.text)) {
      groupedEntities[key].push(ent.text);
    }
  });

  return (
    <div className="glass-panel rounded-xl p-6 flex flex-col gap-4 h-full">
      
      {/* Header element */}
      <div className="flex items-center gap-2 border-b border-brand-border/40 pb-4">
        <Fingerprint className="w-5 h-5 text-brand-accent shrink-0" />
        <h3 className="text-base font-bold text-gray-100 font-heading">Named Entities</h3>
      </div>

      {/* Categories blocks */}
      <div className="flex flex-col gap-5 flex-1">
        {Object.keys(groupedEntities).map((label) => {
          const config = entityLabels[label] || fallbackLabel;
          const IconComponent = iconLookup[config.icon] || Tags;

          return (
            <div key={label} className="flex flex-col gap-2">
              {/* Category Subheader */}
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                <IconComponent className="w-3.5 h-3.5 text-brand-accent/80 shrink-0" />
                <span className="tracking-wide">{config.title}</span>
              </div>
              
              {/* Entity Value Chips */}
              <div className="flex flex-wrap gap-1.5 pl-5.5">
                {groupedEntities[label].map((text, idx) => (
                  <span
                    key={idx}
                    className="inline-flex text-[11px] font-semibold text-gray-300 bg-brand-surface-elevated/40 border border-brand-border px-2.5 py-1 rounded"
                  >
                    {text}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      
    </div>
  );
};

export default EntitiesCard;
