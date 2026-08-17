# EgoClip complete landing page

> GitHub 页面版本：`版本2` · 交付日期：2026-08-17 · 上一版本：`../版本1/`

这是一个可直接本地运行的 EgoClip 产品官网交付版。页面以用户提供的 Rhino、KeyShot 和 STL 工程为产品造型依据，将产品、原型制造、第一人称生活片段、穿戴方式、可见状态、授权原则、App 概念和早期访问表单串成 9 章完整叙事。

设计方案 HTML 仅作为信息与视觉参考，没有把其中的说明文字、占位素材或未确认商业承诺当成产品事实。`设计参考文件` 中的 PDF 未被读取。

## 本地预览

```bash
npm run dev
```

打开 `http://127.0.0.1:4173`。如需指定端口：

```bash
npm run dev -- --port 4174
```

页面没有远程运行时依赖；图片和视频均从 `public/media/` 本地加载。

## 验收

```bash
npm run check
npm test
```

`check` 会核对章节、媒体文件、运行时本地化、图片尺寸属性、视频 poster、授权记录、移动端断点、reduced-motion，以及 waitlist 的真实/预览边界。`test` 覆盖主要交互契约和未经确认的功能/收益声明。

## 素材与事实边界

- 产品主视觉是依据随附 3D 几何和 KeyShot 预览生成的概念渲染，不是量产实拍。
- 五种外壳图由同一产品图局部着色生成；页面明确标为材料方向，而非已发布配色。
- 两段视频和四张生活图片来自 Pexels，已压缩并本地化；作者、素材页、许可和处理记录见 `public/media/SOURCES.md`。
- 3D 打印镜头是制造氛围示意，并非 EgoClip 真实产线。
- 页面没有虚构续航、防水、分辨率、存储、无线连接或回报数字。
- App 和可见状态交互均明确标注为不连接设备、不会录制或发送数据的体验概念。

## Waitlist 接入

默认 `data-endpoint=""`，因此表单只做邮箱格式校验，并明确提示“没有发送或存储”。上线前把 `index.html` 中的表单改为真实 HTTPS JSON 端点：

```html
<form data-waitlist data-endpoint="https://example.com/api/waitlist" novalidate>
```

端点需接受：

```json
{
  "email": "you@example.com",
  "locale": "zh-CN",
  "source": "landing-page"
}
```

只有 HTTP 成功响应后，页面才会显示正式加入成功状态。

## 关键文件

- `index.html`：完整页面结构与产品文案
- `src/styles.css`：桌面、平板、手机与无动画模式
- `src/main.js`：导航、章节、配色、视频、状态、App 与表单交互
- `public/media/SOURCES.md`：运行时素材来源与授权记录
- `scripts/render-stl-assets.py`：STL 审图渲染工具
- `scripts/create-shell-variants.py`：外壳概念配色生成工具
- `scripts/validate.mjs`：交付契约检查
- `artifacts/previews/`：桌面与手机真实浏览器验收截图
