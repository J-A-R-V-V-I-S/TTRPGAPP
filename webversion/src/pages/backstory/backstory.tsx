import Navbar from '../../components/navbar/navbar';
import BackstoryComponent from '../../components/backstory/backstory';
import { useCharacter } from '../../contexts/CharacterContext';
import './backstory.css';

const BackstoryPage = () => {
  const { character, updateBackstory, updateBackstorySecret } = useCharacter();

  const handleBackstoryChange = async (value: string) => {
    console.log('Backstory changed:', value);
    try {
      await updateBackstory(value);
    } catch (err) {
      console.error('Erro ao atualizar backstory:', err);
    }
  };

  const handleSecretChange = async (isSecret: boolean) => {
    console.log('Backstory secret status changed:', isSecret);
    try {
      await updateBackstorySecret(isSecret);
    } catch (err) {
      console.error('Erro ao atualizar status de backstory secreta:', err);
    }
  };

  return (
    <div className="with-navbar">
      <Navbar showBackButton={true} />
      <div className="backstory-page-container">
        <div className="backstory-page-content">
          <div className="backstory-page-header">
            <h1 className="backstory-page-title">História do Personagem</h1>
            <p className="backstory-page-subtitle">
              Conte a história do seu personagem, suas origens, motivações e experiências
            </p>
          </div>
          
          <div className="backstory-page-editor">
            <BackstoryComponent 
              initialValue={character?.backstory || ''}
              placeholder="Escreva a história do seu personagem...&#10;&#10;• De onde você veio?&#10;• Quais são suas motivações?&#10;• Que eventos moldaram sua vida?&#10;• Quem são as pessoas importantes para você?&#10;• Quais são seus objetivos?"
              onChange={handleBackstoryChange}
              isSecret={character?.is_backstory_secret || false}
              onSecretChange={handleSecretChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackstoryPage;

