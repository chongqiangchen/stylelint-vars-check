# stylelint-vars-check

> 利用stylelint检查sass,less变量，通过stylelint插件进行提示

[English](./README.md) | [*中文*]()

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

`vars/check`： 针对指定文件中所有变量
`vars/color-variables`: 仅针对文件中涉及颜色的变量（是对vars/check规则的弥补，建议一起使用，若项目仅针对颜色变量也可以单独使用此规则）

```javascript
// stylelint.config.js
    module.exports = {
        plugins: ['stylelint-vars-check'],
        rules: {
            'vars/check': [ // 针对全部变量
              {
                paths: ['./src/styles/variables.less'],
                styleType: 'less',
                ruleConfig: { 'font-size': ['font'] } // 可选填，用于覆盖或增加对不同css匹配的变量，具体可看下面部分： 是怎么匹配的呢？
              },
              {
                severity: 'warning',
              },
            ],
            'vars/color-variables': [ // 仅针对变量值和css样式值为颜色的校验
                {
                  paths: ['./src/styles/variables.less'],
                  styleType: 'less',
                  // 注意color-variables并不包含ruleConfig配置，因为不需要
                },
                {
                    "severity": "warning"
                }
            ],
        }
    }
```

## 是怎么匹配的呢？
`vars/check`规则中，首先会根据支持css样式中对应可能的匹配正则，如：`font-size: ['font-size', 'font']`，会收集variable.scss中所有`/^([$@])(\S)*font-size/ | /^([$@])(\S)*font/`相关的值存放到一个集合中，
然后在匹配到对应css样式名时，会判断值是否已经是变量，若不是，则会在先前收集的集合中找到value相等的变量，并报告出来。

由于我会假想css每个样式名可能书写的变量名，所以会存在特殊名词下无法匹配成功的情况，故提供选项可供用户自定义相关css样式匹配的值，参考代码如下：

```javascript
// 1. 若直接书写ruleConfig: { 'font-size': ['test'] }，将会直接覆盖插件本身对font-size中的匹配值['font-size', 'font']
 rules: {
  'vars/check': [
    {
      paths: ['./src/styles/variables.less'],
      styleType: 'less',
      ruleConfig: { 'font-size': ['test'] }
    },
    {
      severity: 'warning',
    },
  ]
 }
// 2. 若仅仅只是增加，并非覆盖 {'font-size': {value: ['font'], mergeRule: 'replace | append | prepend'}}
// append和prepend都是添加，区别在于先后匹配查询的顺序
rules: {
  'vars/check': [
    {
      paths: ['./src/styles/variables.less'],
      styleType: 'less',
      ruleConfig: {'font-size': {value: ['test'], mergeRule: 'append'}}
    },
    {
      severity: 'warning',
    },
  ]
}
```

## 支持的相关CSS样式匹配程度(针对vars/check规则)

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

- [x] letter-spacing
- [x] text-align
- [x] text-indent 缩进
- [x] vertical-align
- [x] word-spacing
- [x] display

*box*

- [x] width
- [x] height
- [x] padding(top, right, bottom, left)
- [x] float
- [x] margin(top, right, bottom, left)

*border*

- [x] border
- [ ] border-style
- [ ] border-width
- [ ] border-color

*position*

- [x] position(left, right, bottom, top)
- [x] clip

