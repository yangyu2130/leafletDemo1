<template>
    <div class="test">
        <div class="demo" ref="demo" @mousedown="demoMouseDown($event)">
            <div class="aaa"></div>
            <div class="fillDiv" @mousedown="fillDivMouseDown($event, item)" v-for="(item, index) in fillDivData" :style="item" :key="index">
                <div class="showMsg">
                    {{item.startTimeShow + ' : ' + item.endTimeShow}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default({
    data() {
        return {
            fillDivData: [],
            maxFillDiv: 566,
            // minutes/ px
            minutesPerPx: 0
        }
    },
    mounted() {
        if(this.$refs.demo) {
            // 计算出 1px = 多少分钟
            // 问题：最后1px计算不出23.59分钟
            this.minutesPerPx = Math.floor(60 * 24 / this.maxFillDiv * 100)/100
            // 根据 px/分钟 重新计算 demo的width
            this.$refs.demo.style.width = 1440 / this.minutesPerPx + 2 +'px'
            this.maxFillDiv = 1440 / this.minutesPerPx
        }
    },
    methods: {
        demoMouseDown(e) {
            e.stopPropagation()
            const that = this
            const result = {}
            result.left = e.offsetX + 1 + 'px'
            // 保证时间大于 0
            if(e.offsetX >= -1) {
                result.startTime = that.widthToTime(e.offsetX + 1).time
                result.startTimeShow = that.widthToTime(e.offsetX + 1).show
                result.width = null
                that.fillDivData.push(result)
                const initLeft = e.offsetX
                const fun1 = (e2) => {
                    const moveDistance = e2.clientX - e.clientX
                    const right = initLeft + moveDistance
                    // 不能大于23.59
                    if(right < that.maxFillDiv) {
                        that.fillDivData[that.fillDivData.length - 1].width = moveDistance + 'px'
                        that.fillDivData[that.fillDivData.length - 1].endTime = that.widthToTime(right).time
                        that.fillDivData[that.fillDivData.length - 1].endTimeShow = that.widthToTime(right).show
                    }
                }
                window.addEventListener('mousemove', fun1)
                window.addEventListener('mouseup', () => {
                    window.removeEventListener('mousemove', fun1)
                })
            }
        },
        fillDivMouseDown (e, item) {
            e.stopPropagation()
            const that = this
            const initLeft = item.left.split('px')[0]
            const initWidth = item.width.split('px')[0]
            console.log(initLeft);
            const fun1 = (e2) => {
                const moveDistance = e2.clientX - e.clientX
                const left = initLeft*1 + moveDistance*1
                const right = initLeft*1 + moveDistance*1 + initWidth*1 - 1
                if(left>=0 && (right < that.maxFillDiv)) {
                    item.left = left + 'px'
                    item.startTime = that.widthToTime(left).time
                    item.startTimeShow = that.widthToTime(left).show
                    item.endTime = that.widthToTime(right).time
                    item.endTimeShow = that.widthToTime(right).show
                }
            }
            window.addEventListener('mousemove', fun1)
            window.addEventListener('mouseup', () => {
                window.removeEventListener('mousemove', fun1)
            })
        },
        // 根据 px 获取时间
        widthToTime(data) {
            // 这里 用(1440 - (data * this.minutesPerPx))<this.minutesPerPx 判断出 是否为 23.59 此时的px，此时的Px应为 demo的最后一段长为minutesPerPx的时间段
            // 判断为23.59的时间段则直接更改为1439即 23.59
            const result = ((1440 - (data * this.minutesPerPx))<this.minutesPerPx)?1439:Math.floor(data * this.minutesPerPx)
            const hour = Math.floor(result / 60)
            const minutes = result % 60
            return {
                time: result, show: hour + ':' + minutes
            }
        }
    }
})
</script>
<style lang="less" scoped>
.test{
    text-align: center;
    padding: 50px 0px;
    >.demo{
        margin: auto;
        height: 50px;
        width: 888px;
        position: relative;
        border: 1px solid grey;
        .aaa{
            // height: 48px;
            // width: 50px;
            // background: red;
            // position: absolute;
            // left: 450px;
        }
        // background: red;
        .fillDiv{
            height: 48px;
            background: red;
            position: absolute;
            .showMsg{
                position: absolute;
                left: 0px;
                bottom: -60px;
            }
        }
    }
}
</style>
