/*
 * 
 * @author Han Zhang
 */

const app = new Vue({
    data() {
        return {
            choiceNotSelected: true,
            quizNames: ['math', 'soccer', 'marvel'],
            current : 'Quizzes',
            allQuizzes: {},
            currentData: [],
            questions: [],
            messages: [],
            style: {
            },
            display: ''

        };
    },
    methods: {
        //start quiz based on user input
        start(){
            //this.reset();
            this.current = document.getElementById('options').value;
            this.choiceNotSelected = false;
            this.loadQuiz();
        },

        //load data into questions and answers
        async loadQuiz () {

            if (! this.allQuizzes.hasOwnProperty(this.current)) {
                this.allQuizzes[this.current] = await this.fetchQuiz(this.current);
            }
            this.currentData = this.allQuizzes[this.current];
            this.questions = this.currentData["questions"];
            this.messages = this.currentData["messages"];
            this.style = this.currentData["styles"];

        },
        //fetch from json, catch error if necessary
        async fetchQuiz (quizName) {
            try {
                let response = await fetch(`../data/${quizName.toLowerCase()}.json`);
                return await response.json();
        
            } catch (error) {
                console.error(error);
                return [];
            }
        },

        // process user submission of their answers
        processAnswers () {
            let numCorrect = this.countCorrectAnswers();
            // STOP if a question is not answered
            if (numCorrect < 0) {
                window.alert('You must answer all questions first.');
                return;
            }
            // otherwise report results for user to see
            this.reportResults(numCorrect, this.questions.length);
            // swap buttons to allow the quiz to be reset and taken again
            document.getElementById('submit').style.display = 'none';
            document.getElementById('next').style.display = 'inherit';
        },

        // check how many answers match correct ones
        countCorrectAnswers () {
            let numCorrect = 0;
            for (let question of this.questions) {
                let userAnswer = question.userChoice; 
                if(!question.options.includes(userAnswer)){ 
                    return -1;
                }
                
                if(userAnswer==question.answer){ 
                    numCorrect+=1;
                }
                this.highlightResponse(question.question, userAnswer, question.answer); 
            } 
            return numCorrect;
        },

        // change the classes to reflect results of user's selections
        highlightResponse (parent, choice, correctAnswer) {
            let items = document.getElementById(parent).querySelectorAll('li');
            items.forEach(li => {
                let input = li.querySelector('input');
                if (input.value == choice) {
                    console.log(choice == correctAnswer);
                    li.className = (choice === correctAnswer ? 'correct' : 'incorrect');
                }
                input.disabled = true;
            });
        },

        // show percent correct
        reportResults (numCorrect, total) {
            let percentage = Math.round(numCorrect * 100 / total);
            let display_text = '';
            if (percentage => 80) {display_text = this.messages[2];}
            if (percentage < 80) {display_text = this.messages[1];}
            if (percentage < 40) {display_text = this.messages[0];}


            this.display = `You got ${Math.round(numCorrect * 100 / total)}% correct: ` + display_text;
        },
        // reset quiz to its original state so it can be taken again
        reset () {
            this.choiceNotSelected = true;
            this.current =  'Quizzes';
            this.allQuizzes= {};
            this.currentData = [];
            this.questions= [];
            this.messages= [];
            this.style = {};
            this.display = '';           
        },
        watch: {
            // change current links displayed if this variable changes its value!
            //current () {
                //this.loadData();
            //}
        },
    
        // called after app is connected to the page (i.e., after both Vue and the HTML DOM are loaded, like onload event)
        mounted () {
            //this.loadData();
        }
    
    }

});
app.$mount("#app");