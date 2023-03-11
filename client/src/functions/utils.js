export function Get_Formatted_Time(n) {
    var num = n;
    var hours = (num / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    return rhours + "h" + rminutes + "m";
}

export function Get_Rating_Level(rating) {
    if (rating <= 3.5) {
        return "bad"
    }
    if (rating <= 7) {
        return "bof"
    }
    return null
}

export function Get_Separator(index, text_list) {
    return (index < text_list.length - 1 ? ", " : "")
}

export function copy(obj) {
    return JSON.parse(JSON.stringify(obj))
}

export function is_empty(string) {
    return string == null || string.length == 0
}