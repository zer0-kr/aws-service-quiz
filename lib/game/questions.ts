import { awsServices } from "@/data/aws-services";
import { QuizQuestion } from "@/types";
import { shuffleArray, ICON_CDN_BASE, TOTAL_QUESTIONS } from "@/lib/utils";

/**
 * Generate a balanced set of quiz questions.
 * Distribution: 5 easy (diff 1-2), 5 medium (diff 3), 5 hard (diff 4-5)
 */
export function generateQuestions(): QuizQuestion[] {
  const easy = awsServices.filter((s) => s.difficulty <= 2);
  const medium = awsServices.filter((s) => s.difficulty === 3);
  const hard = awsServices.filter((s) => s.difficulty >= 4);

  const selectedEasy = shuffleArray(easy).slice(0, 5);
  const selectedMedium = shuffleArray(medium).slice(0, 5);
  const selectedHard = shuffleArray(hard).slice(0, 5);

  const selected = shuffleArray([
    ...selectedEasy,
    ...selectedMedium,
    ...selectedHard,
  ]);

  if (selected.length < TOTAL_QUESTIONS) {
    throw new Error("Not enough services to generate questions");
  }

  return selected.map((service) => {
    const otherServices = awsServices.filter((s) => s.id !== service.id);
    const distractors = shuffleArray(otherServices).slice(0, 3);

    const choices = shuffleArray([service, ...distractors]);
    const correctIndex = choices.findIndex((c) => c.id === service.id);

    return {
      serviceId: service.id,
      iconUrl: `${ICON_CDN_BASE}/${service.iconFile}`,
      choices: choices.map((c) => c.name),
      correctIndex,
    };
  });
}
