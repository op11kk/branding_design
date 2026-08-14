---
name: composable-component-api
description: 为复杂 React 组件建立可扩展、可维护且不依赖布尔参数堆叠的 API。
---

# 可组合组件 API

## 工作流

1. 识别不断增长的 boolean prop、render prop 和彼此耦合的状态。
2. 用明确的 variant 组件或 compound component 取代含义不清的开关。
3. 将共享状态提升到 provider，使兄弟组件通过清晰的状态/动作接口协作。
4. 优先使用 `children` 组合布局，不让组件调用方被一长串配置参数锁死。
5. 为不同组合写出示例和行为测试。

## 验收

- 新需求能通过组合加入，而不是继续增加 boolean prop；
- 状态归属单一、可追踪；
- 调用方能从组件结构理解页面层级。
