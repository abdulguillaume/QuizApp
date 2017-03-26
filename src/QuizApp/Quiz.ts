

import * as helper from './helper';

export class Quiz {

    questions: Question[];
    private id: number;

    constructor(private name:string) {
        this.id = helper.getIdQuiz();
        this.questions = [];
    }

    addQuestionsToPool(...questions: Question[]) {
        for (let question of questions) {
            this.questions.push(question);
        }
    }

    isValid() {
        //quiz is valid, when all questions are valid
        return this.questions.every(x => x.isValidForQuiz() == true);
    }

    toString() {

        let res = "";

        for (let question of this.questions) {

            res += question.toString() + "\n";
        }

        return res;
    }


    finalScore() {

        let score = 0;

        for (let question of this.questions) {
            score += question.score;
        }

        return score;
    }

    //maximum score for the quiz
    maxScore() {

        let score = 0;

        for (let question of this.questions) {
            score += question.maxScore;
        }

        return score;

    }


    answerQuestion(question_id: number, answer_id: number) {

        let q = this.questions.filter(x => x.id === question_id);

        if (q.length == 0)
            throw new Error("There is no surch question in the Quiz!");

        q[0].isCorrectAnswer(answer_id);

        return this.finalScore();
    }
}

export class Answer {
        private _id: number;

        constructor(private _definition: string, private _score: number) {
            this._id = helper.getIdAnswer();
            this._definition = helper.htmlTagReplace(this._definition);
        }

        get id() {
            return this._id;
        }

        get definition() {
            return this._definition;
        }

        get score() {
            return this._score;
        }

        set score(value) {
            if (value >= 0) {
                this._score = value;
            } else {
                throw new Error("Score should be greater or equal to zero!");
            }
        }

        decreaseScore() {

            if (this._score > 0) {
                this._score--;
            }

        }
    }

export class Question {
        private _id: number;
        private answer_pool: Answer[];
        private final_score: number;

        constructor(private sentence: string, private answer: Answer, private canRetake: boolean) {

            this.sentence = helper.htmlTagReplace(this.sentence);
            this.answer_pool = [];
            this.answer_pool.push(answer);
            this.final_score = -1;
            this._id = helper.getIdQuestion();
        }

        getAllAnswers() {
            return this.answer_pool;
        }

        getCanRetake()
        {
            return this.canRetake;
        }
        getSentence() {
            return this.sentence;
        }

        get id() {
            return this._id;
        }

        get score() {
            return this.final_score == -1 ? 0 : this.final_score;
        }

        get maxScore() {
            return this.answer.score;
        }

        toString() {

            let res = this.id + " - " + this.sentence + "\n";

            let i = 0;

            for (let answer of this.answer_pool) {
                res += /*(++i) + " - " +*/ answer.definition + "\n";
            }

            return res;
        }

        addAnswerToPool(answer: Answer) {
            this.answer_pool.push(answer);
            this.shufflePool();
        }

        isCorrectAnswer(answer_id: number) {

            //if >0 => question already answered correctly.
            if (this.final_score > 0)
                throw new Error("Question already answered!");

            //cannot retake question
            if (this.final_score === 0 && !this.canRetake)
                throw new Error("You cannot retake this question!");


            if (answer_id === this.answer.id) {
                this.final_score = this.answer.score;
                return true;
            } else if (this.answer_pool.every(x => x.id !== answer_id)) {
                throw new Error("Selected answer not in the list!");
            }
            else {
                this.final_score = 0;
                this.answer.decreaseScore();
                return false;
            }
        }

        isValidForQuiz() {
            //1 of the requirements - Give the user a minimum of 3 and no more than 5 choices
            //between 3 and 5 answers in order to be valid question for the quiz
            return (this.answer_pool.length > 2 && this.answer_pool.length < 6);
        }

        private shufflePool() {

            let size = this.answer_pool.length;

            if (size <= 1) return;

            for (let i = 0; i < size; i++) {

                //find a random position in the array
                var pos = helper.getRandomPosInArray(i, size);

                //change with current position
                var temp = this.answer_pool[pos];
                this.answer_pool[pos] = this.answer_pool[i];
                this.answer_pool[i] = temp;
            }

        }
    }


