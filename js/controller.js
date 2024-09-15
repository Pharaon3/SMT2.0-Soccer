function load() {
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = Number(urlParams.get('id'));
  socket = new WebSocket("ws://80.79.6.111:3443/websocket/1.0/xb_receiver/");
  socket.onopen = function (e) {
    //socket.send(JSON.stringify({r:"authenticate", a:{key:"*******"}}));
    socket.send(JSON.stringify({ r: "subscribe_event", a: { id: eventId } }));
  };

  socket.onmessage = function (e) {
    var data = JSON.parse(e.data);
    if (data?.d && data.d[eventId]) {
      if (data.wm == 'u') { // It's update information
        updateEvent(data.d[eventId])
      } else if (data.wm == 'f') { // It's init information
        initEvent(data.d[eventId]);
      } else if (data.wm == 'rm') {// It's the end time I think
        stopMatch();
      }
    }
  };

  countdown();
}

function updateEvent(data) {
  console.log("data: ", data);
  if (data.gcd) {
    if (data.gcd.XY) {
      hasXYpos = true;
      let x = parseFloat(data.gcd.XY.split(",")[0]);
      let y = parseFloat(data.gcd.XY.split(",")[1]);
      if (x > 1.5) x = x / 100;
      if (y > 1.5) y = y / 100;
      setBallByXY(x, y);
      setlastposx = x;
      setlastposy = y;
    }
    if (data.gcd.VC) {
      setBallByVC(data.gcd.VC);
    }
  }
  initFootball(data);
}
function countdown() {
  var interval = setInterval(function () {
    current_time_per_event += 1 / (eventPeriod / framePeriod);
    if (current_time_per_event >= 1) {    // It's time to set next event
      initEachEvent()
    } else {                              // It's during the event, need to draw ball moving
      if (ball_pos[current_step][4] != 1) {
        kickBall(current_time_per_event, ball_pos[current_step][2]);
        if (next_x != prev_x || next_y != prev_y) {
          drawTrack(current_time_per_event);
        }
      } else {
        removeBall();
      }
      if (ball_pos[current_step][4] == 0) {   // normal status
        drawRect(current_time_per_event, ball_pos[current_step][2]);
      } else {
        resetState();
        resetTrack();
        resetRect();
      }
    }
    if (isTimerRunning == 0) {
      if (startTime) {
        let newDate = new Date;
        gameTime = Math.floor(newDate.getTime() / 1000) - startTime;
        showTime(gameTime);
      }
    } else {
      resetRect();
      resetTrack();
      resetState();
      resetAction();
      removeBall();
      if (noTimeRunningState == 1) {
        var now = new Date();
        var difference = matchStartTime - now;
        var seconds = Math.floor((difference / 1000) % 60);
        var minutes = Math.floor((difference / (1000 * 60)) % 60);
        var hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        var days = Math.floor(difference / (1000 * 60 * 60 * 24));
        setEventLabel(["Match Not Started", `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`], 1, null);
      }
      if (noTimeRunningState == 2) {
        setEventLabel(["Half Time", homeScore + "-" + awayScore], 1, null);
      }
    }
  }, framePeriod)
}
function setBallByXY(x, y, eventTexts, stateType = 0, detail) { // stateType 0: no text, 1: center text, 2: ball text
  ball_pos.push([x, y, currentBallPossessionTeam, eventTexts, stateType, detail]);
}

function kickBall(time, team) {
  time = Math.min(time, 1);
  let x = prev_x + (next_x - prev_x) * time;
  let y = prev_y + (next_y - prev_y) * time;
  $("#ball").attr("x", mapx(x, y));
  $("#ball").attr("y", mapy(x, y) - 30 + 30 * (time - 0.5) * (time - 0.5) * 4);
}

function initEachEvent() {
  current_time_per_event = 0;
  prev_x = next_x; prev_y = next_y;
  if (ball_pos.length > current_step + 1) {
    current_step++;
    next_x = ball_pos[current_step][0]; next_y = ball_pos[current_step][1];
  } else if (ball_pos.length) {
    // bounceBall(current_step);
  }
  if (ball_pos[current_step][4] == 1) {   // big action
    setEventLabel(ball_pos[current_step][3], ball_pos[current_step][2], ball_pos[current_step][5]);
  } else {
    resetEventLabel();
  }
  if (ball_pos[current_step][4] == 2) {   // small action
    showAction(ball_pos[current_step]);
    prev_x = next_x; prev_y = next_y;
  } else {
    resetAction();
  }
  if (ball_pos[current_step][4] == 0) {   // normal status
    displayState(ball_pos[current_step][2]);
  } else {
    resetState();
    resetTrack();
    resetRect();
  }
  // setAttackRectColor(ball_pos[current_step][0], ball_pos[current_step][2]);
  rectId = currentRectId;
  if (ball_pos[current_step][2] != ball_pos[current_step - 1][2]) {
    resetTrack();
  } else if (next_x != prev_x || next_y != prev_y) {
    lineX[3] = lineX[2]
    lineY[3] = lineY[2]
    lineX[2] = lineX[1]
    lineY[2] = lineY[1]
    lineX[1] = lineX[0]
    lineY[1] = lineY[0]
    lineX[0] = mapnx(prev_x, prev_y);
    lineY[0] = mapny(prev_x, prev_y);
  }
}