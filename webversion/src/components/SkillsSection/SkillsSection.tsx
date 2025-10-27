/**
 * SkillsSection Component
 *
 * Extracted from combat.tsx (lines 1070-1090) to eliminate code duplication
 * and improve component reusability.
 */

import TabbedItemList from '../tabbedItemList/tabbedItemList';

interface Skill {
  id: string;
  name: string;
  description?: string;
  category?: string;
  type?: string;
  cost?: string;
  prerequisites?: string;
  cooldown?: string;
  effect?: string;
}

interface SkillsSectionProps {
  abilities: Skill[];
  powers: Skill[];
  skillsTabData: any;
  tabbedListRefreshKey: number;
}

const SkillsSection = ({
  abilities,
  powers,
  skillsTabData,
  tabbedListRefreshKey,
}: SkillsSectionProps) => {
  return (
    <div className="combat-section skills-section">
      <TabbedItemList
        key={`abilities-${abilities.length}-powers-${powers.length}-${tabbedListRefreshKey}`}
        title="Habilidades e Poderes"
        titleIcon={
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        }
        tabData={skillsTabData as any}
        defaultTab="abilities"
        colorScheme="orange"
      />
    </div>
  );
};

export default SkillsSection;
