import Navbar from '../../components/navbar/navbar';
import TabbedItemList from '../../components/tabbedItemList/tabbedItemList';
import type { BaseItem, TabData } from '../../components/tabbedItemList/tabbedItemList';
import './skills.css';

type TabType = 'abilities' | 'powers';

interface Skill extends BaseItem {
  usage?: string;
  cooldown?: string;
  effect?: string;
}

const Skills = () => {
  // Habilidades
  const abilities: Skill[] = [
    {
      id: '1',
      name: 'Fúria Bárbara',
      type: 'Habilidade de Classe',
      description: 'Em batalha, você luta com ferocidade primitiva. No seu turno, você pode entrar em fúria com uma ação bônus.',
      usage: '3 usos por descanso longo',
      cooldown: 'Descanso Longo',
      effect: '+2 dano corpo a corpo, vantagem em testes de Força, resistência a dano físico'
    },
    {
      id: '2',
      name: 'Ação Ardilosa',
      type: 'Habilidade de Classe',
      description: 'Seu pensamento rápido e agilidade fazem você se mover e agir rapidamente. Você pode usar uma ação bônus em cada um de seus turnos em combate.',
      usage: 'Ilimitado',
      effect: 'Realizar ação de Disparada, Desengajar ou Esconder como ação bônus'
    },
    {
      id: '3',
      name: 'Defesa Sem Armadura',
      type: 'Habilidade de Classe',
      description: 'Enquanto você não estiver vestindo armadura nem empunhando um escudo, sua CA é igual a 10 + seu modificador de Destreza + seu modificador de Sabedoria.',
      usage: 'Passivo',
      effect: 'CA = 10 + DES + SAB'
    },
    {
      id: '4',
      name: 'Visão no Escuro',
      type: 'Habilidade Racial',
      description: 'Acostumado à vida nas florestas crepusculares e ao céu noturno, você tem uma visão superior no escuro e na penumbra.',
      usage: 'Passivo',
      effect: 'Visão no escuro até 18 metros'
    }
  ];

  // Poderes
  const powers: Skill[] = [
    {
      id: '1',
      name: 'Sopro Dracônico',
      type: 'Poder Ancestral',
      description: 'Você pode canalizar energia destrutiva através de sua ancestralidade dracônica. Use sua ação para expelir uma onda de energia.',
      usage: '1 uso por descanso curto',
      cooldown: 'Descanso Curto',
      effect: '2d6 de dano elemental em cone de 4,5m'
    },
    {
      id: '2',
      name: 'Imposição de Mãos',
      type: 'Poder Divino',
      description: 'Seu toque abençoado pode curar feridas. Você tem uma reserva de poder curativo que se renova após um descanso longo.',
      usage: '15 pontos por descanso longo',
      cooldown: 'Descanso Longo',
      effect: 'Cura 1d4 + nível de HP por toque'
    },
    {
      id: '3',
      name: 'Sentido Selvagem',
      type: 'Poder Natural',
      description: 'Você pode sentir a presença de criaturas e perigos ao seu redor através de uma conexão com a natureza.',
      usage: '2 usos por descanso longo',
      cooldown: 'Descanso Longo',
      effect: 'Detecta criaturas em 18m por 1 minuto'
    },
    {
      id: '4',
      name: 'Manifestação Psíquica',
      type: 'Poder Mental',
      description: 'Você pode manifestar energia psíquica para criar efeitos telecinéticos menores ou comunicar-se telepaticamente.',
      usage: 'Ilimitado',
      effect: 'Mover objetos de até 5kg ou comunicação telepática 18m'
    }
  ];

  const handleUseSkill = (skill: Skill) => {
    console.log('Using skill:', skill.name);
    // TODO: Implement skill usage logic
  };

  const handleAddItem = (tabKey: TabType) => {
    const itemType = tabKey === 'abilities' ? 'Habilidade' : 'Poder';
    console.log(`Adicionar ${itemType}`);
    // TODO: Implement add item logic (open modal, form, etc.)
  };

  const tabData: TabData<TabType, Skill> = {
    tabs: [
      { key: 'abilities', label: 'Habilidades', icon: '⚡' },
      { key: 'powers', label: 'Poderes', icon: '✨' }
    ],
    items: {
      abilities,
      powers
    },
    getItemFields: (skill) => [
      { label: 'Uso', value: skill.usage },
      { label: 'Recarga', value: skill.cooldown },
      { label: 'Efeito', value: skill.effect, className: 'effect' }
    ],
    getItemBadge: (skill) => 
      skill.usage ? { value: skill.usage, className: 'usage' } : null,
    getActionButtons: (skill) => [
      {
        label: 'Usar Habilidade',
        onClick: () => handleUseSkill(skill),
        className: 'primary',
        show: skill.usage !== 'Passivo'
      }
    ],
    getNoSelectionMessage: (tabKey) => 
      tabKey === 'abilities' 
        ? 'Selecione uma habilidade para ver os detalhes'
        : 'Selecione um poder para ver os detalhes',
    onAddItem: handleAddItem
  };

  return (
    <div className="with-navbar">
      <Navbar showBackButton={true} />
      <div className="skills-container">
        <div className="skills-content">
          <TabbedItemList
            title="Habilidades e Poderes"
            tabData={tabData}
            defaultTab="abilities"
            containerClassName="standalone"
            colorScheme="purple"
          />
        </div>
      </div>
    </div>
  );
};

export default Skills;

