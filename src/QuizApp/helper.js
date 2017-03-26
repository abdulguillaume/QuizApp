define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var idAnswer = 0, idQuestion = 0, idQuiz = 0;
    function getIdAnswer() {
        return ++idAnswer;
    }
    exports.getIdAnswer = getIdAnswer;
    function getIdQuestion() {
        return ++idQuestion;
    }
    exports.getIdQuestion = getIdQuestion;
    function getIdQuiz() {
        return ++idQuiz;
    }
    exports.getIdQuiz = getIdQuiz;
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
    exports.getRandomPosInArray = getRandomPosInArray;
    function htmlTagReplace(data) {
        return data.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
    exports.htmlTagReplace = htmlTagReplace;
});
//# sourceMappingURL=helper.js.map