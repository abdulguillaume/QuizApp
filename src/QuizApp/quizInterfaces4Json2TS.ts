
    export interface IAnswer {
        _definition: string;
        _score: number;
        _id: number;
    }


    export interface IQuestion {
        sentence: string;
        answer: IAnswer;
        canRetake: boolean;
        answer_pool: IAnswer[];
        final_score: number;
        _id: number;
    }

    export interface IQuiz {
        _name: string;
        _id: number;
        questions: IQuestion[];
    }


//extract interface using
//json2ts.com