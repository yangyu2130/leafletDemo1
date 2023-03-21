<template>
    <div>
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
    data() {
        return {
            map: null
        }
    },
    mounted() {
        this.init()
    },
    methods: {
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
            })
            // 百度地图图层
            var baiduDTlayer = L.tileLayer.wms(
                "http://localhost:8080/geoserver/hangzhou/wms",{
                    layers: 'hangzhou:baiduDT15',
                }
            )
            // 百度路网图层
            var baiduLWlayer = L.tileLayer.wms(
                "http://localhost:8080/geoserver/hangzhou/wms",{
                    layers: 'hangzhou:baiduLW15',
                }
            )
            // 百度影像图层
            var baiduYXlayer = L.tileLayer.wms(
                "http://localhost:8080/geoserver/hangzhou/wms",{
                    layers: 'hangzhou:baiduYX15',
                }
            ).addTo(this.map)
            // 新增标记点
            var point1 = L.marker([29.5,120]).bindPopup('这里是北京')
            var cities = L.layerGroup([point1])
            //新建图层控件的数据源-地图
            var baseLayers = {
                '百度地图图层': baiduDTlayer,
                '百度路网图层': baiduLWlayer,
                '百度影像图层': baiduYXlayer,
            };
    
            // 新建图层控件的数据源-城市
            var overlays = {
                '城市': cities
            };
            this.map.setView([30.105,120.42320251464845],12)
            //新建图层控件并添加到地图
            var aa = L.control.layers(baseLayers, overlays,{
                position: 'topright'
            }).addTo(this.map)
        },
        setView() {
            this.map.setView([30,120],13)
        },
        flyTo() {
            this.map.setView([30,120],13)
        },
        reset() {
            this.map.setView([30,120],10)
        },
        test() {
            this.map.setZoomAround([30,120],13)
        }
    },
}
</script>
<style scoped>
#map{
    height: 90vh;
    width: 90vw;
    overflow: hidden;
}
</style>