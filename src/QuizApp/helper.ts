let idAnswer = 0, idQuestion = 0, idQuiz = 0;

export function getIdAnswer() {
    return ++idAnswer;
}

export function getIdQuestion() {
    return ++idQuestion;
}

export function getIdQuiz() {
    return ++idQuiz;
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