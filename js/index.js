const gameConfig = {
    width: 600,
    height: 600,
    rows: 3,
    cols: 3,
    imgUrl: "./img/1.png",
    dom: document.querySelector("#game"),
    isOver: false
}
gameConfig.pieceWidth = gameConfig.width / gameConfig.cols
gameConfig.pieceHeight = gameConfig.height / gameConfig.rows
gameConfig.pieceNumber = gameConfig.rows * gameConfig.cols
gameConfig.dom.style.margin = "50px auto"

class Block {
    constructor(left, top, isVisible) {
        this.left = left
        this.top = top
        this.correctLeft = left
        this.correctTop = top
        this.dom = document.createElement("div")
        this.dom.style.width = gameConfig.pieceWidth + 'px'
        this.dom.style.height = gameConfig.pieceHeight + 'px'
        this.dom.style.background = `url(${gameConfig.imgUrl}) -${left}px -${top}px`
        this.dom.style.backgroundSize = `${gameConfig.width}px ${gameConfig.height}px` 
        this.dom.style.position = "absolute"
        this.dom.style.border = "1px solid #fff"
        this.dom.style.boxSizing = "border-box"
        this.dom.style.cursor = "pointer"
        this.isVisible = isVisible
        if (isVisible) {
            this.dom.style.display = "none"
        }
        this.show()
        gameConfig.dom.appendChild(this.dom)
    }
    show() {
        this.dom.style.left = `${this.left}px`
        this.dom.style.top = `${this.top}px`
    }
    isCorrect() {
        return isEqual(this.left, this.correctLeft) && isEqual(this.top, this.correctTop)
    }
}
const allBlock = []
//交换顺序
function exchange(box1, box2) {
    let temp = box1.left
    box1.left = box2.left
    box2.left = temp

    temp = box1.top
    box1.top = box2.top
    box2.top = temp

    box1.show()
    box2.show()
}
//判断两个数值是否相等
function isEqual(num1, num2) {
    return parseInt(num1) === parseInt(num2)
}
//判断是否已通关
function isWin() {
    const result = allBlock.filter(block => {
        return !block.isCorrect()
    })
    if (result.length === 0) {
        gameConfig.isOver = true
        //游戏结束
        allBlock.forEach(block => {
            block.dom.style.border = "none"
            block.dom.style.display = "block"
        })
    }
}
//点击事件
function regEvent() {
    //找到隐藏的div
    const blockNone = allBlock.find(block => block.isVisible)
    allBlock.forEach(block => {
        block.dom.onclick = function () {
            if (gameConfig.isOver) {
                return
            }
            //判断是否是靠近的方块，r和c至少有一个不一样
            if (isEqual(blockNone.top, block.top) && isEqual(Math.abs(blockNone.left - block.left), gameConfig.pieceWidth) || isEqual(blockNone.left, block.left) && isEqual(Math.abs(blockNone.top - block.top), gameConfig.pieceHeight)) {
                exchange(block, blockNone)
                isWin()
            }
        }
    })
}
//打乱顺序
function blockRandom() {
    //生成随机的顺序
    function getRandom(min, max) {
        return Math.floor(Math.random() * (max + 1 - min) + min)
    }
    for (let i = 0; i < allBlock.length - 1; i++) {
        let index = getRandom(0, allBlock.length - 2)
        exchange(allBlock[i], allBlock[index])
    }
}

//初始化操作，生成图片
function init() {
    gameConfig.dom.style.width = gameConfig.width + 'px'
    gameConfig.dom.style.height = gameConfig.height + 'px'
    gameConfig.dom.style.border = "2px solid"
    gameConfig.dom.style.position = "relative"
    let isVisible = false
    for (let i = 0; i < gameConfig.rows; i++) {
        for (let j = 0; j < gameConfig.cols; j++) {
            //创建元素
            if (i === gameConfig.rows - 1 && j === gameConfig.cols - 1) {
                isVisible = true
            }
            const block = new Block(j * gameConfig.pieceWidth, i * gameConfig.pieceHeight, isVisible)
            allBlock.push(block)
        }
    }
    //打乱顺序
    blockRandom()
    //点击事件
    regEvent()
}

init()