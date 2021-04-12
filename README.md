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
// stylelint.config.js
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

> 注意：因为时间有限，font-size的匹配暂时只针对@font和$font前缀，之后将会交由用户自己输入
