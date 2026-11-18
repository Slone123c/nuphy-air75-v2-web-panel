# NuPhy Air75 V2 电量显示优化固件

基于 [nuphy-src/qmk_firmware](https://github.com/nuphy-src/qmk_firmware) 的 **NuPhy Air75 V2 (ANSI)** 自定义固件，只保留电量条与充电流光优化。

> 网页 WebHID 面板与 VIA 自定义通道（侧灯控制、状态回读等）已归档到 [`archive/web_via_panel/`](./archive/web_via_panel)，不再包含在当前固件中。

## 功能

- **三段原厂预设配色**：
  - 低电量（`<= 20%`）：纯红 `(0x80 >> 2, 0, 0)`，充电流光峰值取 `colour_lib[0]`。
  - 中等电量（`21% ~ 60%`）：纯黄 `(0x80 >> 2, 0x80 >> 2, 0)`，充电流光峰值取 `colour_lib[2]`。
  - 高电量与满电（`> 60%`）：纯绿 `(0, 0x80 >> 2, 0)`，充电流光峰值取 `colour_lib[3]`。
- **连续自下而上充电流光**：采用原厂 `wave_data_tab` 伽马波表与 20ms 步进，已充灯格随波峰脉动，空余灯格在微弱灰底 `(8, 8, 8)` 上呈现光波。
- **快捷演示**：400ms 内快速双击 `Fn + \`（`BAT_SHOW`），播放 9.5 秒的红 / 黄 / 绿静态及充电流光演示。

## 目录结构

```text
├── firmware/
│   ├── air75_v2_battery.patch               # 基于 nuphy-src/qmk_firmware (f185691) 的补丁
│   ├── keyboards/nuphy/air75_v2/ansi/{ansi.c,side.c}
│   └── releases/nuphy_air75_v2_ansi_battery.bin
├── scripts/{apply_to_qmk.sh,flash_dfu.sh}
└── archive/web_via_panel/                   # 已归档：WebHID 面板、VIA 通道固件与旧版 bin
```

## 刷入固件（USB DFU）

拔掉键盘 USB 线，**按住 `Esc` 键插线约 2 秒**进入 STM32 DFU 模式（`0483:df11`），然后执行：

```bash
./scripts/flash_dfu.sh
```

自行编译：

```bash
./scripts/apply_to_qmk.sh ~/qmk_firmware
cd ~/qmk_firmware
make nuphy/air75_v2/ansi:via
```

## 开源协议

本项目固件部分衍生自 [nuphy-src/qmk_firmware](https://github.com/nuphy-src/qmk_firmware)，整体遵循 **GNU General Public License v2.0**（见 [LICENSE](./LICENSE)）。
