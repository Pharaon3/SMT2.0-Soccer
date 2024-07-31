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
    if (data.d[eventId]) {
      if (data.wm == 'u') { // It's update information
        updateEvent(data.d[eventId])
      }
      if (data.wm == 'f') { // It's init information
        initEvent(data.d[eventId]);
      }
    }
	};
}

function updateEvent(data) {
  console.log("data: ", data);
  if (data.gcd) {
    if (data.gcd.XY) {
      let x = data.gcd.XY.split(",")[0];
      let y = data.gcd.XY.split(",")[1];
      moveBallByXY(x, y)
    }
    if (data.gcd.VC) {
      moveBallByVC(data.gcd.VC);
    }
  }
}

function moveBallByXY(x, y) {
  ball_x = mapx(x, y);
  ball_y = mapy(x, y);
  $("#ball").attr("x", ball_x);
  $("#ball").attr("y", ball_y);
}

function moveBallByVC(vc) {
  let y = 0.5;
  if (vc == "11002") {            // Possession
    let x = 0.4;
    moveBallByXY(x, y);
  } else if (vc == "21002") {     // Possession
    let x = 0.6;
    moveBallByXY(x, y);
  } else if (vc == "11004") {     // Cornor kick
    let x = 0.6;
    moveBallByXY(x, y);
  } else if (vc == "21004") {     // Cornor kick
    let x = 0.6;
    moveBallByXY(x, y);
  } else if (vc == "11010") {     // Free kick
    let x = 0.6;
    moveBallByXY(x, y);
  } else if (vc == "21010") {     // Free kick
    let x = 0.6;
    moveBallByXY(x, y);
  } else if (vc == "11001") {     // Free kick
    let x = 0.6;
    moveBallByXY(x, y);
  } else if (vc == "21001") {     // Free kick
    let x = 0.6;
    moveBallByXY(x, y);
  } else if (vc == "11234") {     // Free kick
    let x = 0.6;
    moveBallByXY(x, y);
  } else if (vc == "21234") {     // Free kick
    let x = 0.6;
    moveBallByXY(x, y);
  }
}