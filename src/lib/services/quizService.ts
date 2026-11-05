import { quizRepository } from "../repositories/quizRepository";

export interface SubmitQuizParams {
  user_name: string;
  school_id: string | null;
  answers: {
    question_id: number;
    option_id: number;
    score: number;
  }[];
  source?: string;
}

export const quizService = {
  async getQuestions(category?: string) {
    return await quizRepository.getQuestions(category);
  },

  async submitQuiz(params: SubmitQuizParams) {
    if (!params.answers || params.answers.length === 0) {
      throw new Error("Answers cannot be empty");
    }

    const totalScore = params.answers.reduce((acc, curr) => acc + curr.score, 0);

    let category = "";
    let indicator_color = "";
    let description = "";
    let motivation_message = "";

    if (totalScore >= 60) {
      category = "Sangat Bijak";
      indicator_color = "emerald";
      description = "Kesadaran digital sangat baik. Kontrol diri tinggi. Memahami etika digital dan anti-cyber bullying. Mampu mengelola gadget secara mandiri dan produktif.";
      motivation_message = "Hebat! Pertahankan kebiasaan baikmu, ya!";
    } else if (totalScore >= 50) {
      category = "Bijak";
      indicator_color = "teal";
      description = "Sudah memiliki kebiasaan digital yang sehat. Pemahaman tentang cyber bullying cukup baik. Masih ada ruang kecil untuk perbaikan.";
      motivation_message = "Ayo tingkatkan lagi! Kamu pasti bisa lebih bijak.";
    } else if (totalScore >= 38) {
      category = "Cukup Bijak";
      indicator_color = "amber";
      description = "Kesadaran digital cukup tetapi masih perlu pendampingan. Beberapa kebiasaan perlu diperbaiki, terutama dalam etika bermedia sosial.";
      motivation_message = "Ayo tingkatkan lagi! Kamu pasti bisa lebih bijak.";
    } else if (totalScore >= 25) {
      category = "Perlu Pendampingan";
      indicator_color = "orange";
      description = "Tingkat ketergantungan dan risiko perilaku digital negatif cukup tinggi. Perlu intervensi dan komitmen bersama.";
      motivation_message = "Jangan khawatir, GESAMEGA siap mendampingi kamu.";
    } else {
      category = "Darurat Digital";
      indicator_color = "red";
      description = "Indikasi serius: rentan menjadi pelaku atau korban cyber bullying. Perlu pendampingan intensif dari guru BK dan orang tua.";
      motivation_message = "Jangan khawatir, GESAMEGA siap mendampingi kamu.";
    }

    // Save to database
    const rawScores = params.answers.map((a) => a.score);
    
    await quizRepository.saveQuizResult(
      {
        user_name: params.user_name,
        school_id: params.school_id,
        answers: rawScores,
        result_category: category,
        qualification: category,
        indicator_color,
        description,
        source: params.source,
      },
      params.answers
    );

    return {
      totalScore,
      category,
      indicator_color,
      description,
      motivation_message,
    };
  },
};
