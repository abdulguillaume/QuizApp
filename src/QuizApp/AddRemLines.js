define(["require", "exports", "./Quiz"], function (require, exports, proto) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //i add jquery type definition(not use in project/not working)
    ///<reference path="@types/jquery" />
    var cnt = 1;
    $("document").ready(function () {
        $("#quiz_form").validate();
    });
    $("#quiz_form").submit(function (e) {
        if ($(this).valid()) {
            var quiz_1 = new proto.Quiz($("#quiz").val());
            //question-info
            $(".question-info").each(function () {
                var sentence = $(this).find("[name='sentence']").first().val();
                var manswer = $(this).find("[name='manswer']").first().val();
                var score = parseInt($(this).find("[name='mscore']").first().val());
                var canRetake = $(this).find("select").first().val() == "0" ? false : true;
                var question = new proto.Question(sentence, new proto.Answer(manswer, score), canRetake);
                $(".answer-list li").each(function () {
                    question.addAnswerToPool(new proto.Answer($(this).text(), 0));
                });
                quiz_1.addQuestionsToPool(question);
            });
            console.log(quiz_1.toString());
            e.preventDefault();
            //.next("[name='sentence']")
        }
    });
    $(".addQ").click(function (e) {
        e.preventDefault();
        var last = $('#question-info-hidden')
            .clone(true)
            .attr("id", cnt.toString())
            .addClass("question-info")
            .appendTo("#question-info");
        cnt++;
        $("#quiz_form").validate();
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