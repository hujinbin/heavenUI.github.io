# png-convert-GeoJSON

将地图图片中的轮廓提取为多边形，输出 GeoJSON `FeatureCollection`。适用于手绘地图、游戏地图和示意图的区域描边，可用于后续地图展示、区域着色或点击交互的数据准备。[源码仓库](https://github.com/hujinbin/png-convert-GeoJSON)

项目入口为 Python 脚本 `main.py`，使用 OpenCV 检测轮廓、Shapely 校验多边形、geojson 写入文件。当前输入路径为项目根目录的 `map.jpg`，输出路径为同目录的 `mapData.json`。

## 页内演示

<ClientOnly>
  <demos-GeoJson />
</ClientOnly>

## 安装

以下步骤使用 Python 3.11 验证。拉取项目后安装脚本所需依赖。

```bash
git clone https://github.com/hujinbin/png-convert-GeoJSON.git
cd png-convert-GeoJSON
python -m pip install opencv-python numpy shapely geojson
```

脚本使用的 `Polygon` 来自 `shapely.geometry`，上面列出的依赖已覆盖源码导入。

## 快速使用

1. 将待处理地图保存为项目根目录下的 `map.jpg`。优先选择轮廓清晰、前景与背景对比明显的图片。
2. 在项目根目录执行脚本。
3. 打开生成的 `mapData.json`，检查区域数量、边界和属性。

```bash
python main.py
```

处理其他文件名或 PNG 图片时，修改 `main.py` 的读取路径，再执行脚本。

```python
# 以灰度方式读取实际输入图片
img = cv2.imread('map.png', 0)
```

## 处理过程

| 步骤 | 当前行为 |
| --- | --- |
| 图像读取 | 以灰度模式读取 `map.jpg` |
| 二值化 | 使用高斯自适应阈值，邻域大小为 11，常量为 2 |
| 轮廓提取 | 使用 `RETR_TREE` 和 `CHAIN_APPROX_SIMPLE` 查找轮廓 |
| 轮廓简化 | 使用轮廓周长的 1% 作为 `approxPolyDP` 精度 |
| 坐标缩放 | X、Y 分别按图片宽高缩放到 1500 × 1500 的坐标范围 |
| 多边形检查 | 补充首尾闭合点，保留 Shapely 判定有效的多边形 |
| 文件导出 | 每个有效多边形写为一个 Feature，汇总到 `mapData.json` |

横纵方向分别缩放，非正方形图片也会映射到 1500 × 1500。Y 轴沿图像方向向下增长，输出使用图片平面坐标。接入需要经纬度的地图系统时，应根据地图控制点另行完成地理配准与坐标转换。[转换脚本](https://github.com/hujinbin/png-convert-GeoJSON/blob/main/main.py)

## 案例　生成游戏地图的区域数据

准备一张黑白游戏区域图，将每个区域绘制为清晰闭合边界，保存为 `map.jpg`。执行 `python main.py` 后，使用下面代码检查生成结果。

```python
import json

with open('mapData.json', encoding='utf-8') as file:
    data = json.load(file)

print(data['type'])
print('区域数量', len(data['features']))

if data['features']:
    first = data['features'][0]
    print('区域属性', first['properties'])
    print('边界坐标', first['geometry']['coordinates'][0])
```

输出的顶层类型为 `FeatureCollection`，`features` 中保存有效区域。以下结构用于说明单个区域的字段，坐标与数量由输入图像决定。

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [[150, 150], [450, 150], [450, 450], [150, 450], [150, 150]]
        ]
      },
      "properties": {
        "name": "1",
        "ID_0": 102,
        "ID_1": 1,
        "ISO": "HKG"
      }
    }
  ]
}
```

`name` 和 `ID_1` 由轮廓序号生成，序号可能因无效轮廓被过滤而不连续。`ID_0=102` 和 `ISO=HKG` 是源码中的固定示例值，接入游戏地图时应按自己的区域模型修改，再添加区域名称、阵营或颜色等业务属性。

## 调整与排查

- 输入与输出文件名、1500 × 1500 的目标大小、阈值参数和属性都在 `main.py` 中设置。运行前确认工作目录和读取路径一致。
- 文件无法读取时，`cv2.imread` 返回 `None`，随后读取 `img.shape` 会报错。先检查文件是否存在以及 OpenCV 能否读取该格式。
- 边界缺失或噪声较多时，检查图片对比度，并调整阈值参数与轮廓简化精度。当前脚本没有按面积过滤轮廓。
- `RETR_TREE` 会检测嵌套轮廓，但当前循环将每条有效轮廓独立导出为 Polygon。存在岛屿、孔洞或多层区域时，需要结合轮廓层级完善区域关系。
- `mapData.json` 每次运行都会重新写入。确认最终边界后，再用于区域展示与交互。

项目中的输入示例可用于首次运行验证。该图片尺寸为 3200 × 3600，使用当前脚本与 OpenCV 5.1.0 验证得到 70810 个有效 Polygon，输出文件约 21.8 MB。图片细节会带来大量小轮廓，接入展示前应检查区域数量和边界，按业务需要补充面积过滤。[示例图片](https://github.com/hujinbin/png-convert-GeoJSON/blob/main/map.jpg)
