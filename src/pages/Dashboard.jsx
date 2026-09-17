import { useState, useEffect } from "react";
import { fetchQuizQuestions } from "../services/quizService";
import PopModal from "../components/PopModal";

export default function Dashboard() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function for restarts (called from user interaction)
  const restartQuiz = async () => {
    setLoading(true);
    setError(null);
    setUserAnswers({});
    setCurrentIndex(0);
    try {
      const data = await fetchQuizQuestions();
      setQuestions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on mount without synchronous state updates in the effect
  useEffect(() => {
    let isMounted = true;

    fetchQuizQuestions()
      .then((data) => {
        if (isMounted) {
          setQuestions(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const currentQuestion = questions[currentIndex];

  const score = Object.entries(userAnswers).reduce((acc, [idx, selected]) => {
    const question = questions[idx];
    return selected === question?.names?.common ? acc + 1 : acc;
  }, 0);

  const isQuizFinished =
    questions.length > 0 &&
    Object.keys(userAnswers).length === questions.length;

  const handleSelectOption = (option) => {
    if (userAnswers[currentIndex] !== undefined) return;

    setUserAnswers((prev) => ({
      ...prev,
      [currentIndex]: option,
    }));

    if (currentIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 1200);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-[var(--color-white)] font-semibold text-xl">
        Loading Quiz Questions...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-400 font-semibold">
        Error: {error}
      </div>
    );
  }

  const currentAnswer = userAnswers[currentIndex];
  const isQuestionAnswered = currentAnswer !== undefined;

  return (
    <div className="flex flex-col justify-center h-screen sm:px-[2rem] md:px-[5rem] lg:px-[10rem] px-[.5rem]">
      {isQuizFinished && (
        <PopModal
          score={score}
          totalQuestions={questions.length}
          onRestart={restartQuiz}
        />
      )}
      <div className="flex items-center justify-between w-full pb-[20px]">
        <div>
          <h1 className="text-[var(--color-white)] font-bold text-[25px]">
            Country Quiz
          </h1>
        </div>
        <div className="flex bg-gradient-primary text-[var(--color-white)] px-[16px] py-[2px] rounded-xl">
          <p>{score}/{questions.length} Points</p>🏆
        </div>
      </div>

      <div className="flex flex-col items-center bg-[var(--panel-bg)] rounded-xl px-[4rem] py-[2rem]">
        {/* Stepper / Progress indicators */}
        <div className="flex gap-3 flex-wrap justify-center">
          {questions.map((_, idx) => {
            const isAnswered = userAnswers[idx] !== undefined;
            const isCorrect = userAnswers[idx] === questions[idx]?.names?.common;

            let stepperColor = "bg-slate-700";
            if (idx === currentIndex) {
              stepperColor = "bg-gradient-primary font-bold scale-110";
            } else if (isAnswered) {
              stepperColor = isCorrect ? "bg-green-600" : "bg-red-600";
            }

            return (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`px-[9px] py-[3px] rounded-[16px] text-[var(--color-white)] text-[12px] transition-all ${stepperColor}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        <div className="text-[var(--color-white)] py-[32px] flex">
          <h1>
            Which country does this flag{" "}
            <img
              src={
                currentQuestion?.flag?.url_svg || currentQuestion?.flag?.url_png
              }
              alt="Country Flag"
              className="inline-block w-8 h-auto mx-2 rounded shadow-sm align-middle"
            />{" "}
            belong to?
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 xs:auto-cols-min">
          {currentQuestion?.options?.map((option, index) => {
            const isSelected = currentAnswer === option;
            const isCorrect = option === currentQuestion?.names?.common;

            let buttonBg = "bg-gradient-primary";
            let iconSrc = null;

            if (isQuestionAnswered) {
              if (isCorrect) {
                iconSrc = "Check_round_fill.svg";
              } else if (isSelected) {
                iconSrc = "Close_round_fill.svg"
              }
            }

            return (
              <button
                key={index}
                disabled={isQuestionAnswered}
                onClick={() => handleSelectOption(option)}
                className={`${buttonBg} px-[42px] py-[10px] flex justify-center gap-5 rounded-lg text-[var(--color-white)] whitespace-nowrap font-medium transition-all duration-200 cursor-pointer disabled:cursor-not-allowed text-center`}
              >
                {option}
                { iconSrc && (
                  <img
                    src={iconSrc}
                    alt={isCorrect ? "Correct" : "Incorrect"}
                    className="w-5 h-5 inline-block"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}