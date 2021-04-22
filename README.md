# stylelint-vars-check

> Use stylelint to check sass and less variables, and prompt through the stylelint plugin

[*English*]() | [中文](./README_zh.md)

## When to use

Assumption: Extract common SCSS variables from a project and place them in vars.scss

```text
$color-1: #fff;
$color-2: #f2f2f2;
$color-3: #333;
...
$font-base: 16px;
$font-sm: 14px;
...
```

Do you ever forget the name of the variable with the value #f2f2f2 when you use it? If that's a problem, then this plugin fits your needs.

## How to use

`vars/check`：For all variables in the specified file

`vars/color-variables`: Only for variables in the specified file that involve colors（It is a complement to the vars/check rule and is recommended to be used together or separately if the project is only for color variables）

```javascript
// stylelint.config.js
    module.exports = {
        plugins: ['stylelint-vars-check'],
        rules: {
            'vars/check': [
              {
                paths: ['./src/styles/variables.less'],
                styleType: 'less',
                ruleConfig: { 'font-size': ['font'] } // Optional to overwrite or add a variable that matches a different CSS. See the following section for details: How to match?
              },
              {
                severity: 'warning',
              },
            ],
            'vars/color-variables': [
                {
                  paths: ['./src/styles/variables.less'],
                  styleType: 'less',
                  // Note: that color-variables do not include the ruleConfig configuration
                },
                {
                    "severity": "warning"
                }
            ],
        }
    }
```

## How to match ?

In the `vars/check` rule, the first step is to use the regex to find the variables corresponding to each CSS, such as: `font-size:['font-size, 'font']` into regular `/^([$@])(\S)*font-size/ | /^([$@])(\S)*font/`,
then collect all the relevant values from vars.scss and store them in a Map. When matched to the corresponding CSS style name, it determines if the value is already a variable. If it is not, it will find an equivalent variable in the Map and report it.

Because I will assume the variable name that each CSS style name may write, there will be some cases of failure to match under special nouns, so the option is provided for users to customize the matching value of relevant CSS styles. The reference code is as follows:
```javascript
// 1. ruleConfig: { 'font-size': ['test'] }，the default values will be overridden directly
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
// 2. {'font-size': {value: ['font'], mergeRule: 'replace | append | prepend'}}
// append and prepend is all added, the difference is that the sequence matches the order of the query
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

## Support matching CSS styles(vars/check)

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

