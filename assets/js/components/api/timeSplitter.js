angular.module("bloggerOverlord.api.splitTime", [
])
.value('splitTime',
    /**
     * Function for converting date/time strings
     * to date(DMY) and time
     * @param   {String} time input time string
     * @returns {Array}[0date (DD-MM-YYYY)
     * @returns {Array}[1time (HH:MM:SS)
     */

    function(time){



    var timeDateStr = time.split('T'),
        date = timeDateStr[0],
        dateStr= date.split('-'),
        year = dateStr[0],
        month = dateStr[1],
        day = dateStr[2],
        timeStr = timeDateStr[1].split('.'),
        time = timeStr[0];

    var dateDMY = day + '-' + month + '-' + year;
    return [dateDMY, time];
});
