function main() {

    /*ALL FUNCTIONS IN PROGRAM:*/

    /*Calculates current Cookies wrinklers is holding*/
    function wrinklesC() {
        var totalSucked = 0;
        for (var i in Game.wrinklers) {
            var sucked = Game.wrinklers[i].sucked;
            var toSuck = 1.1;
            if (Game.Has('Sacrilegious corruption')) toSuck *= 1.05;
            if (Game.wrinklers[i].type == 1) toSuck *= 3;
            sucked *= toSuck;
            if (Game.Has('Wrinklerspawn')) sucked *= 1.05;
            totalSucked += sucked;
        }
        return totalSucked
    }

    /*returns total HC depending on total cookies, it is ALWAYS rounded down*/
    function heavenC(totalCookies) {

        return Math.floor(Math.pow(totalCookies / Math.pow(10, 12), (1 / 3)))

    }

    /*returns multiplier that HC has on cps, example 100HC -> output: 2.0 */
    function ff(HC) {
        return 1 + 1 / 100 * HC
    }

    /*returns time it takes to outvalue nonreset if reset occurs at input values. OUTPUT = seconds needed to regain value*/
    /**
     * @return {number}
     */
    function ResetRegainTime(resetTime, currentHC, totalHC) {
        return resetTime * 3600 / (1 - currentHC / totalHC)
    }

    /*returns true or false depending on fastest times. True for RESET, False for Wait*/
    function timeeff(goalCookies, currentCps, resetTime, currentHC, totalHC) {

        return goalCookies / (currentCps * ErrorCalc) > ResetRegainTime(resetTime, currentHC, totalHC)

    }

    /*returns time until reset, only to be used when reset is confirmed. OUTPUT = seconds until reset*/
    function timeUntilReset(goalCookies, currentCps, resetTime, currentHC, totalHC) {
        return (Math.pow(10, 12) * Math.pow(currentHC / (1 - 3600 * resetTime * (currentCps * ErrorCalc) / goalCookies), 3) - Math.pow(10, 12) * Math.pow(totalHC, 3)) / (currentCps * ErrorCalc)
    }

    /*returns a more user friendly time, from second->hours->days->weeks->years(approx), returns in string*/
    function timeshort(seconds) {
        if (seconds < 0) {
            return "Error: Negative time"
        } else if (seconds <= 3600) {
            return "just over " + Math.floor(seconds / 60) + " minute/s"
        } else if (seconds <= 3600 * 24) {
            return "just over " + Math.floor(seconds / 3600) + " hour/s"
        } else if (seconds <= 3600 * 24 * 30) {
            return "just over " + Math.floor(seconds / 3600 / 24) + " day/s"
        } else if (seconds < 3600 * 24 * 7 * 52) {
            return "just over " + Math.floor(seconds / 3600 / 24 / 7) + " week/s"
        } else if (seconds >= 3600 * 24 * 7 * 52) {
            return "just over " + Math.floor(seconds / 3600 / 24 / 7 * 52) + " year/s"
        } else {
            return "Error: unknown"
        }
    }

    /*returns if you should reset now, time until reset(in hours!!!) or if you should not reset*/
    function resetnext(goalCookies, currentCps, resetTime, currentHC, totalHC, totalC) {
        if (timeeff(goalCookies, currentCps, resetTime, currentHC, totalHC)) {
            return "Reset ASAP"
        } else {
            if (timeeff(goalCookies, currentCps, resetTime, currentHC, heavenC(totalC + goalCookies))) {
                return "Reset in " + timeshort(timeUntilReset(goalCookies, currentCps, resetTime, currentHC, totalHC));
            } else {
                return "No reset needed"
            }
        }
    }

    /* returns every reset needed to reach goal in fastest time*/
    function resetschedule(goalCookies, Cps, currentff, TimeUntilReset, currentHC, totalHC, totalC, totalff) {
        var resettimes = [];
        var timetot = 0;
        while (true) {

            if (resettimes.length > 24) {
                resettimes.push("+More");
                break
            }

            if (timeeff(goalCookies, currentff * Cps, TimeUntilReset, currentHC, totalHC)) {
                resettimes.push("Reset ASAP");
                timetot += TimeUntilReset * 3600;
                currentff = totalff;
                currentHC = totalHC;
                totalC += Math.pow(10, 12) * (Math.pow(totalHC + 1, 3) - Math.pow(totalHC, 3));
                totalHC += 1;
                totalff = ff(totalHC);
                timetot += Math.pow(10, 12) * (Math.pow(totalHC + 1, 3) - Math.pow(totalHC, 3)) / (currentff * Cps);

            } else {
                if (timeeff(goalCookies, currentff * Cps, TimeUntilReset, currentHC, heavenC(totalC + goalCookies))) {
                    resettimes.push("Reset in " + timeshort(timetot + timeUntilReset(goalCookies, currentff * Cps, TimeUntilReset, currentHC, totalHC)));
                    timetot += timeUntilReset(goalCookies, currentff * Cps, TimeUntilReset, currentHC, totalHC);
                    totalC += Cps * currentff * timeUntilReset(goalCookies, currentff * Cps, TimeUntilReset, currentHC, totalHC);
                    goalCookies -= Cps * currentff * timeUntilReset(goalCookies, currentff * Cps, TimeUntilReset, currentHC, totalHC);
                    totalHC = heavenC(totalC);
                    totalff = ff(totalHC);

                    currentff = ff(totalHC);
                    currentHC = totalHC;
                    totalC += Math.pow(10, 12) * (Math.pow(totalHC + 1, 3) - Math.pow(totalHC, 3));
                    totalHC += 1;
                    totalff = ff(totalHC);
                    timetot += Math.pow(10, 12) * (Math.pow(totalHC + 1, 3) - Math.pow(totalHC, 3)) / (currentff * Cps);
                } else {
                    resettimes.push("Wait " + timeshort(goalCookies / (Cps * currentff) + TimeUntilReset * 3600));
                    break
                }
            }
        }
        return resettimes
    }


    /*Startup and test if LogiCookie should be used*/

    if (heavenC(Game.cookiesReset) >= Math.pow(10, 6)) {
        var run = true;
    } else {
        run = false;
        alert("LogiCookie is a lategame Calculator and will not work correctly this early ingame.\nStart using when all uppgrades are bought and HC is over 1 million")
    }

    if (run) {

        /*INPUTS*/


        /*Welcome and introduction*/
        alert("Hello and welcome to LogiCookie. This is a program that calculates when you should reset your CookieClicker IF, and only, you play CookieClicker passively. It gives some inputs and takes the rest from CookieClicker and returns a list of when you should reset.\nHope you will enjoy using me");

        /*Cookies wanted with prompt input*/
        var goalCookies = Math.pow(10, parseInt(prompt("Write amount of Cookies 10^(Input)\nOct=10^27\nNon=10^30\nDec=10^33\nUndec=10^36", "33")));

        /*Time it takes from reset until max CPS (In hours)*/
        var ResetTime = parseInt(prompt("Write time it takes to reset and get back to same CPS (without HC multipliers) in hours", "2"));

        /*Total cookies produced in game*/
        var totalCookies = Game.cookiesEarned + wrinklesC();

        /*total cookies lost for currentHC calculation*/
        var lostCookies = Game.cookiesReset;

        /*Cookies per second (auto input) + Bonus multiplier, from wrinklers, (at max)*/
        var Cps = Game.cookiesPs * 9.1318;

        /*Defines which output type*/
        var Outputtype = confirm("Do you want all reset times or just the first one?\nOk for all times\nCancel for just first one");

        var ErrorCalc = parseFloat(prompt("Input for Errorcalculation\n(It is used to approximate uncalculated factors)\nLeave empty if unsure", "1.2"));

        /*Calculations*/


        /*current HC (calc on lostCookies)*/
        var currentHC = heavenC(lostCookies);

        /*HC after soft reset (calc on totalC)*/
        var totalHC = heavenC(totalCookies);

        /*Multipliers (ff=multiplier)*/
        var currentff = ff(currentHC);
        var totalff = ff(totalHC);

        /*Calculation of Cps without HC multiplier*/
        Cps = Cps / currentff;


        /*Main Program*/

        if (Outputtype) {
            output = resetschedule(goalCookies, Cps, currentff, ResetTime, currentHC, totalHC, totalCookies, totalff).join("\n");
        } else {
            output = resetnext(goalCookies, Cps, ResetTime, currentHC, totalHC, totalCookies)
        }

        alert(output);
    }
}

main();