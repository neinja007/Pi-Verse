const DIGITS =
    "14159265358979323846264338327950288419716939937510" +
    "58209749445923078164062862089986280348253421170679" +
    "82148086513282306647093844609550582231725359408128" +
    "48111745028410270193852110555964462294895493038196" +
    "44288109756659334461284756482337867831652712019091" +
    "45648566923460348610454326648213393607260249141273" +
    "72458700660631558817488152092096282925409171536436" +
    "78925903600113305305488204665213841469519415116094" +
    "33057270365759591953092186117381932611793105118548" +
    "07446237996274956735188575272489122793818301194912" +
    "98336733624406566430860213949463952247371907021798" +
    "60943702770539217176293176752384674818467669405132" +
    "00056812714526356082778577134275778960917363717872" +
    "14684409012249534301465495853710507922796892589235" +
    "42019956112129021960864034418159813629774771309960" +
    "51870721134999999837297804995105973173281609631859" +
    "50244594553469083026425223082533446850352619311881" +
    "71010003137838752886587533208381420617177669147303" +
    "59825349042875546873115956286388235378759375195778" +
    "18577805321712268066130019278766111959092164201989"

let total_digits = 0
let last_break = -2
let correct = true
let break_interval = 10
let record = true

function toggle_theme(update) {
    if (update) {
        if (get_cookie("theme_dark") == "true") {
            set_cookie("theme_dark", "false")
        } else {
            set_cookie("theme_dark", "true")
        }
        let bdy = document.getElementById('bdy');
        bdy.getAttribute('class') == 'light' ? bdy.setAttribute('class', 'dark') : bdy.setAttribute('class', 'light')
        for (let i of document.getElementsByTagName('button')) {
            i.getAttribute('class') == 'blight' ? i.setAttribute('class', 'bdark') : i.setAttribute('class', 'blight')
        }
    } else {
        if (get_cookie("theme_dark") == "true") {
            let bdy = document.getElementById('bdy');
            bdy.getAttribute('class') == 'light' ? bdy.setAttribute('class', 'dark') : bdy.setAttribute('class', 'light')
            for (let i of document.getElementsByTagName('button')) {
                i.getAttribute('class') == 'blight' ? i.setAttribute('class', 'bdark') : i.setAttribute('class', 'blight')
            }
        }
    }
}

function add(key) {
    if (key == "Backspace" && !correct) {
        if (total_digits > 0) {
            total_digits--
            document.getElementById(total_digits).remove()
            try {
                document.getElementById("b" + total_digits).remove()
                last_break -= break_interval
            } catch (error) { }
            correct = true

            document.getElementById("spaceholder").innerHTML = ""
            for (let i = 0; i < break_interval - (total_digits - (last_break + 1)); i++) {
                document.getElementById("spaceholder").innerHTML += "&nbsp;"
            }
            document.getElementById("active").innerHTML = total_digits
        } return
    }
    if (!correct || !["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(key)) { return }

    let digit = document.createElement("span")
    digit.innerHTML = key.toString()
    digit.id = total_digits

    DIGITS[total_digits] == key ? correct = true : correct = false
    correct ? digit.setAttribute("class", "correct") : digit.setAttribute("class", "incorrect")

    let digits = document.getElementById("digits")
    digits.appendChild(digit)

    let break_ = document.createElement("br")
    break_.id = "b" + total_digits
    last_break += break_interval
    last_break < total_digits ? digits.appendChild(break_) : last_break -= break_interval

    document.getElementById("spaceholder").innerHTML = ""
    for (let i = 0; i < break_interval - (total_digits - (last_break)); i++) {
        document.getElementById("spaceholder").innerHTML += "&nbsp;"
    }

    total_digits++
    document.getElementById("active").innerHTML = total_digits

    if (get_cookie("highscore") < total_digits && record && correct) {
        set_cookie("highscore", total_digits.toString())
        document.getElementById("highscore").innerHTML = total_digits.toString()
    }
}

function refresh(new_interval) {
    isNaN(new_interval) ? "" : break_interval = new_interval
    set_cookie("break_interval", new_interval)
    document.getElementById("digits").innerHTML = ""
    let blanks = ""
    for (let i = 0; i < break_interval - 2; i++) { blanks += "&nbsp;" }
    document.getElementById("prefix").innerHTML = "3." + blanks
    for (let i of document.getElementsByName("br")) {
        if (!i.name) { i.remove() }
    }
    last_break = -2
    for (let i = 0; i < total_digits; i++) {
        let digit = document.createElement("span")
        digit.innerHTML = DIGITS[i]
        digit.id = i
        digit.setAttribute("class", "correct")
        document.getElementById("digits").appendChild(digit);
        if ((i + 1) % break_interval == 0) {
            last_break = i - 1;
            let break_ = document.createElement("br")
            break_.id = "b" + i
            document.getElementById("digits").appendChild(break_)
        }
    }
    document.getElementById("spaceholder").innerHTML = ""
    for (let i = 0; i < break_interval - (total_digits - (last_break + 1)); i++) {
        document.getElementById("spaceholder").innerHTML += "&nbsp;"
    }
    document.getElementById("active").innerHTML = total_digits
    scrollTo({
        "behavior": "instant",
        "top": 1000000
    })
    document.getElementById("last_active").innerHTML = get_cookie("last_active")
}

addEventListener("keydown", event => {
    add(event.key)
    scrollTo({
        "behavior": "instant",
        "top": 1000000
    })
})

if (!get_cookie("highscore")) { set_cookie("highscore", "0") }
if (!get_cookie("last_active")) { set_cookie("last_active", "0") } else { document.getElementById("last_active").innerHTML = get_cookie("last_active") }
if (!get_cookie("theme_dark")) { set_cookie("theme_dark", "false") } else { toggle_theme(false) }
if (!get_cookie("break_interval")) { set_cookie("break_interval", "10") } else { refresh(parseInt(get_cookie("break_interval"))) }
document.getElementById("highscore").innerHTML = get_cookie("highscore")

function set_cookie(name, value, expires = 400) {
    let cookie = name + "=" + value + "; SameSite=None; Secure; path=/; "
    if (expires !== false) {
        const date = new Date()
        date.setTime(date.getTime() + (expires * 24 * 60 * 60 * 1000))
        let expiry = "expires=" + date.toUTCString()
        cookie += expiry
    }
    document.cookie = cookie
}

function delete_cookie(name, all = false) {
    if (all) {
        const cDecoded = decodeURIComponent(document.cookie)
        const cArray = cDecoded.split("; ")

        cArray.forEach(element => {
            delete_cookie(element)
        })

        return
    }
    set_cookie(name, null, null)
}

function get_cookie(name) {
    const cDecoded = decodeURIComponent(document.cookie)
    const cArray = cDecoded.split("; ")
    let result = null;

    cArray.forEach(element => {
        if (element.indexOf(name) === 0) {
            result = element.substring(name.length + 1)
        }
    })

    return result
}