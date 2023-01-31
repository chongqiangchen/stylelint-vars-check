const testRule = require('stylelint-test-rule-tape');

const rules = require('..');
const { getMsgCnt } = require('../../utils/common');
const rule = rules['color-check'];
testRule(rule, {
  ruleName: rule.ruleName,
  config: [
    { paths: ['./test/color.less'], styleType: 'less' },
    {
      severity: 'warning'
    }
  ],
  accept: [
    {
      code: 'a { color: @gray-5; }'
    }
  ],

  reject: [
    {
      code: 'a { color: #505050; }',
      message: `${getMsgCnt('#505050', '@gray-5')} (vars/color-variables)`
    },
    {
      code: 'a { color: #d7d7d8; }',
      message: `${getMsgCnt('#d7d7d8', '@gray-8')} (vars/color-variables)`
    },
    {
      code: 'a { color: green; }',
      message: `${getMsgCnt('green', '@gray-11')} (vars/color-variables)`
    }
  ]
});

// testRule(rule, {
//   ruleName: rule.ruleName,
//   config: [
//     { paths: ['./test/color.scss'], styleType: 'scss' },
//     {
//       severity: 'warning'
//     }
//   ],
//   accept: [
//     {
//       code: 'a { color: $gray-5; }'
//     }
//   ],
//   reject: [
//     {
//       code: 'a { color: #505050; }',
//       message: `${getMsgCnt('#505050', '$gray-5')} (vars/color-variables)`
//     },
//     {
//       code: 'a { color: #d7d7d8; }',
//       message: `${getMsgCnt('#d7d7d8', '$gray-8')} (vars/color-variables)`
//     },
//     {
//       code: 'a { color: green; }',
//       message: `${getMsgCnt('green', '$gray-11')} (vars/color-variables)`
//     },
//     {
//       code: 'a {background: linear-gradient(to right, #26b5b8, #26b5b8, #4eddca);}',
//       message: `${getMsgCnt('#26b5b8', '$color-1')} (vars/color-variables)`
//     }
//   ]
// });
