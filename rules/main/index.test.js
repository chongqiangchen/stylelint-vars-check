const testRule = require('stylelint-test-rule-tape');

const rules = require('..');
const rule = rules['main-check'];
testRule(rule, {
  ruleName: rule.ruleName,
  config: [{ paths: ['./test/more.scss'], styleType: 'scss' }, {
    'severity': 'warning'
  }],
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
      code: 'a { height: 16px; }',
      message: '16px 建议替换成 $ht-size-1 变量 (vars/check)'
    },
    {
      code: 'a { font-size: 14px; }',
      message: '14px 建议替换成 $font-size-base 变量 (vars/check)'
    },
  ]
});


testRule(rule, {
  ruleName: rule.ruleName,
  config: [{ paths: ['./test/more.less'], styleType: 'less' }, {
    'severity': 'warning'
  }],
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
      code: 'a { height: 16px; }',
      message: '16px 建议替换成 @ht-size-1 变量 (vars/check)'
    },
    {
      code: 'a { font-size: 14px; }',
      message: '14px 建议替换成 @font-size-base 变量 (vars/check)'
    },
  ]
});
