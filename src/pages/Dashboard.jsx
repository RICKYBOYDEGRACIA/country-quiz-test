import { useState, useEffect } from "react";
import { fetchQuizQuestions } from "../services/quizService";

export default function Dashboard() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function getQuestions() {
      try {
        setLoading(true);
        const data = await fetchQuizQuestions();
        if (isMounted) {
          setQuestions(data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    }
    getQuestions();
    return () => {
      isMounted = false;
    };
  }, []);

  const currentQuestion = questions[currentIndex];

  const score = Object.entries(userAnswers).reduce((acc, [idx, selected]) => {
    const question = questions[idx];
    return selected === question?.names?.common ? acc + 1 : acc;
  }, 0);

  const handleSelectOption = (option) => {
    // Lock answer selection if this question was already answered
    if (userAnswers[currentIndex] !== undefined) return;

    // Record the answer for current index
    setUserAnswers((prev) => ({
      ...prev,
      [currentIndex]: option,
    }));

    // Auto-advance to next question if not at the last item
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

  // Check state for the currently displayed question
  const currentAnswer = userAnswers[currentIndex];
  const isQuestionAnswered = currentAnswer !== undefined;

  return (
    <div className="flex flex-col justify-center h-screen sm:px-[2rem] md:px-[5rem] lg:px-[10rem] px-[.5rem]">
      <div className="flex items-center justify-between w-full pb-[20px]">
        <div>
          <h1 className="text-[var(--color-white)] font-bold text-[25px]">
            Country Quiz
          </h1>
        </div>
        <div className="flex bg-gradient-primary text-[var(--color-white)] px-[16px] py-[2px] rounded-xl">
          <p>{score}/{questions.length} Points</p>
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

            if (isQuestionAnswered) {
              if (isCorrect) {
                buttonBg = "bg-green-600"; // Always show green for correct answer
              } else if (isSelected) {
                buttonBg = "bg-red-600"; // Show red if user picked wrong option
              }
            }

            return (
              <button
                key={index}
                disabled={isQuestionAnswered}
                onClick={() => handleSelectOption(option)}
                className={`${buttonBg} px-[42px] py-[10px] rounded-lg text-[var(--color-white)] whitespace-nowrap font-medium transition-all duration-200 cursor-pointer disabled:cursor-not-allowed text-center`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}