// 2026 African Cup of Nations Winner Prediction App
// Using TensorFlow.js for Machine Learning

// Team statistics data (Wins, Draws, Losses, Goals Scored)
const teamData = {
  Egypt: { features: [35, 15, 12, 120], strength: 0.92 },
  Senegal: { features: [28, 12, 16, 95], strength: 0.85 },
  Morocco: { features: [30, 14, 14, 105], strength: 0.88 },
  Cameroon: { features: [32, 11, 17, 110], strength: 0.84 },
  Algeria: { features: [26, 10, 18, 85], strength: 0.78 },
  Nigeria: { features: [33, 13, 15, 115], strength: 0.86 },
  "Ivory Coast": { features: [29, 12, 17, 100], strength: 0.82 },
  Mali: { features: [24, 8, 20, 75], strength: 0.72 },
};

// CAN 2026 Group Stage Format
const groupStage = {
  "Group A": ["Egypt", "Senegal", "Mali", "Cameroon"],
  "Group B": ["Morocco", "Nigeria", "Algeria", "Ivory Coast"],
};

// Generate all group stage matches
const allMatches = [];

function generateMatches() {
  for (const [groupName, teams] of Object.entries(groupStage)) {
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        allMatches.push({
          group: groupName,
          team1: teams[i],
          team2: teams[j],
          result: null,
        });
      }
    }
  }
}

generateMatches();

let model;
let isModelTrained = false;

// Tournament bracket data
let tournamentBracket = {
  groupWinners: {},
  semiFinals: [],
  finals: null,
  champion: null,
};

// Initialize and create the neural network model
async function initializeModel() {
  model = tf.sequential({
    layers: [
      tf.layers.dense({
        inputShape: [4],
        units: 16,
        activation: "relu",
        kernelInitializer: "heNormal",
      }),
      tf.layers.dropout({ rate: 0.2 }),
      tf.layers.dense({
        units: 8,
        activation: "relu",
        kernelInitializer: "heNormal",
      }),
      tf.layers.dense({
        units: 4,
        activation: "relu",
        kernelInitializer: "heNormal",
      }),
      tf.layers.dense({
        units: 1,
        activation: "sigmoid",
      }),
    ],
  });

  model.compile({
    optimizer: tf.train.adam(0.01),
    loss: "binaryCrossentropy",
    metrics: ["mae"],
  });

  console.log("Model architecture initialized");
}

// Train the model with team data
async function trainModel() {
  if (isModelTrained) return;

  try {
    // Prepare training data
    const teamNames = Object.keys(teamData);
    const trainingFeatures = teamNames.map((team) => teamData[team].features);
    const trainingLabels = teamNames.map((team) => [teamData[team].strength]);

    // Normalize features
    const xs = tf.tensor2d(trainingFeatures);
    const xsNormalized = xs.div(tf.tensor1d(xs.max(0).dataSync())).mul(100);
    const ys = tf.tensor2d(trainingLabels);

    // Train the model
    await model.fit(xsNormalized, ys, {
      epochs: 50,
      batchSize: 2,
      verbose: 0,
      shuffle: true,
    });

    // Cleanup tensors
    xs.dispose();
    xsNormalized.dispose();
    ys.dispose();

    isModelTrained = true;
    console.log("Model training completed");
  } catch (error) {
    console.error("Error training model:", error);
  }
}

// Calculate match prediction based on team statistics
function calculateMatchProbability(team1, team2) {
  const team1Data = teamData[team1];
  const team2Data = teamData[team2];

  if (!team1Data || !team2Data) {
    return { team1Prob: 0, team2Prob: 0 };
  }

  // Calculate base probability from strength
  let team1BaseProb = team1Data.strength;
  let team2BaseProb = team2Data.strength;

  // Add variance based on win rate
  const team1WinRate =
    team1Data.features[0] /
    (team1Data.features[0] + team1Data.features[1] + team1Data.features[2]);
  const team2WinRate =
    team2Data.features[0] /
    (team2Data.features[0] + team2Data.features[1] + team2Data.features[2]);

  team1BaseProb = team1BaseProb * 0.7 + team1WinRate * 0.3;
  team2BaseProb = team2BaseProb * 0.7 + team2WinRate * 0.3;

  // Normalize to probabilities that sum to 1
  const total = team1BaseProb + team2BaseProb;
  const team1Prob = (team1BaseProb / total) * 100;
  const team2Prob = (team2BaseProb / total) * 100;

  return { team1Prob, team2Prob };
}

// Main prediction function
async function predictWinner() {
  const team1 = document.getElementById("team1").value;
  const team2 = document.getElementById("team2").value;

  if (!team1 || !team2) {
    alert("Please select both teams");
    return;
  }

  if (team1 === team2) {
    alert("Please select different teams");
    return;
  }

  // Show loading status
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML =
    '<div class="status loading">🔄 Analyzing team data and predicting...</div>';

  try {
    // Initialize and train model if needed
    if (!model) {
      await initializeModel();
    }
    if (!isModelTrained) {
      await trainModel();
    }

    // Calculate probabilities
    const { team1Prob, team2Prob } = calculateMatchProbability(team1, team2);

    // Determine winner
    const winner = team1Prob > team2Prob ? team1 : team2;
    const winnerProb = Math.max(team1Prob, team2Prob);

    // Display results
    displayResults(team1, team2, team1Prob, team2Prob, winner, winnerProb);
  } catch (error) {
    console.error("Prediction error:", error);
    resultsDiv.innerHTML =
      '<div class="status" style="background: #f8d7da; color: #721c24;">Error occurred during prediction</div>';
  }
}

// Display prediction results
function displayResults(
  team1,
  team2,
  team1Prob,
  team2Prob,
  winner,
  winnerProb
) {
  const resultsDiv = document.getElementById("results");

  let html = `
        <div class="result-item">
            <div>
                <div class="team-name">${team1}</div>
                <div class="prediction-bar">
                    <div class="bar-fill" style="width: ${team1Prob}%"></div>
                </div>
            </div>
            <div class="probability">${team1Prob.toFixed(1)}%</div>
        </div>
        
        <div class="result-item">
            <div>
                <div class="team-name">${team2}</div>
                <div class="prediction-bar">
                    <div class="bar-fill" style="width: ${team2Prob}%"></div>
                </div>
            </div>
            <div class="probability">${team2Prob.toFixed(1)}%</div>
        </div>

        <div class="status success" style="margin-top: 20px; font-size: 1.1em;">
            🎯 Predicted Winner: <strong>${winner}</strong> (${winnerProb.toFixed(
    1
  )}% confidence)
        </div>
    `;

  resultsDiv.innerHTML = html;
}

// Reset the application
function resetApp() {
  document.getElementById("team1").value = "";
  document.getElementById("team2").value = "";
  document.getElementById("results").innerHTML = "";
}

// Initialize on page load
window.addEventListener("DOMContentLoaded", () => {
  console.log("CAN 2026 Prediction App Initialized");
  initializeGroupStageDisplay();
});

// Tab switching functionality
function switchTab(tabName) {
  // Hide all tab contents
  const contents = document.querySelectorAll(".tab-content");
  contents.forEach((content) => content.classList.remove("active"));

  // Remove active class from all buttons
  const buttons = document.querySelectorAll(".tab-btn");
  buttons.forEach((btn) => btn.classList.remove("active"));

  // Show selected tab
  document.getElementById(tabName).classList.add("active");

  // Add active class to clicked button
  event.target.classList.add("active");
}

// Initialize group stage display
function initializeGroupStageDisplay() {
  const container = document.getElementById("groups-container");
  let html = '<div class="groups-grid">';

  for (const [groupName, teams] of Object.entries(groupStage)) {
    html += `<div class="group">
            <div class="group-title">${groupName}</div>`;

    // Get matches for this group
    const groupMatches = allMatches.filter((m) => m.group === groupName);

    groupMatches.forEach((match) => {
      html += `<div class="match">
                <span class="match-team">${match.team1}</span>
                <span class="match-vs">vs</span>
                <span class="match-team">${match.team2}</span>
                <span class="match-result" id="result-${groupName}-${match.team1}-${match.team2}">-</span>
            </div>`;
    });

    html += "</div>";
  }

  html += "</div>";
  container.innerHTML = html;
}

// Predict all group stage matches
async function predictAllMatches() {
  const resultsDiv = document.getElementById("group-results");
  resultsDiv.innerHTML =
    '<div class="status loading">🔄 Predicting all group stage matches...</div>';

  try {
    // Initialize and train model if needed
    if (!model) {
      await initializeModel();
    }
    if (!isModelTrained) {
      await trainModel();
    }

    // Predict all matches
    for (const match of allMatches) {
      const { team1Prob, team2Prob } = calculateMatchProbability(
        match.team1,
        match.team2
      );

      // Determine winner
      let result;
      const diff = Math.abs(team1Prob - team2Prob);
      if (diff < 5) {
        // Close match, could be a draw
        const drawChance = Math.random();
        if (drawChance < 0.3) {
          result = "Draw";
        } else if (team1Prob > team2Prob) {
          result = `${match.team1} (${team1Prob.toFixed(0)}%)`;
        } else {
          result = `${match.team2} (${team2Prob.toFixed(0)}%)`;
        }
      } else {
        result =
          team1Prob > team2Prob
            ? `${match.team1} (${team1Prob.toFixed(0)}%)`
            : `${match.team2} (${team2Prob.toFixed(0)}%)`;
      }

      match.result = result;

      // Update UI
      const resultElement = document.getElementById(
        `result-${match.group}-${match.team1}-${match.team2}`
      );
      if (resultElement) {
        resultElement.textContent = result;
        resultElement.style.background =
          result === "Draw" ? "#ffc107" : "#667eea";
      }
    }

    // Display summary
    displayGroupStageSummary();
  } catch (error) {
    console.error("Prediction error:", error);
    resultsDiv.innerHTML =
      '<div class="status" style="background: #f8d7da; color: #721c24;">Error occurred during prediction</div>';
  }
}

// Display group stage summary
function displayGroupStageSummary() {
  const resultsDiv = document.getElementById("group-results");

  let html =
    '<div class="status success" style="margin-top: 20px;">✅ All matches predicted!</div>';

  // Group results by group
  for (const [groupName, teams] of Object.entries(groupStage)) {
    html += `<div style="margin-top: 20px; padding: 15px; background: #f9f9f9; border-radius: 8px;">
            <strong>${groupName} Results:</strong><br>`;

    const groupMatches = allMatches.filter((m) => m.group === groupName);
    groupMatches.forEach((match) => {
      html += `<small>${match.team1} vs ${match.team2}: <strong>${match.result}</strong></small><br>`;
    });

    html += "</div>";
  }

  resultsDiv.innerHTML += html;
}

// Reset group stage
function resetGroupStage() {
  allMatches.forEach((match) => (match.result = null));
  document.getElementById("group-results").innerHTML = "";

  // Reset result display
  for (const match of allMatches) {
    const resultElement = document.getElementById(
      `result-${match.group}-${match.team1}-${match.team2}`
    );
    if (resultElement) {
      resultElement.textContent = "-";
      resultElement.style.background = "#667eea";
    }
  }
}

// Determine group winners based on predictions
async function determineGroupWinners() {
  const winners = {};

  // Initialize and train model if needed
  if (!model) {
    await initializeModel();
  }
  if (!isModelTrained) {
    await trainModel();
  }

  for (const [groupName, teams] of Object.entries(groupStage)) {
    let groupScores = {};

    // Initialize scores
    teams.forEach((team) => {
      groupScores[team] = { points: 0, goalsFor: 0, goalsAgainst: 0 };
    });

    // Get matches for this group
    const groupMatches = allMatches.filter((m) => m.group === groupName);

    groupMatches.forEach((match) => {
      const { team1Prob, team2Prob } = calculateMatchProbability(
        match.team1,
        match.team2
      );

      // Simulate match outcome
      if (Math.abs(team1Prob - team2Prob) < 5) {
        // Draw
        groupScores[match.team1].points += 1;
        groupScores[match.team2].points += 1;
        groupScores[match.team1].goalsFor += 1;
        groupScores[match.team2].goalsFor += 1;
      } else {
        const winner = team1Prob > team2Prob ? match.team1 : match.team2;
        const loser = winner === match.team1 ? match.team2 : match.team1;

        groupScores[winner].points += 3;
        groupScores[winner].goalsFor += Math.ceil(Math.random() * 2 + 1);
        groupScores[loser].goalsFor += Math.floor(Math.random() * 1);
        groupScores[loser].goalsAgainst += groupScores[winner].goalsFor;
      }

      groupScores[match.team2].goalsAgainst +=
        groupScores[match.team1].goalsFor;
    });

    // Sort teams by points, then goal difference
    const sorted = Object.entries(groupScores).sort((a, b) => {
      const aGD = a[1].goalsFor - a[1].goalsAgainst;
      const bGD = b[1].goalsFor - b[1].goalsAgainst;
      return b[1].points - a[1].points || bGD - aGD;
    });

    winners[groupName] = sorted.slice(0, 2).map((item) => item[0]);
  }

  return winners;
}

// Predict tournament bracket
async function predictTournamentBracket() {
  const bracketContainer = document.getElementById("bracket-container");
  const bracketResults = document.getElementById("bracket-results");

  bracketContainer.innerHTML =
    '<div class="status loading">🔄 Determining group winners...</div>';
  bracketResults.innerHTML = "";

  try {
    // Get group winners
    const groupWinners = await determineGroupWinners();
    tournamentBracket.groupWinners = groupWinners;

    // Create semi-finals: Winner A vs Runner-up B, Winner B vs Runner-up A
    const winners = Object.values(groupWinners);
    const semiFinalists = [
      winners[0][0], // Winner of Group A
      winners[1][1], // Runner-up of Group B
      winners[1][0], // Winner of Group B
      winners[0][1], // Runner-up of Group A
    ];

    // Predict semi-finals
    const semiFinal1 = {
      team1: semiFinalists[0],
      team2: semiFinalists[1],
      winner: null,
    };

    const semiFinal2 = {
      team1: semiFinalists[2],
      team2: semiFinalists[3],
      winner: null,
    };

    const { team1Prob: sf1t1, team2Prob: sf1t2 } = calculateMatchProbability(
      semiFinal1.team1,
      semiFinal1.team2
    );
    semiFinal1.winner = sf1t1 > sf1t2 ? semiFinal1.team1 : semiFinal1.team2;
    semiFinal1.prob = Math.max(sf1t1, sf1t2);

    const { team1Prob: sf2t1, team2Prob: sf2t2 } = calculateMatchProbability(
      semiFinal2.team1,
      semiFinal2.team2
    );
    semiFinal2.winner = sf2t1 > sf2t2 ? semiFinal2.team1 : semiFinal2.team2;
    semiFinal2.prob = Math.max(sf2t1, sf2t2);

    tournamentBracket.semiFinals = [semiFinal1, semiFinal2];

    // Predict final
    const finalMatch = {
      team1: semiFinal1.winner,
      team2: semiFinal2.winner,
      winner: null,
    };

    const { team1Prob: final1, team2Prob: final2 } = calculateMatchProbability(
      finalMatch.team1,
      finalMatch.team2
    );
    finalMatch.winner = final1 > final2 ? finalMatch.team1 : finalMatch.team2;
    finalMatch.prob = Math.max(final1, final2);

    tournamentBracket.finals = finalMatch;
    tournamentBracket.champion = finalMatch.winner;

    // Display bracket
    displayTournamentBracket();
  } catch (error) {
    console.error("Bracket prediction error:", error);
    bracketContainer.innerHTML =
      '<div class="status" style="background: #f8d7da; color: #721c24;">Error generating bracket</div>';
  }
}

// Display tournament bracket
function displayTournamentBracket() {
  const container = document.getElementById("bracket-container");
  const resultsDiv = document.getElementById("bracket-results");

  let html = '<div class="bracket-container">';

  // Group Winners
  html +=
    '<div class="bracket-round"><div class="bracket-title">GROUP WINNERS</div>';
  for (const [groupName, winners] of Object.entries(
    tournamentBracket.groupWinners
  )) {
    winners.forEach((team) => {
      html += `<div class="bracket-match">
                <div class="bracket-match-team winner">
                    <span class="team-name-bracket">🥇 ${team}</span>
                    <span class="team-score">${groupName}</span>
                </div>
            </div>`;
    });
  }
  html += "</div>";

  // Semi-Finals
  html +=
    '<div class="bracket-round"><div class="bracket-title">SEMI-FINALS</div>';
  tournamentBracket.semiFinals.forEach((match) => {
    html += `<div class="bracket-match">
            <div class="bracket-match-team ${
              match.winner === match.team1 ? "winner" : "eliminated"
            }">
                <span class="team-name-bracket">${match.team1}</span>
                <span class="team-score">${match.prob.toFixed(0)}%</span>
            </div>
            <div class="bracket-match-team ${
              match.winner === match.team2 ? "winner" : "eliminated"
            }">
                <span class="team-name-bracket">${match.team2}</span>
                <span class="team-score">${(100 - match.prob).toFixed(
                  0
                )}%</span>
            </div>
        </div>`;
  });
  html += "</div>";

  // Final
  const finalMatch = tournamentBracket.finals;
  html += '<div class="bracket-round"><div class="bracket-title">FINAL</div>';
  html += `<div class="bracket-match">
        <div class="bracket-match-team ${
          finalMatch.winner === finalMatch.team1 ? "winner" : "eliminated"
        }">
            <span class="team-name-bracket">${finalMatch.team1}</span>
            <span class="team-score">${finalMatch.prob.toFixed(0)}%</span>
        </div>
        <div class="bracket-match-team ${
          finalMatch.winner === finalMatch.team2 ? "winner" : "eliminated"
        }">
            <span class="team-name-bracket">${finalMatch.team2}</span>
            <span class="team-score">${(100 - finalMatch.prob).toFixed(
              0
            )}%</span>
        </div>
    </div>`;
  html += "</div>";

  html += "</div>";

  container.innerHTML = html;

  // Display champion
  resultsDiv.innerHTML = `
        <div class="final-winner">
            <div class="final-winner-trophy">🏆</div>
            <div>CAN 2026 Champion</div>
            <div style="font-size: 1.5em; margin-top: 10px;">${
              tournamentBracket.champion
            }</div>
            <div style="font-size: 0.9em; margin-top: 5px;">(${finalMatch.prob.toFixed(
              1
            )}% confidence)</div>
        </div>
    `;
}

// Reset bracket
function resetBracket() {
  tournamentBracket = {
    groupWinners: {},
    semiFinals: [],
    finals: null,
    champion: null,
  };
  document.getElementById("bracket-container").innerHTML = "";
  document.getElementById("bracket-results").innerHTML = "";
}
