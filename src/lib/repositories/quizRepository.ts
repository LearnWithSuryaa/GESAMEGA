import { supabase } from "@/lib/supabase";

export interface QuestionOption {
  id: number;
  question_id: number;
  option_text: string;
  score: number;
}

export interface Question {
  id: number;
  question_text: string;
  category: string;
  question_options: QuestionOption[];
}

export interface QuizResultPayload {
  user_name: string;
  school_id: string | null;
  answers: number[];
  result_category: string;
  qualification: string;
  indicator_color: string;
  description: string;
  source?: string;
}

export interface QuizAnswerPayload {
  question_id: number;
  option_id: number;
  score: number;
}

export const quizRepository = {
  async getQuestions(category?: string): Promise<Question[]> {
    let query = supabase
      .from("questions")
      .select(`
        id,
        question_text,
        category,
        question_options (
          id,
          question_id,
          option_text,
          score
        )
      `)
      .order('id', { ascending: true });

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch questions: ${error.message}`);
    }

    // Sort options by score or id if needed, here we sort by id ascending to keep original order
    const formattedData = data?.map(q => ({
      ...q,
      question_options: (q.question_options as QuestionOption[]).sort((a, b) => a.id - b.id)
    }));

    return formattedData as Question[];
  },

  async saveQuizResult(
    resultPayload: QuizResultPayload,
    answersPayload: QuizAnswerPayload[]
  ): Promise<{ id: string }> {
    // 1. Insert Quiz Result
    const { data: resultData, error: resultError } = await supabase
      .from("quiz_results")
      .insert({
        user_name: resultPayload.user_name,
        school_id: resultPayload.school_id,
        answers: resultPayload.answers,
        result_category: resultPayload.result_category,
        qualification: resultPayload.qualification,
        indicator_color: resultPayload.indicator_color,
        description: resultPayload.description,
        source: resultPayload.source,
      })
      .select("id")
      .single();

    if (resultError) {
      throw new Error(`Failed to save quiz result: ${resultError.message}`);
    }

    const quizResultId = resultData.id;

    // 2. Insert Quiz Answers
    const answersToInsert = answersPayload.map((ans) => ({
      quiz_result_id: quizResultId,
      question_id: ans.question_id,
      option_id: ans.option_id,
      score: ans.score,
    }));

    const { error: answersError } = await supabase
      .from("quiz_answers")
      .insert(answersToInsert);

    if (answersError) {
      throw new Error(`Failed to save quiz answers: ${answersError.message}`);
    }

    return resultData;
  },
};
