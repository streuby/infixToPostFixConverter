function getPrecedence(op) {
  if (op === '+' || op === '-') return 1;
  if (op === '*' || op === '/') return 2;
  return 0;
}

function isOperator(c) {
  return ['+', '-', '*', '/'].includes(c);
}

function infixToPostfix(expr) {
  const stack = [];
  const output = [];
  const rows = [];

  for (const token of expr.replace(/\s+/g, '').split('')) {
    if (/[A-Za-z0-9]/.test(token)) {
      output.push(token);
      rows.push({ token, stack: [...stack], output: [...output] });
    } else if (token === '(') {
      stack.push(token);
      rows.push({ token, stack: [...stack], output: [...output] });
    } else if (token === ')') {
      while (stack.length && stack[stack.length - 1] !== '(') {
        output.push(stack.pop());
        rows.push({ token, stack: [...stack], output: [...output] });
      }
      stack.pop(); // remove '('
      rows.push({ token, stack: [...stack], output: [...output] });
    } else if (isOperator(token)) {
      while (
        stack.length &&
        getPrecedence(stack[stack.length - 1]) >= getPrecedence(token)
      ) {
        output.push(stack.pop());
      }
      stack.push(token);
      rows.push({ token, stack: [...stack], output: [...output] });
    }
  }

  while (stack.length) {
    output.push(stack.pop());
    rows.push({ token: '', stack: [...stack], output: [...output] });
  }

  return { rows, result: output.join('') };
}

function evaluatePostfix(expression) {
  const stack = [];
  const tokens = expression.split('');
  const steps = [];

  tokens.forEach((token) => {
    if (!isNaN(token)) {
      stack.push(Number(token));
      steps.push({
        token,
        stack: [...stack],
        result: '',
        explanation: `Push ${token} to stack`,
      });
    } else if (['+', '-', '*', '/'].includes(token)) {
      const b = stack.pop();
      const a = stack.pop();

      if (a === undefined || b === undefined) {
        steps.push({
          token,
          stack: [...stack],
          result: 'Error',
          explanation: 'Not enough operands for operator',
        });
        return;
      }

      let result;
      switch (token) {
        case '+':
          result = a + b;
          break;
        case '-':
          result = a - b;
          break;
        case '*':
          result = a * b;
          break;
        case '/':
          result = a / b;
          break;
      }

      stack.push(result);
      steps.push({
        token,
        stack: [...stack],
        result,
        explanation: `Apply ${a} ${token} ${b} = ${result}, push result to stack`,
      });
    } else {
      steps.push({
        token,
        stack: [...stack],
        result: 'Invalid',
        explanation: `Invalid token "${token}"`,
      });
    }
  });

  const finalResult = stack.length === 1 ? stack[0] : 'Invalid Expression';
  return { steps, finalResult };
}

function process() {
  const mode = document.getElementById('mode').value;
  const expr = document.getElementById('expression').value;
  const head = document.getElementById('tableHead');
  const body = document.getElementById('tableBody');
  const finalResult = document.getElementById('finalResult');

  head.innerHTML = '';
  body.innerHTML = '';
  finalResult.innerHTML = '';

  if (!expr.trim()) {
    alert('Please enter an expression.');
    return;
  }

  if (mode === 'infix') {
    const { rows, result } = infixToPostfix(expr);
    head.innerHTML = `<tr><th>Token</th><th>Stack</th><th>Output</th></tr>`;
    rows.forEach((row) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${row.token}</td><td>${row.stack.join(
        ' '
      )}</td><td>${row.output.join(' ')}</td>`;
      body.appendChild(tr);
    });
    finalResult.innerHTML = `Postfix Expression: <code>${result}</code>`;
  } else if (mode === 'postfix') {
    const { steps, finalResult: result } = evaluatePostfix(expr);
    head.innerHTML = `<tr><th>Token</th><th>Stack</th><th>Explanation</th></tr>`;
    steps.forEach((step) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${step.token}</td><td>${step.stack.join(
        ' '
      )}</td><td>${step.explanation}</td>`;
      body.appendChild(tr);
    });
    finalResult.innerHTML = `Final Result: <code>${result}</code>`;
  }
}
