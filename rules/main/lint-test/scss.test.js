const testRule = require('stylelint-test-rule-tape');

const rules = require('../..');
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
      code: 'a { padding: 16px;background: #fff center/contain;}'
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
    {
      code: 'a {line-height: 2px}',
      message: '2px 建议替换成 $line-height-base 变量 (vars/check)'
    }
  ]
});

// font测试
testRule(rule, {
  ruleName: rule.ruleName,
  config: [{ paths: ['./test/more.scss'], styleType: 'scss' }, {
    'severity': 'warning'
  }],
  reject: [
    {
      code: 'a { font-size: 16px; }',
      message: '16px 建议替换成 $font-size-1 变量 (vars/check)'
    },
    {
      code: 'a { font-style: oblique; }',
      message: 'oblique 建议替换成 $font-style 变量 (vars/check)'
    },
    {
      code: 'a {line-height: 2px}',
      message: '2px 建议替换成 $line-height-base 变量 (vars/check)'
    },
    {
      code: 'a {font-weight: 200}',
      message: '200 建议替换成 $font-weight-base 变量 (vars/check)'
    },
    {
      code: 'a {font-variant: small-caps slashed-zero;}',
      message: 'small-caps slashed-zero 建议替换成 $font-variant 变量 (vars/check)'
    },
    {
      code: 'a {text-transform: uppercase}',
      message: 'uppercase 建议替换成 $txt-transform 变量 (vars/check)'
    },
    {
      code: 'p {text-decoration: green wavy underline}',
      message: 'green wavy underline 建议替换成 $wavy-line 变量 (vars/check)'
    }
  ]
})

// 测试ruleConfig replace方案
testRule(rule, {
  ruleName: rule.ruleName,
  config: [{ paths: ['./test/more.scss'], styleType: 'scss', ruleConfig: { 'font-size': ['test'] } }, {
    'severity': 'warning'
  }],
  accept: [
    {
      code: 'a { font-size: 14px; }',
    }
  ],
});
