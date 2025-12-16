# CAN 2026 Winner Prediction

An AI-powered prediction app for the 2026 African Cup of Nations (CAN) tournament using machine learning with TensorFlow.js.

## Features

### 🎯 Head to Head Predictions

- Select any two teams and predict the match winner
- ML model analyzes team statistics and historical performance
- Shows win probabilities and confidence percentages
- Visual probability bars for easy comparison

### 🏆 Group Stage Predictions

- Displays all 12 group stage matches organized by group
- Group A: Egypt, Senegal, Mali, Cameroon
- Group B: Morocco, Nigeria, Algeria, Ivory Coast
- Predict all group matches with one click
- Shows detailed results and match predictions

### 🎪 Tournament Bracket

- Complete tournament progression from group stage to finals
- Automatic group winner determination based on:
  - Match points (3 for win, 1 for draw, 0 for loss)
  - Goal difference calculations
- Semi-finals and finals predictions
- Visual bracket display with confidence percentages
- Final champion prediction with trophy display

## How It Works

The app uses a neural network powered by TensorFlow.js to make predictions based on:

1. **Team Statistics**:

   - Historical wins, draws, and losses
   - Goals scored and conceded
   - Overall team strength rating

2. **Machine Learning Model**:

   - 4-layer neural network with dropout for regularization
   - Trained on team statistical data
   - Uses Adam optimizer for gradient descent
   - Outputs probability predictions

3. **Match Prediction Algorithm**:
   - Combines team strength with win rates
   - Normalized probability calculations
   - Accounts for close matches with draw possibilities

## Technologies Used

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **ML Library**: TensorFlow.js (browser-based machine learning)
- **Architecture**: Responsive, single-page application

## Installation & Usage

### Online Version

Simply open `index.html` in any modern web browser. No installation required!

### Local Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/diaba/can-2026-prediction.git
   cd can-2026-prediction
   ```

2. Open with a live server or simple HTTP server:

   ```bash
   # Python 3
   python -m http.server 8000

   # Python 2
   python -m SimpleHTTPServer 8000

   # Node.js (with http-server)
   npx http-server
   ```

3. Open your browser to `http://localhost:8000`

## File Structure

```
├── index.html      # Main HTML file with UI and styles
├── scritpt.js      # JavaScript with ML model and prediction logic
└── README.md       # Documentation
```

## Team Data

The app includes statistics for 8 major African teams:

- **Egypt** (Strength: 0.92) - Defending champions
- **Nigeria** (Strength: 0.86) - Strong contenders
- **Morocco** (Strength: 0.88) - Consistent performers
- **Senegal** (Strength: 0.85) - Recent finalists
- **Cameroon** (Strength: 0.84) - Experienced squad
- **Ivory Coast** (Strength: 0.82) - Emerging powerhouse
- **Algeria** (Strength: 0.78) - Solid team
- **Mali** (Strength: 0.72) - Rising star

## Features Explained

### 1. Head to Head Mode

- Select two teams from the dropdown menus
- Click "Predict Winner" to run the ML model
- Get instant prediction with confidence percentage
- Visual probability bars show win chances

### 2. Group Stage Mode

- View all group stage matches organized by group
- Click "Predict All Matches" to simulate group matches
- See winners for each match with confidence levels
- Get detailed summary of group results

### 3. Tournament Bracket Mode

- Click "Generate Tournament" to run complete tournament
- AI automatically determines group winners
- Simulates semi-finals and finals
- Shows final champion with trophy 🏆

## How Predictions Work

1. **Data Preparation**: Team statistics are normalized
2. **Model Training**: Neural network learns from team data
3. **Match Analysis**: Model analyzes both teams' strengths
4. **Probability Calculation**: Win probabilities are calculated
5. **Result Determination**: Winner is determined by higher probability

## Accuracy Note

These are AI-based predictions for entertainment purposes. Actual tournament outcomes depend on many factors including:

- Current player form and injuries
- Tactical decisions by coaches
- Tournament momentum and morale
- Luck and unexpected events

## Browser Compatibility

- Chrome/Edge (Latest)
- Firefox (Latest)
- Safari (Latest)
- Any browser with ES6+ support and WebGL for TensorFlow.js

## Future Enhancements

- [ ] Real-time match updates
- [ ] More teams from CAN 2026 qualifiers
- [ ] Detailed team statistics import
- [ ] Historical data analysis
- [ ] Player-level predictions
- [ ] Mobile app version
- [ ] Dark mode UI

## Contributing

Contributions are welcome! Feel free to:

- Report bugs
- Suggest improvements
- Add new features
- Improve documentation

## License

This project is open source and available under the MIT License.

## Disclaimer

This application provides entertainment-based predictions and is not affiliated with the official CAF (Confederation of African Football) or CAN tournament organizers.

## Author

Created as an AI-powered sports prediction tool for the African Cup of Nations 2026.

---

**Enjoy the predictions and may the best team win! 🏆⚽**
