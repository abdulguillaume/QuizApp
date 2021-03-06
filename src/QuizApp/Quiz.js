define(["require", "exports", "./helper"], function (require, exports, helper) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Quiz = (function () {
        //private _id: number;
        function Quiz(_name, _id) {
            this._name = _name;
            this._id = _id;
            if (_id == null)
                this._id = helper.getIdQuiz();
            else
                this._id = _id;
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
        Object.defineProperty(Quiz.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Quiz.prototype, "id", {
            get: function () {
                return this._id;
            },
            enumerable: true,
            configurable: true
        });
        Quiz.prototype.isValid = function () {
            //quiz is valid, when all questions are valid and 
            //have more than 4 questions
            return (this.questions.every(function (x) { return x.isValidForQuiz() == true; }) &&
                this.questions.length >= 3);
        };
        //quiz is complete when every single question is complete
        Quiz.prototype.isComplete = function () {
            if (this.questions.every(function (x) { return x.isComplete() === true; }))
                throw new Error("The Quiz is Completed!");
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
        //static method that will allow me to convert my json data to a TS quiz instance
        //when retrieving data from localstore, they are in json format
        Quiz.json2TS = function (json) {
            var quiz = new Quiz(json._name, json._id);
            for (var _i = 0, _a = json.questions; _i < _a.length; _i++) {
                var obj = _a[_i];
                var answer = new Answer(obj.answer._definition, obj.answer._score, obj.answer._id);
                var question = new Question(obj.sentence, answer, obj.canRetake, obj._id);
                for (var _b = 0, _c = obj.answer_pool; _b < _c.length; _b++) {
                    var a = _c[_b];
                    if (obj.answer._id !== a._id) {
                        question.addAnswerToPool(new Answer(a._definition, a._score, a._id));
                    }
                }
                quiz.addQuestionsToPool(question);
            }
            return quiz;
        };
        return Quiz;
    }());
    exports.Quiz = Quiz;
    var Answer = (function () {
        //private _id: number;
        function Answer(_definition, _score, _id) {
            this._definition = _definition;
            this._score = _score;
            this._id = _id;
            if (_id == null)
                this._id = helper.getIdAnswer();
            else
                this._id = _id;
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
    exports.Answer = Answer;
    var Question = (function () {
        function Question(sentence, answer, canRetake, _id) {
            this.sentence = sentence;
            this.answer = answer;
            this.canRetake = canRetake;
            this._id = _id;
            this.sentence = helper.htmlTagReplace(this.sentence);
            this.answer_pool = [];
            this.answer_pool.push(answer);
            this.final_score = -1;
            if (_id == null)
                this._id = helper.getIdQuestion();
            else
                this._id = _id;
        }
        Question.prototype.getAllAnswers = function () {
            return this.answer_pool;
        };
        Question.prototype.getCanRetake = function () {
            return this.canRetake;
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
        Question.prototype.isComplete = function () {
            return this.final_score > 0 || (this.final_score === 0 && this.answer.score == 0) || (this.final_score === 0 && !this.canRetake);
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
    exports.Question = Question;
});
//# sourceMappingURL=Quiz.js.map