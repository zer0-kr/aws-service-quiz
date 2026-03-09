"use client";

import { useEffect, useState, useCallback, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { completeGame } from "@/app/actions/game";
import { formatTime, TOTAL_QUESTIONS, PENALTY_MS } from "@/lib/utils";
import { QuizQuestion } from "@/types";

function GameContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("id");

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [penaltyCount, setPenaltyCount] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerState, setAnswerState] = useState<"idle" | "correct" | "incorrect">("idle");
  const [gameOver, setGameOver] = useState(false);
  const [loading, setLoading] = useState(true);
  const [penaltyFlash, setPenaltyFlash] = useState(false);
  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const answersRef = useRef<number[]>([]);

  // Load game session
  useEffect(() => {
    if (!sessionId) {
      router.push("/play");
      return;
    }

    async function loadSession() {
      const supabase = createClient();
      const { data: session } = await supabase
        .from("game_sessions")
        .select("*")
        .eq("id", sessionId)
        .single();

      if (!session || session.status !== "playing") {
        router.push("/play");
        return;
      }

      setQuestions(session.questions as QuizQuestion[]);
      startTimeRef.current = Date.now();
      setLoading(false);
    }

    loadSession();
  }, [sessionId, router]);

  // Timer
  useEffect(() => {
    if (loading || gameOver) return;

    timerRef.current = setInterval(() => {
      setElapsedMs(Date.now() - startTimeRef.current);
    }, 10);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loading, gameOver]);

  const handleAnswer = useCallback(
    (choiceIndex: number) => {
      if (answerState !== "idle" || gameOver) return;

      const question = questions[currentIndex];
      const isCorrect = choiceIndex === question.correctIndex;

      setSelectedAnswer(choiceIndex);
      answersRef.current[currentIndex] = choiceIndex;

      if (isCorrect) {
        setAnswerState("correct");
      } else {
        setAnswerState("incorrect");
        setPenaltyCount((prev) => prev + 1);
        setPenaltyFlash(true);
        setTimeout(() => setPenaltyFlash(false), 500);
      }

      // Move to next question after delay
      setTimeout(async () => {
        const nextIndex = currentIndex + 1;

        if (nextIndex >= TOTAL_QUESTIONS) {
          // Game over
          setGameOver(true);
          if (timerRef.current) clearInterval(timerRef.current);

          const finalElapsed = Date.now() - startTimeRef.current;
          const currentPenaltyCount = penaltyCount + (isCorrect ? 0 : 1);

          const result = await completeGame(
            sessionId!,
            answersRef.current
          );

          if (result.session) {
            const s = result.session;
            router.push(
              `/play/result?id=${sessionId}&time=${s.total_time_ms}&penalties=${s.penalty_count}&final=${s.final_time_ms}`
            );
          }
        } else {
          setCurrentIndex(nextIndex);
          setSelectedAnswer(null);
          setAnswerState("idle");
        }
      }, isCorrect ? 400 : 800);
    },
    [answerState, currentIndex, gameOver, questions, penaltyCount, sessionId, router]
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

  const question = questions[currentIndex];
  const progress = ((currentIndex) / TOTAL_QUESTIONS) * 100;
  const totalPenaltyMs = penaltyCount * PENALTY_MS;

  return (
    <div className={`min-h-screen bg-grid px-4 py-6 ${penaltyFlash ? "penalty-flash" : ""}`}>
      <div className="max-w-xl mx-auto space-y-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between fade-in">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">
              <span className="text-white font-bold">{currentIndex + 1}</span>
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

        {/* Question Card */}
        <div className="glass-card rounded-2xl p-8 text-center space-y-8 scale-in">
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
              if (answerState !== "idle") {
                if (idx === question.correctIndex) {
                  btnClass += " correct";
                } else if (idx === selectedAnswer && answerState === "incorrect") {
                  btnClass += " incorrect";
                }
              }

              return (
                <button
                  key={idx}
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
