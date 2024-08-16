// Static functions

function initEvent(data) {
    console.log("data: ", data);
    if (data.s?.n == "Football") {
        if (data.c1?.n) homeTeamName = data.c1.n;
        if (data.c2?.n) awayTeamName = data.c2.n;
        $("#homeTeamName").text(homeTeamName);
        $("#awayTeamName").text(awayTeamName);

        if (data.c1?.k) $("#homePlayerBase").attr("fill", data.c1?.k?.TC);
        if (data.c2?.k) $("#awayPlayerBase").attr("fill", data.c2?.k?.TC);
        let homeKC = data.c1?.k?.KC?.split(",");
        if (homeKC?.length > 3) $("#homePlayerLeftLongSleeve").attr("fill", homeKC[3]);
        if (homeKC?.length > 3) $("#homePlayerRightLongSleeve").attr("fill", homeKC[3]);
        let awayKC = data.c2?.k?.KC?.split(",");
        if (awayKC?.length > 3) $("#awayPlayerLeftLongSleeve").attr("fill", awayKC[3]);
        if (awayKC?.length > 3) $("#awayPlayerRightLongSleeve").attr("fill", awayKC[3]);

        if (data?.ps?.TN?.score) {
            homeScore = data?.ps?.TN?.score?.c1;
            awayScore = data?.ps?.TN?.score?.c2;
            $("#score").text(homeScore + '-' + awayScore);
        }

        if (data?.cl) {
            gameTime = data?.cl?.m * 60 + data?.cl?.s;
            showTime(gameTime);
            if (data?.cl?.r == 0) isTimerRunning = data?.cl?.r;
                let newDate = new Date;
                startTime = Math.floor(newDate.getTime() / 1000) - gameTime;
        }

        if (data?.p?.n) {
            $("#period").text(data?.p?.n);
        }
    }
}

function showTime(showTimeArgument) {
    if(showTimeArgument >= 0) {
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

function setEventLabel(eventTitle) {
    if (eventTitle[0] == "") $("#center_rect").attr("fill-opacity", 0);
    else $("#center_rect").attr("fill-opacity", 0.3);
    $("#center_text").text(eventTitle[0]);
}