import * as proto from './Quiz';
import { LoadQuizzesList } from './AddRemLines';
import { store_quiz } from './AddRemLines';

//i add jquery type definition(not use in project/not working)
///<reference path="@types/jquery" />

//$("#answer-info-hidden").hide();

let _quiz: proto.Quiz;

$(document).ready(function () {

    LoadQuizzesList("option", "#quiz-list-select");

    let quiz_select = $("#quiz-list-select");

    //if no quiz found, add default quiz to db
    if (quiz_select.val() == "" || quiz_select.val() == null) {
        defaultQuiz();
    }
    

});

$("#start_quiz").click(function () {

    let quiz_select = $("#quiz-list-select");

    if (quiz_select.val() == "" || quiz_select.val() == null)
    {
        alert("No Quiz Found in LocalStorage!");
    }
    else
    {
        $("#quiz").empty();

        $("#score").empty();

        let quiz_id = quiz_select.val().split(":")[0];

        let quizjson = JSON.parse(
            localStorage.getItem(`quiz_id_${quiz_id}`)
        );

        _quiz = proto.Quiz.json2TS(quizjson);

        showQuiz(_quiz);
    }
});


$("#quiz-list-select").change(function () {
    $("#quiz").empty();

    $("#score").empty();
});

function defaultQuiz(){
let q1 = new proto.Question("Javascript code can run on?", new proto.Answer("All most common browsers(firefox, IR, Chrome, Safari etc.)", 2), false);
q1.addAnswerToPool(new proto.Answer("Internet Explorer only", 0));
q1.addAnswerToPool(new proto.Answer("Firefox only", 0));
q1.addAnswerToPool(new proto.Answer("Chrome only", 0));


let q2 = new proto.Question("Select the operating system in the provided list?", new proto.Answer("Linux", 4), true);
q2.addAnswerToPool(new proto.Answer("HTML", 0));
q2.addAnswerToPool(new proto.Answer("TypeScript", 0));
q2.addAnswerToPool(new proto.Answer("Facebook", 0));
q2.addAnswerToPool(new proto.Answer("Whatever 1.0", 0));


let q3 = new proto.Question("How to add an external JavaScript to an html page?", new proto.Answer("<script></script>", 5), true);
q3.addAnswerToPool(new proto.Answer("<body></body>", 0));
q3.addAnswerToPool(new proto.Answer("<link hfref=''>", 0));
q3.addAnswerToPool(new proto.Answer("<div></div>", 0));
q3.addAnswerToPool(new proto.Answer("<javascript></javascript>", 0));

let q4 = new proto.Question("A switch is a?", new proto.Answer("Layer 2 device", 2), false);
q4.addAnswerToPool(new proto.Answer("Layer 3 device", 0));
q4.addAnswerToPool(new proto.Answer("Layer 1 device", 0));

let q5 = new proto.Question("A router is a?", new proto.Answer("Layer 3 device", 2), false);
q5.addAnswerToPool(new proto.Answer("Layer 2 device", 0));
q5.addAnswerToPool(new proto.Answer("Layer 1 device", 0));

let quiz_dflt = new proto.Quiz("Quiz Sample - Default");
quiz_dflt.addQuestionsToPool(q1, q2, q3, q4, q5);

    store_quiz(quiz_dflt);

}

function showQuiz(quiz: proto.Quiz) {

    let divQuiz = document.getElementById("quiz");
    
    for (let question of quiz.questions) {

        let ans_list = document.createElement("ol");

        let str = "";

        if (question.getCanRetake())
            str = " (Can retake question)";
        ans_list.innerHTML = question.getSentence() + " /Max pts +" + question.maxScore + str;

        for (let answer of question.getAllAnswers()) {

            let ans = document.createElement("li");

            let radio = document.createElement("input");
            radio.setAttribute("type", "radio");
            radio.setAttribute("name", question.id.toString());
            radio.setAttribute("value", question.id.toString());
            radio.setAttribute("id", answer.id.toString());

            let _radio = radio;
            radio.addEventListener("click", function (e) {
                let isCorrect = false;
                try {

                    quiz.isComplete();

                    isCorrect = question.isCorrectAnswer(parseInt(_radio.id));

                    if (isCorrect) {
                        ans.classList.add("correct");
                    } else {
                        ans.classList.add("wrong");
                    }
                    printScore(quiz);

                    //quiz.isComplete();

                } catch (ex) {
                    alert(ex.message);
                    e.preventDefault();
                }

            });

            let label = document.createElement("label");
            label.setAttribute("for", answer.id.toString());
            label.innerHTML = answer.definition.toString();

            ans.appendChild(radio);
            ans.appendChild(label);

           

            ans_list.appendChild(ans);
        }

        divQuiz.appendChild(ans_list);

    }

}

function printScore(quiz: proto.Quiz) {
    let div_score = document.getElementById("score");

    let score = "score: " + quiz.finalScore().toString();

    div_score.innerHTML = score;
}









