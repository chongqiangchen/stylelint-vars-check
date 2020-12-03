const testRule = require('stylelint-test-rule-tape')

const rules = require('..')
const rule = rules['color-variables']
testRule(rule, {
  ruleName: rule.ruleName,
  config: [['./stylelint-vars-check/test/color.less'], {
    severity: 'warning'
  }],
  accept: [
    {
      code: 'a { color: @gray-5; }'
    },
  ],

  reject: [
    {
      code: 'a { color: #505050; }',
      message: '#505050 建议替换成 @gray-5 变量 (vars/color-variables)'
    },
    {
      code: 'a { color: #d7d7d8; }',
      message: '#d7d7d8 建议替换成 @gray-8 变量 (vars/color-variables)'
    }

  ]
})