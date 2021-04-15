const testRule = require('stylelint-test-rule-tape');

const rules = require('../..');
const rule = rules['main-check'];
// font测试
testRule(rule, {
  ruleName: rule.ruleName,
  config: [{ paths: ['./test/more.scss'], styleType: 'scss' }, {
    'severity': 'warning'
  }],
  reject: [
    {
      code: 'a { font-size: 16px; }',
      message: '16px 建议替换成 $font-size-1 变量\n16px 建议替换成 $btn-font-size-1 变量 (vars/check)'
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

// background测试
testRule(rule, {
  ruleName: rule.ruleName,
  config: [{ paths: ['./test/more.scss'], styleType: 'scss' }, {
    'severity': 'warning'
  }],
  reject: [
    {
      code: 'a { background-color: red; }',
      message: 'red 建议替换成 $bg-color-1 变量 (vars/check)'
    },
    {
      code: 'a {background-image: url("./../xx.png")}',
      message: 'url("./../xx.png") 建议替换成 $bg-img-1 变量 (vars/check)'
    },
    {
      code: 'a {background-repeat: no-repeat}',
      message: 'no-repeat 建议替换成 $bg-repeat 变量 (vars/check)'
    },
    {
      code: 'a {background-attachment: local, scroll}',
      message: 'local, scroll 建议替换成 $bg-attachment 变量 (vars/check)'
    },
    {
      code: 'a {background-position: bottom 10px right 20px}',
      message: 'bottom 10px right 20px 建议替换成 $bg-position 变量 (vars/check)'
    },
    {
      code: 'a {background-clip: border-box}',
      message: 'border-box 建议替换成 $bg-clip 变量\nborder-box 建议替换成 $bg-origin 变量 (vars/check)'
    },
    {
      code: 'a {background-origin: border-box}',
      message: 'border-box 建议替换成 $bg-clip 变量\nborder-box 建议替换成 $bg-origin 变量 (vars/check)'
    },
    {
      code: 'a {background-size: 30% 30%}',
      message: '30% 30% 建议替换成 $bg-size 变量 (vars/check)'
    },
    {
      code: "div {background: linear-gradient(rgba(0, 0, 255, 0.5), rgba(255, 255, 0, 0.5)), url('../../media/examples/lizard.png') 50% 50% / 30% 30% content-box}",
      message: 'linear-gradient(rgba(0, 0, 255, 0.5), rgba(255, 255, 0, 0.5)) , url("../../media/examples/lizard.png") 建议替换成 $bg-image 变量\n30% 30% 建议替换成 $bg-size 变量 (vars/check)'
    }
  ]
});

// block
testRule(rule, {
  ruleName: rule.ruleName,
  config: [{ paths: ['./test/more.scss'], styleType: 'scss' }, {
    'severity': 'warning'
  }],
  reject: [
    {
      code: 'a { letter-spacing: 3px; }',
      message: '3px 建议替换成 $letter-spacing 变量 (vars/check)'
    },
    {
      code: 'a { text-align: left; }',
      message: 'left 建议替换成 $text-align 变量 (vars/check)'
    },
    {
      code: 'a { text-indent: 15%; }',
      message: '15% 建议替换成 $text-indent 变量 (vars/check)'
    },
    {
      code: 'a { vertical-align: middle; }',
      message: 'middle 建议替换成 $vertical-align 变量 (vars/check)'
    },
    {
      code: 'a { word-spacing: 3px; }',
      message: '3px 建议替换成 $word-spacing 变量 (vars/check)'
    },
    {
      code: 'a { display: flex; }',
      message: 'flex 建议替换成 $display 变量 (vars/check)'
    },
  ]
});

// bpx
testRule(rule, {
  ruleName: rule.ruleName,
  config: [{ paths: ['./test/more.scss'], styleType: 'scss' }, {
    'severity': 'warning'
  }],
  reject: [
    {
      code: 'a { width: 2px; }',
      message: '2px 建议替换成 $width 变量 (vars/check)'
    },
    {
      code: 'a { height: 10px; }',
      message: '10px 建议替换成 $height 变量 (vars/check)'
    },
    {
      code: 'a { padding: 20px; }',
      message: '20px 建议替换成 $padding 变量 (vars/check)'
    },
    {
      code: 'a { float: left; }',
      message: 'left 建议替换成 $float 变量 (vars/check)'
    },
    {
      code: 'a { margin: 20px; }',
      message: '20px 建议替换成 $margin 变量 (vars/check)'
    }
  ]
});

// border
testRule(rule, {
  ruleName: rule.ruleName,
  config: [{ paths: ['./test/more.scss'], styleType: 'scss' }, {
    'severity': 'warning'
  }],
  reject: [
    {
      code: 'a { border: 2px; }',
      message: '2px 建议替换成 $border 变量 (vars/check)'
    },
    {
      code: 'a { position: absolute; }',
      message: 'absolute 建议替换成 $position 变量 (vars/check)'
    },
    {
      code: 'a { clip: rect(1px, 10em, 3rem, 2ch); }',
      message: 'rect(1px, 10em, 3rem, 2ch) 建议替换成 $clip 变量 (vars/check)'
    },
  ]
});


// // 测试ruleConfig replace方案
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
