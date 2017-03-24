var Helper;
(function (Helper) {
    var idAnswer = 0, idQuestion = 0;
    function getIdAnswer() {
        return ++idAnswer;
    }
    Helper.getIdAnswer = getIdAnswer;
    function getIdQuestion() {
        return ++idQuestion;
    }
    Helper.getIdQuestion = getIdQuestion;
    function getRandomPosInArray(current_pos, maxval) {
        var pos;
        while (true) {
            pos = Math.floor(Math.random() * maxval);
            //continue until you find a random number != to (current_pos)
            if (pos != current_pos) {
                return pos;
            }
        }
    }
    Helper.getRandomPosInArray = getRandomPosInArray;
})(Helper || (Helper = {}));
var Quiz = (function () {
    function Quiz() {
        this.questions = [];
    }
    Quiz.prototype.addQuestionsToPool = function () {
        var questions = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            questions[_i] = arguments[_i];
        }
        for (var _a = 0, questions_1 = questions; _a < questions_1.length; _a++) {
            var question = questions_1[_a];
            this.questions.push(question);
        }
    };
    Quiz.prototype.isValid = function () {
        //quiz is valid, when all questions are valid
        return this.questions.every(function (x) { return x.isValidForQuiz() == true; });
    };
    Quiz.prototype.toString = function () {
        var res = "";
        for (var _i = 0, _a = this.questions; _i < _a.length; _i++) {
            var question = _a[_i];
            res += question.toString() + "\n";
        }
        return res;
    };
    Quiz.prototype.finalScore = function () {
        var score = 0;
        for (var _i = 0, _a = this.questions; _i < _a.length; _i++) {
            var question = _a[_i];
            score += question.score;
        }
        return score;
    };
    Quiz.prototype.answerQuestion = function (question_id, answer_id) {
        var q = this.questions.filter(function (x) { return x.id === question_id; });
        if (q.length == 0)
            throw new Error("There is no surch question in the Quiz!");
        q[0].isCorrectAnswer(answer_id);
        return this.finalScore();
    };
    return Quiz;
}());
var Answer = (function () {
    function Answer(_definition, _score) {
        this._definition = _definition;
        this._score = _score;
        this._id = Helper.getIdAnswer();
    }
    Object.defineProperty(Answer.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Answer.prototype, "definition", {
        get: function () {
            return this.id + ' - ' + this._definition;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Answer.prototype, "score", {
        get: function () {
            return this._score;
        },
        set: function (value) {
            if (value >= 0) {
                this._score = value;
            }
            else {
                throw new Error("Score should be greater or equal to zero!");
            }
        },
        enumerable: true,
        configurable: true
    });
    Answer.prototype.decreaseScore = function () {
        if (this._score > 0) {
            this._score--;
        }
    };
    return Answer;
}());
var Question = (function () {
    function Question(sentence, answer, canRetake) {
        this.sentence = sentence;
        this.answer = answer;
        this.canRetake = canRetake;
        this.answer_pool = [];
        this.answer_pool.push(answer);
        this.final_score = -1;
        this._id = Helper.getIdQuestion();
    }
    Object.defineProperty(Question.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Question.prototype, "score", {
        get: function () {
            return this.final_score == -1 ? 0 : this.final_score;
        },
        enumerable: true,
        configurable: true
    });
    Question.prototype.toString = function () {
        var res = this.id + " - " + this.sentence + "\n";
        var i = 0;
        for (var _i = 0, _a = this.answer_pool; _i < _a.length; _i++) {
            var answer = _a[_i];
            res += answer.definition + "\n";
        }
        return res;
    };
    Question.prototype.addAnswerToPool = function (answer) {
        this.answer_pool.push(answer);
        this.shufflePool();
    };
    Question.prototype.isCorrectAnswer = function (answer_id) {
        //if >0 => question already answered correctly.
        if (this.final_score > 0)
            throw new Error("Question already answered!");
        //cannot retake question
        if (this.final_score === 0 && !this.canRetake)
            throw new Error("You cannot retake this question!");
        if (answer_id === this.answer.id) {
            this.final_score = this.answer.score;
            return true;
        }
        else if (this.answer_pool.every(function (x) { return x.id !== answer_id; })) {
            throw new Error("Selected answer not in the list!");
        }
        else {
            this.final_score = 0;
            this.answer.decreaseScore();
            return false;
        }
    };
    Question.prototype.isValidForQuiz = function () {
        //at least 2 answers in order to be eligible for quiz => question is valid
        return (this.answer_pool.length > 1);
    };
    Question.prototype.shufflePool = function () {
        var size = this.answer_pool.length;
        if (size <= 1)
            return;
        for (var i = 0; i < size; i++) {
            //find a random position in the array
            var pos = Helper.getRandomPosInArray(i, size);
            //change with current position
            var temp = this.answer_pool[pos];
            this.answer_pool[pos] = this.answer_pool[i];
            this.answer_pool[i] = temp;
        }
    };
    return Question;
}());
var q1 = new Question("A switch is a router?", new Answer("No", 5), false);
q1.addAnswerToPool(new Answer("Yes", 0));
var q2 = new Question("Select the operating system in the provided list?", new Answer("Linux", 4), true);
q2.addAnswerToPool(new Answer("HTML", 0));
q2.addAnswerToPool(new Answer("TypeScript", 0));
q2.addAnswerToPool(new Answer("Facebook", 0));
q2.addAnswerToPool(new Answer("Whatever 1.0", 0));
var q3 = new Question("How to add an external JavaScript to an html page?", new Answer("<script></script>", 5), true);
q3.addAnswerToPool(new Answer("<body></body>", 0));
q3.addAnswerToPool(new Answer("<link hfref=''>", 0));
q3.addAnswerToPool(new Answer("<div></div>", 0));
q3.addAnswerToPool(new Answer("<head></head>", 0));
q3.addAnswerToPool(new Answer("<javascript></javascript>", 0));
var quiz = new Quiz();
quiz.addQuestionsToPool(q1, q2, q3);
console.log(quiz.toString());
