import * as proto from './Quiz';


//i added jquery type definition(not use in project/not working)
///<reference path="@types/jquery" />


let cnt = 1;

let currentLinkElt: HTMLLinkElement;

$("document").ready(function () {

    $("#dialog-form").hide();

    $("#quiz_form").validate();

    LoadQuizzesList("li", "#quiz-list-ul");
});


export function LoadQuizzesList(tag:string, selector:string)
{
    let quiz_list = $(selector);

    quiz_list.empty();

    for (let i = 0; i < localStorage.length; i++) {
        let s_id = localStorage.key(i);

        if (s_id.toString().match(/^quiz_id_/) != null) {
            let elt = document.createElement(tag);

            if (tag == "li")
            {
                elt.classList.add("dblClickable");
            }
            
            let jsondata = JSON.parse(
                localStorage.getItem(s_id)
            );

            let quiz = proto.Quiz.json2TS(jsondata);
            
            elt.innerHTML = `${quiz.id}: ${quiz.name}`;

            quiz_list.append(elt);

        }

    }
    
}



$("#quiz_form").submit(function (e) {

    if ($(this).valid())
    {
        let quiz = new proto.Quiz($("#quiz").val());

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

        if (quiz.isValid())
            store_quiz(quiz);
        else {
            alert("The Quiz is valid when:\n-We have between 3 and 5 answers per question\n-At least 3 questions!");
            e.preventDefault();
        }

    }


});


export function store_quiz(quiz: proto.Quiz) {
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

    let ans = $("#dialog-answer").val();

    if (ans != null && ans != "") {
        let elt = document.createElement("li");
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

    if (e.target.className == "dblClickable")
    {

        let quiz_text = e.target.textContent

        let message: string;

        let parent = e.target.parentElement;

        if (parent.classList.contains("answer-list"))
            message = `Do you want to Delete Answer -> ${quiz_text}?`;
        else
            message = `Do you want to Delete Quiz ${quiz_text}?`;

        let delete_quiz = confirm(message);

        if (delete_quiz == true) {
            if (!parent.classList.contains("answer-list")) {
                let quiz_id = quiz_text.split(":")[0];

                localStorage.removeItem(`quiz_id_${quiz_id}`);
            }

            e.target.remove();
        }

    }


});