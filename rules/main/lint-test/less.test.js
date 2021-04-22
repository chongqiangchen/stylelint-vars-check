const testRule = require('stylelint-test-rule-tape');

const rules = require('../..');
const { getMsgCnt } = require('../../../utils/common');
const rule = rules['main-check'];

// font test
testRule(rule, {
  ruleName: rule.ruleName,
  config: [{ paths: ['./test/more.less'], styleType: 'less' }, {
    'severity': 'warning'
  }],
  reject: [
    {
      code: 'a { font-size: 16px; }',
      message: `${getMsgCnt('16px', '@font-size-1')}\n${getMsgCnt('16px', '@btn-font-size-1')} (vars/check)`
    },
    {
      code: 'a { font-style: oblique; }',
      message: `${getMsgCnt('oblique', '@font-style')} (vars/check)`
    },
    {
      code: 'a {line-height: 2px}',
      message: `${getMsgCnt('2px', '@line-height-base')} (vars/check)`
    },
    {
      code: 'a {font-weight: 200}',
      message: `${getMsgCnt('200', '@font-weight-base')} (vars/check)`
    },
    {
      code: 'a {font-variant: small-caps slashed-zero;}',
      message: `${getMsgCnt('small-caps slashed-zero', '@font-variant')} (vars/check)`
    },
    {
      code: 'a {text-transform: uppercase}',
      message: `${getMsgCnt('uppercase', '@txt-transform')} (vars/check)`
    },
    {
      code: 'p {text-decoration: green wavy underline}',
      message: `${getMsgCnt('green wavy underline', '@wavy-line')} (vars/check)`
    }
  ]
})

// background test
testRule(rule, {
  ruleName: rule.ruleName,
  config: [{ paths: ['./test/more.less'], styleType: 'less' }, {
    'severity': 'warning'
  }],
  reject: [
    {
      code: 'a { background-color: red; }',
      message: `${getMsgCnt('red', '@bg-color-1')} (vars/check)`
    },
    {
      code: 'a {background-image: url("./../xx.png")}',
      message: `${getMsgCnt('url("./../xx.png")', '@bg-img-1')} (vars/check)`
    },
    {
      code: 'a {background-repeat: no-repeat}',
      message: `${getMsgCnt('no-repeat', '@bg-repeat')} (vars/check)`
    },
    {
      code: 'a {background-attachment: local, scroll}',
      message: `${getMsgCnt('local, scroll', '@bg-attachment')} (vars/check)`
    },
    {
      code: 'a {background-position: bottom 10px right 20px}',
      message: `${getMsgCnt('bottom 10px right 20px', '@bg-position')} (vars/check)`
    },
    {
      code: 'a {background-clip: border-box}',
      message: `${getMsgCnt('border-box', '@bg-clip')}\n${getMsgCnt('border-box', '@bg-origin')} (vars/check)`
    },
    {
      code: 'a {background-origin: border-box}',
      message: `${getMsgCnt('border-box', '@bg-clip')}\n${getMsgCnt('border-box', '@bg-origin')} (vars/check)`
    },
    {
      code: 'a {background-size: 30% 30%}',
      message: `${getMsgCnt('30% 30%', '@bg-size')} (vars/check)`
    },
    {
      code: "div {background: linear-gradient(rgba(0, 0, 255, 0.5), rgba(255, 255, 0, 0.5)), url('../../media/examples/lizard.png') 50% 50% / 30% 30% content-box}",
      message: `${getMsgCnt('linear-gradient(rgba(0, 0, 255, 0.5), rgba(255, 255, 0, 0.5)) , url("../../media/examples/lizard.png")', '@bg-image')}\n${getMsgCnt('30% 30%', '@bg-size')} (vars/check)`
    }
  ]
});


// block test
testRule(rule, {
  ruleName: rule.ruleName,
  config: [{ paths: ['./test/more.less'], styleType: 'less' }, {
    'severity': 'warning'
  }],
  reject: [
    {
      code: 'a { letter-spacing: 3px; }',
      message: `${getMsgCnt('3px', '@letter-spacing')} (vars/check)`
    },
    {
      code: 'a { text-align: left; }',
      message: `${getMsgCnt('left', '@text-align')} (vars/check)`
    },
    {
      code: 'a { text-indent: 15%; }',
      message: `${getMsgCnt('15%', '@text-indent')} (vars/check)`
    },
    {
      code: 'a { vertical-align: middle; }',
      message: `${getMsgCnt('middle', '@vertical-align')} (vars/check)`
    },
    {
      code: 'a { word-spacing: 3px; }',
      message: `${getMsgCnt('3px', '@word-spacing')} (vars/check)`
    },
    {
      code: 'a { display: flex; }',
      message: `${getMsgCnt('flex', '@display')} (vars/check)`
    },
  ]
});

// box test
testRule(rule, {
  ruleName: rule.ruleName,
  config: [{ paths: ['./test/more.less'], styleType: 'less' }, {
    'severity': 'warning'
  }],
  reject: [
    {
      code: 'a { width: 2px; }',
      message: `${getMsgCnt('2px', '@width')} (vars/check)`
    },
    {
      code: 'a { height: 10px; }',
      message: `${getMsgCnt('10px', '@height')} (vars/check)`
    },
    {
      code: 'a { padding: 20px; }',
      message: `${getMsgCnt('20px', '@padding')} (vars/check)`
    },
    {
      code: 'a { float: left; }',
      message: `${getMsgCnt('left', '@float')} (vars/check)`
    },
    {
      code: 'a { margin: 20px; }',
      message: `${getMsgCnt('20px', '@margin')} (vars/check)`
    }
  ]
});

// border test
testRule(rule, {
  ruleName: rule.ruleName,
  config: [{ paths: ['./test/more.less'], styleType: 'less' }, {
    'severity': 'warning'
  }],
  reject: [
    {
      code: 'a { border: 2px; }',
      message: `${getMsgCnt('2px', '@border')} (vars/check)`
    },
    {
      code: 'a { position: absolute; }',
      message: `${getMsgCnt('absolute', '@position')} (vars/check)`
    },
    {
      code: 'a { clip: rect(1px, 10em, 3rem, 2ch); }',
      message: `${getMsgCnt('rect(1px, 10em, 3rem, 2ch)', '@clip')} (vars/check)`
    },
  ]
});


// ruleConfig replace test
testRule(rule, {
  ruleName: rule.ruleName,
  config: [{ paths: ['./test/more.less'], styleType: 'less', ruleConfig: { 'font-size': ['test'] } }, {
    'severity': 'warning'
  }],
  accept: [
    {
      code: 'a { font-size: 14px; }',
    }
  ],
});
