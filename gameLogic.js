var answer, score = 0,
  backgroundImage = [];

function nextQuestion() {
  var n1 = Math.round(Math.random() * 5);
  document.getElementById('n1').innerHTML = n1;
  var n2 = Math.round(Math.random() * 5);
  document.getElementById('n2').innerHTML = n2;
  answer = n1 + n2;
}

function checkAnswer() {
  const prediction = predictImage();
  console.log(`answer: ${answer} prediction: ${prediction}`);
  if (answer == prediction) {
    score++;
    if (score > 6) {
      alert('Congratulations!');
      backgroundImage = [];
      document.body.style.backgroundImage = backgroundImage;
      nextQuestion();
      score = 0;
    } else {
      backgroundImage.push(`url('images/background${score}.svg')`);
      document.body.style.backgroundImage = backgroundImage;
    }
  } else {
    score != 0 ? score-- : null;
    alert('Oops, check your calculations and try writing the number neater next time.')
    setTimeout(function() {
      backgroundImage.pop();
      document.body.style.backgroundImage = backgroundImage;
    }, 1000);
  }
  console.log(`score: ${score}`);
}
