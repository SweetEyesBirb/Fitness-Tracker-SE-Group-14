function calculateBMI() {
    var weight = document.getElementById('weight').value;
    var height = document.getElementById('height').value;

    if (weight > 0 && height > 0) {
        var bmi = (weight / ((height / 100) * (height / 100))).toFixed(2);
        document.getElementById('result').innerHTML = 'Your BMI is: ' + bmi;
    } else {
        document.getElementById('result').innerHTML = 'Please enter valid values for weight and height.';
    }
}

function setCalorieGoal() {
    var calories = document.getElementById('calories').value;

    if (calories > 0) {
        document.getElementById('calorie-goal-result').innerHTML = 'Your daily calorie goal is: ' + calories + ' calories';
    } else {
        document.getElementById('calorie-goal-result').innerHTML = 'Please enter a valid calorie goal.';
    }
}
