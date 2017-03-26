import * as proto from './Quiz';


//i added jquery type definition(not use in project/not working)
///<reference path="@types/jquery" />

let cnt = 1;

$("document").ready(function () {
    $("#quiz_form").validate();

    LoadQuizzesList("li", "#quiz-list-ul");
   // LoadQuizzesList("option", "#quiz-list-select");

    if ($("#index").length)
    {
        alert("this is index page");
    }
});




function LoadQuizzesList(tag:string, selector:string)
{
    let quiz_list = $(selector);

    quiz_list.empty();

    for (let i = 0; i < localStorage.length; i++)
    {
        let s_id = localStorage.key(i);

        if (s_id.toString().match(/^quiz_id_/) != null )
        {
            let elt = document.createElement(tag);

            let jsondata = JSON.parse(
                    localStorage.getItem(s_id)
            );

            let quiz = proto.Quiz.json2TS(jsondata);

            elt.innerHTML = quiz.name;

            //alert(quiz.name);

            quiz_list.append(elt);

        }

    }
    
}

$("#quiz_form").submit(function (e) {

    if ($(this).valid())
    {
        let quiz = new proto.Quiz($("#quiz").val());

        //question-info
        $(".question-info").each(function () {
            let sentence = $(this).find("[name^='sentence']").first().val();

            let manswer = $(this).find("[name^='manswer']").first().val();

            let score = parseInt($(this).find("[name^='mscore']").first().val());

            let canRetake = $(this).find("select").first().val() =="0"?false:true;

            let question = new proto.Question(sentence,
                new proto.Answer(manswer, score), canRetake);

            $(this).find(".answer-list li").each(function () {
                question.addAnswerToPool(new proto.Answer($(this).text(), 0));
            });

            quiz.addQuestionsToPool(question);

            
        });

        store_quiz(quiz);

    }



});


function store_quiz(quiz: proto.Quiz) {
    let quiz_seq = quiz.id;
    localStorage.setItem(`quiz_id_${quiz_seq}`, JSON.stringify(quiz));
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

    last.find("[name='sentence']").attr("name",`sentence-${cnt}`);
    last.find("[name='manswer']").attr("name", `manswer-${cnt}`);
    last.find("[name='mscore']").attr("name", `mscore-${cnt}`);

    cnt++;

    //$.validator.unobtrusive.parseDynamicContent("#quiz_form");

    //$("#quiz_form").validate();
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
