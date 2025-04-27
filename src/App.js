//css
import './App.css';
//react
import {useCallback, useEffect, useState} from "react";
//data 
import {wordsList} from "./data/words";
//components
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages = [
  {id: 1, name: "start"},
  {id: 2, name: "game"},
  {id: 3, name: "end"},
];

const guessesQtd = 3;

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);
  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setguessedLetters] = useState([]); //letras acertadas
  const [wrongLetters, setWrongLetters] = useState([]); //letras erradas
  const [guesses, setGuesses] = useState(guessesQtd) //chances
  const [score, setScore] = useState(0); //score

  const pickWordAndCategory = useCallback(() => {
    //escolhe uma categoria aleatória
    const categories = Object.keys(words);
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)];
    //seleciona uma palavra aleatória
    const word = words[category][Math.floor(Math.random() * words[category].length)];

    return {word, category};
  }, [words]);

  //inicia o jogo
  const startGame = useCallback(() => {
    clearLetterState();
    //pega uma palavra e categoria
    const {word, category} = pickWordAndCategory();
    let wordLetters = word.split("");
    wordLetters = wordLetters.map((l) => l.toLowerCase());
    console.log(word, category);
    console.log(wordLetters);
    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);
    setGameStage(stages[1].name)
  },[pickWordAndCategory]);

  //verifica a letra
  const verifyLetter = (letter) => {
    console.log(letter);
    const normalizedLetter = letter.toLowerCase();

    //checa se a letra já foi usada - se consta nos acertos ou erros
    if(guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)){
      return;
    }

    //verifica se uma letra correta ou não
    if(letters.includes(normalizedLetter)){
      setguessedLetters((guessedLetters) => [
        ...guessedLetters, normalizedLetter,
      ]);
    } else{
      setWrongLetters((guessedLetters) => [
        ...guessedLetters, normalizedLetter
      ]);
      setGuesses((guesses) => guesses - 1);
    }
  }

  const clearLetterState = () => {
    setguessedLetters([]);
    setWrongLetters([]);
    setGuesses(guessesQtd);
  }

  //monitora as chances para ver se já bateu todas
  useEffect(() => {
    if(guesses <= 0){
      //limpar as variáveis do jogo
      clearLetterState();
      setGameStage(stages[2].name);
    }
  }, [guesses]);

  //verifica condição de vitória
  useEffect(() => {
    const uniqueLetters = [... new Set(letters)];
    //vitória
    if(guessedLetters.length === uniqueLetters.length){
      setScore((score) => (score += 100));
      startGame();
    }
  }, [guessedLetters, letters, startGame])

  //tentar novamente
  const retry = () => {
    setScore(0);
    setGuesses(guessesQtd);
    setGameStage(stages[0].name);
  }

  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame={startGame}/>}
      {gameStage === "game" && <Game verifyLetter={verifyLetter} pickedCategory={pickedCategory} pickedWord={pickedWord} letters={letters} guesses={guesses} guessedLetters={guessedLetters} wrongLetters={wrongLetters} score={score}/>}
      {gameStage === "end" && <GameOver retry={retry} score={score}/>}
    </div>
  );
}

export default App;
