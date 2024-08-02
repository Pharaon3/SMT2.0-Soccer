function load() {
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = Number(urlParams.get('id'));
	socket=new WebSocket("ws://80.79.6.111:3443/websocket/1.0/xb_receiver/");
	socket.onopen=function(e) {
		//socket.send(JSON.stringify({r:"authenticate", a:{key:"*******"}}));
		socket.send(JSON.stringify({r:"subscribe_event", a:{id:eventId}}));
	};

	socket.onmessage=function(e) {
		var data = JSON.parse(e.data);
    if (data?.d && data.d[eventId]) {
      if (data.wm == 'u') { // It's update information
        updateEvent(data.d[eventId])
      }
      if (data.wm == 'f') { // It's init information
        initEvent(data.d[eventId]);
      }
    }
	};

  countdown();
}

function updateEvent(data) {
  console.log("data: ", data);
  if (data.gcd) {
    if (data.gcd.XY) {
      let x = parseFloat(data.gcd.XY.split(",")[0]);
      let y = parseFloat(data.gcd.XY.split(",")[1]);
      setBallByXY(x, y)
    }
    if (data.gcd.VC) {
      setBallByVC(data.gcd.VC);
    }
  }
}
function countdown() {
  var interval = setInterval(function () {
    current_time_per_event += 1 / (eventPeriod / framePeriod);
    if (current_time_per_event >= 1) {
      current_time_per_event = 0;
      prev_x = next_x; prev_y = next_y;
      if (ball_pos.length > current_step + 1) {
        current_step ++;
        next_x = ball_pos[current_step][0]; next_y = ball_pos[current_step][1];
      } else if (ball_pos.length) {
        // bounceBall(current_step);
      }
    } else {
      kickBall(current_time_per_event);
    }
  }, framePeriod)
}
function setBallByXY(x, y) {
  ball_pos.push([x, y]);
}

function setBallByVC(vc) {
  let y = 0.5;
  if (vc == "11002") {            // Possession
    let x = 0.4;
    setBallByXY(x, y);
  } else if (vc == "21002") {     // Possession
    let x = 0.6;
    setBallByXY(x, y);
  } else if (vc == "11004") {     // Cornor kick
    let x = 0.6;
    setBallByXY(x, y);
  } else if (vc == "21004") {     // Cornor kick
    let x = 0.6;
    setBallByXY(x, y);
  } else if (vc == "11010") {     // Free kick
    let x = 0.6;
    setBallByXY(x, y);
  } else if (vc == "21010") {     // Free kick
    let x = 0.6;
    setBallByXY(x, y);
  } else if (vc == "11001") {     // Attack
    let x = 0.6;
    setBallByXY(x, y);
  } else if (vc == "21001") {     // Attack
    let x = 0.6;
    setBallByXY(x, y);
  } else if (vc == "11007") {     // Goal kick
    let x = 0.6;
    setBallByXY(x, y);
  } else if (vc == "21007") {     // Goal kick
    let x = 0.6;
    setBallByXY(x, y);
  } else if (vc == "11008") {     // Penalty
    let x = 0.6;
    setBallByXY(x, y);
  } else if (vc == "21008") {     // Penalty
    let x = 0.6;
    setBallByXY(x, y);
  } else if (vc == "11009") {     // Direct Free Kick
    let x = 0.6;
    setBallByXY(x, y);
  } else if (vc == "21009") {     // Direct Free Kick
    let x = 0.6;
    setBallByXY(x, y);
  } else if (vc == "11010") {     // Simple Free Kick
    let x = 0.6;
    setBallByXY(x, y);
  } else if (vc == "21010") {     // Simple Free Kick
    let x = 0.6;
    setBallByXY(x, y);
  } else if (vc == "11024") {     // Throw
    let x = 0.6;
    setBallByXY(x, y);
  } else if (vc == "21024") {     // Throw
    let x = 0.6;
    setBallByXY(x, y);
  } else if (vc == "11003") {     // Goal
    let x = 0.6;
    setBallByXY(x, y);
  } else if (vc == "21003") {     // Goal
    let x = 0.6;
    setBallByXY(x, y);
  } else if (vc == "11005") {     // Yellow Card
    let x = 0.6;
    setBallByXY(x, y);
  } else if (vc == "21005") {     // Yellow Card
    let x = 0.6;
    setBallByXY(x, y);
  } else if (vc == "11006") {     // Red Card
    let x = 0.6;
    setBallByXY(x, y);
  } else if (vc == "21006") {     // Red Card
    let x = 0.6;
    setBallByXY(x, y);
  } else if (vc == "11011") {     // Shot on goal
    let x = 0.6;
    setBallByXY(x, y);
  } else if (vc == "21011") {     // Shot on goal
    let x = 0.6;
    setBallByXY(x, y);
  } else if (vc == "11012") {     // Shot off goal
    let x = 0.6;
    setBallByXY(x, y);
  } else if (vc == "21012") {     // Shot off goal
    let x = 0.6;
    setBallByXY(x, y);
  } else if (vc == "11013") {     // Substitution
    let x = 0.6;
    setBallByXY(x, y);
  } else if (vc == "21013") {     // Substitution
    let x = 0.6;
    setBallByXY(x, y);
  } else if (vc == "11014") {     // Kick off
    let x = 0.6;
    setBallByXY(x, y);
  } else if (vc == "21014") {     // Kick off
    let x = 0.6;
    setBallByXY(x, y);
  }
}

function kickBall(time){
  time = Math.min(time, 1);
  let x = prev_x + (next_x - prev_x) * time;
  let y = prev_y + (next_y - prev_y) * time;
  $("#ball").attr("x", mapx(x, y));
  $("#ball").attr("y", mapy(x, y) - 30 + 30 * (time - 0.5) * (time - 0.5) * 4);
}