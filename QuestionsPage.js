import React, { useState, useEffect } from "react";
import "./QuestionsPage.css";
import Confetti from "react-confetti";

export default function QuestionsPage() {
  const [start, setStart] = useState(false);
  const [quiz, setQuiz] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [end, setEnd] = useState(false);
  const [disableNext, setDisableNext] = useState(true);
  const [perfectScore, setPerfectScore] = useState(0);
  const [formsData, setFormsData] = useState({
    numberOfQuestions: "",
    category: "",
    difficultyLevel: "",
    questionType: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormsData((prevFormsData) => ({
      ...prevFormsData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formsData);
    setStart(true);
  };

  useEffect(() => {
    if (start) {
      const { numberOfQuestions, category, difficultyLevel, questionType } = formsData;
      fetch(
        `https://opentdb.com/api.php?amount=${numberOfQuestions}&category=${category}&difficulty=${difficultyLevel}&type=${questionType}`
      )
        .then((res) => res.json())
        .then((data) => {
          const shuffledQuiz = data.results.map((question) => ({
            ...question,
            answers: shuffleArray([
              ...question.incorrect_answers,
              question.correct_answer,
            ]),
          }));
          setQuiz(shuffledQuiz);
          setPerfectScore(shuffledQuiz.length);
        })
        .catch((error) => console.error("Error fetching quiz data:", error));
    }
  }, [start, formsData]);

  useEffect(() => {
    if (selectedAnswer !== null) {
      setDisableNext(false);
    }
  }, [selectedAnswer]);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleAnswerClick = (answer) => {
    if (selectedAnswer === null) {
      setSelectedAnswer(answer);
      setShowCorrectAnswer(true);
      setDisableNext(false);

      const answerElements = document.querySelectorAll(".answer");
      answerElements.forEach((element) => {
        element.style.pointerEvents = "none";
      });
    }
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === quiz[questionIndex].correct_answer) {
      setScore((prevScore) => prevScore + 1);
    }

    if (questionIndex < quiz.length - 1) {
      setQuestionIndex((prevIndex) => prevIndex + 1);
      setSelectedAnswer(null);
      setShowCorrectAnswer(false);
      setDisableNext(true);

      const answerElements = document.querySelectorAll(".answer");
      answerElements.forEach((element) => {
        element.style.pointerEvents = "auto";
      });
    } else {
      setEnd(true);
    }
  };

  const resetQuiz = () => {
    setStart(false);
    setQuiz([]);
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setShowCorrectAnswer(false);
    setScore(0);
    setEnd(false);
    setDisableNext(true);
  };

  return (
    <div className="page">
      {end && score === perfectScore && <Confetti />}
      <h1>Quizzical</h1>
      <hr />
      {start ? (
        !end ? (
          <div className="container">
            <div className="head">
              <h2>Question {questionIndex + 1}:</h2>
              <button onClick={resetQuiz} className="reset">Reset</button>
            </div>
            <h3>{quiz[questionIndex]?.question}</h3>
            <ul>
              {quiz[questionIndex]?.answers.map((answer, i) => (
                <li
                  key={i}
                  onClick={() => handleAnswerClick(answer)}
                  className="answer"
                  style={{
                    backgroundColor:
                      showCorrectAnswer &&
                      answer === quiz[questionIndex].correct_answer
                        ? "green"
                        : answer === selectedAnswer
                        ? "red"
                        : "",
                    color:
                      showCorrectAnswer &&
                      answer === quiz[questionIndex].correct_answer
                        ? "white"
                        : "black",
                  }}
                >
                  {answer}
                </li>
              ))}
            </ul>
            <button onClick={handleNextQuestion} disabled={disableNext}>
              Next
            </button>
            <div className="index">
              {`${questionIndex + 1} of ${quiz.length} questions`}
            </div>
          </div>
        ) : (
          <div className="container">
            <h2>Your Score</h2>
            <p>You scored: {score} out of {quiz.length}</p>
            {score === perfectScore && (
              <p>Congratulations! You achieved a perfect score!</p>
            )}
            <button onClick={resetQuiz}>Play Again</button>
          </div>
        )
      ) : (
        <div className="instructions">
          <h2>Welcome to Quizzical!</h2>
          <p>
            Get ready to test your knowledge across a wide range of topics, from
            pop culture and history to science and sports. Whether you're a
            trivia buff or just looking for some fun, Quizzical has something for
            everyone.
          </p>
          <h3>Here's what you can expect:</h3>
            <ul>
              <li>
                <strong>Diverse Categories:</strong> Choose from an array of
                topics to challenge yourself.
              </li>
              <li>
                <strong>Timed Rounds:</strong> Race against the clock to score the
                highest points.
              </li>
              <li>
                <strong>Leaderboard:</strong> See how you stack up against other
                players.
              </li>
              <li>
                <strong>Multiplayer Mode:</strong> Invite friends or join a random
                match to compete head-to-head.
              </li>
            </ul>
            <p>
              Join us now and start quizzing! Are you ready to become the quiz
              master?
            </p>
            <form onSubmit={handleSubmit}>
            <input
                id="numberOfQuestions"
                type="number"
                name="numberOfQuestions"
                onChange={handleChange}
                value={formsData.numberOfQuestions}
                placeholder="Number of Questions"
                className="numberOfQuestions"
                required
              />
              <br />
              <select
                id="category"
                value={formsData.category}
                onChange={handleChange}
                name="category"
                className="category"
                required
              >
                <option value="">Select Category</option>
                <option value="9">General Knowledge</option>
                <option value="10">Entertainment: Books</option>
                <option value="11">Entertainment: Film</option>
                <option value="12">Entertainment: Music</option>
                <option value="13">Entertainment: Musicals & Theatres</option>
                <option value="14">Entertainment: Television</option>
                <option value="15">Entertainment: Video Games</option>
                <option value="16">Entertainment: Board Games</option>
                <option value="17">Science & Nature</option>
                <option value="18">Science: Computers</option>
                <option value="19">Science: Mathematics</option>
                <option value="20">Mythology</option>
                <option value="21">Sports</option>
                <option value="22">Geography</option>
                <option value="23">History</option>
                <option value="24">Politics</option>
                <option value="25">Art</option>
                <option value="26">Celebrities</option>
                <option value="27">Animals</option>
                <option value="28">Vehicles</option>
                <option value="29">Entertainment: Comics</option>
                <option value="30">Science: Gadgets</option>
                <option value="31">Entertainment: Japanese Anime & Manga</option>
                <option value="32">Entertainment: Cartoon & Animations</option>
              </select>
              <br />
              <select
                id="difficultyLevel"
                value={formsData.difficultyLevel}
                onChange={handleChange}
                name="difficultyLevel"
                className="difficultyLevel"
                required
              >
                <option value="">Select Difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <br />
              <select
                id="questionType"
                value={formsData.questionType}
                onChange={handleChange}
                name="questionType"
                className="questionType"
                required
              >
                <option value="">Select Question Type</option>
                <option value="multiple">Multiple Choice</option>
                <option value="boolean">True/False</option>
              </select>
              <br />


            <button type="submit" className="start-button">
              Start
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
