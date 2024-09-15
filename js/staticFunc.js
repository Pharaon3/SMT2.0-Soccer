// Static functions

function initEvent(data) {
    console.log("data: ", data);
    if (data.s?.n == "Football") {
       initFootball(data);
    }
}

function initFootball(data) {
    if (data.c1?.n) homeTeamName = data.c1.n;
    if (data.c2?.n) awayTeamName = data.c2.n;
    teamNames['home'] = homeTeamName;
    teamNames['away'] = awayTeamName;
    if (homeTeamName.length > 16) {
        teamNames['home'] = homeTeamName.substr(0, 13) + '...';
    }
    if (awayTeamName.length > 16) {
        teamNames['away'] = awayTeamName.substr(0, 13) + '...';
    }
    $("#homeTeamName").text(teamNames['home']);
    $("#awayTeamName").text(teamNames['away']);

    if (data.c1?.k) $(".homePlayerBase").attr("fill", data.c1?.k?.TC);
    if (data.c2?.k) $(".awayPlayerBase").attr("fill", data.c2?.k?.TC);
    let homeKC = data.c1?.k?.KC?.split(",");
    if (homeKC?.length > 3) $(".homePlayerLeftLongSleeve").attr("fill", homeKC[3]);
    if (homeKC?.length > 3) $(".homePlayerRightLongSleeve").attr("fill", homeKC[3]);
    let awayKC = data.c2?.k?.KC?.split(",");
    if (awayKC?.length > 3) $(".awayPlayerLeftLongSleeve").attr("fill", awayKC[3]);
    if (awayKC?.length > 3) $(".awayPlayerRightLongSleeve").attr("fill", awayKC[3]);

    if (data?.ps?.TN?.score) {
        homeScore = data?.ps?.TN?.score?.c1;
        awayScore = data?.ps?.TN?.score?.c2;
        $("#score").text(homeScore + '-' + awayScore);
    }

    if (data?.cl) {
        gameTime = data?.cl?.m * 60 + data?.cl?.s;
        showTime(gameTime);
        if (data?.cl?.r == 0) isTimerRunning = data?.cl?.r;
        if (data?.cl?.r) isTimerRunning = data?.cl?.r;
        let newDate = new Date;
        startTime = Math.floor(newDate.getTime() / 1000) - gameTime;
    }

    if (data?.p?.n) {
        $("#period").text(data?.p?.n);
    }

    if (data?.mdt) {
        matchStartTime = new Date(data?.mdt);
    }
    if (data?.mdt && data?.cl?.m == 0 && data?.cl?.s == 0 && data?.cl?.r == 1) {
        console.log("Match Not Started");
        noTimeRunningState = 1;
        setEventLabel(["Match Not Started", ""], 1, null);
    }
    if (data?.mdt && data?.cl?.m == 45 && data?.cl?.s == 0 && data?.cl?.r == 1) {
        console.log("Half Time");
        noTimeRunningState = 2;
        setEventLabel(["Half Time", ""], 1, null);
    }
}
function showTime(showTimeArgument) {
    if (showTimeArgument >= 0) {
        let showTimeMinute = Math.floor(showTimeArgument / 60);
        if (showTimeMinute < 10) showTimeMinute = "0" + showTimeMinute;
        let showTimeSecond = Math.floor(showTimeArgument % 60);
        if (showTimeSecond < 10) showTimeSecond = "0" + showTimeSecond;
        $("#time").text(showTimeMinute + ":" + showTimeSecond);
    }
}

function stopMatch() {
    isTimerRunning = 1;
}

function setEventLabel(eventTitle, team, detail) {
    if (eventTitle[0] == "") $("#center_rect").attr("fill-opacity", 0);
    else $("#center_rect").attr("fill-opacity", 0.7);
    $("#center_text").text(eventTitle[0]);
    $("#bottom_text").text(eventTitle[1] || teamNames[team == 1 ? "home" : "away"]);
    let textwidth = Math.max($('#center_text')[0].getBoundingClientRect().width, $('#bottom_text')[0].getBoundingClientRect().width, MINTEXTWIDTH) + 40;
    $("#center_rect").attr("x", pitch_center_x - textwidth / 2);
    if (detail?.color) {
        $("#center_text").attr("fill", detail.color);
    } else {
        $("#center_text").attr("fill", DEFAULTCOLOR);
    }
    if (detail?.svg) {
        $("#centerImage").css("display", "block");
        $("#center_rect").attr("width", textwidth + 40 + 70);
        $("#centerrectdiv").attr("x1", pitch_center_x + textwidth / 2);
        $("#centerrectdiv").attr("x2", pitch_center_x + textwidth / 2);
        $("#centerrectdiv").attr("stroke-opacity", 0.5);
        $("#centerImage").attr("href", "./media/" + detail?.svg);
        $("#centerImage").attr("x", pitch_center_x + textwidth / 2 + 20);
    } else {
        $("#centerImage").css("display", "none");
        $("#center_rect").attr("width", textwidth);
        $("#centerrectdiv").attr("stroke-opacity", 0);
    }
}

function resetEventLabel() {
    $("#center_rect").attr("fill-opacity", 0);
    $("#center_text").text("");
    $("#bottom_text").text("");
    $("#centerImage").css("display", "none");
    $("#centerrectdiv").attr("stroke-opacity", 0);
}
function capitalizeWords(arr) {
    return arr.map(word => {
        const firstLetter = word.charAt(0).toUpperCase();
        const rest = word.slice(1).toLowerCase();

        return firstLetter + rest;
    });
}

function setAttackRectColor(x, team) {
    if (team == 1) {  // home team possessed ball.
        if (x < 0.5) {  // ball safe
            $("#homeStatePolygon").css("fill", "url(#homeSafe)");
            $("#awayStatePolygon").css("fill", "url(#none)");
        } else if (x < 0.75) {  // attack
            $("#homeStatePolygon").css("fill", "url(#homeAttack)");
            $("#awayStatePolygon").css("fill", "url(#none)");
        } else if (x <= 1) {    // Dangerout attack
            $("#homeStatePolygon").css("fill", "url(#homeDangerousAttack)");
            $("#awayStatePolygon").css("fill", "url(#none)");
        }
    } else if (team == 2) { // away team possessed the ball.
        if (x < 0.25) {  // Dangerout attack
            $("#awayStatePolygon").css("fill", "url(#awayDangerousAttack)");
            $("#homeStatePolygon").css("fill", "url(#none)");
        } else if (x < 0.5) {  // attack
            $("#awayStatePolygon").css("fill", "url(#awayAttack)");
            $("#homeStatePolygon").css("fill", "url(#none)");
        } else if (x <= 1) {    // ball safe
            $("#awayStatePolygon").css("fill", "url(#awaySafe)");
            $("#homeStatePolygon").css("fill", "url(#none)");
        }
    }
}


function drawRect(time, team) {
    rt = time * 2;
    if (rt > 1) rt = 1
    if (team == 1) {
        $("#awayStatePolygon").css("fill", "url(#none)");
        if (next_x < 0.5) {
            document.getElementById('homeStatePolygon').style.fill =
                'url(#homeSafe)'
            if (rectId == 0 || rectId == 1) {
                document.getElementById('homeStatePolygon').points[1].x = 440
                document.getElementById('homeStatePolygon').points[2].x = 480
                document.getElementById('homeStatePolygon').points[3].x = 424
            }
            if (rectId == 2) {
                document.getElementById('homeStatePolygon').points[1].x =
                    510 + (440 - 510) * rt
                document.getElementById('homeStatePolygon').points[2].x =
                    550 + (480 - 550) * rt
                document.getElementById('homeStatePolygon').points[3].x =
                    526 + (424 - 526) * rt
            }
            if (rectId == 3) {
                document.getElementById('homeStatePolygon').points[1].x =
                    614 + (440 - 614) * rt
                document.getElementById('homeStatePolygon').points[2].x =
                    700 + (480 - 700) * rt
                document.getElementById('homeStatePolygon').points[3].x =
                    678 + (424 - 678) * rt
            }
            if (rectId < 0) {
                document.getElementById('homeStatePolygon').points[1].x =
                    232 + (440 - 232) * rt
                document.getElementById('homeStatePolygon').points[2].x =
                    180 + (480 - 180) * rt
                document.getElementById('homeStatePolygon').points[3].x =
                    120 + (424 - 120) * rt
            }
            currentRectId = 1
        } else if (next_x < 0.75) {
            document.getElementById('homeStatePolygon').style.fill =
                'url(#homeAttack)'
            currentRectId = 2
            if (rectId == 0 || rectId == 2) {
                document.getElementById('homeStatePolygon').points[1].x = 510
                document.getElementById('homeStatePolygon').points[2].x = 550
                document.getElementById('homeStatePolygon').points[3].x = 526
            }
            if (rectId == 1) {
                document.getElementById('homeStatePolygon').points[1].x =
                    440 + (510 - 440) * rt
                document.getElementById('homeStatePolygon').points[2].x =
                    480 + (550 - 480) * rt
                document.getElementById('homeStatePolygon').points[3].x =
                    424 + (526 - 424) * rt
            }
            if (rectId == 3) {
                document.getElementById('homeStatePolygon').points[1].x =
                    614 + (510 - 614) * rt
                document.getElementById('homeStatePolygon').points[2].x =
                    700 + (550 - 700) * rt
                document.getElementById('homeStatePolygon').points[3].x =
                    678 + (526 - 678) * rt
            }
            if (rectId < 0) {
                document.getElementById('homeStatePolygon').points[1].x =
                    232 + (510 - 232) * rt
                document.getElementById('homeStatePolygon').points[2].x =
                    180 + (550 - 180) * rt
                document.getElementById('homeStatePolygon').points[3].x =
                    120 + (526 - 120) * rt
            }
        } else {
            currentRectId = 3
            if (rectId == 0 || rectId == 3) {
                document.getElementById('homeStatePolygon').style.fill =
                    'url(#homeDangerousAttack)'
                document.getElementById('homeStatePolygon').points[1].x = 614
                document.getElementById('homeStatePolygon').points[2].x = 700
                document.getElementById('homeStatePolygon').points[3].x = 678
            }
            if (rectId == 1) {
                document.getElementById('homeStatePolygon').style.fill =
                    'url(#homeDangerousAttack)'
                document.getElementById('homeStatePolygon').points[1].x =
                    440 + (614 - 440) * rt
                document.getElementById('homeStatePolygon').points[2].x =
                    480 + (700 - 480) * rt
                document.getElementById('homeStatePolygon').points[3].x =
                    424 + (678 - 424) * rt
            }
            if (rectId == 2) {
                document.getElementById('homeStatePolygon').style.fill =
                    'url(#homeDangerousAttack)'
                document.getElementById('homeStatePolygon').points[1].x =
                    510 + (614 - 510) * rt
                document.getElementById('homeStatePolygon').points[2].x =
                    550 + (700 - 550) * rt
                document.getElementById('homeStatePolygon').points[3].x =
                    526 + (678 - 526) * rt
            }
            if (rectId < 0) {
                document.getElementById('homeStatePolygon').style.fill =
                    'url(#homeDangerousAttack)'
                document.getElementById('homeStatePolygon').points[1].x =
                    232 + (614 - 232) * rt
                document.getElementById('homeStatePolygon').points[2].x =
                    180 + (700 - 180) * rt
                document.getElementById('homeStatePolygon').points[3].x =
                    120 + (678 - 120) * rt
            }
        }
    } else {
        document.getElementById('homeStatePolygon').style.fill = 'url(#none)'
        if (next_x < 0.25) {
            currentRectId = -1
            if (rectId == 0 || rectId == -1) {
                document.getElementById('awayStatePolygon').style.fill =
                    'url(#awayDangerousAttack)'
                document.getElementById('awayStatePolygon').points[1].x = 336
                document.getElementById('awayStatePolygon').points[0].x = 250
                document.getElementById('awayStatePolygon').points[4].x = 272
            }
            if (rectId == -2) {
                document.getElementById('awayStatePolygon').style.fill =
                    'url(#awayDangerousAttack)'
                document.getElementById('awayStatePolygon').points[1].x =
                    440 + (336 - 440) * rt
                document.getElementById('awayStatePolygon').points[0].x =
                    400 + (250 - 400) * rt
                document.getElementById('awayStatePolygon').points[4].x =
                    424 + (272 - 424) * rt
            }
            if (rectId == -3) {
                document.getElementById('awayStatePolygon').style.fill =
                    'url(#awayDangerousAttack)'
                document.getElementById('awayStatePolygon').points[1].x =
                    510 + (336 - 510) * rt
                document.getElementById('awayStatePolygon').points[0].x =
                    470 + (250 - 470) * rt
                document.getElementById('awayStatePolygon').points[4].x =
                    526 + (272 - 526) * rt
            }
            if (rectId > 0) {
                document.getElementById('awayStatePolygon').style.fill =
                    'url(#awayDangerousAttack)'
                document.getElementById('awayStatePolygon').points[1].x =
                    718 + (336 - 718) * rt
                document.getElementById('awayStatePolygon').points[0].x =
                    775 + (250 - 775) * rt
                document.getElementById('awayStatePolygon').points[4].x =
                    830 + (272 - 830) * rt
            }
        } else if (next_x < 0.50) {
            currentRectId = -2
            if (rectId == 0 || rectId == -2) {
                document.getElementById('awayStatePolygon').style.fill =
                    'url(#awayAttack)'
                document.getElementById('awayStatePolygon').points[1].x = 440
                document.getElementById('awayStatePolygon').points[0].x = 400
                document.getElementById('awayStatePolygon').points[4].x = 424
            }
            if (rectId == -1) {
                document.getElementById('awayStatePolygon').style.fill =
                    'url(#awayAttack)'
                document.getElementById('awayStatePolygon').points[1].x =
                    336 + (440 - 336) * rt
                document.getElementById('awayStatePolygon').points[0].x =
                    250 + (400 - 250) * rt
                document.getElementById('awayStatePolygon').points[4].x =
                    272 + (424 - 272) * rt
            }
            if (rectId == -3) {
                document.getElementById('awayStatePolygon').style.fill =
                    'url(#awayAttack)'
                document.getElementById('awayStatePolygon').points[1].x =
                    510 + (440 - 510) * rt
                document.getElementById('awayStatePolygon').points[0].x =
                    470 + (400 - 470) * rt
                document.getElementById('awayStatePolygon').points[4].x =
                    526 + (424 - 526) * rt
            }
            if (rectId > 0) {
                document.getElementById('awayStatePolygon').style.fill =
                    'url(#awayAttack)'
                document.getElementById('awayStatePolygon').points[1].x =
                    718 + (440 - 718) * rt
                document.getElementById('awayStatePolygon').points[0].x =
                    775 + (400 - 775) * rt
                document.getElementById('awayStatePolygon').points[4].x =
                    830 + (424 - 830) * rt
            }
        } else {
            currentRectId = -3
            if (rectId == 0 || rectId == -3) {
                document.getElementById('awayStatePolygon').style.fill =
                    'url(#awaySafe)'
                document.getElementById('awayStatePolygon').points[1].x = 510
                document.getElementById('awayStatePolygon').points[0].x = 470
                document.getElementById('awayStatePolygon').points[4].x = 526
            }
            if (rectId == -2) {
                document.getElementById('awayStatePolygon').style.fill =
                    'url(#awaySafe)'
                document.getElementById('awayStatePolygon').points[1].x =
                    440 + (510 - 440) * rt
                document.getElementById('awayStatePolygon').points[0].x =
                    400 + (470 - 400) * rt
                document.getElementById('awayStatePolygon').points[4].x =
                    424 + (526 - 424) * rt
            }
            if (rectId == -1) {
                document.getElementById('awayStatePolygon').style.fill =
                    'url(#awaySafe)'
                document.getElementById('awayStatePolygon').points[1].x =
                    336 + (510 - 336) * rt
                document.getElementById('awayStatePolygon').points[0].x =
                    250 + (470 - 250) * rt
                document.getElementById('awayStatePolygon').points[4].x =
                    272 + (526 - 272) * rt
            }
            if (rectId > 0) {
                document.getElementById('awayStatePolygon').style.fill =
                    'url(#awaySafe)'
                document.getElementById('awayStatePolygon').points[1].x =
                    718 + (510 - 718) * rt
                document.getElementById('awayStatePolygon').points[0].x =
                    775 + (470 - 775) * rt
                document.getElementById('awayStatePolygon').points[4].x =
                    830 + (526 - 830) * rt
            }
        }
    }
}

function resetRect() {
    $("#homeStatePolygon").css("fill", "url(#none)");
    $("#awayStatePolygon").css("fill", "url(#none)");
}
function drawTrack(time) {
    x_l = mapnx(prev_x, prev_y) + (mapnx(next_x, next_y) - mapnx(prev_x, prev_y)) * time;
    y_l = mapny(prev_x, prev_y) + (mapny(next_x, next_y) - mapny(prev_x, prev_y)) * time;
    $('#ballLine1').attr({
        'x1': lineX[0],
        'y1': lineY[0],
        'x2': x_l,
        'y2': y_l
    });

    $('#ballLine2').attr({
        'x1': lineX[1],
        'y1': lineY[1],
        'x2': lineX[0],
        'y2': lineY[0]
    });

    $('#ballLine3').attr({
        'x1': lineX[2],
        'y1': lineY[2],
        'x2': lineX[1],
        'y2': lineY[1]
    });

    $('#ballLine4').attr({
        'x1': lineX[3],
        'y1': lineY[3],
        'x2': lineX[2],
        'y2': lineY[2]
    });

    $('#TractDot1').attr({
        'cx': lineX[0],
        'cy': lineY[0]
    });
    $('#TractDot2').attr({
        'cx': lineX[1],
        'cy': lineY[1]
    });
    $('#TractDot3').attr({
        'cx': lineX[2],
        'cy': lineY[2]
    });

}

function resetTrack() {
    lineX[3] = mapnx(prev_x, prev_y);
    lineX[2] = mapnx(prev_x, prev_y);
    lineX[1] = mapnx(prev_x, prev_y);
    lineX[0] = mapnx(prev_x, prev_y);
    lineY[3] = mapny(prev_x, prev_y);
    lineY[2] = mapny(prev_x, prev_y);
    lineY[1] = mapny(prev_x, prev_y);
    lineY[0] = mapny(prev_x, prev_y);
    drawTrack(0);
}

function setBallByVC(vc) {
    currentBallPossessionTeam = vc[0];
    let y = 0.5;
    if (vc == "11002") {            // Possession
        let x = 0.4;
        if (hasXYpos) {
            x = setlastposx;
            y = setlastposy;
        }
        setBallByXY(x, y, ["", ""], 0);
    } else if (vc == "21002") {     // Possession
        let x = 0.6;
        if (hasXYpos) {
            x = setlastposx;
            y = setlastposy;
        }
        setBallByXY(x, y, ["", ""], 0);
    } else if (vc == "11004") {     // Cornor kick
        let x = 1;
        y = 1;
        setBallByXY(x, y, ["Cornor Kick", ""], 2);
    } else if (vc == "21004") {     // Cornor kick
        let x = 0;
        y = 0;
        setBallByXY(x, y, ["Cornor Kick", ""], 2);
    } else if (vc == "11010") {     // Free kick
        let x = 0.4;
        if (hasXYpos) {
            x = setlastposx;
            y = setlastposy;
        }
        setBallByXY(x, y, ["Free kick", ""], 2);
    } else if (vc == "21010") {     // Free kick
        let x = 0.6;
        if (hasXYpos) {
            x = setlastposx;
            y = setlastposy;
        }
        setBallByXY(x, y, ["Free kick", ""], 2);
    } else if (vc == "11001") {     // Attack
        let x = 0.6;
        if (hasXYpos) {
            x = setlastposx;
            y = setlastposy;
        }
        setBallByXY(x, y, ["", ""], 0);
    } else if (vc == "21001") {     // Attack
        let x = 0.4;
        if (hasXYpos) {
            x = setlastposx;
            y = setlastposy;
        }
        setBallByXY(x, y, ["", ""], 0);
    } else if (vc == "11007") {     // Goal kick
        let x = 0.1;
        setBallByXY(x, y, ["Goal kick", ""], 2);
    } else if (vc == "21007") {     // Goal kick
        let x = 0.9;
        setBallByXY(x, y, ["Goal kick", ""], 2);
    } else if (vc == "11008") {     // Penalty
        let x = 0.9;
        setBallByXY(x, y, ["Penalty", ""], 1);
    } else if (vc == "21008") {     // Penalty
        let x = 0.1;
        setBallByXY(x, y, ["Penalty", ""], 1);
    } else if (vc == "11009") {     // Dangerous Free Kick
        let x = 0.6;
        if (hasXYpos) {
            x = setlastposx;
            y = setlastposy;
        }
        setBallByXY(x, y, ["Dangerous Free Kick", ""], 2);
    } else if (vc == "21009") {     // Dangerous Free Kick
        let x = 0.4;
        if (hasXYpos) {
            x = setlastposx;
            y = setlastposy;
        }
        setBallByXY(x, y, ["Dangerous Free Kick", ""], 2);
    } else if (vc == "11010") {     // Simple Free Kick
        let x = 0.6;
        if (hasXYpos) {
            x = setlastposx;
            y = setlastposy;
        }
        setBallByXY(x, y, ["Simple Free Kick", ""], 2);
    } else if (vc == "21010") {     // Simple Free Kick
        let x = 0.4;
        if (hasXYpos) {
            x = setlastposx;
            y = setlastposy;
        }
        setBallByXY(x, y, ["Simple Free Kick", ""], 2);
    } else if (vc == "11024") {     // Throw
        let x = 0.6;
        y = 0;
        if (hasXYpos) {
            x = setlastposx;
            y = setlastposy;
        } else {
            x = ball_pos[ball_pos.length - 1][0];
        }
        setBallByXY(x, y, ["Throw", ""], 2);
    } else if (vc == "21024") {     // Throw
        let x = 0.4;
        y = 1;
        if (hasXYpos) {
            x = setlastposx;
            y = setlastposy;
        } else {
            x = ball_pos[ball_pos.length - 1][0];
        }
        setBallByXY(x, y, ["Throw", ""], 2);

    } else if (vc == "11003") {     // Goal
        let x = 0.95;
        setBallByXY(x, y, ["Goal", ""], 1, {
            "color": DEFAULTCOLOR,
            "svg": "soccer-goal.svg",
            "centertextposition": DEFAULTCENTERTEXTPOSITION,
            "bottomtextposition": DEFAULTBOTTOMTEXTPOSITION,
            "svgposition": [600, 420, 70]
        });
    } else if (vc == "21003") {     // Goal
        let x = 0.05;
        setBallByXY(x, y, ["Goal", ""], 1, {
            "color": DEFAULTCOLOR,
            "svg": "soccer-goal.svg",
            "centertextposition": DEFAULTCENTERTEXTPOSITION,
            "bottomtextposition": DEFAULTBOTTOMTEXTPOSITION,
            "svgposition": [600, 420, 70]
        });

    } else if (vc == "11242") {     // Disallowed Goal
        let x = 0.95;
        setBallByXY(x, y, ["Disallowed Goal", ""], 1, {
            "color": DEFAULTCOLOR,
            "svg": "soccer-disgoal.svg",
            "centertextposition": DEFAULTCENTERTEXTPOSITION,
            "bottomtextposition": DEFAULTBOTTOMTEXTPOSITION,
            "svgposition": [600, 420, 70]
        });
    } else if (vc == "21242") {     // Disallowed Goal
        let x = 0.05;
        setBallByXY(x, y, ["Disallowed Goal", ""], 1, {
            "color": DEFAULTCOLOR,
            "svg": "soccer-disgoal.svg",
            "centertextposition": DEFAULTCENTERTEXTPOSITION,
            "bottomtextposition": DEFAULTBOTTOMTEXTPOSITION,
            "svgposition": [600, 420, 70]
        });

    } else if (vc == "11005") {     // Yellow Card
        let x = 0.6;
        setBallByXY(x, y, ["Yellow Card", ""], 1, {
            "color": DEFAULTCOLOR,
            "svg": "yellowcard.svg"
        });
    } else if (vc == "21005") {     // Yellow Card
        let x = 0.6;
        setBallByXY(x, y, ["Yellow Card", ""], 1, {
            "color": DEFAULTCOLOR,
            "svg": "yellowcard.svg"
        });
    } else if (vc == "11006") {     // Red Card
        let x = 0.6;
        setBallByXY(x, y, ["Red Card", ""], 1, {
            "color": REDCOLOR,
            "svg": "redcard.svg"
        });
    } else if (vc == "21006") {     // Red Card
        let x = 0.6;
        setBallByXY(x, y, ["Red Card", ""], 1, {
            "color": REDCOLOR,
            "svg": "redcard.svg"
        });
    } else if (vc == "11011") {     // Shot on target
        let x = 0.9;
        if (hasXYpos) {
            x = setlastposx;
            y = setlastposy;
        }
        setBallByXY(x, y, ["Shot on target", ""], 2);
    } else if (vc == "21011") {     // Shot on target
        let x = 0.1;
        if (hasXYpos) {
            x = setlastposx;
            y = setlastposy;
        }
        setBallByXY(x, y, ["Shot on target", ""], 2);
    } else if (vc == "11012") {     // Shot off target
        let x = 0.9;
        if (hasXYpos) {
            x = setlastposx;
            y = setlastposy;
        }
        setBallByXY(x, y, ["Shot off target", ""], 2);
    } else if (vc == "21012") {     // Shot off target
        let x = 0.1;
        if (hasXYpos) {
            x = setlastposx;
            y = setlastposy;
        }
        setBallByXY(x, y, ["Shot off target", ""], 2);
    } else if (vc == "11013") {     // Substitution
        let x = 0.6;
        setBallByXY(x, y, ["Substitution", ""], 1, {
            "color": DEFAULTCOLOR,
            "svg": "soccer-substitution.svg"
        });
    } else if (vc == "21013") {     // Substitution
        let x = 0.6;
        setBallByXY(x, y, ["Substitution", ""], 1, {
            "color": DEFAULTCOLOR,
            "svg": "soccer-substitution.svg"
        });
    } else if (vc == "11014") {     // Kick off
        let x = 0.8;
        if (hasXYpos) {
            x = setlastposx;
            y = setlastposy;
        }
        setBallByXY(x, y, ["Kick off", ""], 2);
    } else if (vc == "21014") {     // Kick off
        let x = 0.2;
        if (hasXYpos) {
            x = setlastposx;
            y = setlastposy;
        }
        setBallByXY(x, y, ["Kick off", ""], 2);
    } else if (vc == "11000") {     // Dangerous Attack
        let x = 0.8;
        if (hasXYpos) {
            x = setlastposx;
            y = setlastposy;
        }
        setBallByXY(x, y, ["", ""], 0);
    } else if (vc == "21000") {     // Dangerous Attack
        let x = 0.2;
        if (hasXYpos) {
            x = setlastposx;
            y = setlastposy;
        }
        setBallByXY(x, y, ["", ""], 0);

    } else if (vc == "11234") {     // Off Side
        let x = 0.7;
        if (hasXYpos) {
            x = setlastposx;
            y = setlastposy;
        }
        setBallByXY(x, y, ["Off Side", ""], 1, {
            "color": DEFAULTCOLOR,
            "svg": "soccer-offside.svg"
        });
    } else if (vc == "21234") {     // Off Side
        let x = 0.3;
        if (hasXYpos) {
            x = setlastposx;
            y = setlastposy;
        }
        setBallByXY(x, y, ["Off Side", ""], 1, {
            "color": DEFAULTCOLOR,
            "svg": "soccer-offside.svg"
        });

    } else if (vc == "1026") {     // Stop Page Time
        let x = 0.5;
        if (hasXYpos) {
            x = setlastposx;
            y = setlastposy;
        }
        setBallByXY(x, y, ["Stop Page Time", ""], 1);

    } else if (vc == "1015") {     // Half Time
        let x = 0.5;
        setBallByXY(x, y, ["Half Time", homeScore + "-" + awayScore], 1);

    } else if (vc == "1017") {     // Full Time
        let x = 0.5;
        setBallByXY(x, y, ["Full Time", homeScore + "-" + awayScore], 1);

    } else if (vc == "11025") {     // Injury
        let x = 0.5;
        setBallByXY(x, y, ["Injury", ""], 1, {
            "color": DEFAULTCOLOR,
            "svg": "soccer-injury.svg"
        });
    } else if (vc == "21025") {     // Injury
        let x = 0.5;
        setBallByXY(x, y, ["Injury", ""], 1, {
            "color": DEFAULTCOLOR,
            "svg": "soccer-injury.svg"
        });
    }
}

function displayState(team) {
    let statePositionX, statePositionY;
    if (team == 1) {
        $('#homeStateLabels').show();
        $('#awayStateLabels').hide();
        $('#homeName').text(teamNames['home'].toUpperCase());

        if (next_y < 0.30) {
            statePositionY = 500;
        } else if (next_y < 0.60) {
            statePositionY = 540;
        } else {
            statePositionY = 500;
        }

        if (next_x < 0.50) {
            $('#homeState').text('Ball Safe');
            statePositionX = 350;
        } else if (next_x < 0.75) {
            $('#homeState').text('Attacking');
            statePositionX = 550;
        } else {
            $('#homeState').text('Dangerous Attack');
            statePositionX = 700;
        }

        $('#homeStateLabels').attr('transform', 'translate(' + statePositionX + ',' + statePositionY + ')');
        $('#homeStateBoard').attr('width', Math.max($('#homeName').get(0).getBBox().width, $('#homeState').get(0).getBBox().width) + 70);
        $('#homeStateBoard').attr('x', -Math.max($('#homeName').get(0).getBBox().width, $('#homeState').get(0).getBBox().width) - 70);
    } else {
        $('#homeStateLabels').hide();
        $('#awayStateLabels').show();
        $('#awayName').text(teamNames['away'].toUpperCase());

        if (next_y < 0.30) {
            statePositionY = 500;
        } else if (next_y < 0.60) {
            statePositionY = 540;
        } else {
            statePositionY = 500;
        }

        if (next_x < 0.25) {
            $('#awayState').text('Dangerous Attack');
            statePositionX = 200;
        } else if (next_x < 0.50) {
            $('#awayState').text('Attacking');
            statePositionX = 400;
        } else {
            $('#awayState').text('Ball Safe');
            statePositionX = 550;
        }

        $('#awayStateLabels').attr('transform', 'translate(' + statePositionX + ',' + statePositionY + ')');
        $('#awayStateBoard').attr('width', Math.max($('#awayName').get(0).getBBox().width, $('#awayState').get(0).getBBox().width) + 70);
    }
}

function resetState() {
    $('#homeStateLabels').hide();
    $('#awayStateLabels').hide();
}
function showAction(gameState) {
    // text, team, x, y
    let text = gameState[3][0];
    let team = gameState[2];
    let x = mapnx(gameState[0], gameState[1]);
    let y = mapny(gameState[0], gameState[1]);
    var centerText = capitalizeWords(text.split(" ")).join('');
    $('#ballState').text(centerText);
    $('#holder').text(teamNames[team == 1 ? "home" : "away"].toUpperCase());

    var rectWidth = $('#ballState').get(0).getBBox().width;
    rectWidth = Math.max(rectWidth, $('#holder').get(0).getBBox().width) + 20;

    $('#actionBoard').attr('width', rectWidth)
        .attr('height', 50)
        .attr('x', x - rectWidth - 10)
        .attr('y', y - 50 - 10);

    $('#holder').attr('text-anchor', 'end')
        .attr('x', x - 20)
        .attr('y', y - 12 - 5);

    $('#ballState').attr('text-anchor', 'end')
        .attr('x', x - 20)
        .attr('y', y - 37 - 5);

    $('#stateBoardLine').attr('stroke-opacity', 0.9)
        .attr('x1', x - 15)
        .attr('x2', x - 15)
        .attr('y1', y - 50 - 5)
        .attr('y2', y - 15);

    if (team == 2) {
        $('#actionBoard').attr('x', x + 10);
        $('#holder').attr('text-anchor', 'start')
            .attr('x', x + 20);
        $('#ballState').attr('text-anchor', 'start')
            .attr('x', x + 20);

        $('#stateBoardLine').attr('stroke-opacity', 0.9)
            .attr('x1', x + 15)
            .attr('x2', x + 15);
    }

    if (team == 1) {
        $('#homeKickPolygon').css('fill', 'url(#homeKick)');
        $('#awayKickPolygon').css('fill', 'url(#none)');
        if (gameState[1] < 0.3 && gameState[0] > 0.6) {
            $('#homeKickPolygon').css('fill', 'url(#homeTopKick)');
        }
        if (gameState[1] > 0.7 && gameState[0] > 0.6) {
            $('#homeKickPolygon').css('fill', 'url(#homeBottomKick)');
        }
        var points = $('#homeKickPolygon')[0].points;
        points[0].x = x;
        points[0].y = y;
    } else {
        $('#awayKickPolygon').css('fill', 'url(#awayKick)');
        $('#homeKickPolygon').css('fill', 'url(#none)');
        if (gameState[1] < 0.3 && gameState[0] < 0.6) {
            $('#awayKickPolygon').css('fill', 'url(#awayTopKick)');
        }
        if (gameState[1] > 0.7 && gameState[0] < 0.6) {
            $('#awayKickPolygon').css('fill', 'url(#awayBottomKick)');
        }
        var points = $('#awayKickPolygon')[0].points;
        points[0].x = x;
        points[0].y = y;
    }
}

function resetAction() {
    $('#ballState').text("");
    $('#holder').text("");
    $('#actionBoard').attr('width', 0)
        .attr('height', 0)
    $('#stateBoardLine').attr('stroke-opacity', 0);
    $('#homeKickPolygon').css('fill', 'url(#none)');
    $('#awayKickPolygon').css('fill', 'url(#none)');
}

function removeBall() {
    $("#ball").attr("x", -100);
    $("#ball").attr("y", -100);
}