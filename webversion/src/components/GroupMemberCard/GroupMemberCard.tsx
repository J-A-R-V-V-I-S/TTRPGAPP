/**
 * GroupMemberCard Component
 *
 * Extracted from group.tsx (lines 768-819) to eliminate code duplication
 * and improve component reusability.
 */

import {
  calculateHpPercentage,
  getGroupMemberStatus,
  getStatusColor,
  getStatusLabel,
} from '../../utils/groupHelpers';
import './GroupMemberCard.css';

interface Character {
  id: string;
  name: string;
  class: string;
  race: string;
  level: number;
  current_health: number;
  max_health: number;
  profile_img: string | null;
}

interface GroupMemberCardProps {
  character: Character;
}

const GroupMemberCard = ({ character }: GroupMemberCardProps) => {
  const hpPercentage = calculateHpPercentage(character.current_health, character.max_health);
  const status = getGroupMemberStatus(character.current_health, character.max_health);

  return (
    <div className="member-card">
      <div className="member-header">
        <div className="member-avatar">
          {character.profile_img ? (
            <img src={character.profile_img} alt={character.name} />
          ) : (
            <div className="avatar-placeholder">{character.name.charAt(0)}</div>
          )}
        </div>
        <div className="member-info">
          <h3 className="member-name">{character.name}</h3>
          <p className="member-details">
            {character.race} {character.class} - Nível {character.level}
          </p>
        </div>
      </div>

      <div className="member-hp-section">
        <div className="hp-header">
          <span className="hp-label">Pontos de Vida</span>
          <span className="hp-values">
            {character.current_health} / {character.max_health}
          </span>
        </div>
        <div className="hp-bar">
          <div
            className="hp-fill"
            style={{
              width: `${hpPercentage}%`,
              backgroundColor: getStatusColor(status),
            }}
          />
        </div>
      </div>

      <div className="member-status">
        <span
          className="status-badge"
          style={{
            backgroundColor: `${getStatusColor(status)}20`,
            color: getStatusColor(status),
            borderColor: getStatusColor(status),
          }}
        >
          {getStatusLabel(status)}
        </span>
      </div>
    </div>
  );
};

export default GroupMemberCard;
