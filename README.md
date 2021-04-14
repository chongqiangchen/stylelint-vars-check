# stylelint-vars-check

> 利用stylelint检查sass,less变量，并通过vscode stylelint插件，webStorm stylelint插件进行提示

## 作用

在一个项目中大部分会考虑到单独抽出公用的less,sass变量，如下：

```text
// 假设这个文件是vars.scss
$color-1: #000;
$color-2: #001;
$color-3: #002;
...

$font-base: 16px;
$font-sm: 14px;
...
```

那么在使用的时候，你是否会有遇见过突然忘了这个#001的颜色在vars.scss叫啥名字？如果觉得这是个问题，那么这个插件符合你的需求。

## 使用

```text
// stylelint.store.js
    {
        plugins: ['stylelint-vars-check'],
        rules: {
            'vars/font-size-variables': [
                {
                    paths: ['./src/styles/font-size.less'],  // 你的变量文件路径
                    styleType: 'less'  // 或者'scss'
                },
                {
                    "severity": "warning" // 警告或者错误自己选择
                }
            ],
            'vars/color-variables': [
                {
                   paths: ['./src/styles/color.less'],
                   styleType: 'less'
                },
                {
                    "severity": "warning"
                }
            ],
        }
    }
```

## 预发布功能：

1. 新增全变量匹配（除color相关，继续使用之前处理方案）功能，只需要提供一个less/sass变量文件，即可在全局相对应的地方提示
2. 重构font-size匹配，合并到全变量匹配中

## 支持的CSS样式

*font*

- [x] font-size
- [x] font-style
- [x] line-height
- [x] font-weight
- [x] font-variant
- [x] text-transform
- [x] text-decoration
- [x] font-family

*background*

- [x] background
- [x] background-color
- [x] background-image
- [x] background-repeat
- [x] background-attachment
- [x] background-position
- [x] background-clip
- [x] background-origin
- [x] background-size

*block*

- [ ] letter-spacing
- [ ] text-align
- [ ] text-indent 缩进
- [ ] vertical-align
- [ ] word-spacing
- [ ] display

*box*

- [ ] width
- [x] height
- [ ] padding(top, right, bottom, left)
- [ ] float
- [ ] margin(top, right, bottom, left)

*border*

- [ ] border
- [ ] border-style
- [ ] border-width
- [ ] border-color

*list*

- [ ] list-style-type
- [ ] list-style-position
- [ ] list-style-image

*position*

- [ ] position(left, right, bottom, top)
- [ ] visibility
- [ ] overflow
- [ ] clip

