const repFactors = {
  1: 1,
  2: 0.96,
  3: 0.94,
  4: 0.91,
  5: 0.88,
  6: 0.86,
  7: 0.83,
  8: 0.8,
  9: 0.77,
  10: 0.74,
  11: 0.7,
  12: 0.67,
  13: 0.65,
  14: 0.63,
  15: 0.6,
  16: 0.55,
  17: 0.52,
  18: 0.49,
  19: 0.46,
  20: 0.43,
  21: 0.4,
  22: 0.37,
  23: 0.34,
  24: 0.31,
  25: 0.28,
  26: 0.25,
  27: 0.22,
  28: 0.19,
  29: 0.16,
  30: 0.13,
};

const exercises = {
  squat: {
    Beginner: 0.75,
    Novice: 1.25,
    Intermediate: 1.5,
    Advanced: 2.25,
    Elite: 2.75,
    SuperElite: 3.25,
  },
  deadlift: {
    Beginner: 1,
    Novice: 1.5,
    Intermediate: 2,
    Advanced: 2.5,
    Elite: 3,
    SuperElite: 3.5,
  },
  barbellRows: {
    Beginner: 0.5,
    Novice: 0.75,
    Intermediate: 1,
    Advanced: 1.5,
    Elite: 1.75,
    SuperElite: 2,
  },
  shoulderPress: {
    Beginner: 0.35,
    Novice: 0.55,
    Intermediate: 0.8,
    Advanced: 1.1,
    Elite: 1.4,
    SuperElite: 1.7,
  },
  dumbbellBenchPress: {
    Beginner: 0.2,
    Novice: 0.35,
    Intermediate: 0.5,
    Advanced: 0.75,
    Elite: 1,
    SuperElite: 1.25,
  },
  dumbbellShoulderPress: {
    Beginner: 0.15,
    Novice: 0.25,
    Intermediate: 0.4,
    Advanced: 0.6,
    Elite: 0.75,
    SuperElite: 0.9,
  },
  barbellCurl: {
    Beginner: 0.2,
    Novice: 0.4,
    Intermediate: 0.6,
    Advanced: 0.85,
    Elite: 0.85,
    SuperElite: 1.15,
  },
  dumbbellCurl: {
    Beginner: 0.1,
    Novice: 0.15,
    Intermediate: 0.3,
    Advanced: 0.5,
    Elite: 0.65,
    SuperElite: 0.8,
  },
  benchPress: {
    Beginner: 0.5,
    Novice: 0.75,
    Intermediate: 1.25,
    Advanced: 1.75,
    Elite: 2,
    SuperElite: 2.5,
  },
};

const levelPercentages = {
  Beginner: 5,
  Novice: 20,
  Intermediate: 50,
  Advanced: 80,
  Elite: 95,
  SuperElite: 99,
};

const levelStars = {
  Untrained: 0,
  Beginner: 1,
  Novice: 2,
  Intermediate: 3,
  Advanced: 4,
  Elite: 5,
  SuperElite: 6,
};

function updateGraphs() {
  const exercise = document.getElementById("exercise").value;
  const bodyweight = parseFloat(document.getElementById("bodyweight").value);
  const weightLifted = parseFloat(
    document.getElementById("weight-lifted").value
  );
  const reps = parseInt(document.getElementById("reps").value);

  if (isNaN(bodyweight) || isNaN(weightLifted) || isNaN(reps)) {
    return;
  }

  const repFactor = repFactors[reps];
  const maxLift = weightLifted / (bodyweight * repFactor);
  let level = "Untrained";
  let nextLevel = "Beginner";
  let percentageToNextLevel = 0;
  let strongerThanPercentage = 0;

  const levels = exercises[exercise];

  if (maxLift < levels.Beginner) {
    percentageToNextLevel = (maxLift / levels.Beginner) * 100;
    strongerThanPercentage =
      (maxLift / levels.Beginner) * levelPercentages.Beginner;
  } else {
    for (const [key, value] of Object.entries(levels)) {
      if (maxLift >= value) {
        level = key;
        strongerThanPercentage = levelPercentages[key];
      } else {
        nextLevel = key;
        percentageToNextLevel =
          ((maxLift - levels[level]) / (value - levels[level])) * 100;
        strongerThanPercentage +=
          ((maxLift - levels[level]) / (value - levels[level])) *
          (levelPercentages[key] - levelPercentages[level]);
        break;
      }
    }
  }

  const circleChart = document.querySelector(".circle-chart");
  const percentageValue = document.getElementById("percentage-value");
  percentageValue.textContent = `${Math.round(percentageToNextLevel)}%`;
  circleChart.style.background = `conic-gradient(#4caf50 0%, #8bc34a ${percentageToNextLevel}%, #ffffff ${percentageToNextLevel}% 100%)`;

  document.getElementById(
    "level"
  ).innerHTML = `Current Level: <b>${level}</b>.<br> 
  You are stronger than ${Math.min(
    Math.round(strongerThanPercentage),
    100
  )}% of male lifters.`;

  const nextLevelContainer = document.getElementById("next-level-container");
  if (level !== "SuperElite") {
    document.getElementById("next-level").textContent =
      "Progress to reach " + nextLevel;
  } else {
    document.getElementById("next-level").textContent = "You are a beast!";
  }

  const progressBar = document.getElementById("progress-bar");
  let progressPercentage = (maxLift / levels.SuperElite) * 100;
  if (progressPercentage > 100) {
    progressPercentage = 100;
  }
  progressBar.style.width = `${progressPercentage}%`;

  updateTable(levels, level);
  updateStars(level);
}

function updateTable(levels, currentLevel) {
  const tbody = document.getElementById("exercise-levels");
  tbody.innerHTML = "";
  for (const [key, value] of Object.entries(levels)) {
    const row = document.createElement("tr");
    if (key === currentLevel) {
      row.classList.add("highlight");
    }
    const classCell = document.createElement("td");
    classCell.textContent = key;
    const xBWCell = document.createElement("td");
    xBWCell.textContent = value;
    const strongerThanCell = document.createElement("td");
    strongerThanCell.textContent = levelPercentages[key] + "%";
    row.appendChild(classCell);
    row.appendChild(xBWCell);
    row.appendChild(strongerThanCell);
    tbody.appendChild(row);
  }
}

function updateStars(level) {
  const starsContainer = document.getElementById("stars-container");
  starsContainer.innerHTML = "";
  const filledStars = levelStars[level];
  for (let i = 0; i < 6; i++) {
    const star = document.createElement("img");
    star.src =
      i < filledStars ? "images/star_filled.png" : "images/star_empty.png";
    starsContainer.appendChild(star);
  }
}

document
  .getElementById("strength-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    updateGraphs();
  });

document.getElementById("exercise").addEventListener("change", updateGraphs);
document.getElementById("bodyweight").addEventListener("input", updateGraphs);
document
  .getElementById("weight-lifted")
  .addEventListener("input", updateGraphs);
document.getElementById("reps").addEventListener("input", updateGraphs);
