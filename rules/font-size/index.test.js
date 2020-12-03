const testRule = require('stylelint-test-rule-tape');

const rules = require('..');
const rule = rules['font-size'];
testRule(rule, {
  ruleName: rule.ruleName,
  config: [['./stylelint-vars-check/test/font-size.scss'], 'scss'],
  accept: [
    {
      code: 'a { font-size: $font-size-xl;}'
    },
    {
      code: 'a { padding: 16px;}'
    }
  ],

  reject: [
    {
      code: 'a { font-size: 14px; }',
      message: '14px 建议替换成 $font-size-base 变量 (vars/font-size-variables)'
    },
    {
      code: 'a { font-size: 16px; }',
      message: '16px 建议替换成 $font-size-base1 变量 (vars/font-size-variables)'
    },
    {
      code: 'a { font-size: 1rem; }',
      message: '1rem 建议替换成 $font-size-base2 变量 (vars/font-size-variables)'
    }
  ]
});

testRule(rule, {
  ruleName: rule.ruleName,
  config: [['./stylelint-vars-check/test/font-size.less'], 'less'],
  accept: [
    {
      code: 'a { font-size: @font-size-xl;}'
    },
    {
      code: 'a { padding: 16px;}'
    }
  ],

  reject: [
    {
      code: 'a { font-size: 14px; }',
      message: '14px 建议替换成 @font-size-base 变量 (vars/font-size-variables)'
    },
    {
      code: 'a { font-size: 16px; }',
      message: '16px 建议替换成 @font-size-base1 变量 (vars/font-size-variables)'
    },
    {
      code: 'a { font-size: 1rem; }',
      message: '1rem 建议替换成 @font-size-base2 变量 (vars/font-size-variables)'
    }
  ]
});
