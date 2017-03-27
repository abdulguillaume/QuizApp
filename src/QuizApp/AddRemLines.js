define(["require", "exports", "./Quiz"], function (require, exports, proto) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //i added jquery type definition(not use in project/not working)
    ///<reference path="@types/jquery" />
    var cnt = 1;
    var currentLinkElt;
    $("document").ready(function () {
        $("#dialog-form").hide();
        $("#quiz_form").validate();
        LoadQuizzesList("li", "#quiz-list-ul");
    });
    function LoadQuizzesList(tag, selector) {
        var quiz_list = $(selector);
        quiz_list.empty();
        for (var i = 0; i < localStorage.length; i++) {
            var s_id = localStorage.key(i);
            if (s_id.toString().match(/^quiz_id_/) != null) {
                var elt = document.createElement(tag);
                if (tag == "li") {
                    elt.classList.add("dblClickable");
                }
                var jsondata = JSON.parse(localStorage.getItem(s_id));
                var quiz = proto.Quiz.json2TS(jsondata);
                elt.innerHTML = quiz.id + ": " + quiz.name;
                quiz_list.append(elt);
            }
        }
    }
    exports.LoadQuizzesList = LoadQuizzesList;
    $("#quiz_form").submit(function (e) {
        if ($(this).valid()) {
            var quiz_1 = new proto.Quiz($("#quiz").val());
            $(".question-info").each(function () {
                var sentence = $(this).find("[name^='sentence']").first().val();
                var manswer = $(this).find("[name^='manswer']").first().val();
                var score = parseInt($(this).find("[name^='mscore']").first().val());
                var canRetake = $(this).find("select").first().val() == "0" ? false : true;
                var question = new proto.Question(sentence, new proto.Answer(manswer, score), canRetake);
                $(this).find(".answer-list li").each(function () {
                    question.addAnswerToPool(new proto.Answer($(this).text(), 0));
                });
                quiz_1.addQuestionsToPool(question);
            });
            if (quiz_1.isValid())
                store_quiz(quiz_1);
            else {
                alert("The Quiz is valid when:\n-We have between 3 and 5 answers per question\n-At least 3 questions!");
                e.preventDefault();
            }
        }
    });
    function store_quiz(quiz) {
        var quiz_seq = quiz.id;
        localStorage.setItem("quiz_id_" + quiz_seq, JSON.stringify(quiz));
        quiz_seq++;
        localStorage.setItem("quiz_sequence", quiz_seq.toString());
    }
    exports.store_quiz = store_quiz;
    $(".addQ").click(function (e) {
        e.preventDefault();
        var last = $('#question-info-hidden')
            .clone(true)
            .attr("id", cnt.toString())
            .addClass("question-info")
            .appendTo("#question-info");
        last.find("[name='sentence']").attr("name", "sentence-" + cnt);
        last.find("[name='manswer']").attr("name", "manswer-" + cnt);
        last.find("[name='mscore']").attr("name", "mscore-" + cnt);
        cnt++;
    });
    $(".remQ").click(function () {
        $(this).parents("div").first().remove();
        return false;
    });
    $(".addA").click(function () {
        $("#dialog-form").show();
        currentLinkElt = this;
    });
    $("#dialog-ok").click(function (e) {
        e.preventDefault();
        var ans = $("#dialog-answer").val();
        if (ans != null && ans != "") {
            var elt = document.createElement("li");
            //elt.classList.add("answer-li");
            elt.classList.add("dblClickable");
            elt.innerHTML = $("#dialog-answer").val();
            $("#dialog-answer").val("");
            $("#dialog-form").hide();
            currentLinkElt.nextElementSibling.appendChild(elt);
        }
    });
    $("#dialog-cancel").click(function (e) {
        e.preventDefault();
        $("#dialog-answer").val("");
        $("#dialog-form").hide();
    });
    //force the focus on the dialogbox if it is visible
    $("body").click(function (e) {
        if (e.target.className !== "dialog-box-elt" && $("#dialog-form").is(":visible")) {
            e.preventDefault();
            $("#dialog-answer").focus();
        }
    });
    //i tried with LI element but it is only working for the list of quizzes
    //not the list of answers per question
    $("body").dblclick(function (e) {
        if (e.target.className == "dblClickable") {
            var quiz_text = e.target.textContent;
            var message = void 0;
            var parent_1 = e.target.parentElement;
            if (parent_1.classList.contains("answer-list"))
                message = "Do you want to Delete Answer -> " + quiz_text + "?";
            else
                message = "Do you want to Delete Quiz " + quiz_text + "?";
            var delete_quiz = confirm(message);
            if (delete_quiz == true) {
                if (!parent_1.classList.contains("answer-list")) {
                    var quiz_id = quiz_text.split(":")[0];
                    localStorage.removeItem("quiz_id_" + quiz_id);
                }
                e.target.remove();
            }
        }
    });
});
//# sourceMappingURL=AddRemLines.js.map