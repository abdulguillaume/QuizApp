define(["require", "exports", "./Quiz"], function (require, exports, proto) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //i added jquery type definition(not use in project/not working)
    ///<reference path="@types/jquery" />
    var cnt = 1;
    $("document").ready(function () {
        $("#quiz_form").validate();
        LoadQuizzesList("li", "#quiz-list-ul");
        // LoadQuizzesList("option", "#quiz-list-select");
        if ($("#index").length) {
            alert("this is index page");
        }
    });
    function LoadQuizzesList(tag, selector) {
        var quiz_list = $(selector);
        quiz_list.empty();
        for (var i = 0; i < localStorage.length; i++) {
            var s_id = localStorage.key(i);
            if (s_id.toString().match(/^quiz_id_/) != null) {
                var elt = document.createElement(tag);
                var jsondata = JSON.parse(localStorage.getItem(s_id));
                var quiz = proto.Quiz.json2TS(jsondata);
                elt.innerHTML = quiz.name;
                //alert(quiz.name);
                quiz_list.append(elt);
            }
        }
    }
    $("#quiz_form").submit(function (e) {
        if ($(this).valid()) {
            var quiz_1 = new proto.Quiz($("#quiz").val());
            //question-info
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
            store_quiz(quiz_1);
        }
    });
    function store_quiz(quiz) {
        var quiz_seq = quiz.id;
        localStorage.setItem("quiz_id_" + quiz_seq, JSON.stringify(quiz));
        quiz_seq++;
        localStorage.setItem("quiz_sequence", quiz_seq.toString());
    }
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
        //$.validator.unobtrusive.parseDynamicContent("#quiz_form");
        //$("#quiz_form").validate();
    });
    $(".remQ").click(function () {
        $(this).parents("div").first().remove();
        return false;
    });
    $(".addA").click(function () {
        var ans = prompt("Enter answer");
        if (ans != null && ans != "") {
            var elt = document.createElement("li");
            elt.innerHTML = ans;
            $(this).next("ul").append(elt);
        }
    });
});
//# sourceMappingURL=AddRemLines.js.map