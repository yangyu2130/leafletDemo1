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
            <div class="topOptDiv" @click="optshowClick">显示
                <i class="el-icon-arrow-down"></i>
            </div>
            <div class="topOptDiv optToolDiv" @click="optToolClick">工具箱
                <div v-if="optToolVif" class="optTool">
                    <!-- 工具箱 包含: 测距 标记 收藏 点亮 绘制图形 -->
                    <!-- 测距 -->
                    <div class="distanceDiv" @click="distanceClick">
                        <i class="el-icon-paperclip"></i>
                        测距
                    </div>
                    <div class="markDiv" @click="markClick">
                        <i class="el-icon-location-outline"></i>
                        标记
                    </div>
                    <div class="collectDiv" @click="collectClick">
                        <i class="el-icon-star-off"></i>
                        收藏
                    </div>
                    <div class="lightDiv" @click="lightClick">
                        <i class="el-icon-s-opportunity"></i>
                        点亮
                    </div>
                    <div class="drawDiv" @click="drawClick">
                        <i class="el-icon-news"></i>
                        绘制图形
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
            }
        }
    },
    mounted() {
        this.init()
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
            console.log(this.map);
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
            console.log(this.map);
        },
        flyTo() {
            this.map.setView([30,120],13)
        },
        reset() {
            this.map.setView([30,120],10)
        },
        test() {
            console.log(this.map.getCenter());
        },
        // 点击 图层切换
        optLayerClick(e) {
            console.log(e.target.className.includes('optLayerDiv'));
            if(e.target.className === 'el-icon-arrow-up' || e.target.className.includes('optLayerDiv')) {
                this.optLayerVif = !this.optLayerVif
            }
        },
        optshowClick() {
            
        },
        // 点击工具箱
        optToolClick(e) {
            if(e.target.className === 'el-icon-arrow-up' || e.target.className.includes('optToolDiv')) {
                this.optToolVif = !this.optToolVif
            }
        },
        // 工具箱 点击测绘
        distanceClick() {
            // 点击测绘, 开始测绘事件
            this.distanceFun(0)
        },
        distanceFun(time) {
            // 用time来记录点击点数
            let that = this
            var myIcon = L.divIcon({className: 'myMarkerIcon'});
            this.map.on('click', function(e){
                const data = [e.latlng.lat*1,e.latlng.lng*1]
                if(time == 0) {
                    const aa =  L.marker(data,{
                        icon: myIcon,
                    }).addTo(that.map)
                    aa.bindTooltip(`<span class="markerTooltipSpan">起点</span>`,{
                        permanent: true,
                        offset: [10,0]
                    }).openTooltip();
                    // aa.bindPopup(`<span>aaa</span>`).openPopup();
                }
            });
        },
        // 工具箱 点击标记
        markClick() {
            
        },
        // 工具箱 点击收藏
        collectClick() {
            
        },
        // 工具箱 点亮
        lightClick() {

        },
        // 工具箱 绘制图形
        drawClick() {

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
                    background:rgba(0,0,0,0.05) !important;
                    color: #409EFF;
                    text-align: center;
                }
            }
        }
    }
    /deep/ .myMarkerIcon{
        width: 15px;
        height: 15px;
        border-radius: 50%;
        background: rgba(255,0,0,0.7);
        z-index: 402;
    }
    /deep/ .markerTooltipSpan{
        color: #000;
    }
}

</style>