namespace Helper {
    let idAnswer = 0, idQuestion = 0;

    export function getIdAnswer() {
        return ++idAnswer;
    }

    export function getIdQuestion() {
        return ++idQuestion;
    }


    export function getRandomPosInArray(current_pos, maxval) {
        var pos;

        while (true) {
            pos = Math.floor(Math.random() * maxval);

            //continue until you find a random number != to (current_pos)
            if (pos != current_pos) {
                return pos;
            }
        }
    }

}

class Quiz{
    questions: Question[];

    constructor() {
        this.questions = [];
    }

    addQuestionsToPool(...questions: Question[]) {
        for (let question of questions)
        {
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

        for (let question of this.questions)
        {
            score += question.score;
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

class Answer {
    private _id: number;

    constructor(private _definition: string, private _score: number) {
        this._id = Helper.getIdAnswer();
    }

    get id() {
        return this._id;
    }

    get definition() {
        return this.id + ' - ' + this._definition;
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

class Question {
    private _id: number;
    private answer_pool:Answer[];
    private final_score: number;

    constructor(private sentence: string, private answer: Answer, private canRetake: boolean) {
        this.answer_pool = [];
        this.answer_pool.push(answer);
        this.final_score = -1;
        this._id = Helper.getIdQuestion();
    }

    get id() {
        return this._id;
    }

    get score() {
        return this.final_score == -1 ? 0 : this.final_score;
    }

    toString() {

        let res = this.id + " - " + this.sentence + "\n";

        let i = 0;

        for (let answer of this.answer_pool)
        {
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
        //at least 2 answers in order to be eligible for quiz => question is valid
        return (this.answer_pool.length > 1);
    }

    private shufflePool() {

        let size = this.answer_pool.length;

        if (size <= 1) return;

        for (let i = 0; i < size; i++) {

            //find a random position in the array
            var pos = Helper.getRandomPosInArray(i, size);

            //change with current position
            var temp = this.answer_pool[pos];
            this.answer_pool[pos] = this.answer_pool[i];
            this.answer_pool[i] = temp;
        }

    }
}






let q1 = new Question("A switch is a router?", new Answer("No", 5), false);
q1.addAnswerToPool(new Answer("Yes", 0));


let q2 = new Question("Select the operating system in the provided list?", new Answer("Linux", 4), true);
q2.addAnswerToPool(new Answer("HTML", 0));
q2.addAnswerToPool(new Answer("TypeScript", 0));
q2.addAnswerToPool(new Answer("Facebook", 0));
q2.addAnswerToPool(new Answer("Whatever 1.0", 0));


let q3 = new Question("How to add an external JavaScript to an html page?", new Answer("<script></script>", 5), true);
q3.addAnswerToPool(new Answer("<body></body>", 0));
q3.addAnswerToPool(new Answer("<link hfref=''>", 0));
q3.addAnswerToPool(new Answer("<div></div>", 0));
q3.addAnswerToPool(new Answer("<head></head>", 0));
q3.addAnswerToPool(new Answer("<javascript></javascript>", 0));


let quiz = new Quiz();
quiz.addQuestionsToPool(q1, q2, q3);

console.log(quiz.toString());




