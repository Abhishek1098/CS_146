/* Create an element with tag `tag`, style `style`, and content `content` (array, ) */
function $el(tag, style, content, attrs) {
  const el = document.createElement(tag);
  Object.assign(el.style, style);

  if (attrs && attrs.length)
    Object.keys(attrs).forEach(key => el.setAttribute(key, attrs[key]));

  if (typeof content === 'object') {
    (typeof content.length !== 'undefined' ? content : [content]).forEach(
      el.appendChild.bind(el)
    );
  } else {
    el.innerHTML = content;
  }

  return el;
}

// Fill an array with 0...n
function range(n) {
  return Array(n).fill(0).map(Number.call, Number);
}

function decode(i) {
  const el = document.createElement('div');
  el.innerHTML = i;
  return el.childNodes[0].nodeValue;
}

console.cow = msg => {
  console.log(`
   _${Array.from(msg)
    .map(_ => '_')
    .join('')}_
  | ${msg} |
   -${Array.from(msg)
     .map(_ => '-')
     .join('')}-
       \\  ^__^
        \\ (oo)\_______
          (__)\\       )\\/\\
            ||-----w |
            ||      ||`);
};

// HercMagic creates a check list for students to tell them what they're doing wrong!!
class HercMagic {
  constructor(title) {
    if (window.hercMagic) {
      const el = window.hercMagic;
      Object.assign(el.style, {
        opacity: 0,
        transform: 'scale(0.3)'
      });
      setTimeout(() => el.remove(), 1000);
    }

    // List of test cases added with .test
    this.cases = [];

    // Element holding the list content
    const content = (this.content = $el('div', {}, ''));
    const progress = (this.progress = $el(
      'div',
      {
        height: '8px',
        width: 0,
        background: 'linear-gradient(to bottom, transparent, #afa)',
        borderBottomRightRadius: '4px',
        borderBottomLeftRadius: '4px',
        transition: 'width 2s ease'
      },
      ''
    ));

    // Core HTML for the on screen display
    const osd = (this.osd = window.hercMagic = $el(
      'div',
      {
        fontFamily: 'Tahoma, Arial, sans-serif',
        bottom: '0px',
        boxSizing: 'border-box',
        left: 0,
        lineHeight: 1,
        opacity: 0,
        padding: '16px',
        position: 'fixed',
        transform: 'scale(0.9) translateY(100%)',
        transition: 'all 1s ease',
        width: '350px'
      },
      $el(
        'div',
        {
          background: 'rgba(0, 0, 0, 0.4)',
          borderRadius: '4px',
          position: 'relative',
          color: '#fff',
          padding: '8px'
        },
        [
          $el(
            'header',
            {
              borderBottom: '2px solid white',
              fontWeight: 'bold',
              marginTop: '0px',
              marginBottom: '4px',
              paddingBottom: '4px',
              textAlign: 'center'
            },
            title
          ),
          content,
          $el(
            'footer',
            {
              background:
                'linear-gradient(to bottom, transparent, #a44)',
              height: '8px',
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              borderBottomRightRadius: '4px',
              borderBottomLeftRadius: '4px'
            },
            progress
          )
        ]
      )
    ));

    // Allow the element to move across the screen if it's covering up important content
    osd.addEventListener('mouseenter', () => {
      osd.style.bottom = 0;

      if (osd.style.left === '0px') {
        osd.style.left = '100%';
        osd.style.transform = 'translateX(-100%)';
      } else {
        osd.style.left = 0;
        osd.style.transform = '';
      }
    });
  }

  // Name is the test case name, func should return an error message if something went wrong
  test(name, func, weight) {
    this.cases.push({ name: name, func: func, weight: weight || 1 });
    return this;
  }

  done() {
    const list = this.content;

    if (this.cases.length === 0) {
      list.appendChild(
        $el(
          'div',
          { textAlign: 'center', fontVariant: 'italic' },
          'You need some test cases!'
        )
      );
    }

    const totalWeight = this.cases.reduce((a, b) => a + b.weight, 0);
    const [errors, total, percent] =
      this.cases.map(test => {
        let error = (test.func() || [])
          .map(f => typeof f === 'function' ? f() : f);

        const total = error.length;
        error = error.filter(e => e);
        const errors = error.length;

        console.log(`[${
          total-errors
        }/${
          total
        }] ${test.name}`)
        if (error.length)
          error.map(decode).forEach(t => console.error(t));

        if (error.length > 3) {
          error = error
            .splice(0, 3)
            .map(e => '<br/>&nbsp;&cross; ' + e)
            .concat([`<br/>&nbsp;<i>and ${error.length} others</i>`]);
        } else {
          error = error.map(e => '<br/> &cross; ' + e);
        }

        list.appendChild(
          $el(
            'div',
            {
              display: 'flex',
              alignItems: 'center',
              marginBottom: '4px',
              paddingLeft: '8px',
              paddingBottom: '4px',
              borderLeft: '2px solid #' + (error.length ? 'fff' : '5d5'),
              fontSize: '14px'
            },
            [
              $el('span', { flex: '1' }, test.name + error.join('')),
              $el(
                'div',
                {
                  alignSelf: 'flex-start',
                  backgroundColor: error.length ? '#a44' : '#5d5',
                  width: '16px',
                  height: '16px',
                  marginRight: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%'
                },
                error.length ? '&cross;' : '&check;'
              )
            ]
          )
        );
        return [errors, total, (1 - errors / (total || 1)) * (test.weight / totalWeight)];
      }).reduce((a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], [0, 0, 0]);

    console.log(`Passed ${total-errors}/${total} Checks (~${Math.round(percent*100)}%)`);
    if (percent !== 1) this.progress.style.borderBottomRightRadius = 0;

    document.body.appendChild(this.osd);
    setTimeout(() => {
      this.osd.style.bottom = 50 - this.osd.clientHeight + 'px';
      Object.assign(this.osd.style, {
        opacity: 1,
        transform: 'scale(1)'
      });
      this.progress.style.width = percent * 100 + '%';
    }, 100);
  }
}

function launch() {
  console.log('Herc Magic 1.0.0 Launched!');
  console.cow("Herc's watching so you better not cheat!");

  /**
   * determine if the given selector is in the head
   * @param  {string} selector query selector
   * @return {string}          error message if there is no selected element
   */
  function head(selector) {
    return (
      !document.head.querySelector(selector) &&
      `Missing &lt;${selector.split(/[ >+~]/).slice(-1)}&gt;`
    );
  }

  /**
   * determine if the given selector is in the body
   * @param  {string} selector query selector
   * @return {string}          error message if there is selected element
   */     
  function body(selector) {
    return (
      !document.body.querySelector(selector) &&
      `Missing &lt;${selector.split(/[ >+~]/).slice(-1)}&gt;`
    );
  }

  /**
   * determine if the elem at selector has a specific CSS value
   * @param  {string}  selector  query selector
   * @param  {string}  prop      CSS property name
   * @param  {...string}  values CSS property value
   * @return {Boolean}           elem has CSS selector
   */
  function hasStyle(selector, prop, ...values) {
    if(typeof prop === 'object' && prop.length)
      return prop.map(p => hasStyle(selector, p, ...values)).reduce((a, b) => a && b, true)
    return $(selector).length > 0 && getStyle(selector, prop)
      .map(style => values
        .map(val =>
          // evaluate regex or compare values
          typeof val === 'function' ? val(style) :
          typeof val.test === 'function' ? val.test(style) :
          style == val
        ).reduce((a, b) => a || b)) // any of the values must be valid
      .reduce((a, b) => a && b, true) // all of the elements must be valid
  }

  /**
   * gets an array of styles from all the selected elemens given a CSS property
   * @param  {string} selector query selector
   * @param  {string} prop     CSS property
   * @return {string[]}        array of values
   */
  function getStyle(selector, prop) {
    return $(selector)
      .map(e => getComputedStyle(e)[prop]);
  }

  /**
   * Determine if a number is close enough to another number
   * @param  {number} target Target number to compare
   * @return {int => bool}   Function determining whether the argument is within a 20th of the target
   */
  function about(target) {
    return num => Math.abs((typeof num === 'string' ? parseInt(num) : num)-target) < target/15;
  }

  /**
   * Determine if an array is composed of unique elements
   * @param  {array}  arr Array of things
   * @return {boolean}    Every element is unique
   */
  function isUnique(arr) {
    return arr.filter((e, i) => arr.indexOf(e) === i).length === arr.length
  }

  const allElems = Array.from(document.body.querySelectorAll('*'));

  const $ = (...args) => Array.from(document.querySelectorAll.bind(document)(...args));

  const webkitBorderRadius = [
    '-webkit-border-bottom-left-radius',
    '-webkit-border-bottom-right-radius',
    '-webkit-border-top-left-radius',
    '-webkit-border-top-right-radius',
  ];

  function getDisplay() {
    return parseInt($('#output')[0].innerHTML);
  }

  const and = (a, b) => a && b;

  Number.prototype.times = function (fn) {
    for(let i = 0; i < this; i++)
      fn(i);
  };

  function assertCalc(fn) {
    resetCalc();
    fn();
    const res = getResult();
    resetCalc();
    return res;
  }

  function inputNum(n) {
    n.toString().split('').forEach(n => pressNum(parseInt(n)));
  }

  const TESTMAP = range(100).flatMap(a => range(20).map(b => [a, b]))
  function testOp(op) {
    return TESTMAP.filter(([a, b]) =>
      assertCalc(() => {
        inputNum(a);
        pressOp(op);
        inputNum(b);
        pressEquals();
      }) !== eval(`${a} ${op} ${b}`) && `Incorrect ${a} ${op} ${b}`
    ).slice(0, 3).join(', ');
  }

  new HercMagic('CS146HW3 Checklist')
    .test('Function Definitions', () =>
      [
        'setDisplay', 'pressNum', 'pressOp',
        'pressEquals', 'resetCalc', 'getResult',
      ].map(fn =>
        (!window[fn] || typeof window[fn] !== 'function') &&
          `Missing <code>${fn}</code> function`
      )
    )
    .test('Core Functionality', () => [
      getDisplay() !== 0 && 'Display should start at 0',
      () => {
        $('#output')[0].innerHTML = 'foo';
        resetCalc();
        const res = getDisplay() !== 0 && '<code>resetCalc</code> should clear display';
        $('#output')[0].innerHTML = '0';
        return res;
      },
      () => {
        const num = Math.floor(Math.random() * 10);
        setDisplay(num);
        const res = getDisplay() !== num && '<code>setDisplay</code> does not update display';
        $('#output')[0].innerHTML = '0';
        return res;
      },
      () => {
        resetCalc();
        pressNum(0);
        pressOp('/');
        pressNum(0);
        pressEquals();
        const res = getResult();
        const disp = $('#output')[0].innerHTML;
        resetCalc();
        if(disp !== 'ERROR')
          return '0 / 0 should display ERROR';
        if(res !== 0)
          return '0 / 0 Should have result 0';
      }
    ])
    .test('Number Entry', () => [
      ![0,1,2,3,4,5,6,7,8,9].map(n => {
        resetCalc();
        pressNum(n);
        const result = getDisplay() === n;
        resetCalc();
        return result;
      }).reduce(and, true) && 'Digit does not correspond with button',
      () => {
        resetCalc();
        (9).times(() => pressNum(1))
        if(getDisplay() !== 111111111) {
          resetCalc();
          return 'Pressing 1 nine times should yield 111111111';
        }
        pressNum(1);
        if(getDisplay() !== 999999999) {          
          resetCalc();
          return 'Max value is not 999999999';
        }
        resetCalc();
      },
      () => {
        resetCalc();
        pressNum(0);
        if ($('#output')[0].innerHTML === '00') {
          resetCalc();
          return 'Pressing 0 should not add more zeroes';
        }
        resetCalc();
      }
    ])
    .test('Operator Functionality', () => [
      testOp('+'),
      testOp('-'),
      testOp('*'),
      // Test division
      TESTMAP.filter(([a, b]) => {
        if(b == 0)
          return;

        return assertCalc(() => {
          inputNum(a);
          pressOp('/');
          inputNum(b);
          pressEquals();
        }) !== eval(`Math.min(Math.floor(${a}/${b}), 999999999)`) && `Incorrect ${a} / ${b}`;
      }).slice(0, 3).join(', '),
      assertCalc(() => {
        inputNum(5);
        pressOp('*');
        pressOp('/');
        pressOp('+');
        inputNum(6);
        pressEquals();
      }) !== 11 && `Pressing an operator without input should change operator`,
      // a = 0...100, b = 0...100:
      // a + b, a * b, a - b, a / b (except n/0)
      // division should be floored

      // pressing a different operator after the first one should:
      // - if no number has been pressed, change the operator
      // - if a number has been pressed, calculate, then change operator
    ])
    .done();
}

window.onload = () => {
  launch();
};