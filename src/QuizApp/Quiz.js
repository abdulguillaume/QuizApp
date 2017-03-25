var helper;
(function (helper) {
    var idAnswer = 0, idQuestion = 0;
    function getIdAnswer() {
        return ++idAnswer;
    }
    helper.getIdAnswer = getIdAnswer;
    function getIdQuestion() {
        return ++idQuestion;
    }
    helper.getIdQuestion = getIdQuestion;
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
    helper.getRandomPosInArray = getRandomPosInArray;
    function htmlTagReplace(data) {
        return data.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
    helper.htmlTagReplace = htmlTagReplace;
})(helper || (helper = {}));
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
    //maximum score for the quiz
    Quiz.prototype.maxScore = function () {
        var score = 0;
        for (var _i = 0, _a = this.questions; _i < _a.length; _i++) {
            var question = _a[_i];
            score += question.maxScore;
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
        this._id = helper.getIdAnswer();
        this._definition = helper.htmlTagReplace(this._definition);
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
            return this._definition;
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
        this.sentence = helper.htmlTagReplace(this.sentence);
        this.answer_pool = [];
        this.answer_pool.push(answer);
        this.final_score = -1;
        this._id = helper.getIdQuestion();
    }
    Question.prototype.getAllAnswers = function () {
        return this.answer_pool;
    };
    Question.prototype.getSentence = function () {
        return this.sentence;
    };
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
    Object.defineProperty(Question.prototype, "maxScore", {
        get: function () {
            return this.answer.score;
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
        //1 of the requirements - Give the user a minimum of 3 and no more than 5 choices
        //between 3 and 5 answers in order to be valid question for the quiz
        return (this.answer_pool.length > 2 && this.answer_pool.length < 6);
    };
    Question.prototype.shufflePool = function () {
        var size = this.answer_pool.length;
        if (size <= 1)
            return;
        for (var i = 0; i < size; i++) {
            //find a random position in the array
            var pos = helper.getRandomPosInArray(i, size);
            //change with current position
            var temp = this.answer_pool[pos];
            this.answer_pool[pos] = this.answer_pool[i];
            this.answer_pool[i] = temp;
        }
    };
    return Question;
}());
var q1 = new Question("Javascript code can run on?", new Answer("All most common browsers(firefox, IR, Chrome, Safari etc.)", 2), false);
q1.addAnswerToPool(new Answer("Internet Explorer only", 0));
q1.addAnswerToPool(new Answer("Firefox only", 0));
q1.addAnswerToPool(new Answer("Chrome only", 0));
var q2 = new Question("Select the operating system in the provided list?", new Answer("Linux", 4), true);
q2.addAnswerToPool(new Answer("HTML", 0));
q2.addAnswerToPool(new Answer("TypeScript", 0));
q2.addAnswerToPool(new Answer("Facebook", 0));
q2.addAnswerToPool(new Answer("Whatever 1.0", 0));
var q3 = new Question("How to add an external JavaScript to an html page?", new Answer("<script></script>", 5), true);
q3.addAnswerToPool(new Answer("<body></body>", 0));
q3.addAnswerToPool(new Answer("<link hfref=''>", 0));
q3.addAnswerToPool(new Answer("<div></div>", 0));
//q3.addAnswerToPool(new Answer("<head></head>", 0));
q3.addAnswerToPool(new Answer("<javascript></javascript>", 0));
var q4 = new Question("A switch is a?", new Answer("Layer 2 device", 2), false);
q4.addAnswerToPool(new Answer("Layer 3 device", 0));
q4.addAnswerToPool(new Answer("Layer 1 device", 0));
var q5 = new Question("A router is a?", new Answer("Layer 3 device", 2), false);
q5.addAnswerToPool(new Answer("Layer 2 device", 0));
q5.addAnswerToPool(new Answer("Layer 1 device", 0));
var quiz = new Quiz();
quiz.addQuestionsToPool(q1, q2, q3, q4, q5);
var divQuiz = document.getElementById("quiz");
for (var _i = 0, _a = quiz.questions; _i < _a.length; _i++) {
    var question = _a[_i];
    var ans_list = document.createElement("ol");
    ans_list.innerHTML = question.getSentence();
    for (var _b = 0, _c = question.getAllAnswers(); _b < _c.length; _b++) {
        var answer = _c[_b];
        var ans = document.createElement("li");
        var radio = document.createElement("input");
        radio.setAttribute("type", "radio");
        radio.setAttribute("name", question.id.toString());
        radio.setAttribute("value", question.id.toString());
        radio.setAttribute("id", answer.id.toString());
        var label = document.createElement("label");
        label.setAttribute("for", answer.id.toString());
        label.innerHTML = answer.definition.toString();
        ans.appendChild(radio);
        ans.appendChild(label);
        ans_list.appendChild(ans);
    }
    divQuiz.appendChild(ans_list);
}
//# sourceMappingURL=Quiz.js.map