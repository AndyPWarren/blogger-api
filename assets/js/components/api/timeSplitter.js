angular.module("bloggerOverlord.api.splitTime", [
])
.value('splitTime',
    /**
     * Function for converting date/time strings
     * to date(DMY) and time
     * @param   {String} time  input time string in with time separated with 'T' and milliseconds with '.'
     * @returns {Array}[0]date (DD-MM-YYYY)
     * @returns {Array}[1]time (HH:MM:SS)
     */
    function(dateTime){
        // separate date and time by 'T'
        var dateTimeArr = dateTime.split('T');
        // take date and separate into Y,M,D
        var dateArr = dateTimeArr[0].split('-'),
            year = dateArr[0],
            month = dateArr[1],
            day = dateArr[2];
        // take time and remove milliseconds
        var timeArr = dateTimeArr[1].split('.'),
            time = timeArr[0];
        //construct date format DD-MM-YYYY
        var dateDMY = day + '-' + month + '-' + year;
        return [dateDMY, time];
    }
);
