---
name: reduced-motion-and-animation-performance
description: 让动效尊重用户偏好，并在低性能设备上保持流畅。
---

# 低动效与动效性能

## 工作流

1. 优先动画化 `transform` 与 `opacity`，避免持续修改布局属性。
2. 为 `prefers-reduced-motion: reduce` 提供静态或更短的替代方案。
3. 把动效集中在关键时刻：首次进入、明确状态切换或结构变化。
4. 检查长列表、低端手机和滚动时是否掉帧；移除与理解无关的动效。

## 验收

- 减少动效模式下内容仍易于理解；
- 动效没有导致布局抖动或焦点丢失；
- 滚动与输入在动画期间依然响应。
