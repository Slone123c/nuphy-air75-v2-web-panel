# NuPhy Air75 V2 WebHID Panel & Custom Battery Firmware

基于 [nuphy-src/qmk_firmware](https://github.com/nuphy-src/qmk_firmware) 的 **NuPhy Air75 V2 (ANSI)** 自定义固件与浏览器 **WebHID 可视化控制面板**。

## 功能亮点

### 1. 浏览器 WebHID 控制面板 (`web_panel/`)
- **免安装浏览器直连**：基于 Chromium WebHID（Google Chrome / Edge / Arc）直连键盘 QMK VIA Raw HID 接口（`19F5:3246`，`UsagePage 0xFF60`，`Usage 0x61`）。
- **实时状态与灯珠回读**：读取键盘电量百分比、充电状态、连接模式（USB / 2.4G / BT1-3）、Mac/Win 系统开关，并在网页端实时渲染左右两侧共 12 颗侧灯珠的硬件缓冲区画面。
- **侧灯与左右独立控制**：切换流光 / 光谱 / 常亮 / 呼吸 / 关闭模式、亮度（0–5）、速度（0–4）、彩虹流光、原厂单色预设，支持单独为左侧或右侧 6 颗灯珠指定自定义 RGB 颜色（保留 Caps Lock、无线配对与电量/系统提示的优先显示）。
- **电源与演示**：切换常驻电量条（`f_bat_hold`）、自动休眠开关（`sleep_enable`），支持在网页中一键触发红 / 黄 / 绿电量流光演示。
- **主键盘背光控制**：兼容 QMK VIA Channel 3，支持全部 41 种 RGB Matrix 灯效、亮度、速度与 HSV 色彩调节，支持一键将配置写入键盘 EEPROM 持久化。

### 2. 电量条与充电流光优化 (`firmware/`)
- **三段原厂预设配色**：
  - 低电量（`<= 20%`）：原厂纯红 `(0x80 >> 2, 0, 0)`，充电流光峰值取 `colour_lib[0]`（`{0xff, 0x00, 0x00}`）。
  - 中等电量（`21% ~ 60%`）：原厂纯黄 `(0x80 >> 2, 0x80 >> 2, 0)`，充电流光峰值取 `colour_lib[2]`（`{0xff, 0xff, 0x00}`）。
  - 高电量与满电（`> 60%`）：原厂纯绿 `(0, 0x80 >> 2, 0)`，充电流光峰值取 `colour_lib[3]`（`{0x00, 0xff, 0x00}`）。
- **连续自下而上充电流光**：采用原厂 `wave_data_tab` 伽马波表与 20ms 步进逻辑，已充灯格随波峰脉动，空余灯格在微弱灰底 `(8, 8, 8)` 上呈现自下而上涌动的光波。
- **快捷演示触发**：400ms 内快速双击 `Fn + \`（`BAT_SHOW`），或在浏览器面板点击演示按钮，即可播放 9.5 秒的红 / 黄 / 绿静态及充电流光演示。

## 目录结构

```text
nuphy-air75-v2-web-panel/
├── web_panel/
│   ├── index.html                           # WebHID 控制面板页面
│   ├── styles.css                           # 面板样式
│   ├── app.js                               # VIA Channel 0/3 WebHID 通信与实时回读
│   └── start_panel.command                  # macOS 本地服务一键启动脚本
├── firmware/
│   ├── air75_v2_custom_battery_via.patch    # 基于 nuphy-src/qmk_firmware (f185691) 的补丁
│   ├── keyboards/nuphy/air75_v2/ansi/
│   │   ├── ansi.c                           # VIA 自定义通道实现与双击 Fn+\ 演示触发
│   │   └── side.c                           # 三段原厂色电量条、充电流光与左右侧独立覆盖
│   └── releases/
│       └── nuphy_air75_v2_ansi_via_custom.bin
└── scripts/
    ├── apply_to_qmk.sh                      # 同步源码到本地 qmk_firmware
    └── flash_dfu.sh                         # 通过 dfu-util 刷写固件
```

## VIA 自定义通道协议 (`Channel 0`)

| `value_id` | 名称 | 权限 | 数据格式 |
| --- | --- | --- | --- |
| `1` | `ID_SIDE_MODE` | R/W | `[0..4]`（流光 / 光谱 / 常亮 / 呼吸 / 关闭） |
| `2` | `ID_SIDE_LIGHT` | R/W | `[0..5]` |
| `3` | `ID_SIDE_SPEED` | R/W | `[0..4]`（`0` 最快，`4` 最慢） |
| `4` | `ID_SIDE_RGB` | R/W | `[0/1]`（单色 / 彩虹） |
| `5` | `ID_SIDE_COLOUR` | R/W | `[0..8]`（对应 `colour_lib` 索引） |
| `6` | `ID_SLEEP_ENABLE` | R/W | `[0/1]` |
| `7` | `ID_BAT_HOLD` | R/W | `[0/1]` |
| `8` | `ID_BAT_DEMO` | R/W | `[0/1]`（写 `1` 触发演示） |
| `9` | `ID_DEV_STATUS` | R | `[bat%, rf_charge, link_mode, sys_sw_state, rf_state, demo_active]` |
| `10` | `ID_SIDE_CUSTOM_LEFT` | R/W | `[enable, r, g, b]` |
| `11` | `ID_SIDE_CUSTOM_RIGHT` | R/W | `[enable, r, g, b]` |
| `12` | `ID_SIDE_LEDS_LEFT` | R | 18 字节（`side_leds[0..5]` RGB） |
| `13` | `ID_SIDE_LEDS_RIGHT` | R | 18 字节（`side_leds[6..11]` RGB） |

## 快速开始

### 1. 刷入固件（USB DFU）

拔掉键盘 USB 线，**按住 `Esc` 键插线约 2 秒**进入 STM32 DFU 模式（`0483:df11`），然后执行：

```bash
./scripts/flash_dfu.sh
```

如需自行从源码编译，可将本仓库改动同步至 [nuphy-src/qmk_firmware](https://github.com/nuphy-src/qmk_firmware) 后编译：

```bash
./scripts/apply_to_qmk.sh ~/qmk_firmware
cd ~/qmk_firmware
make nuphy/air75_v2/ansi:via
```

### 2. 启动浏览器控制面板

WebHID 要求通过 `http://127.0.0.1`、`http://localhost` 或 `https://` 访问（不支持直接以 `file://` 打开）：

```bash
python3 -m http.server 19752 --bind 127.0.0.1 --directory ./web_panel
```

在 **Google Chrome / Edge / Arc** 中打开 `http://127.0.0.1:19752/`，点击右上角「连接键盘」并授权 `NuPhy Air75 V2` 即可使用。macOS 用户也可以直接运行或双击 `./web_panel/start_panel.command`。

## 注意事项
- WebHID 在线读写与实时控制需要 USB 有线连接；点击「保存到键盘」会将侧灯全局配置、休眠开关与主键盘背光写入 EEPROM，断电或切换 2.4G / 蓝牙后依然保留。
- 左右侧灯独立 RGB 覆盖状态保存在内存中，断电重启后会恢复为已保存的全局侧灯模式。

## 开源协议

本项目固件部分衍生自 [nuphy-src/qmk_firmware](https://github.com/nuphy-src/qmk_firmware)，整体遵循 **GNU General Public License v2.0**（见 [LICENSE](./LICENSE)）。
