let idAnswer = 0, idQuestion = 0, idQuiz = 0;

export function getIdAnswer() {
    return ++idAnswer;
}

export function getIdQuestion() {

    return ++idQuestion;
}

export function getIdQuiz() {
    //previous version was the expression {return ++idQuestion;} only
    //now as i will be using localstorage
    //check available quiz id in the localstorage
    //i dont want to overwrite my quiz inside localstorage

    let quiz_seq = localStorage.getItem("quiz_sequence");

    if (quiz_seq == null) {
        ++idQuiz;
    } else {
        idQuiz = parseInt(quiz_seq);
    }

    return idQuiz;
}

export function getRandomPosInArray(current_pos, maxval) {
    var pos;

    while (true) {
        pos = Math.floor(Math.random() * maxval);

        //continue until you find a random number != to (current_pos)
        if (pos != current_pos) {
            return pos;
        }
    }
}

export function htmlTagReplace(data) {
    return data.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
