import * as proto from './Quiz';

//i add jquery type definition(not use in project/not working)
///<reference path="@types/jquery" />

let cnt = 1;

$("document").ready(function () {
    $("#quiz_form").validate();
});

$("#quiz_form").submit(function (e) {

    if ($(this).valid())
    {
        let quiz = new proto.Quiz($("#quiz").val());

        //question-info
        $(".question-info").each(function () {
            let sentence = $(this).find("[name='sentence']").first().val();

            let manswer = $(this).find("[name='manswer']").first().val();

            let score = parseInt($(this).find("[name='mscore']").first().val());

            let canRetake = $(this).find("select").first().val() =="0"?false:true;

            let question = new proto.Question(sentence,
                new proto.Answer(manswer, score), canRetake);

            $(".answer-list li").each(function () {
                question.addAnswerToPool(new proto.Answer($(this).text(), 0));
            });

            quiz.addQuestionsToPool(question);

            
        });

        console.log(quiz.toString());
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
    let ans = prompt("Enter answer");

    if (ans != null && ans != "") {
        let elt = document.createElement("li");
        elt.innerHTML = ans;
        $(this).next("ul").append(elt);
    }
});
