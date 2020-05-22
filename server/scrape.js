const fetch = require('node-fetch');
const cheerio =  require('cheerio'); // Its a library that gives query type functionality on node backend side

const baseUrl = 'https://www.rd.com/culture/trivia-questions/page';

async function getTriviaPage(pageNum){
    const url = `${baseUrl}/${pageNum}/`; // The url we are intending to scrape
    const response = await fetch(url); // Fetch the data of the url provided
    const html =  await response.text(); // convert it to raw html
    const $ = cheerio.load(html);
    const containers = $('.listicle-card');
    const questions = [];
    for(let i = 0 ; i < containers.length; i += 2){
        const questionContainer =  $(containers[i]);
        const answerContainer =  $(containers[i + 1]);
        const options = [];
        const questionImage = $(questionContainer.find('img')).attr('src');
        let question = '';
        const possibleQuestion = $(questionContainer.find('p')[0]).text().trim();
        if(!possibleQuestion.match(/^[A-D]\./g)){
            question = possibleQuestion;
        }
        questionContainer.find('p').each((_, element) => {
            const text = $(element).text().trim();
            const matching = /^[A-D]\.\s(.*)/g.exec(text)
            if(matching){
                options.push(matching[1]);
            }
        });
        const answer = /^Answer: [A-D]\.\s(.*)/g.exec($(answerContainer.find('h2')[0]).text())[1].trim();
        const answerDescription = $(answerContainer.find('p').not('.listicle-image-wrapper')).text().trim();
        questions.push({
            question,
            questionImage,
            options,
            answer,
            answerDescription 
        })
    }
    console.log(questions);

}

getTriviaPage(2);