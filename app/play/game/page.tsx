"use client";

import { useEffect, useState, useCallback, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { completeGame, getGameQuestions, checkAnswer } from "@/app/actions/game";
import { formatTime, TOTAL_QUESTIONS, PENALTY_MS } from "@/lib/utils";
import { SafeQuizQuestion } from "@/types";

function GameContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("id");

  const [questions, setQuestions] = useState<SafeQuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [penaltyCount, setPenaltyCount] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerState, setAnswerState] = useState<
    "idle" | "checking" | "correct" | "incorrect"
  >("idle");
  const [correctIndex, setCorrectIndex] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [loading, setLoading] = useState(true);
  const [penaltyFlash, setPenaltyFlash] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const answersRef = useRef<number[]>([]);
  const preloadedImages = useRef<Set<string>>(new Set());

  // Preload an image and return a promise
  const preloadImage = useCallback((url: string) => {
    if (preloadedImages.current.has(url)) return;
    preloadedImages.current.add(url);
    const img = new Image();
    img.src = url;
  }, []);

  // Load game session via server action (no correctIndex exposed)
  useEffect(() => {
    if (!sessionId) {
      router.push("/play");
      return;
    }

    async function loadSession() {
      try {
        const result = await getGameQuestions(sessionId!);

        if (result.error || !result.questions) {
          router.push("/play");
          return;
        }

        setQuestions(result.questions);
        startTimeRef.current = Date.now();
        setLoading(false);

        // Preload first 3 question icons
        result.questions.slice(0, 3).forEach((q) => preloadImage(q.iconUrl));
      } catch {
        router.push("/play");
      }
    }

    loadSession();
  }, [sessionId, router, preloadImage]);

  // Preload upcoming question icons when currentIndex changes
  useEffect(() => {
    if (questions.length === 0) return;
    // Preload next 2 icons ahead
    for (
      let i = currentIndex + 1;
      i <= Math.min(currentIndex + 2, questions.length - 1);
      i++
    ) {
      preloadImage(questions[i].iconUrl);
    }
  }, [currentIndex, questions, preloadImage]);

  // Prefetch result page for fast transition at game end
  useEffect(() => {
    router.prefetch("/play/result");
  }, [router]);

  // Timer
  useEffect(() => {
    if (loading || gameOver) return;

    timerRef.current = setInterval(() => {
      setElapsedMs(Date.now() - startTimeRef.current);
    }, 100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loading, gameOver]);

  const handleAnswer = useCallback(
    (choiceIndex: number) => {
      if (answerState !== "idle" || gameOver || transitioning) return;

      setSelectedAnswer(choiceIndex);
      setAnswerState("checking");
      answersRef.current[currentIndex] = choiceIndex;

      // Validate answer server-side
      (async () => {
        try {
          const result = await checkAnswer(sessionId!, currentIndex, choiceIndex);

          if (result.error) {
            // On server error, reset to idle so user can retry
            setAnswerState("idle");
            setSelectedAnswer(null);
            return;
          }

          const isCorrect = result.correct!;
          const serverCorrectIndex = result.correctIndex!;

          setCorrectIndex(serverCorrectIndex);

          if (isCorrect) {
            setAnswerState("correct");
          } else {
            setAnswerState("incorrect");
            setPenaltyCount((prev) => prev + 1);
            setPenaltyFlash(true);
            setTimeout(() => setPenaltyFlash(false), 500);
          }

          // Move to next question after delay
          const delay = isCorrect ? 400 : 800;
          setTimeout(async () => {
            const nextIndex = currentIndex + 1;

            if (nextIndex >= TOTAL_QUESTIONS) {
              // Game over
              setGameOver(true);
              if (timerRef.current) clearInterval(timerRef.current);

              const completeResult = await completeGame(
                sessionId!,
                answersRef.current
              );

              if (completeResult.error) {
                setSubmitError(completeResult.error);
                return;
              }

              if (completeResult.session) {
                const s = completeResult.session;
                router.replace(
                  `/play/result?id=${sessionId}&time=${s.total_time_ms}&penalties=${s.penalty_count}&correct=${s.correct_count}&final=${s.final_time_ms}`
                );
              }
            } else {
              // Transition: fade out, swap, fade in
              setTransitioning(true);
              setTimeout(() => {
                setCurrentIndex(nextIndex);
                setSelectedAnswer(null);
                setAnswerState("idle");
                setCorrectIndex(null);
                setTransitioning(false);
              }, 150);
            }
          }, delay);
        } catch {
          // Network error — reset to idle so user can retry
          setAnswerState("idle");
          setSelectedAnswer(null);
        }
      })();
    },
    [answerState, currentIndex, gameOver, transitioning, sessionId, router]
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#ff9900] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-400">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (gameOver && submitError) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass-card rounded-2xl p-8 text-center space-y-4 max-w-md">
          <div className="text-red-400 text-lg font-semibold">
            Something went wrong
          </div>
          <p className="text-gray-400 text-sm">{submitError}</p>
          <button
            onClick={() => router.push("/play")}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff9900] to-[#cc7a00] text-white font-bold hover:from-[#ffad33] hover:to-[#ff9900] transition-all duration-200"
          >
            Return to Menu
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentIndex];
  const progress = (currentIndex / TOTAL_QUESTIONS) * 100;
  const totalPenaltyMs = penaltyCount * PENALTY_MS;

  return (
    <div
      className={`min-h-screen bg-grid px-4 py-6 ${penaltyFlash ? "penalty-flash" : ""}`}
    >
      <div className="max-w-xl mx-auto space-y-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">
              <span className="text-white font-bold">
                {currentIndex + 1}
              </span>
              <span className="text-gray-600">/{TOTAL_QUESTIONS}</span>
            </span>
          </div>

          <div className="text-right">
            <div className="font-mono text-2xl font-bold text-[#ff9900] text-glow-orange timer-pulse">
              {formatTime(elapsedMs)}
            </div>
            {penaltyCount > 0 && (
              <div className="text-xs text-red-400">
                +{formatTime(totalPenaltyMs)} penalty
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 bg-[#1e1e2e] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#ff9900] to-[#ffad33] rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question Card — key forces re-mount for consistent animation */}
        <div
          key={currentIndex}
          className={`glass-card rounded-2xl p-8 text-center space-y-8 min-h-[420px] transition-opacity duration-150 ${
            transitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
          }`}
          style={{
            transition: "opacity 150ms ease, transform 150ms ease",
          }}
        >
          {/* Icon Display */}
          <div className="flex items-center justify-center">
            <div className="w-32 h-32 rounded-2xl bg-[#0a0a0f] border border-[#1e1e2e] flex items-center justify-center p-4 glow-orange">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={question.iconUrl}
                alt="AWS Service Icon"
                className="w-full h-full object-contain"
                draggable={false}
              />
            </div>
          </div>

          <p className="text-gray-400 text-sm">What AWS service is this?</p>

          {/* Choices */}
          <div className="grid grid-cols-1 gap-3">
            {question.choices.map((choice, idx) => {
              let btnClass = "choice-btn";
              if (answerState === "checking") {
                if (idx === selectedAnswer) {
                  btnClass += " checking";
                }
              } else if (
                answerState === "correct" ||
                answerState === "incorrect"
              ) {
                if (idx === correctIndex) {
                  btnClass += " correct";
                } else if (
                  idx === selectedAnswer &&
                  answerState === "incorrect"
                ) {
                  btnClass += " incorrect";
                }
              }

              return (
                <button
                  key={`${currentIndex}-${idx}`}
                  onClick={() => handleAnswer(idx)}
                  disabled={answerState !== "idle"}
                  className={`${btnClass} disabled:cursor-default`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-[#0a0a0f] border border-[#1e1e2e] flex items-center justify-center text-sm font-mono text-gray-500">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="font-medium">{choice}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GamePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#ff9900] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <GameContent />
    </Suspense>
  );
}
