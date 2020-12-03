# stylelint-vars-check

> 利用stylelint检查sass,less变量，并通过vscode stylelint插件，webStorm stylelint插件进行提示

## 使用

> 注意：因为时间有限，font-size的匹配暂时只针对@font和$font前缀，之后将会交由用户自己输入

```
// stylelint.config.js / .stylelint.json
    {
        plugins: ['stylelint-vars-check'],
        rules: {
            'vars/font-size-variables': [
                ['../src/styles/font-size.less'], 
                {
                    "severity": "warning" // 警告或者错误自己选择
                }
            ],
            'vars/color-variables': [
                ['../src/styles/color.less'], 
                {
                    "severity": "warning"
                }
            ],
        }
    }
```
