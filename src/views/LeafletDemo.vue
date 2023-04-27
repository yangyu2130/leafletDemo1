<template>
    <div class="leafletDemo">
        <div class="leafletOption">
            <div class="topOptDiv optLayerDiv" @click="optLayerClick">图层
                <div v-if="optLayerVif" class="optLayer">
                    <!-- 图层 包含: 地图 影像 网路 -->
                    <div class="imageDiv" @click="layerChangeClick('DT')" :class="this.nowChioseLayer==='DT'?'active':''" style="position: relative; width: 120px; height: 70px;">
                        <img src="images/baiduDT.png" width="120" height="70" alt="">
                        <i v-if="this.nowChioseLayer==='DT'" class="el-icon-circle-check"></i>
                        <span>地图</span>
                    </div>
                    <div class="imageDiv" @click="layerChangeClick('YX')" :class="this.nowChioseLayer==='YX'?'active':''" style="position: relative; width: 120px; height: 70px;">
                        <img src="images/baiduYX.png" width="120" height="70" alt="">
                        <i v-if="this.nowChioseLayer==='YX'" class="el-icon-circle-check"></i>
                        <span>影像</span>
                    </div>
                    <div class="imageDiv" @click="layerChangeClick('LW')" :class="this.nowChioseLayer==='LW'?'active':''" style="position: relative; width: 120px; height: 70px;">
                        <img src="images/baiduLW.png" width="120" height="70" alt="">
                        <i v-if="this.nowChioseLayer==='LW'" class="el-icon-circle-check"></i>
                        <span>网路</span>
                    </div>
                </div>
                <i v-if="!optLayerVif" class="el-icon-arrow-down"></i>
                <i v-if="optLayerVif" class="el-icon-arrow-up"></i>
            </div>
            <div class="topOptDiv optShowDiv" @click="optshowClick">显示
                <!-- 显示 包含： 标记 收藏 点亮-->
                <div v-if="optShowVif" class="optShow">
                    <!-- 标记 -->
                    <div class="showDiv" @click="showMarkClick">
                        <i class="el-icon-paperclip"></i>
                        标记
                    </div>
                    <div class="showDiv" @click="showCollectClick">
                        <i class="el-icon-location-outline"></i>
                        收藏
                    </div>
                    <div class="showDiv" @click="showLightClick">
                        <i class="el-icon-star-off"></i>
                        点亮
                    </div>
                </div>
                <i v-if="!optShowVif" class="el-icon-arrow-down"></i>
                <i v-if="optShowVif" class="el-icon-arrow-up"></i>
            </div>
            <div class="topOptDiv optToolDiv" @click="optToolClick">工具箱
                <div v-if="optToolVif" class="optTool">
                    <!-- 工具箱 包含: 测距 标记 收藏 点亮 绘制图形 -->
                    <!-- 测距 -->
                    <div class="toolDiv" @click="distanceClick">
                        <i class="el-icon-paperclip"></i>
                        测距
                    </div>
                    <div class="toolDiv" @click="markClick">
                        <i class="el-icon-location-outline"></i>
                        标记
                    </div>
                    <div class="toolDiv" @click="collectClick">
                        <i class="el-icon-star-off"></i>
                        收藏
                    </div>
                    <div class="toolDiv" @click="lightClick">
                        <i class="el-icon-s-opportunity"></i>
                        点亮
                    </div>
                    <!-- 绘制图形分为： 矩形、圆形、自定义 -->
                    <div class="toolDiv" @mouseover="drawToolHover = true">
                        <i class="el-icon-news"></i>
                        绘制图形
                    </div>
                    <div class="drawGraphDiv" v-if="drawToolHover"  @mouseleave="drawToolHover = false">
                        <span @click="drawGraphClick('rectangle')">矩形</span>
                        <span @click="drawGraphClick('circular')">圆形</span>
                        <span @click="drawGraphClick('costom')">自定义</span>
                    </div>
                </div>
                <i v-if="!optToolVif" class="el-icon-arrow-down"></i>
                <i v-if="optToolVif" class="el-icon-arrow-up"></i>
            </div>
        </div>
        <el-button @click="setView">setView</el-button>
        <el-button @click="flyTo">flyTo</el-button>
        <el-button @click="reset">还原</el-button>
        <el-button @click="test">测试</el-button>
        <div id="map"></div>
    </div>
</template>
<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { all } from 'q'
var redMarker = L.divIcon({className: 'redMarkerIcon'});
var noContentMarker = L.divIcon({className: 'noContentMarkerIcon'});
// 标记 marker
var tabMarker = L.divIcon({
    className: 'tabMarkerIcon',
    html: `<i class="el-icon-location"></i>`
});
// 收藏 marker
var collectMarker = L.divIcon({
    className: 'collectMarkerIcon',
    html: `<i class="el-icon-star-on"></i>`
});
export default {
    name: 'LeafletDemo',
    comments: {
    },
    data() {
        return {
            map: null,
            baiduYXlayer: null,
            activeName: null,
            // 图层div v-if
            optLayerVif: false,
            // 工具箱div v-if
            optToolVif: false,
            // 此时选中的图层 DT地图 YX影相 WL网路
            nowChioseLayer: 'DT',
            // 存放对应图层的json对象
            layerData: {
                DT: null,
                YX: null,
                LW: null
            },
            optShowVif: false,
            drawToolHover: false,
            markClickPopupHtml: `<div class="markClickPopup">
                        <div class="title">确定删除该标记点？</div>
                        <div clasa="btnGroup">
                            <button class="my-button" id="markClickPopupBtnOk"}>确定</button>    
                            <button class="my-button" id="markClickPopupBtnCancel">取消</button>    
                        </div>
                    </div>`
        }
    },
    mounted() {
        this.init()
    },
    watch: {
        optLayerVif(newValue, oldValue) {
            if(newValue === true) {
                this.optShowVif = false
                this.optToolVif = false
            }
        },
        optShowVif(newValue, oldValue) {
            if(newValue === true) {
                this.optLayerVif = false
                this.optToolVif = false
            }
        },
        optToolVif(newValue, oldValue) {
            if(newValue === true) {
                this.optLayerVif = false
                this.optShowVif = false
            }
        },

    },
    methods: {
        // 地图图层切换
        layerChangeClick(type) {
            const data = this.layerData[this.nowChioseLayer]
            this.map.removeLayer(data)
            if(type === 'YX') {
                this.layerData.YX = L.tileLayer.wms(
                    "http://localhost:8080/geoserver/hangzhou/wms",{
                        layers: 'hangzhou:baiduYX15',
                    }
                ).addTo(this.map)
            } else if(type === 'DT') {
                this.layerData.DT = L.tileLayer.wms(
                    "http://localhost:8080/geoserver/hangzhou/wms",{
                        layers: 'hangzhou:baiduDT15',
                    }
                ).addTo(this.map)
            } else if(type === 'LW') {
                this.layerData.LW = L.tileLayer.wms(
                    "http://localhost:8080/geoserver/hangzhou/wms",{
                        layers: 'hangzhou:baiduLW15',
                    }
                ).addTo(this.map)
            }          
            this.nowChioseLayer = type
        },
        // lat 30.105 lng 120.42320251464845
        init() {
            this.map = L.map('map',{
                zoom: 0,
                minZoom: 10,
                maxZoom: 15,
                center: [0,0],
                noWrap: true,
                layersControl: true,
                attributionControl: false,
                zoomControl: true,
                position: 'topright'
            })
            // 百度地图图层
            this.layerData.DT = L.tileLayer.wms(
                "http://localhost:8080/geoserver/hangzhou/wms",{
                    layers: 'hangzhou:baiduDT15',
                }
            ).addTo(this.map)
            // 百度路网图层
            this.layerData.WL = L.tileLayer.wms(
                "http://localhost:8080/geoserver/hangzhou/wms",{
                    layers: 'hangzhou:baiduLW15',
                }
            )
            // 百度影像图层
            this.layerData.YX = L.tileLayer.wms(
                "http://localhost:8080/geoserver/hangzhou/wms",{
                    layers: 'hangzhou:baiduYX15',
                }
            )
            // 新增标记点
            var point1 = L.marker([30.2, 120.4]).bindPopup('这里是北京')
            var cities = L.layerGroup([point1])
            //新建图层控件的数据源-地图
            // var baseLayers = {
            //     '百度地图图层': baiduDTlayer,
            //     '百度影像图层': baiduYXlayer,
            //     '百度路网图层': baiduLWlayer,
            // };
            // 新建图层控件的数据源-城市
            var overlays = {
                '城市': cities
            };
            this.map.setView([30.105,120.42320251464845],12)
            //新建图层控件并添加到地图
            // var aa = L.control.layers(baseLayers, overlays,{
            // }).addTo(this.map)
        },
        setView() {
            this.map.removeLayer(this.baiduYXlayer)
        },
        flyTo() {
            this.map.setView([30,120],13)
        },
        reset() {
            this.map.setView([30,120],10)
        },
        test() {
        },
        // 点击 图层切换
        optLayerClick(e) {
            if(e.target.className === 'el-icon-arrow-up' || e.target.className.includes('optLayerDiv')) {
                this.optLayerVif = !this.optLayerVif
            }
        },
        // 点击 显示
        optshowClick(e) {
            if(e.target.className === 'el-icon-arrow-up' || e.target.className.includes('optShowDiv')) {
                this.optShowVif = !this.optShowVif
            }
        },
        // 点击工具箱
        optToolClick(e) {
            if(e.target.className === 'el-icon-arrow-up' || e.target.className.includes('optToolDiv')) {
                this.optToolVif = !this.optToolVif
            }
        },
        // 工具箱 点击测距
        distanceClick() {
            // 点击测距, 开始测距事件
            this.distanceFun()
        },
        // 测距函数
        distanceFun() {
            // 用time来记录点击点数
            let that = this
            var time = 0
            var myIcon = L.divIcon({className: 'redMarker'});
            var transparentIcon = L.divIcon({className: 'transparentIcon'});
            const allpoint = []
            var transparentPolyLine = null
            var transparentPolyLineToolTip = null
            that.map.on('click', function(e){
                const nowClickPoint = [e.latlng.lat*1,e.latlng.lng*1]
                allpoint.push(nowClickPoint)
                if(time == 0) {
                    // 起点
                    const aa =  L.marker(nowClickPoint,{
                        icon: myIcon,
                    }).addTo(that.map)
                    aa.bindTooltip(`<span class="markerTooltipSpan">起点</span>`,{
                        permanent: true,
                        offset: [10,0]
                    }).openTooltip();
                    // bindPopup 显示在上测 比较大
                    // aa.bindPopup(`<span>aaa</span>`).openPopup();
                    that.map.on('mousemove', function(e) {
                        // 路径透明线
                        let point = [e.latlng.lat*1,e.latlng.lng*1]
                        let polylinePoint = [[e.latlng.lat*1,e.latlng.lng*1],allpoint[allpoint.length-1]]
                        if(transparentPolyLine !== null){
                            transparentPolyLine.remove()
                        }
                        transparentPolyLine = L.polyline(polylinePoint, {color: 'rgba(255,0,0,0.3)'}).addTo(that.map);
                        // 计算距离（这里的距离应为： 全部折线的距离总和 + mousemove移动的距离）
                        let nowDistance = 0
                        allpoint.map((item, index) => {
                            if(index !== allpoint.length-1) {
                                nowDistance += that.map.distance(allpoint[index*1],allpoint[index*1+1]).toFixed(1)*1
                            }
                        })
                        nowDistance += that.map.distance(allpoint[allpoint.length - 1],point).toFixed(1)*1
                        if(transparentPolyLineToolTip !== null) {
                            transparentPolyLineToolTip.remove()
                        }
                        transparentPolyLineToolTip =  L.marker(point,{icon: myIcon,}).addTo(that.map)
                        transparentPolyLineToolTip.bindTooltip(`<span class="markerTooltipSpan">距离： ${nowDistance} 米; 双击结束</span>`,{
                            permanent: true,
                            offset: [10,0]
                        }).openTooltip();
                    })
                    // 双击 暂停测距
                    that.map.on('dblclick', function(e) {
                        that.stopDistanceFun()
                        transparentPolyLineToolTip.remove()
                    })
                } else {
                    // 中间点
                    // 画 红色折线
                    let polyLinePoint = [allpoint[allpoint.length-2],allpoint[allpoint.length-1]]
                    L.polyline(polyLinePoint, {color: 'rgba(255,0,0,0.5)'}).addTo(that.map)
                    // 计算距离（这里的距离应为： 全部折线的距离总和）
                    let nowDistance = 0
                    allpoint.map((item, index) => {
                        if(index !== allpoint.length-1) {
                            nowDistance += that.map.distance(allpoint[index*1],allpoint[index*1+1]).toFixed(1)*1
                        }
                    })
                    // 显示 距离
                    let aa =  L.marker(nowClickPoint,{
                        icon: myIcon,
                    }).addTo(that.map)
                    aa.bindTooltip(`<span class="markerTooltipSpan">距离： ${nowDistance} 米</span>`,{
                        permanent: true,
                        offset: [10,0]
                    }).openTooltip();
                }
                time++
            })
        },
        // 暂停 测绘
        stopDistanceFun() {
            this.map.off('click')
            this.map.off('mousemove')
            this.map.off('dblclick')
        },
        // 工具箱 点击标记
        markClick(e) {
            let that = this
            function clickFun(e) {
                let point = [e.latlng.lat*1,e.latlng.lng*1]
                const markPoint = L.marker(point,{icon: tabMarker}).addTo(that.map)
                // Tooltip展示经纬度
                markPoint.bindTooltip(`<div>经度：${point[1].toFixed(5)}</div><div>纬度：${point[0].toFixed(5)}</div>`, {offset:[10,0], permanent: false}).openTooltip();
                // Popup 弹出框 -- 是否要删除该标记点
                markPoint.bindPopup(that.markClickPopupHtml,{
                })
                // that.map.off('click',clickFun)
                // 点击确定 -- 删除该标记点
                // console.log(document.getEle
                
                
                mentById('markClickPopupBtnOk'));
                document.getElementById('markClickPopupBtnOk').onclick = function() {
                    console.log('ok');
                    markPoint.remove()
                }
                // 点击取消 -- 关闭popup
                document.getElementById('markClickPopupBtnCancel').onclick = function(){
                    markPoint.closePopup();
                }
                // 删除click防止多次触发
                that.map.off('click')
            }
            that.map.on('click', clickFun)
            // 删除click防止多次触发
            // that.map.off('click',clickFun)
        },
        // 工具箱 点击收藏
        collectClick() {
            let that = this
            that.map.on('click', function(e) {
                let point = [e.latlng.lat*1,e.latlng.lng*1]
                L.marker(point,{icon: collectMarker}).addTo(that.map)
                // 删除click防止多次触发
                that.map.off('click')
            })
        },
        // 工具箱 点亮
        lightClick() {

        },
        // 工具箱 绘制图形
        drawGraphClick(type) {
            let that = this
            that.$message.success('开始绘制')
            if(type === 'rectangle'){
                // 矩形
                // 点击，确定其中一个顶点1，可向四周移动鼠标确定 对角顶点2
                let rectanglePolyLine = null
                let rectanglePolyLineToolTip = null
                this.map.on('click', function(e) {
                    // 起点 （其中一个顶点）
                    let point1 = [e.latlng.lat*1,e.latlng.lng*1]
                    that.map.on('mousemove', function(e) {
                        let point2 = [e.latlng.lat*1,e.latlng.lng*1]
                        // 画矩形
                        if(rectanglePolyLine !== null) {
                            rectanglePolyLine.remove()
                        }
                        let polyLinePoint1 = [point1,[point1[0],point2[1]],point2,[point2[0],point1[1]],point1]
                        rectanglePolyLine = L.rectangle(polyLinePoint1, {color: 'rgba(255,0,0,0.5)'}).addTo(that.map)
                        // 提示工具  单击重新选择顶点，双击结束
                        if(rectanglePolyLineToolTip !== null) {
                            rectanglePolyLineToolTip.remove()
                        }
                        rectanglePolyLineToolTip =  L.marker(point2,{icon: noContentMarker,}).addTo(that.map)
                        rectanglePolyLineToolTip.bindTooltip(`<span class="markerTooltipSpan">单击重新选择顶点，双击结束</span>`,{
                            permanent: true,
                            offset: [10,0]
                        }).openTooltip();
                    })
                    // 双击结束函数
                    that.map.on('dblclick', function(e) {
                        rectanglePolyLineToolTip.remove()
                        that.stopDistanceFun()
                    })
                })
            } else if(type === 'circular') {
                // 圆形
                // 点击 确定圆形的中心点，向四周拖动鼠标确定半径
                let circular = null
                let circularToolTip = null
                this.map.on('click', function(e) {
                    // 起点（圆心）
                    let point1 = [e.latlng.lat*1,e.latlng.lng*1]
                    that.map.on('mousemove', function(e) {
                        let point2 = [e.latlng.lat*1,e.latlng.lng*1]
                        // 画圆形
                        if(circular !== null) {
                            circular.remove()
                        }
                        /** 
                         * 
                         * L.circle（[圆心坐标]，{radius: 半径}）.addTo(map)
                         * 
                         * **/
                        // 半径
                        let radius = that.map.distance(point1,point2)
                        circular = L.circle(point1,{radius: radius}, {color: 'rgba(255,0,0,0.5)'}).addTo(that.map)
                        // 提示工具  单击重新选择顶点，双击结束
                        if(circularToolTip !== null) {
                            circularToolTip.remove()
                        }
                        circularToolTip =  L.marker(point2,{icon: noContentMarker}).addTo(that.map)
                        circularToolTip.bindTooltip(`<span class="markerTooltipSpan">单击重新选择圆心，双击结束</span>`,{
                            permanent: true,
                            offset: [10,0]
                        }).openTooltip();
                    })
                    // 双击结束函数
                    that.map.on('dblclick', function(e) {
                        circularToolTip.remove()
                        that.stopDistanceFun()
                    })
                })
            } else if(type === 'costom') {
                // 自定义
                // 点击，确定 一个顶点，再单击 确定一个顶点....直至形成一个闭合图形
                var myIcon = L.divIcon({className: 'noContentMark'});
                let costomPolyLine = null
                let costomPolyLine2 = null
                let costomPolyLineToolTip = null
                let costomPolyLinePoint = []
                this.map.on('click', function(e) {
                    let point1 = [e.latlng.lat*1,e.latlng.lng*1]
                    costomPolyLinePoint.push(point1)
                    // 显示顶点
                    // L.marker(costomPolyLinePoint,{icon: myIcon}).addTo(that.map)
                    if(costomPolyLine !== null) {
                        costomPolyLine.remove()
                    }
                    // 绘制折线
                    costomPolyLine = L.polyline(costomPolyLinePoint, {color: 'rgba(255,0,0,0.5)'}).addTo(that.map)
                    that.map.on('mousemove', function(e) {
                        let point2 = [e.latlng.lat*1,e.latlng.lng*1]
                        // 画 透明折线
                        if(costomPolyLine2 !== null) {
                            costomPolyLine2.remove()
                        }
                        costomPolyLine2 = L.polyline([point1, point2], {color: 'rgba(255,0,0,0.5)'}).addTo(that.map)
                        // 提示工具  单击选择下一顶点，双击闭合图形 结束绘制
                        if(costomPolyLineToolTip !== null) {
                            costomPolyLineToolTip.remove()
                        }
                        costomPolyLineToolTip =  L.marker(point2,{icon: noContentMarker}).addTo(that.map)
                        costomPolyLineToolTip.bindTooltip(`<span class="markerTooltipSpan">单击选择下一顶点，双击闭合图形，结束绘制</span>`,{
                            permanent: true,
                            offset: [10,0]
                        }).openTooltip();
                    })
                    // 双击结束函数--把折线绘制成闭合图形
                    that.map.on('dblclick', function(e) {
                        costomPolyLineToolTip.remove()
                        costomPolyLine.remove()
                        // costomPolyLinePoint = [...costomPolyLinePoint,costomPolyLinePoint[0]]
                        costomPolyLine = L.polygon(costomPolyLinePoint, {color: 'rgba(255,0,0,0.5)'}).addTo(that.map)
                        that.stopDistanceFun()
                    })
                })
            }
        },
        // 显示 标记
        showMarkClick() {

        },
        // 显示 收藏
        showCollectClick() {
            
        },
        // 显示 点亮
        showLightClick() {
            
        },
    },
}
</script>
<style lang="less" scoped>
#map{
    height: 90vh;
    width: 90vw;
    overflow: hidden;
}
.leafletDemo{
    height: 100vh;
    overflow: hidden;
    // 地图工具选项包含： 图层、显示、工具箱
    .leafletOption{
        position: absolute;
        top: 20px;
        right: 50px;
        height: 42px;
        line-height: 40px;
        // leaflet 图层默认z-index为400
        z-index: 401;
        border: 1px solid #DCDFE6;
        border-radius: 2px;
        background: #fff;
        // 图层、显示、工具箱 div
        .topOptDiv{
            display: inline-block;
            background: #fff;
            padding: 0px 20px;
            color: #666;
            border-right: 1px solid #E4E7ED;
            font-size: 14px;
            cursor: pointer;
            // 图层 下拉显示
            .optLayer{
                background: rgba(0,0,0,0.2);
                height: 88px;
                position: absolute;
                padding: 9px 0px;
                top: 45px;
                right: 187px;
                z-index: 401;
                width: 420px;
                text-align: left;
                .imageDiv:last-child{
                    margin-right: 0px;
                }
                // 图层下拉显示的小地图图片 包含 文字显示和勾选图标
                .imageDiv{
                    right: -15px;
                    display: inline-block;
                    margin-right: 15px;
                    // 小地图 图片 上的勾选图标 
                    i{
                        color: #409EFF;
                        font-size: 20px;
                        font-weight: 600;
                        position: absolute;
                        top: 5px;
                        left: 5px;
                    }
                    // 小地图图片右侧字体
                    >span{
                        position: absolute; 
                        bottom: 5px;
                        right: 5px;
                        height: 20px;
                        padding: 0px 3px;
                        line-height: 20px;
                        font-size: 12px;
                        background: #409EFF;
                        color: #fff;
                    }
                    // 小地图 图片
                    >img{
                        border: 2px solid #fff;
                    }
                    >img:hover{
                        border-color: #409EFF;
                    }
                }
                .imageDiv.active{
                    >img{
                        border-color: #409EFF;
                    }
                }
            }
            // 工具箱 下拉显示
            .optTool{
                border: 1px solid #E4E7ED;
                background: #fff;
                position: absolute;
                top: 45px;
                right: 0px;
                z-index: 401;
                height: 200px;
                width: 102px;
                text-align: left;
                >div{
                    color: #000;
                    width: 100px;
                    height: 40px;
                    line-height: 40px;
                    text-align: center;
                }
                >div:hover{
                    background:rgba(0,0,0,0.05);
                    color: #409EFF;
                    text-align: center;
                }
                .drawGraphDiv{
                    width: 150px;
                    position: absolute;
                    right: 105px;
                    bottom: 0px;
                    background: #fff;
                    span{
                        background: #fff;
                        padding: 0px 5px;
                        color: #000;
                    }
                    >span:hover{
                        color: #409EFF;
                    }
                }
                .drawGraphDiv:hover{
                    background: #fff;
                    color: #000;
                }
            }
            // 显示 下拉显示
            .optShow{
                border: 1px solid #E4E7ED;
                background: #fff;
                position: absolute;
                top: 45px;
                right: 100px;
                z-index: 401;
                height: 120px;
                width: 90px;
                text-align: left;
                >div{
                    color: #000;
                    width: 90px;
                    height: 40px;
                    line-height: 40px;
                    text-align: center;
                }
                >div:hover{
                    background:rgba(0,0,0,0.05) !important;
                    color: #409EFF;
                    text-align: center;
                }
            }
        }
        .topOptDiv:hover{
            color: #000;
            background: rgba(0,0,0,0.05);
        }
    }
    /deep/ .redMarkerIcon{
        width: 15px;
        height: 15px;
        border-radius: 50%;
        background: rgba(255,0,0,0.7);
        z-index: 402;
    }
    /deep/ .noContentMarkerIcon{
        width: 0px;
        height: 0px;
    }
    /deep/ .transparentIcon{
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: rgba(255,0,0);
        opacity: 0.1;
        z-index: 402;
    }
    /deep/ .markerTooltipSpan{
        color: #000;
    }
    /deep/ .tabMarkerIcon{
        i{
            font-size: 25px;
            color: rgba(255,0,0,0.7);
        }
    }
    /deep/ .collectMarkerIcon{
        i{
            font-size: 25px;
            color: rgb(138, 141, 39);
        }
    }
    // 标记点 popup
    /deep/ .markClickPopup{
        >.title{
            font-weight: 600;
            margin-bottom: 3px;
        }
        .my-button{
            background: #fff;
            border: 1px solid rgb(201, 196, 196);
            border-radius: 2px;
            cursor: pointer;
            padding: 3px 8px !important;
            font-size: 12px;
        }
        // 确定按钮
        .my-button:first-child{
            color: #409EFF;
        }

    }
}

</style>