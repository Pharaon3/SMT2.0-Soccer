// Variables Init
let ball_x = 475, ball_y = 505;
let homeTeamName, awayTeamName;
let ball_pos = [[0.5, 0.5], [0.5, 0.5]];
let current_step = 1;       // current step of event
let current_time_per_event = 0;       // it's initialized to 0 at the beginning of each event.
let kick_or_bounce = 0; // 0: kick, 1: bounce, 2: hidden
let prev_x = 0.5, prev_y = 0.5, next_x = 0.5, next_y = 0.5;
let homeScore = 0, awayScore = 0;
let gameTime = 0;
let isTimerRunning = 1;
let startTime;
let eventTexts = [["", ""], ["", ""]];
// ball_pos = [
//     [0.5, 0.5],
//     [0.5, 0.1],
//     [0.1, 0.1],
//     [0.1, 0.1],
//     [0.1, 0.1],
//     [0.1, 0.1],
//     [0.1, 0.5]
// ]