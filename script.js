let fileInput = document.getElementById('fileInput')
let board = document.getElementById('board')
let downloadBtn = document.getElementById('downloadBtn')
let dragged

function saveBoard() {
    let images = []
    let items = document.querySelectorAll('.board-item img')
    items.forEach(img => images.push(img.src))
    localStorage.setItem('moodBoard', JSON.stringify(images))
}

function loadBoard() {
    let saved = localStorage.getItem('moodBoard')
    if (saved) {
        let images = JSON.parse(saved)
        images.forEach(src => {
            let div = document.createElement('div')
            div.className = 'board-item'
            div.draggable = true
            div.innerHTML = '<img src="' + src + '">'
            board.appendChild(div)
        })
    }
}

fileInput.addEventListener('change', function() {
    let files = fileInput.files
    for (let i = 0; i < files.length; i++) {
        let reader = new FileReader()
        reader.onload = function(e) {
            let div = document.createElement('div')
            div.className = 'board-item'
            div.draggable = true
            div.innerHTML = '<img src="' + e.target.result + '">'
            board.appendChild(div)
            saveBoard()
        }
        reader.readAsDataURL(files[i])
    }
})

board.addEventListener('dragstart', function(e) {
    if (e.target.classList.contains('board-item')) {
        e.dataTransfer.setData('text/plain', null)
        dragged = e.target
    }
})

board.addEventListener('dragover', function(e) {
    e.preventDefault()
})

board.addEventListener('drop', function(e) {
    e.preventDefault()
    if (dragged && e.target.classList.contains('board-item')) {
        let temp = document.createElement('div')
        board.insertBefore(temp, dragged)
        board.insertBefore(dragged, e.target)
        board.insertBefore(e.target, temp)
        board.removeChild(temp)
        sparkle(e.pageX, e.pageY)
        saveBoard()
    }
})

downloadBtn.addEventListener('click', function() {
    html2canvas(board).then(function(canvas) {
        let link = document.createElement('a')
        link.download = 'moodboard.png'
        link.href = canvas.toDataURL()
        link.click()
    })
})

function sparkle(x, y) {
    let star = document.createElement('div')
    star.className = 'sparkle'
    star.style.left = (x - 10) + 'px'
    star.style.top = (y - 10) + 'px'
    board.appendChild(star)
    setTimeout(() => {
        board.removeChild(star)
    }, 600)
}

loadBoard()
