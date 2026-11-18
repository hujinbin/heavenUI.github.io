<template>
  <DemoPanel title="地图区域与 GeoJSON" description="预生成数据展示，实际图片转换需运行 Python。点击区域可查看坐标并调整展示颜色。">
    <div class="geo-demo">
      <div class="geo-demo-map">
        <div class="geo-demo-toolbar" role="group" aria-label="地图展示方式">
          <button type="button" :class="{ active: !outlineOnly }" :aria-pressed="String(!outlineOnly)" @click="outlineOnly = false">区域着色</button>
          <button type="button" :class="{ active: outlineOnly }" :aria-pressed="String(outlineOnly)" @click="outlineOnly = true">轮廓样例</button>
        </div>
        <svg viewBox="0 0 1500 1500" class="geo-demo-svg" role="group" aria-label="四个区域组成的平面地图">
          <rect width="1500" height="1500" fill="#eef4f2" />
          <g v-for="region in regions" :key="region.id">
            <polygon
              :points="points(region)"
              :fill="outlineOnly ? '#ffffff' : colors[region.id]"
              :stroke="selectedId === region.id ? '#123c35' : outlineOnly ? '#354840' : '#ffffff'"
              :stroke-width="selectedId === region.id ? 15 : 8"
              stroke-linejoin="round"
              role="button"
              tabindex="0"
              :aria-label="'选择' + region.name"
              :aria-pressed="String(selectedId === region.id)"
              @click="selectedId = region.id"
              @keydown.enter.prevent="selectedId = region.id"
              @keydown.space.prevent="selectedId = region.id"
            />
            <text :x="region.label[0]" :y="region.label[1]" text-anchor="middle" dominant-baseline="middle">{{ region.name }}</text>
          </g>
        </svg>
        <p class="geo-demo-map-note">平面坐标 1500 × 1500 · Y 轴向下</p>
      </div>
      <div class="geo-demo-data">
        <div class="geo-demo-selection">
          <div>
            <strong>{{ selectedRegion.name }}</strong>
            <span>{{ selectedRegion.coordinates.length - 1 }} 个顶点，首尾闭合</span>
          </div>
          <label class="geo-demo-color">
            <span>区域颜色</span>
            <input v-model="colors[selectedId]" type="color" :aria-label="selectedRegion.name + '的颜色'">
          </label>
        </div>
        <label class="geo-demo-json-toggle">
          <input v-model="showCollection" type="checkbox">
          展示完整 FeatureCollection
        </label>
        <pre class="geo-demo-json" tabindex="0" aria-label="区域 GeoJSON 数据"><code>{{ jsonOutput }}</code></pre>
      </div>
    </div>
  </DemoPanel>
</template>

<script>
import DemoPanel from '../DemoPanel.vue';

// 小型固定样例保持图片轮廓与 GeoJSON 使用相同坐标，便于逐点核对。
const REGIONS = [
  { id: 'west', name: '西丘', label: [410, 570], coordinates: [[180, 380], [520, 180], [760, 500], [630, 780], [250, 850], [100, 640], [180, 380]] },
  { id: 'north', name: '北岭', label: [930, 380], coordinates: [[520, 180], [1020, 130], [1350, 430], [1100, 710], [760, 500], [520, 180]] },
  { id: 'east', name: '河谷', label: [1100, 900], coordinates: [[760, 500], [1100, 710], [1350, 430], [1420, 930], [1100, 1210], [810, 1000], [630, 780], [760, 500]] },
  { id: 'south', name: '南岸', label: [620, 1110], coordinates: [[250, 850], [630, 780], [810, 1000], [1100, 1210], [720, 1420], [340, 1200], [250, 850]] },
];

export default {
  components: { DemoPanel },
  data() {
    return {
      regions: REGIONS,
      selectedId: 'north',
      outlineOnly: false,
      showCollection: false,
      colors: { west: '#b9d7b0', north: '#79b9a8', east: '#edc989', south: '#c5bedc' },
    };
  },
  computed: {
    selectedRegion() {
      return this.regions.find(region => region.id === this.selectedId);
    },
    features() {
      return this.regions.map(region => ({
        type: 'Feature',
        properties: { name: region.name, color: this.colors[region.id] },
        geometry: { type: 'Polygon', coordinates: [region.coordinates] },
      }));
    },
    jsonOutput() {
      const value = this.showCollection
        ? { type: 'FeatureCollection', features: this.features }
        : this.features.find(feature => feature.properties.name === this.selectedRegion.name);
      return JSON.stringify(value, null, 2);
    },
  },
  methods: {
    points(region) {
      return region.coordinates.map(point => point.join(',')).join(' ');
    },
  },
};
</script>

<style scoped>
.geo-demo { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr); gap: 20px; }
.geo-demo-map { min-width: 0; background: #eef4f2; border: 1px solid #dce7e2; border-radius: 10px; overflow: hidden; }
.geo-demo-toolbar { display: flex; gap: 4px; padding: 12px; }
.geo-demo-toolbar button { border: 1px solid transparent; padding: 7px 12px; border-radius: 6px; background: transparent; color: #50675b; font: inherit; font-size: 13px; cursor: pointer; }
.geo-demo-toolbar button.active { background: #fff; border-color: #d6e2dc; color: #214d3d; }
.geo-demo-toolbar button:focus-visible, .geo-demo-svg polygon:focus-visible { outline: 3px solid #38856d; outline-offset: 3px; }
.geo-demo-svg { display: block; width: 100%; max-height: 280px; }
.geo-demo-svg polygon { cursor: pointer; transition: fill 160ms ease, stroke 160ms ease; }
.geo-demo-svg polygon:hover { stroke: #123c35; stroke-width: 15; }
.geo-demo-svg text { fill: #203d32; font-size: 62px; font-weight: 600; pointer-events: none; }
.geo-demo-map-note { margin: 10px 14px 14px; color: #687b71; font-size: 12px; text-align: center; }
.geo-demo-data { min-width: 0; }
.geo-demo-selection { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 15px; }
.geo-demo-selection strong { display: block; color: #243e33; font-size: 18px; }
.geo-demo-selection span { color: #65756e; font-size: 12px; }
.geo-demo-color { display: flex; gap: 7px; align-items: center; }
.geo-demo-color input { width: 35px; height: 30px; padding: 2px; border: 1px solid #d6e2dc; background: #fff; border-radius: 5px; cursor: pointer; }
.geo-demo-json-toggle { display: flex; align-items: center; gap: 6px; margin-bottom: 10px; font-size: 12px; color: #52695c; }
.geo-demo-json { box-sizing: border-box; height: 270px; margin: 0; padding: 16px; background: #142c26; color: #d8ece1; border-radius: 8px; font-size: 12px; line-height: 1.65; overflow: auto; }
.geo-demo-json code { padding: 0; color: inherit; background: transparent; font-size: inherit; }
@media (max-width: 620px) { .geo-demo { grid-template-columns: 1fr; } .geo-demo-svg { max-height: 260px; } .geo-demo-json { height: 220px; } }
@media (prefers-reduced-motion: reduce) { .geo-demo-svg polygon { transition: none; } }
</style>
