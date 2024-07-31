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
    }
}