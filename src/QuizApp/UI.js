define(["require", "exports", "./Quiz"], function (require, exports, proto) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //i add jquery type definition(not use in project/not working)
    ///<reference path="@types/jquery" />
    //$("#answer-info-hidden").hide();
    var q1 = new proto.Question("Javascript code can run on?", new proto.Answer("All most common browsers(firefox, IR, Chrome, Safari etc.)", 2), false);
    q1.addAnswerToPool(new proto.Answer("Internet Explorer only", 0));
    q1.addAnswerToPool(new proto.Answer("Firefox only", 0));
    q1.addAnswerToPool(new proto.Answer("Chrome only", 0));
    var q2 = new proto.Question("Select the operating system in the provided list?", new proto.Answer("Linux", 4), true);
    q2.addAnswerToPool(new proto.Answer("HTML", 0));
    q2.addAnswerToPool(new proto.Answer("TypeScript", 0));
    q2.addAnswerToPool(new proto.Answer("Facebook", 0));
    q2.addAnswerToPool(new proto.Answer("Whatever 1.0", 0));
    var q3 = new proto.Question("How to add an external JavaScript to an html page?", new proto.Answer("<script></script>", 5), true);
    q3.addAnswerToPool(new proto.Answer("<body></body>", 0));
    q3.addAnswerToPool(new proto.Answer("<link hfref=''>", 0));
    q3.addAnswerToPool(new proto.Answer("<div></div>", 0));
    q3.addAnswerToPool(new proto.Answer("<javascript></javascript>", 0));
    var q4 = new proto.Question("A switch is a?", new proto.Answer("Layer 2 device", 2), false);
    q4.addAnswerToPool(new proto.Answer("Layer 3 device", 0));
    q4.addAnswerToPool(new proto.Answer("Layer 1 device", 0));
    var q5 = new proto.Question("A router is a?", new proto.Answer("Layer 3 device", 2), false);
    q5.addAnswerToPool(new proto.Answer("Layer 2 device", 0));
    q5.addAnswerToPool(new proto.Answer("Layer 1 device", 0));
    var quiz = new proto.Quiz("Quiz Sample - Default");
    quiz.addQuestionsToPool(q1, q2, q3, q4, q5);
    showQuiz(quiz);
    function showQuiz(quiz) {
        var divQuiz = document.getElementById("quiz");
        var _loop_1 = function (question) {
            var ans_list = document.createElement("ol");
            var str = "";
            if (question.getCanRetake())
                str = " (Can retake question)";
            ans_list.innerHTML = question.getSentence() + " /Max pts +" + question.maxScore + str;
            var _loop_2 = function (answer) {
                var ans = document.createElement("li");
                var radio = document.createElement("input");
                radio.setAttribute("type", "radio");
                radio.setAttribute("name", question.id.toString());
                radio.setAttribute("value", question.id.toString());
                radio.setAttribute("id", answer.id.toString());
                var _radio = radio;
                radio.addEventListener("click", function (e) {
                    try {
                        question.isCorrectAnswer(parseInt(_radio.id));
                        printScore(quiz);
                    }
                    catch (ex) {
                        alert(ex.message);
                        e.preventDefault();
                    }
                });
                var label = document.createElement("label");
                label.setAttribute("for", answer.id.toString());
                label.innerHTML = answer.definition.toString();
                ans.appendChild(radio);
                ans.appendChild(label);
                ans_list.appendChild(ans);
            };
            for (var _i = 0, _a = question.getAllAnswers(); _i < _a.length; _i++) {
                var answer = _a[_i];
                _loop_2(answer);
            }
            divQuiz.appendChild(ans_list);
        };
        for (var _i = 0, _a = quiz.questions; _i < _a.length; _i++) {
            var question = _a[_i];
            _loop_1(question);
        }
    }
    function printScore(quiz) {
        var div_score = document.getElementById("score");
        var score = "score: " + quiz.finalScore().toString();
        div_score.innerHTML = score;
    }
});
//# sourceMappingURL=UI.js.map