export function Get_Formatted_Time(n) {
    try {
        var num = n;
        var hours = (num / 60);
        var rhours = Math.floor(hours);
        var minutes = (hours - rhours) * 60;
        var rminutes = Math.round(minutes);
        return rhours + "h" + rminutes + "m";
    }
    catch (e) {
        console.log("Handled get time error ", e)
        return '1h17m'
    }

}

export function Get_Rating_Level(rating) {
    try {
        if (rating <= 3.5) {
            return "bad"
        }
        if (rating <= 7) {
            return "bof"
        }
        return null
    }
    catch (e) {
        console.log("Handled get rating error ", e)
        return 'bof'
    }

}

export function Get_Separator(index, text_list) {
    try {
        return (index < text_list.length - 1 ? ", " : "")
    }
    catch (e) {
        console.log("Handled Get_Separator error ", e)
        return ", "
    }
}

export function Get_Genres_String(genres_list) {
    console.log("genres: ", genres_list)
    return (genres_list.join(", "))
}

export function copy(obj) {
    return JSON.parse(JSON.stringify(obj))
}

export function is_empty(string) {
    try {
        return string == null || string.length == 0
    }
    catch (e) {
        return true
    }
}